import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STATIONS, StationData, VocabItem } from '../data/stations';

interface InteractiveProp {
  item: VocabItem;
  wrapper: THREE.Group;
  modelRoot: THREE.Object3D;
  ring: THREE.Mesh;
  baseY: number;
  baseScale: number;
  discovered: boolean;
  pulsePhase: number;
}

export class DioramaManager {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private loader = new GLTFLoader();
  private modelCache = new Map<string, THREE.Group>();

  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private skyMat: THREE.ShaderMaterial;

  private stationGroup = new THREE.Group();
  private cloudsGroup = new THREE.Group();
  private props: InteractiveProp[] = [];
  private hoveredProp: InteractiveProp | null = null;
  private currentStation: StationData = STATIONS[0];

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDownPos = { x: 0, y: 0 };
  private isPointerDown = false;

  // Smooth camera transition
  private camAnimActive = false;
  private camTargetPos = new THREE.Vector3();
  private camTargetLook = new THREE.Vector3();

  private clock = new THREE.Clock();
  private rafId = 0;

  public onItemClick?: (item: VocabItem) => void;
  public onItemHover?: (item: VocabItem | null, screenX: number, screenY: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene = new THREE.Scene();

    // Subtle studio environment reflection so brass, gold, chrome & ceramics gleam!
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.65;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 160);
    this.camera.position.set(8, 6, 9);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 4.5;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.08;
    this.controls.minPolarAngle = 0.25;
    this.controls.enablePan = false;
    this.controls.addEventListener('start', () => {
      this.camAnimActive = false;
    });

