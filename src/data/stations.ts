export interface VocabItem {
  id: string;
  modelFile: string;
  emoji: string;
  en: string;
  phonetic: string;
  de: string;
  exampleEn: string;
  exampleDe: string;
  position: [number, number, number];
  rotationY: number;
  scale: number;
  hoverHeight: number;
  bobAmp?: number;
  spinSpeed?: number;
  rideOnItemId?: string;
}

export interface SceneryProp {
  modelFile: string;
  position: [number, number, number];
  rotationY: number;
  scale: number;
}

export interface FindObjectTask {
  type: 'find';
  title: string;
  promptDe: string;
  promptEn: string;
  targetItemId: string;
  hintDe: string;
}

export interface DialogueTask {
  type: 'dialogue';
  title: string;
  speakerName: string;
  speakerEmoji: string;
  npcLineEn: string;
  npcLineDe: string;
  options: {
    en: string;
    de: string;
    correct: boolean;
    feedbackDe: string;
  }[];
}

export interface SentenceBuilderTask {
  type: 'sentence';
  title: string;
  promptDe: string;
  targetWords: string[];
  extraWords: string[];
  fullSentenceEn: string;
  fullSentenceDe: string;
}

export type StationTask = FindObjectTask | DialogueTask | SentenceBuilderTask;

export interface StationData {
  id: string;
  index: number;
  nameEn: string;
  nameDe: string;
  icon: string;
  stampLabel: string;
  stampColor: string;
  skyTop: string;
  skyBottom: string;
  groundColor: string;
  accentColor: string;
  sunColor: string;
  descriptionDe: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  items: VocabItem[];
  scenery: SceneryProp[];
  tasks: StationTask[];
}

