import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STATIONS, StationData, VocabItem } from '../data/stations';

export type TimeOfDay = 'day' | 'sunset' | 'night';

interface InteractiveProp {
  item: VocabItem;
  wrapper: THREE.Group;
  modelRoot: THREE.Object3D;
  ring: THREE.Mesh;
  baseY: number;
  baseScale: number;
  hoverLiftCur: number;
  discovered: boolean;
  pulsePhase: number;
}

interface ConfettiParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  rotVel: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface AmbientParticle {
  mesh: THREE.Mesh;
  kind: 'steam' | 'water';
  origin: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
  maxAge: number;
  age: number;
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
  private rimLight: THREE.DirectionalLight;
  private skyMat: THREE.ShaderMaterial;
  private starsPoints: THREE.Points;
  private starsMat: THREE.PointsMaterial;
  private nightLights: THREE.PointLight[] = [];

  private stationGroup = new THREE.Group();
  private cloudsGroup = new THREE.Group();
  private balloonWrapper: THREE.Group | null = null;
  private guideOwlWrapper: THREE.Group | null = null;
  private guideOwlBaseY = 0;
  private guideHovered = false;

  private props: InteractiveProp[] = [];
  private hoveredProp: InteractiveProp | null = null;
  private currentStation: StationData = STATIONS[0];
  private timeOfDay: TimeOfDay = 'day';