    // Sky dome gradient
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#58b4ff') },
        bottomColor: { value: new THREE.Color('#dff4ff') }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          float t = clamp(h * 0.85 + 0.22, 0.0, 1.0);
          gl_FragColor = vec4(mix(bottomColor, topColor, smoothstep(0.0, 1.0, t)), 1.0);
        }
      `
    });
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 24), this.skyMat);
    this.scene.add(skyDome);

    // Lighting
    this.hemiLight = new THREE.HemisphereLight('#ffffff', '#94a3b8', 0.95);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight('#fff5dc', 1.85);
    this.sunLight.position.set(9, 14, 7);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 40;
    const d = 10.5;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    const rimLight = new THREE.DirectionalLight('#bae6fd', 0.55);
    rimLight.position.set(-8, 6, -9);
    this.scene.add(rimLight);

    this.scene.add(this.stationGroup);
    this.buildClouds();
    this.scene.add(this.cloudsGroup);

    this.bindEvents();
    this.animate();
  }

  private buildClouds(): void {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.95,
      metalness: 0.0
    });
    const positions: [number, number, number, number][] = [
      [-11, 8.2, -10, 1.2],
      [10, 9.0, -11, 1.4],
      [-12, 7.4, 8, 0.95],
      [13, 8.0, 7, 1.1],
      [0, 10.5, -14, 1.5]
    ];
    positions.forEach(([x, y, z, s], idx) => {
      const c = new THREE.Group();
      const puffs: [number, number, number, number][] = [
        [0, 0, 0, 1.0],
        [-0.9, -0.15, 0.1, 0.72],
        [0.95, -0.1, -0.1, 0.78],
        [0.25, 0.42, 0.12, 0.65]
      ];
      puffs.forEach(([px, py, pz, r]) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 12), cloudMat);
        m.position.set(px, py, pz);
        c.add(m);
      });
      c.position.set(x, y, z);
      c.scale.setScalar(s);
      c.userData.baseX = x;
      c.userData.speed = 0.25 + idx * 0.06;
      c.userData.phase = idx * 1.4;
      this.cloudsGroup.add(c);
    });
  }

  async preloadAllModels(onProgress?: (loaded: number, total: number, label: string) => void): Promise<void> {
    const uniqueFiles: { file: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const st of STATIONS) {
      for (const item of st.items) {
        if (!seen.has(item.modelFile)) {
          seen.add(item.modelFile);
          uniqueFiles.push({ file: item.modelFile, label: item.en });
        }
      }
      for (const sc of st.scenery) {
        if (!seen.has(sc.modelFile)) {
          seen.add(sc.modelFile);
          uniqueFiles.push({ file: sc.modelFile, label: sc.modelFile.replace('.glb', '') });
        }
      }
    }

    let loaded = 0;
    const total = uniqueFiles.length;

    await Promise.all(
      uniqueFiles.map(async ({ file, label }) => {
        try {
          const gltf = await this.loader.loadAsync(`/models/${file}`);
          const root = gltf.scene;
          root.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              const mesh = obj as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });
          this.modelCache.set(file, root);
        } catch (err) {
          console.warn(`Failed to load /models/${file}, using fallback mesh.`, err);
          this.modelCache.set(file, this.createFallbackMesh());
        } finally {
          loaded++;
          onProgress?.(loaded, total, label);
        }
      })
    );
  }

  private createFallbackMesh(): THREE.Group {
    const g = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.4 })
    );
    box.position.y = 0.5;
    box.castShadow = true;
    box.receiveShadow = true;
    g.add(box);
    return g;
  }

  loadStation(station: StationData, discoveredIds: Set<string>): void {
    this.currentStation = station;
    this.hoveredProp = null;
    this.props = [];

    // Clear previous station geometry
    while (this.stationGroup.children.length > 0) {
      const child = this.stationGroup.children[0];
      this.stationGroup.remove(child);
    }

    // Update atmosphere colors
    this.skyMat.uniforms.topColor.value.set(station.skyTop);
    this.skyMat.uniforms.bottomColor.value.set(station.skyBottom);
    this.sunLight.color.set(station.sunColor);

    // Build floating diorama island base + station decor
    this.buildIslandBase(station);
    this.buildStationDecor(station);

    // Place Sand3D architectural & atmospheric scenery models
    station.scenery.forEach((sc) => {
      const template = this.modelCache.get(sc.modelFile);
      if (!template) return;
      const model = template.clone(true);
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawSize = new THREE.Vector3();
      rawBox.getSize(rawSize);
      const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
      const normFactor = (1.6 / maxDim) * sc.scale;
      model.scale.setScalar(normFactor);

      model.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(model);
      const scaledCenter = new THREE.Vector3();
      scaledBox.getCenter(scaledCenter);
      model.position.x -= scaledCenter.x;
      model.position.z -= scaledCenter.z;
      model.position.y -= scaledBox.min.y;

      const wrapper = new THREE.Group();
      wrapper.position.set(sc.position[0], sc.position[1], sc.position[2]);
      wrapper.rotation.y = sc.rotationY;
      wrapper.add(model);
      this.stationGroup.add(wrapper);
    });

    // Place Sand3D interactive props
    station.items.forEach((item, idx) => {
      const template = this.modelCache.get(item.modelFile) || this.createFallbackMesh();
      const model = template.clone(true);

      // Normalize scale & align bottom precisely to y = 0
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawSize = new THREE.Vector3();
      const rawCenter = new THREE.Vector3();
      rawBox.getSize(rawSize);
      rawBox.getCenter(rawCenter);

      const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
      const normFactor = (1.6 / maxDim) * item.scale;
      model.scale.setScalar(normFactor);

      // Recompute bounds after scaling to center XZ and sit on y = 0
      model.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(model);
      const scaledCenter = new THREE.Vector3();
      scaledBox.getCenter(scaledCenter);
      model.position.x -= scaledCenter.x;
      model.position.z -= scaledCenter.z;
      model.position.y -= scaledBox.min.y;

      const wrapper = new THREE.Group();
      wrapper.position.set(item.position[0], item.position[1], item.position[2]);
      wrapper.rotation.y = item.rotationY;
      wrapper.add(model);

      // Interactive ground/tabletop beacon ring
      const isDisc = discoveredIds.has(item.id);
      const isTabletop = item.position[1] > 0.5;
      const ringRadius = isTabletop
        ? Math.max(0.38, Math.min(0.55, maxDim * normFactor * 0.58))
        : Math.max(0.62, Math.min(1.55, maxDim * normFactor * 0.48));
      const ringGeo = new THREE.RingGeometry(ringRadius * 0.82, ringRadius, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isDisc ? '#10b981' : '#f59e0b',
        transparent: true,
        opacity: isDisc ? 0.45 : 0.72,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.025;
      wrapper.add(ring);

      wrapper.userData.itemId = item.id;
      model.traverse((obj) => {
        obj.userData.itemId = item.id;
      });

      this.stationGroup.add(wrapper);
      this.props.push({
        item,
        wrapper,
        modelRoot: model,
        ring,
        baseY: item.position[1],
        baseScale: 1,
        discovered: isDisc,
        pulsePhase: idx * 1.3
      });
    });

    // Animate camera to station default view
    this.flyCameraTo(
      new THREE.Vector3(...station.cameraPos),
      new THREE.Vector3(...station.cameraTarget)
    );
  }

  private buildIslandBase(station: StationData): void {
    // Top diorama disk (generous 6.4 radius for 6 vocab + scenery Sand3D models)
    const topGeo = new THREE.CylinderGeometry(6.4, 6.58, 0.48, 56);
    const topMat = new THREE.MeshStandardMaterial({
      color: station.groundColor,
      roughness: 0.85,
      metalness: 0.04
    });
    const topDisk = new THREE.Mesh(topGeo, topMat);
    topDisk.position.y = -0.24;
    topDisk.receiveShadow = true;
    this.stationGroup.add(topDisk);

    // Stylish colored rim band
    const rimGeo = new THREE.CylinderGeometry(6.62, 6.18, 0.45, 56);
    const rimMat = new THREE.MeshStandardMaterial({
      color: station.accentColor,
      roughness: 0.65,
      metalness: 0.1
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = -0.68;
    this.stationGroup.add(rim);

    // Tapered floating island underside
    const underGeo = new THREE.CylinderGeometry(6.0, 2.5, 1.55, 36);
    const underMat = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.9
    });
    const under = new THREE.Mesh(underGeo, underMat);
    under.position.y = -1.66;
    this.stationGroup.add(under);
  }

  private buildStationDecor(station: StationData): void {
    if (station.id === 'airport') {
      // Runway tarmac strip
      const runway = new THREE.Mesh(
        new THREE.BoxGeometry(9.6, 0.03, 2.6),
        new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.9 })
      );
      runway.position.set(0.4, 0.01, -1.3);
      runway.rotation.y = -0.18;
      runway.receiveShadow = true;
      this.stationGroup.add(runway);

      // Dashed white runway centerlines
      const stripeMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.7 });
      for (let i = -3; i <= 3; i++) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.035, 0.15), stripeMat);
        dash.position.set(0.4 + i * 1.25, 0.012, -1.3 + i * 0.22);
        dash.rotation.y = -0.18;
        this.stationGroup.add(dash);
      }

      // Cozy terminal floor mat
      const mat = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.03, 3.0),
        new THREE.MeshStandardMaterial({ color: '#bfdbfe', roughness: 0.8 })
      );
      mat.position.set(-0.3, 0.01, 2.35);
      mat.receiveShadow = true;
      this.stationGroup.add(mat);
    } else if (station.id === 'station') {
      // Railway gravel bed
      const gravel = new THREE.Mesh(
        new THREE.BoxGeometry(11.0, 0.04, 2.3),
        new THREE.MeshStandardMaterial({ color: '#78716c', roughness: 0.95 })
      );
      gravel.position.set(0, 0.01, -2.2);
      gravel.receiveShadow = true;
      this.stationGroup.add(gravel);

      // Steel rails + wooden sleepers
      const railMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.75, roughness: 0.3 });
      const sleeperMat = new THREE.MeshStandardMaterial({ color: '#7c4a21', roughness: 0.9 });
      [-0.58, 0.58].forEach((zOff) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.07, 0.08), railMat);
        rail.position.set(0, 0.06, -2.2 + zOff);
        this.stationGroup.add(rail);
      });
      for (let x = -5.0; x <= 5.0; x += 0.55) {
        const sleeper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 1.7), sleeperMat);
        sleeper.position.set(x, 0.03, -2.2);
        this.stationGroup.add(sleeper);
      }

      // Yellow safety line along platform edge
      const safetyLine = new THREE.Mesh(
        new THREE.BoxGeometry(10.2, 0.03, 0.18),
        new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.6 })
      );
      safetyLine.position.set(0, 0.015, -0.65);
      this.stationGroup.add(safetyLine);
    } else if (station.id === 'hotel') {
      // Warm hardwood floor + plush burgundy lobby rug
      const rug = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.03, 5.4),
        new THREE.MeshStandardMaterial({ color: '#ddd6fe', roughness: 0.9 })
      );
      rug.position.set(0.2, 0.01, 0.1);
      rug.receiveShadow = true;
      this.stationGroup.add(rug);

      const runner = new THREE.Mesh(
        new THREE.BoxGeometry(4.6, 0.038, 3.0),
        new THREE.MeshStandardMaterial({ color: '#a78bfa', roughness: 0.88 })
      );
      runner.position.set(0.2, 0.014, 0.5);
      runner.receiveShadow = true;
      this.stationGroup.add(runner);
    } else if (station.id === 'cafe') {
      // Warm checkered café patio floor
      const tileA = new THREE.MeshStandardMaterial({ color: '#fffbeb', roughness: 0.8 });
      const tileB = new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.8 });
      for (let gx = -4; gx <= 4; gx++) {
        for (let gz = -4; gz <= 4; gz++) {
          if (gx * gx + gz * gz > 18) continue;
          const tile = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 0.03, 0.95),
            (gx + gz) % 2 === 0 ? tileA : tileB
          );
          tile.position.set(gx, 0.01, gz);
          tile.receiveShadow = true;
          this.stationGroup.add(tile);
        }
      }
    } else if (station.id === 'london') {
      // Cobblestone road across front of London Square
      const road = new THREE.Mesh(
        new THREE.BoxGeometry(10.8, 0.03, 2.5),
        new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.9 })
      );
      road.position.set(0.2, 0.01, 2.45);
      road.rotation.y = -0.1;
      road.receiveShadow = true;
      this.stationGroup.add(road);

      // Road center stripes
      const stripeMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.7 });
      for (let i = -4; i <= 4; i++) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.11), stripeMat);
        dash.position.set(0.2 + i * 1.18, 0.015, 2.45 + i * 0.118);
        dash.rotation.y = -0.1;
        this.stationGroup.add(dash);
      }

      // Stone plaza circle around the Sand3D fountain
      const plaza = new THREE.Mesh(
        new THREE.CylinderGeometry(2.3, 2.35, 0.03, 36),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.85 })
      );
      plaza.position.set(0.35, 0.012, -0.55);
      plaza.receiveShadow = true;
      this.stationGroup.add(plaza);
    }
  }

  private addStylizedPlant(x: number, z: number, scale: number): void {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.24, 0.42, 14),
      new THREE.MeshStandardMaterial({ color: '#c2410c', roughness: 0.8 })
    );
    pot.position.y = 0.21;
    pot.castShadow = true;
    g.add(pot);

    const bush = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 14, 12),
      new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.85 })
    );
    bush.position.y = 0.62;
    bush.castShadow = true;
    g.add(bush);

    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    this.stationGroup.add(g);
  }

  private addParkTree(x: number, z: number, scale: number): void {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.2, 1.1, 10),
      new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 })
    );
    trunk.position.y = 0.55;
    trunk.castShadow = true;
    g.add(trunk);

    const crownMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.82 });
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.68, 14, 12), crownMat);
    c1.position.y = 1.45;
    c1.castShadow = true;
    g.add(c1);

    const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), crownMat);
    c2.position.set(0.35, 1.2, 0.15);
    c2.castShadow = true;
    g.add(c2);

    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    this.stationGroup.add(g);
  }

  markDiscovered(itemId: string): void {
    const prop = this.props.find((p) => p.item.id === itemId);
    if (!prop) return;
    prop.discovered = true;
    const mat = prop.ring.material as THREE.MeshBasicMaterial;
    mat.color.set('#10b981');
    mat.opacity = 0.45;
  }

  focusOnItem(itemId: string): void {
    const prop = this.props.find((p) => p.item.id === itemId);
    if (!prop) return;
    const target = prop.wrapper.position.clone().add(new THREE.Vector3(0, 0.75, 0));
    const offset = new THREE.Vector3(3.6, 2.7, 4.1);
    this.flyCameraTo(target.clone().add(offset), target);
  }

  resetCamera(): void {
    this.flyCameraTo(
      new THREE.Vector3(...this.currentStation.cameraPos),
      new THREE.Vector3(...this.currentStation.cameraTarget)
    );
  }

  private flyCameraTo(pos: THREE.Vector3, lookAt: THREE.Vector3): void {
    this.camTargetPos.copy(pos);
    this.camTargetLook.copy(lookAt);
    this.camAnimActive = true;
  }

  private bindEvents(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.canvas.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    this.canvas.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const hit = this.raycastProp();
      if (hit !== this.hoveredProp) {
        this.hoveredProp = hit;
        this.canvas.classList.toggle('pointer', Boolean(hit));
      }
      this.onItemHover?.(hit ? hit.item : null, e.clientX, e.clientY);
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      if (dist < 7) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const hit = this.raycastProp();
        if (hit) {
          this.onItemClick?.(hit.item);
        }
      }
    });
  }

  private raycastProp(): InteractiveProp | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const roots = this.props.map((p) => p.wrapper);
    const hits = this.raycaster.intersectObjects(roots, true);
    if (hits.length === 0) return null;

    let obj: THREE.Object3D | null = hits[0].object;
    while (obj) {
      if (obj.userData?.itemId) {
        return this.props.find((p) => p.item.id === obj!.userData.itemId) || null;
      }
      obj = obj.parent;
    }
    return null;
  }

  private animate = (): void => {
    this.rafId = requestAnimationFrame(this.animate);
    const t = this.clock.getElapsedTime();

    // Animate drifting clouds
    for (const c of this.cloudsGroup.children) {
      c.position.x = c.userData.baseX + Math.sin(t * c.userData.speed + c.userData.phase) * 1.4;
      c.position.y += Math.sin(t * 0.7 + c.userData.phase) * 0.0012;
    }

    // Animate props (hover bounce, gentle bobbing, beacon ring pulse)
    for (const prop of this.props) {
      const isHovered = prop === this.hoveredProp;
      const targetScale = isHovered ? 1.11 : 1.0;
      prop.baseScale += (targetScale - prop.baseScale) * 0.14;
      prop.wrapper.scale.setScalar(prop.baseScale);

      const bob = prop.item.bobAmp ? Math.sin(t * 2.1 + prop.pulsePhase) * prop.item.bobAmp : 0;
      const hoverLift = isHovered ? 0.14 : 0;
      prop.wrapper.position.y += (prop.baseY + bob + hoverLift - prop.wrapper.position.y) * 0.14;

      const pulse = 1 + Math.sin(t * 3.0 + prop.pulsePhase) * (prop.discovered ? 0.03 : 0.08);
      prop.ring.scale.setScalar(isHovered ? 1.18 : pulse);
    }

    // Smooth camera lerp
    if (this.camAnimActive) {
      this.camera.position.lerp(this.camTargetPos, 0.075);
      this.controls.target.lerp(this.camTargetLook, 0.085);
      if (
        this.camera.position.distanceTo(this.camTargetPos) < 0.04 &&
        this.controls.target.distanceTo(this.camTargetLook) < 0.04
      ) {
        this.camAnimActive = false;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