export const STATIONS: StationData[] = [
  // ============================================================================
  // STATION 1: AIRPORT
  // ============================================================================
  {
    id: 'airport',
    index: 0,
    nameEn: 'Airport',
    nameDe: 'Flughafen',
    icon: '✈️',
    stampLabel: 'DEPARTURE · GATE 4',
    stampColor: '#2563eb',
    skyTop: '#58b4ff',
    skyBottom: '#dff4ff',
    groundColor: '#e2e8f0',
    accentColor: '#3b82f6',
    sunColor: '#fff5dc',
    descriptionDe: 'Pack deine Sachen! Entdecke 6 Wörter am Flughafen und meistere den Check-in.',
    cameraPos: [9.0, 6.4, 9.8],
    cameraTarget: [0, 0.9, 0],
    scenery: [
      {
        modelFile: 'control_tower.glb',
        position: [3.8, 0, -3.1],
        rotationY: -0.5,
        scale: 2.55
      },
      {
        modelFile: 'luggage_cart.glb',
        position: [-4.1, 0, 0.3],
        rotationY: 0.4,
        scale: 1.35
      }
    ],
    items: [
      {
        id: 'suitcase',
        modelFile: 'suitcase.glb',
        emoji: '🧳',
        en: 'Suitcase',
        phonetic: '/ˈsuːt.keɪs/',
        de: 'Der Koffer',
        exampleEn: 'My suitcase is blue and ready to go.',
        exampleDe: 'Mein Koffer ist blau und bereit für die Reise.',
        position: [-2.8, 0, 2.25],
        rotationY: 0.45,
        scale: 1.25,
        hoverHeight: 1.4
      },
      {
        id: 'passport',
        modelFile: 'passport.glb',
        emoji: '🛂',
        en: 'Passport',
        phonetic: '/ˈpɑːs.pɔːt/',
        de: 'Der Reisepass',
        exampleEn: 'Here is my passport, please.',
        exampleDe: 'Hier ist mein Reisepass, bitte.',
        position: [-0.2, 0.02, 3.05],
        rotationY: -0.15,
        scale: 0.85,
        hoverHeight: 1.1,
        bobAmp: 0.05
      },
      {
        id: 'backpack',
        modelFile: 'backpack.glb',
        emoji: '🎒',
        en: 'Backpack',
        phonetic: '/ˈbæk.pæk/',
        de: 'Der Rucksack',
        exampleEn: 'My snacks are in my backpack.',
        exampleDe: 'Meine Snacks sind in meinem Rucksack.',
        position: [2.1, 0, 2.6],
        rotationY: -0.55,
        scale: 1.05,
        hoverHeight: 1.2
      },
      {
        id: 'camera',
        modelFile: 'camera.glb',
        emoji: '📷',
        en: 'Camera',
        phonetic: '/ˈkæm.rə/',
        de: 'Die Kamera',
        exampleEn: 'Don’t forget your camera for holiday photos!',
        exampleDe: 'Vergiss deine Kamera für Urlaubsfotos nicht!',
        position: [3.95, 0.02, 0.7],
        rotationY: -0.9,
        scale: 0.85,
        hoverHeight: 1.0,
        bobAmp: 0.04
      },
      {
        id: 'airplane',
        modelFile: 'airplane.glb',
        emoji: '✈️',
        en: 'Airplane',
        phonetic: '/ˈeə.pleɪn/',
        de: 'Das Flugzeug',
        exampleEn: 'The airplane flies to London.',
        exampleDe: 'Das Flugzeug fliegt nach London.',
        position: [0.9, 0.04, -1.25],
        rotationY: -1.35,
        scale: 2.45,
        hoverHeight: 1.9,
        bobAmp: 0.03
      },
      {
        id: 'gate',
        modelFile: 'departure_board.glb',
        emoji: '🛫',
        en: 'Departure Gate',
        phonetic: '/dɪˈpɑː.tʃər ɡeɪt/',
        de: 'Das Flugsteig / Gate',
        exampleEn: 'Our flight leaves from Gate 4.',
        exampleDe: 'Unser Flug startet von Gate 4.',
        position: [-2.75, 0, -2.35],
        rotationY: 0.45,
        scale: 1.5,
        hoverHeight: 2.3
      }
    ],
    tasks: [
      {
        type: 'find',
        title: 'Hör genau hin & klicke!',
        promptDe: 'Klicke in der 3D-Szene auf das passende Objekt:',
        promptEn: 'Please find the passport!',
        targetItemId: 'passport',
        hintDe: 'Tipp: Du brauchst ihn bei der Passkontrolle (rot-goldenes Heft vorn).'
      },
      {
        type: 'dialogue',
        title: 'Am Check-in-Schalter',
        speakerName: 'Emily (Check-in)',
        speakerEmoji: '👩‍✈️',
        npcLineEn: 'Good morning! May I see your passport, please?',
        npcLineDe: 'Guten Morgen! Darf ich bitte Ihren Reisepass sehen?',
        options: [
          {
            en: 'Yes, here you are!',
            de: 'Ja, bitte sehr!',
            correct: true,
            feedbackDe: 'Perfekt! „Here you are“ ist genau die richtige höfliche Antwort.'
          },
          {
            en: 'A cup of coffee, please.',
            de: 'Eine Tasse Kaffee, bitte.',
            correct: false,
            feedbackDe: 'Fast – das passt eher ins Café! Versuch es noch einmal.'
          },
          {
            en: 'Good night, see you tomorrow.',
            de: 'Gute Nacht, bis morgen.',
            correct: false,
            feedbackDe: 'Ups, es ist Morgen und du möchtest einchecken.'
          }
        ]
      },
      {
        type: 'sentence',
        title: 'Gepäck aufgeben',
        promptDe: 'Bilde den englischen Satz für: „Ich habe einen Koffer.“',
        targetWords: ['I', 'have', 'one', 'suitcase.'],
        extraWords: ['train', 'coffee'],
        fullSentenceEn: 'I have one suitcase.',
        fullSentenceDe: 'Ich habe einen Koffer.'
      }
    ]
  },

  // ============================================================================
  // STATION 2: TRAIN STATION
  // ============================================================================
  {
    id: 'station',
    index: 1,
    nameEn: 'Train Station',
    nameDe: 'Bahnhof',
    icon: '🚆',
    stampLabel: 'LONDON EXPRESS · PLATFORM 2',
    stampColor: '#dc2626',
    skyTop: '#60a5fa',
    skyBottom: '#fde68a',
    groundColor: '#d6d3d1',
    accentColor: '#ef4444',
    sunColor: '#ffe8bd',
    descriptionDe: 'Willkommen am Bahnhof! Kauf dir eine Fahrkarte, schau auf den Stadtplan und steig in den Zug.',
    cameraPos: [9.2, 6.2, 9.6],
    cameraTarget: [0, 1.0, 0],
    scenery: [
      {
        modelFile: 'railway_signal.glb',
        position: [4.35, 0, -2.5],
        rotationY: -0.2,
        scale: 1.85
      },
      {
        modelFile: 'platform_canopy.glb',
        position: [-0.4, 0, 2.55],
        rotationY: 0,
        scale: 2.35
      }
    ],
    items: [
      {
        id: 'train',
        modelFile: 'train.glb',
        emoji: '🚆',
        en: 'Train',
        phonetic: '/treɪn/',
        de: 'Der Zug',
        exampleEn: 'The express train goes to London.',
        exampleDe: 'Der Expresszug fährt nach London.',
        position: [0.3, 0.08, -2.2],
        rotationY: 0.0,
        scale: 2.8,
        hoverHeight: 2.0
      },
      {
        id: 'ticket_machine',
        modelFile: 'ticket_machine.glb',
        emoji: '🎫',
        en: 'Ticket Machine',
        phonetic: '/ˈtɪk.ɪt məˈʃiːn/',
        de: 'Der Fahrkartenautomat',
        exampleEn: 'I buy a ticket at the ticket machine.',
        exampleDe: 'Ich kaufe eine Fahrkarte am Fahrkartenautomaten.',
        position: [-3.55, 0, 1.2],
        rotationY: 0.55,
        scale: 1.32,
        hoverHeight: 2.1
      },
      {
        id: 'map_stand',
        modelFile: 'map_stand.glb',
        emoji: '🗺️',
        en: 'Map',
        phonetic: '/mæp/',
        de: 'Der Stadtplan / Die Karte',
        exampleEn: 'Let’s look at the map of London.',
        exampleDe: 'Schauen wir auf den Stadtplan von London.',
        position: [-2.75, 0, 3.1],
        rotationY: 0.35,
        scale: 1.25,
        hoverHeight: 1.8
      },
      {
        id: 'bench',
        modelFile: 'bench.glb',
        emoji: '🪑',
        en: 'Bench',
        phonetic: '/bentʃ/',
        de: 'Die Bank',
        exampleEn: 'Let’s sit on the bench and wait.',
        exampleDe: 'Lass uns auf der Bank sitzen und warten.',
        position: [-0.4, 0, 2.35],
        rotationY: 0.0,
        scale: 1.22,
        hoverHeight: 1.3
      },
      {
        id: 'umbrella',
        modelFile: 'umbrella.glb',
        emoji: '☂️',
        en: 'Umbrella',
        phonetic: '/ʌmˈbrel.ə/',
        de: 'Der Regenschirm',
        exampleEn: 'Take an umbrella — it might rain in London!',
        exampleDe: 'Nimm einen Regenschirm mit – in London regnet es manchmal!',
        position: [1.95, 0, 2.85],
        rotationY: -0.25,
        scale: 1.2,
        hoverHeight: 1.6
      },
      {
        id: 'station_clock',
        modelFile: 'station_clock.glb',
        emoji: '🕰️',
        en: 'Clock',
        phonetic: '/klɒk/',
        de: 'Die Uhr',
        exampleEn: 'Look at the clock! It is ten o’clock.',
        exampleDe: 'Schau auf die Uhr! Es ist zehn Uhr.',
        position: [3.65, 0, 1.05],
        rotationY: -0.5,
        scale: 1.6,
        hoverHeight: 2.7
      }
    ],
    tasks: [
      {
        type: 'find',
        title: 'Wo gibt es Fahrkarten?',
        promptDe: 'Klicke in der 3D-Szene auf das gesuchte Objekt:',
        promptEn: 'Click on the ticket machine!',
        targetItemId: 'ticket_machine',
        hintDe: 'Tipp: Der blaue Automat links am Bahnsteig.'
      },
      {
        type: 'dialogue',
        title: 'Fahrkarte kaufen',
        speakerName: 'Oliver (Schaffner)',
        speakerEmoji: '🧑‍✈️',
        npcLineEn: 'Hello! Where would you like to go today?',
        npcLineDe: 'Hallo! Wohin möchten Sie heute fahren?',
        options: [
          {
            en: 'One ticket to London, please.',
            de: 'Eine Fahrkarte nach London, bitte.',
            correct: true,
            feedbackDe: 'Super! Mit „One ticket to ..., please“ kommst du überall hin.'
          },
          {
            en: 'My bench is very tasty.',
            de: 'Meine Bank ist sehr lecker.',
            correct: false,
            feedbackDe: 'Haha, eine leckere Bank? Schau dir nochmal die Optionen an.'
          },
          {
            en: 'Where is the airport bed?',
            de: 'Wo ist das Flughafen-Bett?',
            correct: false,
            feedbackDe: 'Nicht ganz – du möchtest eine Fahrkarte nach London kaufen.'
          }
        ]
      },
      {
        type: 'sentence',
        title: 'Nach der Abfahrt fragen',
        promptDe: 'Bilde den englischen Satz für: „Wann fährt der Zug ab?“',
        targetWords: ['When', 'does', 'the', 'train', 'leave?'],
        extraWords: ['cake', 'fly'],
        fullSentenceEn: 'When does the train leave?',
        fullSentenceDe: 'Wann fährt der Zug ab?'
      }
    ]
  },

  // ============================================================================
  // STATION 3: BOUTIQUE HOTEL (NEW!)
  // ============================================================================
  {
    id: 'hotel',
    index: 2,
    nameEn: 'Boutique Hotel',
    nameDe: 'Hotel',
    icon: '🏨',
    stampLabel: 'ROOM 204 · CHECK-IN',
    stampColor: '#7c3aed',
    skyTop: '#a78bfa',
    skyBottom: '#fce7f3',
    groundColor: '#f3e8ff',
    accentColor: '#7c3aed',
    sunColor: '#ffecd6',
    descriptionDe: 'Willkommen im Londoner Hotel! Hol dir deinen Zimmerschlüssel und mach es dir gemütlich.',
    cameraPos: [9.0, 6.2, 9.4],
    cameraTarget: [0, 1.0, 0],
    scenery: [
      {
        modelFile: 'reception_desk.glb',
        position: [-2.1, 0, -2.2],
        rotationY: 0,
        scale: 2.2
      },
      {
        modelFile: 'hotel_sign.glb',
        position: [-4.4, 0, -0.7],
        rotationY: 0.4,
        scale: 1.65
      }
    ],
    items: [
      {
        id: 'reception_bell',
        modelFile: 'reception_bell.glb',
        emoji: '🛎️',
        en: 'Bell',
        phonetic: '/bel/',
        de: 'Die Klingel',
        exampleEn: 'Please ring the bell for service.',
        exampleDe: 'Bitte läute die Klingel für den Service.',
        position: [-2.1, 1.81, -2.18],
        rotationY: 0.2,
        scale: 0.42,
        hoverHeight: 1.0
      },
      {
        id: 'room_key',
        modelFile: 'room_key.glb',
        emoji: '🔑',
        en: 'Key',
        phonetic: '/kiː/',
        de: 'Der Schlüssel',
        exampleEn: 'Here is the key to room 204.',
        exampleDe: 'Hier ist der Schlüssel für Zimmer 204.',
        position: [-2.4, 0.03, 1.85],
        rotationY: 0.35,
        scale: 0.95,
        hoverHeight: 1.0,
        bobAmp: 0.04
      },
      {
        id: 'hotel_bed',
        modelFile: 'hotel_bed.glb',
        emoji: '🛏️',
        en: 'Bed',
        phonetic: '/bed/',
        de: 'Das Bett',
        exampleEn: 'The hotel bed is soft and comfortable.',
        exampleDe: 'Das Hotelbett ist weich und gemütlich.',
        position: [2.05, 0, -1.15],
        rotationY: -0.35,
        scale: 2.1,
        hoverHeight: 1.7
      },
      {
        id: 'desk_lamp',
        modelFile: 'desk_lamp.glb',
        emoji: '🛋️',
        en: 'Lamp',
        phonetic: '/læmp/',
        de: 'Die Lampe',
        exampleEn: 'Turn on the lamp next to the bed.',
        exampleDe: 'Mach die Lampe neben dem Bett an.',
        position: [4.05, 0, -0.25],
        rotationY: -0.5,
        scale: 1.25,
        hoverHeight: 1.6
      },
      {
        id: 'armchair',
        modelFile: 'armchair.glb',
        emoji: '🪑',
        en: 'Armchair',
        phonetic: '/ˈɑːm.tʃeər/',
        de: 'Der Sessel',
        exampleEn: 'I like reading in the green armchair.',
        exampleDe: 'Ich lese gern im grünen Sessel.',
        position: [1.75, 0, 2.5],
        rotationY: -0.65,
        scale: 1.35,
        hoverHeight: 1.5
      },
      {
        id: 'window_frame',
        modelFile: 'window_frame.glb',
        emoji: '🪟',
        en: 'Window',
        phonetic: '/ˈwɪn.dəʊ/',
        de: 'Das Fenster',
        exampleEn: 'Look out the window! The sun is shining.',
        exampleDe: 'Schau aus dem Fenster! Die Sonne scheint.',
        position: [1.15, 0, -3.75],
        rotationY: -0.1,
        scale: 1.75,
        hoverHeight: 2.1
      }
    ],
    tasks: [
      {
        type: 'find',
        title: 'Wo ist der Zimmerschlüssel?',
        promptDe: 'Klicke in der 3D-Szene auf das gesuchte Objekt:',
        promptEn: 'Please find the room key!',
        targetItemId: 'room_key',
        hintDe: 'Tipp: Der goldene Schlüssel auf dem roten Samtkissen links vorn.'
      },
      {
        type: 'dialogue',
        title: 'An der Hotel-Rezeption',
        speakerName: 'Clara (Rezeption)',
        speakerEmoji: '👩‍💼',
        npcLineEn: 'Welcome to London Hotel! Do you have a reservation?',
        npcLineDe: 'Willkommen im London Hotel! Haben Sie eine Reservierung?',
        options: [
          {
            en: 'Yes, I booked a room for two nights.',
            de: 'Ja, ich habe ein Zimmer für zwei Nächte gebucht.',
            correct: true,
            feedbackDe: 'Großartig! Damit klappt jeder Hotel-Check-in auf Englisch.'
          },
          {
            en: 'The red bus is in my bed.',
            de: 'Der rote Bus ist in meinem Bett.',
            correct: false,
            feedbackDe: 'Oh weh, ein Bus im Bett! Probier eine passende Antwort.'
          },
          {
            en: 'One ticket to the coffee, please.',
            de: 'Eine Fahrkarte zum Kaffee, bitte.',
            correct: false,
            feedbackDe: 'Fast – sag der Rezeption, dass du ein Zimmer gebucht hast.'
          }
        ]
      },
      {
        type: 'sentence',
        title: 'Frühstückszeit erfragen',
        promptDe: 'Bilde den englischen Satz für: „Wo ist mein Zimmer?“',
        targetWords: ['Where', 'is', 'my', 'room?'],
        extraWords: ['cake', 'flies'],
        fullSentenceEn: 'Where is my room?',
        fullSentenceDe: 'Wo ist mein Zimmer?'
      }
    ]
  },

  // ============================================================================
  // STATION 4: COZY CAFE
  // ============================================================================
  {
    id: 'cafe',
    index: 3,
    nameEn: 'Cozy Café',
    nameDe: 'Café',
    icon: '☕',
    stampLabel: 'TEA & CAKE · SOHO',
    stampColor: '#d97706',
    skyTop: '#fb923c',
    skyBottom: '#fef3c7',
    groundColor: '#f5e6d3',
    accentColor: '#d97706',
    sunColor: '#ffdfb0',
    descriptionDe: 'Zeit für eine kleine Pause! Entdecke Getränke & Kuchen und bestelle auf Englisch.',
    cameraPos: [8.8, 6.0, 9.2],
    cameraTarget: [0, 1.0, 0],
    scenery: [
      {
        modelFile: 'espresso_counter.glb',
        position: [0.1, 0, -2.95],
        rotationY: 0,
        scale: 2.85
      },
      {
        modelFile: 'cafe_plant.glb',
        position: [-3.95, 0, -2.15],
        rotationY: 0.3,
        scale: 1.45
      },
      {
        modelFile: 'cafe_plant.glb',
        position: [4.05, 0, -2.0],
        rotationY: -0.4,
        scale: 1.45
      }
    ],
    items: [
      {
        id: 'coffee_cup',
        modelFile: 'coffee_cup.glb',
        emoji: '☕',
        en: 'Coffee',
        phonetic: '/ˈkɒf.i/',
        de: 'Der Kaffee',
        exampleEn: 'I would like a hot coffee, please.',
        exampleDe: 'Ich hätte gern einen heißen Kaffee, bitte.',
        position: [-0.25, 1.83, 1.0],
        rotationY: 0.4,
        scale: 0.44,
        hoverHeight: 1.15,
        bobAmp: 0.015,
        rideOnItemId: 'bistro_table'
      },
      {
        id: 'cake_plate',
        modelFile: 'cake_plate.glb',
        emoji: '🍰',
        en: 'Cake',
        phonetic: '/keɪk/',
        de: 'Der Kuchen',
        exampleEn: 'This cake is sweet and delicious!',
        exampleDe: 'Dieser Kuchen ist süß und lecker!',
        position: [0.65, 1.83, 0.62],
        rotationY: -0.5,
        scale: 0.48,
        hoverHeight: 1.15,
        bobAmp: 0.015,
        rideOnItemId: 'bistro_table'
      },
      {
        id: 'bistro_table',
        modelFile: 'bistro_table.glb',
        emoji: '🍽️',
        en: 'Table',
        phonetic: '/ˈteɪ.bəl/',
        de: 'Der Tisch',
        exampleEn: 'Excuse me, is this table free?',
        exampleDe: 'Entschuldigung, ist dieser Tisch frei?',
        position: [0.2, 0, 0.78],
        rotationY: 0.2,
        scale: 2.35,
        hoverHeight: 1.5
      },
      {
        id: 'menu_board',
        modelFile: 'menu_board.glb',
        emoji: '📋',
        en: 'Menu',
        phonetic: '/ˈmen.juː/',
        de: 'Die Speisekarte',
        exampleEn: 'Can I see the menu, please?',
        exampleDe: 'Kann ich bitte die Speisekarte sehen?',
        position: [-2.85, 0, 2.5],
        rotationY: 0.65,
        scale: 1.22,
        hoverHeight: 1.7
      },
      {
        id: 'teapot',
        modelFile: 'teapot.glb',
        emoji: '🫖',
        en: 'Tea',
        phonetic: '/tiː/',
        de: 'Der Tee (Die Teekanne)',
        exampleEn: 'British people love a warm cup of tea!',
        exampleDe: 'Briten lieben eine warme Tasse Tee!',
        position: [3.25, 0, 1.6],
        rotationY: -0.6,
        scale: 0.92,
        hoverHeight: 1.2,
        bobAmp: 0.03
      },
      {
        id: 'water_bottle',
        modelFile: 'water_bottle.glb',
        emoji: '💧',
        en: 'Water',
        phonetic: '/ˈwɔː.tər/',
        de: 'Das Wasser',
        exampleEn: 'May I have a glass of water, please?',
        exampleDe: 'Darf ich bitte ein Glas Wasser haben?',
        position: [-3.25, 0, 0.15],
        rotationY: 0.5,
        scale: 0.95,
        hoverHeight: 1.2
      }
    ],
    tasks: [
      {
        type: 'find',
        title: 'Was gibt es heute?',
        promptDe: 'Klicke in der 3D-Szene auf das richtige Objekt:',
        promptEn: 'Please click on the menu!',
        targetItemId: 'menu_board',
        hintDe: 'Tipp: Die kleine Tafel mit der Speisekarte links vor dem Tisch.'
      },
      {
        type: 'dialogue',
        title: 'Bestellen im Café',
        speakerName: 'Sophie (Barista)',
        speakerEmoji: '🧑‍🍳',
        npcLineEn: 'Welcome! What would you like to order?',
        npcLineDe: 'Willkommen! Was möchten Sie bestellen?',
        options: [
          {
            en: 'A coffee and a piece of cake, please.',
            de: 'Einen Kaffee und ein Stück Kuchen, bitte.',
            correct: true,
            feedbackDe: 'Köstlich! Sehr höflich und perfekt bestellt.'
          },
          {
            en: 'The airplane is on the street.',
            de: 'Das Flugzeug ist auf der Straße.',
            correct: false,
            feedbackDe: 'Das wäre im Café etwas überraschend! Versuch es nochmal.'
          },
          {
            en: 'My passport is green.',
            de: 'Mein Reisepass ist grün.',
            correct: false,
            feedbackDe: 'Im Café bestellen wir lieber etwas zu trinken oder essen.'
          }
        ]
      },
      {
        type: 'sentence',
        title: 'Die Rechnung bitte',
        promptDe: 'Bilde den englischen Satz für: „Kann ich bitte bezahlen?“',
        targetWords: ['Can', 'I', 'pay,', 'please?'],
        extraWords: ['bus', 'clock'],
        fullSentenceEn: 'Can I pay, please?',
        fullSentenceDe: 'Kann ich bitte bezahlen?'
      }
    ]
  },

  // ============================================================================
  // STATION 5: LONDON SQUARE
  // ============================================================================
  {
    id: 'london',
    index: 4,
    nameEn: 'London Square',
    nameDe: 'London',
    icon: '🇬🇧',
    stampLabel: 'WELCOME TO LONDON',
    stampColor: '#059669',
    skyTop: '#38bdf8',
    skyBottom: '#e0f2fe',
    groundColor: '#d1fae5',
    accentColor: '#059669',
    sunColor: '#fff7e0',
    descriptionDe: 'Du hast es nach London geschafft! Entdecke die berühmten Wahrzeichen und frag nach dem Weg.',
    cameraPos: [9.4, 6.6, 10.2],
    cameraTarget: [0, 1.3, 0],
    scenery: [
      {
        modelFile: 'park_fountain.glb',
        position: [0.35, 0, -0.55],
        rotationY: 0,
        scale: 1.55
      },
      {
        modelFile: 'park_tree.glb',
        position: [-4.2, 0, -2.55],
        rotationY: 0.4,
        scale: 1.75
      },
      {
        modelFile: 'park_tree.glb',
        position: [4.25, 0, -2.65],
        rotationY: -0.6,
        scale: 1.65
      }
    ],
    items: [
      {
        id: 'phone_booth',
        modelFile: 'phone_booth.glb',
        emoji: '☎️',
        en: 'Phone Booth',
        phonetic: '/ˈfəʊn buːθ/',
        de: 'Die Telefonzelle',
        exampleEn: 'Meet me next to the red phone booth.',
        exampleDe: 'Triff mich neben der roten Telefonzelle.',
        position: [-2.85, 0, -1.65],
        rotationY: 0.45,
        scale: 1.35,
        hoverHeight: 2.3
      },
      {
        id: 'double_decker',
        modelFile: 'double_decker.glb',
        emoji: '🚌',
        en: 'Bus',
        phonetic: '/bʌs/',
        de: 'Der Bus',
        exampleEn: 'The red double-decker bus goes to the park.',
        exampleDe: 'Der rote Doppeldeckerbus fährt zum Park.',
        position: [1.0, 0.03, 2.45],
        rotationY: -0.1,
        scale: 2.0,
        hoverHeight: 2.2
      },
      {
        id: 'clock_tower',
        modelFile: 'clock_tower.glb',
        emoji: '🕰️',
        en: 'Clock Tower',
        phonetic: '/klɒk ˈtaʊ.ər/',
        de: 'Der Uhrturm',
        exampleEn: 'The famous clock tower is very tall!',
        exampleDe: 'Der berühmte Uhrturm ist sehr hoch!',
        position: [-0.25, 0, -3.25],
        rotationY: 0.12,
        scale: 2.85,
        hoverHeight: 4.5
      },
      {
        id: 'street_lamp',
        modelFile: 'street_lamp.glb',
        emoji: '💡',
        en: 'Street Lamp',
        phonetic: '/striːt læmp/',
        de: 'Die Straßenlaterne',
        exampleEn: 'Go straight down this street.',
        exampleDe: 'Geh diese Straße geradeaus entlang.',
        position: [3.25, 0, -1.2],
        rotationY: -0.3,
        scale: 1.65,
        hoverHeight: 3.1
      },
      {
        id: 'post_box',
        modelFile: 'post_box.glb',
        emoji: '📮',
        en: 'Postbox',
        phonetic: '/ˈpəʊst.bɒks/',
        de: 'Der Briefkasten',
        exampleEn: 'I send a postcard in the red postbox.',
        exampleDe: 'Ich werfe eine Postkarte in den roten Briefkasten.',
        position: [-3.35, 0, 1.05],
        rotationY: 0.65,
        scale: 1.15,
        hoverHeight: 1.7
      },
      {
        id: 'bicycle',
        modelFile: 'bicycle.glb',
        emoji: '🚲',
        en: 'Bicycle',
        phonetic: '/ˈbaɪ.sɪ.kəl/',
        de: 'Das Fahrrad',
        exampleEn: 'We can ride a bicycle through the park!',
        exampleDe: 'Wir können mit dem Fahrrad durch den Park fahren!',
        position: [3.85, 0, 1.2],
        rotationY: -0.75,
        scale: 1.25,
        hoverHeight: 1.4
      }
    ],
    tasks: [
      {
        type: 'find',
        title: 'Typisch London!',
        promptDe: 'Klicke in der 3D-Szene auf das gesuchte Fahrzeug:',
        promptEn: 'Find the red bus!',
        targetItemId: 'double_decker',
        hintDe: 'Tipp: Der rote Doppeldecker vorne auf der Straße.'
      },
      {
        type: 'dialogue',
        title: 'Nach dem Weg fragen',
        speakerName: 'Liam (Londoner)',
        speakerEmoji: '🎩',
        npcLineEn: 'Hello! You look like a visitor. Can I help you?',
        npcLineDe: 'Hallo! Du siehst aus wie ein Besucher. Kann ich dir helfen?',
        options: [
          {
            en: 'Excuse me, where is the clock tower?',
            de: 'Entschuldigung, wo ist der Uhrturm?',
            correct: true,
            feedbackDe: 'Wunderbar! „Excuse me, where is ...?“ ist super hilfreich auf Reisen.'
          },
          {
            en: 'I have a suitcase in my coffee.',
            de: 'Ich habe einen Koffer in meinem Kaffee.',
            correct: false,
            feedbackDe: 'Oh je, ein Koffer im Kaffee! Probier die höfliche Frage nach dem Weg.'
          },
          {
            en: 'One boarding pass for the bench.',
            de: 'Eine Bordkarte für die Bank.',
            correct: false,
            feedbackDe: 'Das passt hier nicht ganz – du möchtest den Uhrturm finden.'
          }
        ]
      },
      {
        type: 'sentence',
        title: 'Freundlich bedanken',
        promptDe: 'Bilde den englischen Satz für: „Vielen Dank!“',
        targetWords: ['Thank', 'you', 'very', 'much!'],
        extraWords: ['ticket', 'gate'],
        fullSentenceEn: 'Thank you very much!',
        fullSentenceDe: 'Vielen Dank!'
      }
    ]
  }
];