  private confettiParticles: ConfettiParticle[] = [];
  private ambientParticles: AmbientParticle[] = [];
  private effectsGroup = new THREE.Group();

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
  public onGuideClick?: () => void;
  public onGuideHover?: (hovering: boolean, screenX: number, screenY: number) => void;

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

    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 180);
    this.camera.position.set(9, 6.4, 9.8);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 4.5;
    this.controls.maxDistance = 21;
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
    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(95, 32, 24), this.skyMat);
    this.scene.add(skyDome);

    // Starfield for Sunset & Night modes
    const starCount = 360;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(0.15 + Math.random() * 0.85);
      const r = 74 + Math.random() * 10;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    this.starsMat = new THREE.PointsMaterial({
      color: '#fef9c3',
      size: 1.45,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.starsPoints = new THREE.Points(starGeo, this.starsMat);
    this.scene.add(this.starsPoints);

    // Lighting
    this.hemiLight = new THREE.HemisphereLight('#ffffff', '#94a3b8', 0.95);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight('#fff5dc', 1.85);
    this.sunLight.position.set(9, 14, 7);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 42;
    const d = 10.5;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight('#bae6fd', 0.55);
    this.rimLight.position.set(-8, 6, -9);
    this.scene.add(this.rimLight);

    this.scene.add(this.stationGroup);
    this.scene.add(this.effectsGroup);
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
      [-12, 8.6, -11, 1.2],
      [11, 9.4, -12, 1.4],
      [-13, 7.8, 9, 0.95],
      [14, 8.4, 8, 1.1],
      [0, 11.0, -15, 1.5]
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
    const addFile = (file: string, label: string) => {
      if (!seen.has(file)) {
        seen.add(file);
        uniqueFiles.push({ file, label });
      }
    };

    for (const st of STATIONS) {
      for (const item of st.items) addFile(item.modelFile, item.en);
      for (const sc of st.scenery) addFile(sc.modelFile, sc.modelFile.replace('.glb', ''));
    }
    addFile('hot_air_balloon.glb', 'Hot Air Balloon');
    addFile('travel_owl.glb', 'Barnaby Owl');

    let loaded = 0;
    const total = uniqueFiles.length;

    await Promise.all(
      uniqueFiles.map(async ({ file, label }) => {
        try {
          const gltf = await this.loader.loadAsync(`${import.meta.env.BASE_URL}models/${file}`);
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

    this.spawnSkyBalloon();
  }

  private spawnSkyBalloon(): void {
    const template = this.modelCache.get('hot_air_balloon.glb');
    if (!template || this.balloonWrapper) return;
    const model = this.normalizeModel(template.clone(true), 1.55);
    const wrapper = new THREE.Group();
    wrapper.add(model);
    wrapper.position.set(-10.5, 4.8, -9.5);
    this.scene.add(wrapper);
    this.balloonWrapper = wrapper;
  }

  private normalizeModel(model: THREE.Object3D, targetScale: number): THREE.Object3D {
    const rawBox = new THREE.Box3().setFromObject(model);
    const rawSize = new THREE.Vector3();
    rawBox.getSize(rawSize);
    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
    const normFactor = (1.6 / maxDim) * targetScale;
    model.scale.setScalar(normFactor);

    model.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);
    model.position.x -= scaledCenter.x;
    model.position.z -= scaledCenter.z;
    model.position.y -= scaledBox.min.y;
    return model;
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

  setTimeOfDay(mode: TimeOfDay): void {
    this.timeOfDay = mode;
    this.applyAtmosphere();
  }

  private applyAtmosphere(): void {
    const st = this.currentStation;
    if (this.timeOfDay === 'day') {
      this.skyMat.uniforms.topColor.value.set(st.skyTop);
      this.skyMat.uniforms.bottomColor.value.set(st.skyBottom);
      this.sunLight.color.set(st.sunColor);
      this.sunLight.intensity = 1.85;
      this.sunLight.position.set(9, 14, 7);
      this.hemiLight.color.set('#ffffff');
      this.hemiLight.groundColor.set('#94a3b8');
      this.hemiLight.intensity = 0.95;
      this.rimLight.color.set('#bae6fd');
      this.rimLight.intensity = 0.55;
      this.starsMat.opacity = 0.0;
      this.scene.environmentIntensity = 0.65;
      this.nightLights.forEach((l) => (l.intensity = 0));
    } else if (this.timeOfDay === 'sunset') {
      this.skyMat.uniforms.topColor.value.set('#4c1d95');
      this.skyMat.uniforms.bottomColor.value.set('#fb923c');
      this.sunLight.color.set('#ffb26b');
      this.sunLight.intensity = 1.55;
      this.sunLight.position.set(-12, 6.5, 9);
      this.hemiLight.color.set('#fde68a');
      this.hemiLight.groundColor.set('#7c2d12');
      this.hemiLight.intensity = 0.72;
      this.rimLight.color.set('#f472b6');
      this.rimLight.intensity = 0.65;
      this.starsMat.opacity = 0.35;
      this.scene.environmentIntensity = 0.45;
      this.nightLights.forEach((l) => (l.intensity = 1.8));
    } else {
      // Night mode — magical starry London night with glowing station lights!
      this.skyMat.uniforms.topColor.value.set('#020617');
      this.skyMat.uniforms.bottomColor.value.set('#1e1b4b');
      this.sunLight.color.set('#93c5fd');
      this.sunLight.intensity = 0.65;
      this.sunLight.position.set(-7, 13, -8);
      this.hemiLight.color.set('#6366f1');
      this.hemiLight.groundColor.set('#0f172a');
      this.hemiLight.intensity = 0.48;
      this.rimLight.color.set('#38bdf8');
      this.rimLight.intensity = 0.55;
      this.starsMat.opacity = 0.95;
      this.scene.environmentIntensity = 0.25;
      this.nightLights.forEach((l) => (l.intensity = 4.2));
    }
  }

  loadStation(station: StationData, discoveredIds: Set<string>): void {
    this.currentStation = station;
    this.hoveredProp = null;
    this.guideHovered = false;
    this.props = [];
    this.nightLights = [];
    this.guideOwlWrapper = null;

    // Clear previous station geometry & ambient particles
    while (this.stationGroup.children.length > 0) {
      this.stationGroup.remove(this.stationGroup.children[0]);
    }
    for (const p of this.ambientParticles) {
      this.effectsGroup.remove(p.mesh);
    }
    this.ambientParticles = [];

    // Build floating diorama island base + station decor
    this.buildIslandBase(station);
    this.buildStationDecor(station);
    this.buildNightLights(station);
    this.buildAmbientParticles(station);

    // Place Sand3D architectural & atmospheric scenery models
    station.scenery.forEach((sc) => {
      const template = this.modelCache.get(sc.modelFile);
      if (!template) return;
      const model = this.normalizeModel(template.clone(true), sc.scale);
      const wrapper = new THREE.Group();
      wrapper.position.set(sc.position[0], sc.position[1], sc.position[2]);
      wrapper.rotation.y = sc.rotationY;
      wrapper.add(model);
      this.stationGroup.add(wrapper);
    });

    // Place Barnaby the friendly Sand3D Travel Owl guide!
    this.spawnGuideOwl(station);

    // Place Sand3D interactive vocab props
    station.items.forEach((item, idx) => {
      const template = this.modelCache.get(item.modelFile) || this.createFallbackMesh();
      const model = this.normalizeModel(template.clone(true), item.scale);

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const horizDim = Math.max(size.x, size.z);

      const wrapper = new THREE.Group();
      wrapper.position.set(item.position[0], item.position[1], item.position[2]);
      wrapper.rotation.y = item.rotationY;
      wrapper.add(model);

      // Interactive ground/tabletop beacon ring (elevated + polygonOffset to eliminate Z-fighting!)
      const isDisc = discoveredIds.has(item.id);
      const isTabletop = item.position[1] > 0.5;
      const ringRadius = isTabletop
        ? Math.max(0.38, Math.min(0.55, horizDim * 0.58))
        : Math.max(0.62, Math.min(1.55, horizDim * 0.54));
      const ringGeo = new THREE.RingGeometry(ringRadius * 0.82, ringRadius, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isDisc ? '#10b981' : '#f59e0b',
        transparent: true,
        opacity: isDisc ? 0.52 : 0.78,
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = isTabletop ? 0.032 : 0.062;
      ring.renderOrder = 3;
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
        hoverLiftCur: 0,
        discovered: isDisc,
        pulsePhase: idx * 1.3
      });
    });

    this.applyAtmosphere();

    // Animate camera to station default view
    this.flyCameraTo(
      new THREE.Vector3(...station.cameraPos),
      new THREE.Vector3(...station.cameraTarget)
    );
  }

  private spawnGuideOwl(station: StationData): void {
    const template = this.modelCache.get('travel_owl.glb');
    if (!template) return;
    const model = this.normalizeModel(template.clone(true), 0.82);

    const spots: Record<string, [number, number, number, number]> = {
      airport: [4.25, 0, 2.75, -0.6],
      station: [4.35, 0, 2.65, -0.65],
      hotel: [3.9, 0, 2.9, -0.75],
      cafe: [4.25, 0, 2.9, -0.7],
      london: [-0.85, 0, 4.45, 0.2]
    };
    const [x, y, z, ry] = spots[station.id] || [4.2, 0, 2.8, -0.6];

    const wrapper = new THREE.Group();
    wrapper.position.set(x, y, z);
    wrapper.rotation.y = ry;
    wrapper.add(model);

    // Soft sky-blue guide pedestal ring under Barnaby (no Z-fighting)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.46, 0.58, 32),
      new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.062;
    ring.renderOrder = 3;
    wrapper.add(ring);

    wrapper.userData.isGuide = true;
    model.traverse((obj) => {
      obj.userData.isGuide = true;
    });

    this.stationGroup.add(wrapper);
    this.guideOwlWrapper = wrapper;
    this.guideOwlBaseY = y;
  }

  private buildNightLights(station: StationData): void {
    const addGlow = (x: number, y: number, z: number, color: string, dist = 7) => {
      const pt = new THREE.PointLight(color, 0, dist, 1.5);
      pt.position.set(x, y, z);
      this.stationGroup.add(pt);
      this.nightLights.push(pt);
    };

    if (station.id === 'airport') {
      addGlow(3.8, 3.8, -3.1, '#38bdf8', 9);
      addGlow(-2.75, 2.0, -2.1, '#facc15', 7);
      addGlow(0.9, 1.2, -1.2, '#e0f2fe', 7);
    } else if (station.id === 'station') {
      addGlow(3.65, 2.4, 1.05, '#fde68a', 8);
      addGlow(-3.55, 1.8, 1.4, '#38bdf8', 7);
      addGlow(4.35, 2.5, -2.5, '#4ade80', 6);
    } else if (station.id === 'hotel') {
      addGlow(4.05, 1.8, -0.25, '#fde68a', 9);
      addGlow(-2.1, 2.4, -2.1, '#fbbf24', 8);
      addGlow(1.15, 2.0, -3.5, '#7dd3fc', 7);
    } else if (station.id === 'cafe') {
      addGlow(0.1, 2.6, -2.5, '#fdba74', 9);
      addGlow(0.2, 2.5, 0.8, '#fef08a', 8);
    } else if (station.id === 'london') {
      addGlow(3.25, 2.8, -1.2, '#fef08a', 9);
      addGlow(-0.25, 3.4, -3.0, '#fde68a', 9);
      addGlow(-2.85, 2.0, -1.65, '#fca5a5', 6);
    }
  }

  private buildAmbientParticles(station: StationData): void {
    if (station.id === 'cafe') {
      // Rising cozy steam puffs from coffee cup & teapot!
      const steamSources = [
        new THREE.Vector3(-0.25, 2.35, 1.0),
        new THREE.Vector3(3.25, 1.15, 1.6)
      ];
      const puffGeo = new THREE.SphereGeometry(0.11, 8, 8);
      steamSources.forEach((origin) => {
        for (let i = 0; i < 6; i++) {
          const mat = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.45,
            depthWrite: false
          });
          const mesh = new THREE.Mesh(puffGeo, mat);
          mesh.position.copy(origin);
          this.effectsGroup.add(mesh);
          this.ambientParticles.push({
            mesh,
            kind: 'steam',
            origin: origin.clone(),
            vel: new THREE.Vector3((Math.random() - 0.5) * 0.12, 0.45 + Math.random() * 0.2, (Math.random() - 0.5) * 0.12),
            phase: Math.random() * Math.PI * 2,
            maxAge: 2.2 + Math.random() * 0.8,
            age: Math.random() * 2.2
          });
        }
      });
    } else if (station.id === 'london') {
      // Sparkling water fountain droplets in London Square!
      const origin = new THREE.Vector3(0.35, 1.85, -0.55);
      const dropGeo = new THREE.SphereGeometry(0.065, 8, 8);
      for (let i = 0; i < 16; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: '#7dd3fc',
          transparent: true,
          opacity: 0.8
        });
        const mesh = new THREE.Mesh(dropGeo, mat);
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 0.65 + Math.random() * 0.35;
        this.effectsGroup.add(mesh);
        this.ambientParticles.push({
          mesh,
          kind: 'water',
          origin: origin.clone(),
          vel: new THREE.Vector3(Math.cos(angle) * speed, 1.6 + Math.random() * 0.55, Math.sin(angle) * speed),
          phase: angle,
          maxAge: 1.15 + Math.random() * 0.35,
          age: Math.random() * 1.15
        });
      }
    }
  }

  burstConfetti(itemId?: string): void {
    const origin = new THREE.Vector3(0, 1.8, 0);
    if (itemId) {
      const prop = this.props.find((p) => p.item.id === itemId);
      if (prop) {
        origin.copy(prop.wrapper.position).add(new THREE.Vector3(0, 1.2, 0));
      }
    }

    const palette = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#facc15', '#ef4444'];
    const geo = new THREE.BoxGeometry(0.16, 0.16, 0.04);

    for (let i = 0; i < 34; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        emissive: palette[i % palette.length],
        emissiveIntensity: 0.35,
        roughness: 0.3
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(origin);
      const angle = Math.random() * Math.PI * 2;
      const horiz = 1.2 + Math.random() * 2.8;
      this.effectsGroup.add(mesh);
      this.confettiParticles.push({
        mesh,
        vel: new THREE.Vector3(Math.cos(angle) * horiz, 3.4 + Math.random() * 3.0, Math.sin(angle) * horiz),
        rotVel: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8),
        life: 0,
        maxLife: 1.5 + Math.random() * 0.7
      });
    }
  }

  private buildIslandBase(station: StationData): void {
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

    const rimGeo = new THREE.CylinderGeometry(6.62, 6.18, 0.45, 56);
    const rimMat = new THREE.MeshStandardMaterial({
      color: station.accentColor,
      roughness: 0.65,
      metalness: 0.1
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = -0.68;
    this.stationGroup.add(rim);

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
      const runway = new THREE.Mesh(
        new THREE.BoxGeometry(9.6, 0.03, 2.6),
        new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.9 })
      );
      runway.position.set(0.4, 0.01, -1.3);
      runway.rotation.y = -0.18;
      runway.receiveShadow = true;
      this.stationGroup.add(runway);

      const stripeMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.7 });
      for (let i = -3; i <= 3; i++) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.035, 0.15), stripeMat);
        dash.position.set(0.4 + i * 1.25, 0.012, -1.3 + i * 0.22);
        dash.rotation.y = -0.18;
        this.stationGroup.add(dash);
      }

      const mat = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.03, 3.0),
        new THREE.MeshStandardMaterial({ color: '#bfdbfe', roughness: 0.8 })
      );
      mat.position.set(-0.3, 0.01, 2.35);
      mat.receiveShadow = true;
      this.stationGroup.add(mat);
    } else if (station.id === 'station') {
      const gravel = new THREE.Mesh(
        new THREE.BoxGeometry(11.0, 0.04, 2.3),
        new THREE.MeshStandardMaterial({ color: '#78716c', roughness: 0.95 })
      );
      gravel.position.set(0, 0.01, -2.2);
      gravel.receiveShadow = true;
      this.stationGroup.add(gravel);

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

      const safetyLine = new THREE.Mesh(
        new THREE.BoxGeometry(10.2, 0.03, 0.18),
        new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.6 })
      );
      safetyLine.position.set(0, 0.015, -0.65);
      this.stationGroup.add(safetyLine);
    } else if (station.id === 'hotel') {
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
      const road = new THREE.Mesh(
        new THREE.BoxGeometry(10.8, 0.03, 2.5),
        new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.9 })
      );
      road.position.set(0.2, 0.01, 2.45);
      road.rotation.y = -0.1;
      road.receiveShadow = true;
      this.stationGroup.add(road);

      const stripeMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.7 });
      for (let i = -4; i <= 4; i++) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.11), stripeMat);
        dash.position.set(0.2 + i * 1.18, 0.015, 2.45 + i * 0.118);
        dash.rotation.y = -0.1;
        this.stationGroup.add(dash);
      }

      const plaza = new THREE.Mesh(
        new THREE.CylinderGeometry(2.3, 2.35, 0.03, 36),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.85 })
      );
      plaza.position.set(0.35, 0.012, -0.55);
      plaza.receiveShadow = true;
      this.stationGroup.add(plaza);
    }
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

      const hit = this.raycastInteractive();
      const propHit = hit?.kind === 'prop' ? hit.prop : null;
      const guideHit = hit?.kind === 'guide';

      if (propHit !== this.hoveredProp || guideHit !== this.guideHovered) {
        this.hoveredProp = propHit;
        this.guideHovered = guideHit;
        this.canvas.classList.toggle('pointer', Boolean(propHit || guideHit));
      }

      if (guideHit) {
        this.onItemHover?.(null, e.clientX, e.clientY);
        this.onGuideHover?.(true, e.clientX, e.clientY);
      } else {
        this.onGuideHover?.(false, e.clientX, e.clientY);
        this.onItemHover?.(propHit ? propHit.item : null, e.clientX, e.clientY);
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      if (dist < 7) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const hit = this.raycastInteractive();
        if (hit?.kind === 'prop') {
          this.onItemClick?.(hit.prop.item);
        } else if (hit?.kind === 'guide') {
          this.onGuideClick?.();
        }
      }
    });
  }

  private raycastInteractive(): { kind: 'prop'; prop: InteractiveProp } | { kind: 'guide' } | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const roots: THREE.Object3D[] = this.props.map((p) => p.wrapper);
    if (this.guideOwlWrapper) roots.push(this.guideOwlWrapper);

    const hits = this.raycaster.intersectObjects(roots, true);
    if (hits.length === 0) return null;

    let obj: THREE.Object3D | null = hits[0].object;
    while (obj) {
      if (obj.userData?.isGuide) {
        return { kind: 'guide' };
      }
      if (obj.userData?.itemId) {
        const found = this.props.find((p) => p.item.id === obj!.userData.itemId);
        if (found) return { kind: 'prop', prop: found };
      }
      obj = obj.parent;
    }
    return null;
  }

  private animate = (): void => {
    this.rafId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // Gentle floating island breathing
    this.stationGroup.position.y = Math.sin(t * 0.9) * 0.06;

    // Slowly rotate starfield at night
    this.starsPoints.rotation.y = t * 0.008;

    // Drifting clouds
    for (const c of this.cloudsGroup.children) {
      c.position.x = c.userData.baseX + Math.sin(t * c.userData.speed + c.userData.phase) * 1.4;
      c.position.y += Math.sin(t * 0.7 + c.userData.phase) * 0.0012;
    }

    // Circling Hot Air Balloon in the scenic sky!
    if (this.balloonWrapper) {
      const orbitAng = t * 0.12 + 2.3;
      this.balloonWrapper.position.x = Math.cos(orbitAng) * 13.0;
      this.balloonWrapper.position.z = Math.sin(orbitAng) * 13.0 - 2.5;
      this.balloonWrapper.position.y = 4.6 + Math.sin(t * 1.1) * 0.5;
      this.balloonWrapper.rotation.y = -orbitAng + Math.PI / 2;
    }

    // Friendly Barnaby Owl idle bounce & hover scale
    if (this.guideOwlWrapper) {
      const targetS = this.guideHovered ? 1.14 : 1.0;
      const curS = this.guideOwlWrapper.scale.x + (targetS - this.guideOwlWrapper.scale.x) * 0.14;
      this.guideOwlWrapper.scale.setScalar(curS);
      this.guideOwlWrapper.position.y = this.guideOwlBaseY + Math.abs(Math.sin(t * 2.2)) * 0.08 + (this.guideHovered ? 0.12 : 0);
    }

    // Interactive vocab props (update base props first, then tabletop props riding on them!)
    const propById = new Map<string, InteractiveProp>();
    for (const p of this.props) propById.set(p.item.id, p);

    // Pass 1: Ground / host props
    for (const prop of this.props) {
      if (prop.item.rideOnItemId) continue;
      const isHovered = prop === this.hoveredProp;
      const isHostTable = this.props.some((other) => other.item.rideOnItemId === prop.item.id);
      const targetScale = isHovered ? (isHostTable ? 1.04 : 1.11) : 1.0;
      prop.baseScale += (targetScale - prop.baseScale) * 0.14;
      prop.wrapper.scale.setScalar(prop.baseScale);

      const bob = prop.item.bobAmp ? Math.sin(t * 2.1 + prop.pulsePhase) * prop.item.bobAmp : 0;
      const hoverLift = isHovered ? (isHostTable ? 0.05 : 0.14) : 0;
      prop.wrapper.position.y += (prop.baseY + bob + hoverLift - prop.wrapper.position.y) * 0.14;

      const pulse = 1 + Math.sin(t * 3.0 + prop.pulsePhase) * (prop.discovered ? 0.03 : 0.08);
      prop.ring.scale.setScalar(isHovered ? 1.18 : pulse);
    }

    // Pass 2: Tabletop props that ride smoothly on top of a host prop (never sinking!)
    for (const prop of this.props) {
      if (!prop.item.rideOnItemId) continue;
      const host = propById.get(prop.item.rideOnItemId);
      const isHovered = prop === this.hoveredProp;
      const targetScale = isHovered ? 1.14 : 1.0;
      prop.baseScale += (targetScale - prop.baseScale) * 0.14;
      prop.wrapper.scale.setScalar(prop.baseScale);

      let surfaceY = prop.baseY;
      let targetX = prop.item.position[0];
      let targetZ = prop.item.position[2];
      if (host) {
        surfaceY = host.wrapper.position.y + prop.baseY * host.wrapper.scale.y + 0.01;
        targetX = host.wrapper.position.x + (prop.item.position[0] - host.item.position[0]) * host.wrapper.scale.x;
        targetZ = host.wrapper.position.z + (prop.item.position[2] - host.item.position[2]) * host.wrapper.scale.z;
      }

      const bob = prop.item.bobAmp ? Math.sin(t * 2.1 + prop.pulsePhase) * prop.item.bobAmp : 0;
      const targetLift = isHovered ? 0.12 : 0;
      prop.hoverLiftCur += (targetLift - prop.hoverLiftCur) * 0.16;
      prop.wrapper.position.x = targetX;
      prop.wrapper.position.z = targetZ;
      prop.wrapper.position.y = surfaceY + Math.max(0, bob) + prop.hoverLiftCur;

      const pulse = 1 + Math.sin(t * 3.0 + prop.pulsePhase) * (prop.discovered ? 0.03 : 0.07);
      prop.ring.scale.setScalar(isHovered ? 1.18 : pulse);
    }

    // Ambient steam & water fountain particles
    for (const p of this.ambientParticles) {
      p.age += dt;
      if (p.age >= p.maxAge) {
        p.age = 0;
        p.mesh.position.copy(p.origin);
      }
      const frac = p.age / p.maxAge;
      if (p.kind === 'steam') {
        p.mesh.position.set(
          p.origin.x + Math.sin(t * 2.0 + p.phase) * 0.12 + p.vel.x * p.age,
          p.origin.y + p.vel.y * p.age + this.stationGroup.position.y,
          p.origin.z + Math.cos(t * 1.8 + p.phase) * 0.12 + p.vel.z * p.age
        );
        const s = 0.6 + frac * 1.4;
        p.mesh.scale.setScalar(s);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - frac) * 0.42;
      } else {
        // Water fountain parabola
        const g = -3.8;
        p.mesh.position.set(
          p.origin.x + p.vel.x * p.age,
          p.origin.y + p.vel.y * p.age + 0.5 * g * p.age * p.age + this.stationGroup.position.y,
          p.origin.z + p.vel.z * p.age
        );
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - frac * 0.9);
      }
    }

    // 3D Confetti celebration particles
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const c = this.confettiParticles[i];
      c.life += dt;
      if (c.life >= c.maxLife) {
        this.effectsGroup.remove(c.mesh);
        (c.mesh.material as THREE.Material).dispose();
        this.confettiParticles.splice(i, 1);
        continue;
      }
      c.vel.y -= 7.8 * dt;
      c.mesh.position.addScaledVector(c.vel, dt);
      c.mesh.rotation.x += c.rotVel.x * dt;
      c.mesh.rotation.y += c.rotVel.y * dt;
      c.mesh.rotation.z += c.rotVel.z * dt;
      const fade = 1 - c.life / c.maxLife;
      c.mesh.scale.setScalar(Math.max(0.01, fade));
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
