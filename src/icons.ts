// Crisp, cohesive custom SVG icon set for Sprachreise (zero OS emoji / Windows flag bugs!)

const SVG_MAP: Record<string, string> = {
  // === FLAGS ===
  'flag-gb': `<svg viewBox="0 0 36 26" fill="none">
    <rect width="36" height="26" rx="4" fill="#012169"/>
    <path d="M0 0L36 26M36 0L0 26" stroke="#fff" stroke-width="5.2"/>
    <path d="M0 0L36 26M36 0L0 26" stroke="#C8102E" stroke-width="2.4"/>
    <path d="M18 0V26M0 13H36" stroke="#fff" stroke-width="7.2"/>
    <path d="M18 0V26M0 13H36" stroke="#C8102E" stroke-width="4.2"/>
    <rect x="0.75" y="0.75" width="34.5" height="24.5" rx="3.25" stroke="rgba(15,23,42,0.12)" stroke-width="1.5"/>
  </svg>`,

  'flag-de': `<svg viewBox="0 0 36 26" fill="none">
    <clipPath id="de-clip"><rect width="36" height="26" rx="4"/></clipPath>
    <g clip-path="url(#de-clip)">
      <rect width="36" height="8.7" fill="#1e293b"/>
      <rect y="8.7" width="36" height="8.7" fill="#dc2626"/>
      <rect y="17.3" width="36" height="8.7" fill="#facc15"/>
    </g>
    <rect x="0.75" y="0.75" width="34.5" height="24.5" rx="3.25" stroke="rgba(15,23,42,0.12)" stroke-width="1.5"/>
  </svg>`,

  // === STATION & VOCAB ICONS ===
  airplane: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M27.5 4.5C26 3 23.2 4 21 6.2L17.2 10L6.5 7.4L4 9.9L12.6 14.5L9.2 17.9L5.4 17.4L3.6 19.2L8.7 21.8L11.3 26.9L13.1 25.1L12.6 21.3L16 17.9L20.6 26.5L23.1 24L20.5 13.3L24.3 9.5C26.5 7.3 29 6 27.5 4.5Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="21.5" cy="9.5" r="1.6" fill="#bae6fd"/>
  </svg>`,

  suitcase: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M12 8V5.5C12 4.7 12.7 4 13.5 4H18.5C19.3 4 20 4.7 20 5.5V8" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="5" y="8" width="22" height="19" rx="4" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.6"/>
    <rect x="9.5" y="8" width="2.8" height="19" fill="#92400e"/>
    <rect x="19.7" y="8" width="2.8" height="19" fill="#92400e"/>
    <circle cx="16" cy="15" r="2.2" fill="#ef4444"/>
    <rect x="14.3" y="19.5" width="4" height="2.6" rx="0.8" fill="#facc15"/>
    <circle cx="9" cy="28" r="1.6" fill="#1e293b"/>
    <circle cx="23" cy="28" r="1.6" fill="#1e293b"/>
  </svg>`,

  passport: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M18 3L25 6L23 12H16L18 3Z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.3"/>
    <rect x="7" y="6" width="18" height="23" rx="3" fill="#881337" stroke="#4c0519" stroke-width="1.6"/>
    <circle cx="16" cy="17" r="4.8" stroke="#fbbf24" stroke-width="1.6"/>
    <path d="M11.4 17H20.6M16 12.2V21.8" stroke="#fbbf24" stroke-width="1.3"/>
    <path d="M11 10H21M12 24.5H20" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,

  backpack: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M12.5 7V5.5C12.5 4.1 13.6 3 15 3H17C18.4 3 19.5 4.1 19.5 5.5V7" stroke="#78350f" stroke-width="2.2"/>
    <rect x="6" y="7" width="20" height="21" rx="7" fill="#0d9488" stroke="#115e59" stroke-width="1.6"/>
    <rect x="9.5" y="16" width="13" height="9" rx="3" fill="#f97316" stroke="#c2410c" stroke-width="1.4"/>
    <path d="M11.5 18.5H20.5" stroke="#fef08a" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M11 12.5H21" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,

  camera: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M11 9L13 6H19L21 9" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="4" y="9" width="24" height="17" rx="4" fill="#e2e8f0" stroke="#334155" stroke-width="1.6"/>
    <rect x="4.8" y="13" width="22.4" height="9" fill="#1e293b"/>
    <circle cx="16" cy="17.5" r="5.5" fill="#0284c7" stroke="#f59e0b" stroke-width="1.8"/>
    <circle cx="17.8" cy="15.8" r="1.4" fill="#bae6fd"/>
    <circle cx="8" cy="11.5" r="1.4" fill="#ef4444"/>
  </svg>`,

  gate: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="3" y="5" width="26" height="17" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="5" y="7" width="22" height="4" rx="1" fill="#2563eb"/>
    <rect x="21" y="7.8" width="5" height="2.4" rx="0.8" fill="#facc15"/>
    <path d="M6 14H17M6 18H15" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
    <path d="M20 14H25M20 18H25" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>
    <path d="M10 22V28M22 22V28M7 28H25" stroke="#64748b" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  train: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="6" y="4" width="20" height="20" rx="5" fill="#dc2626" stroke="#991b1b" stroke-width="1.6"/>
    <rect x="9" y="8" width="14" height="7" rx="2" fill="#7dd3fc"/>
    <rect x="6.8" y="16.5" width="18.4" height="2.5" fill="#fef3c7"/>
    <circle cx="10.5" cy="21" r="1.7" fill="#fef08a"/>
    <circle cx="21.5" cy="21" r="1.7" fill="#fef08a"/>
    <path d="M10 24L7 29M22 24L25 29M8.5 27H23.5" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  ticket_machine: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="7" y="4" width="18" height="24" rx="3" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.6"/>
    <rect x="10" y="6.5" width="12" height="2.6" rx="1" fill="#facc15"/>
    <rect x="10" y="11" width="12" height="8" rx="1.5" fill="#38bdf8"/>
    <rect x="10" y="21.5" width="7" height="3.5" rx="0.8" fill="#fb923c"/>
    <rect x="19" y="21.5" width="3" height="3.5" rx="0.6" fill="#0f172a"/>
  </svg>`,

  map_stand: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="4" y="6" width="24" height="17" rx="3" fill="#fffbeb" stroke="#1e3a8a" stroke-width="2"/>
    <path d="M7 11L15 14L24 10" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M8 18L16 14L24 19" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="15.5" cy="14" r="2.2" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
    <path d="M11 23V28M21 23V28" stroke="#b45309" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  bench: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="4" y="9" width="24" height="5" rx="1.5" fill="#c26412" stroke="#78350f" stroke-width="1.4"/>
    <rect x="4" y="16" width="24" height="4.5" rx="1.5" fill="#b45309" stroke="#78350f" stroke-width="1.4"/>
    <path d="M7 14V26M25 14V26M7 20V26M25 20V26" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  umbrella: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M4 16C4 9.5 9.4 5 16 5C22.6 5 28 9.5 28 16H4Z" fill="#facc15" stroke="#1e3a8a" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M16 5V25C16 26.7 17.3 28 19 28C20.7 28 22 26.7 22 25" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M16 3V5" stroke="#b45309" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  station_clock: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="13" r="9" fill="#fffbeb" stroke="#d97706" stroke-width="2.6"/>
    <path d="M16 8V13L19.5 15" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 22V28M11 28H21" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  hotel: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="20" height="22" rx="3" fill="#7c3aed" stroke="#4c1d95" stroke-width="1.6"/>
    <rect x="10" y="10" width="4" height="4" rx="0.8" fill="#fef08a"/>
    <rect x="18" y="10" width="4" height="4" rx="0.8" fill="#fef08a"/>
    <rect x="10" y="16" width="4" height="4" rx="0.8" fill="#fef08a"/>
    <rect x="18" y="16" width="4" height="4" rx="0.8" fill="#fef08a"/>
    <rect x="13.5" y="22" width="5" height="6" rx="1" fill="#fde68a"/>
    <circle cx="16" cy="4" r="1.8" fill="#facc15"/>
  </svg>`,

  reception_bell: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M6 22C6 15.5 10.5 11 16 11C21.5 11 26 15.5 26 22H6Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.6"/>
    <rect x="4" y="22" width="24" height="4" rx="2" fill="#1e293b"/>
    <path d="M16 11V8M13 8H19" stroke="#64748b" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  room_key: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="10.5" cy="16" r="6" fill="#facc15" stroke="#b45309" stroke-width="2"/>
    <circle cx="10.5" cy="16" r="2.2" fill="#fff"/>
    <path d="M16.5 16H28M23 16V20.5M26.5 16V19.5" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  hotel_bed: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M4 11V25M28 15V25" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="4" y="16" width="24" height="6" rx="2" fill="#0d9488" stroke="#115e59" stroke-width="1.5"/>
    <rect x="6.5" y="12" width="7" height="4.5" rx="2" fill="#fffbeb" stroke="#cbd5e1" stroke-width="1.2"/>
    <rect x="4" y="20" width="24" height="3" fill="#92400e"/>
  </svg>`,

  desk_lamp: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M10 6H22L25 16H7L10 6Z" fill="#fef3c7" stroke="#d97706" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M16 16V25M11 26H21" stroke="#b45309" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  armchair: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="7" y="6" width="18" height="12" rx="4" fill="#047857" stroke="#064e3b" stroke-width="1.5"/>
    <rect x="5" y="15" width="22" height="9" rx="3" fill="#059669" stroke="#064e3b" stroke-width="1.5"/>
    <rect x="12" y="12" width="8" height="5" rx="2" fill="#fbbf24"/>
    <path d="M8 24V28M24 24V28" stroke="#78350f" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  window_frame: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="5" y="5" width="22" height="22" rx="3" fill="#7dd3fc" stroke="#0f766e" stroke-width="2.4"/>
    <path d="M16 5V27M5 16H27" stroke="#fff" stroke-width="2.2"/>
    <rect x="4" y="25" width="24" height="3.5" rx="1.5" fill="#c2410c"/>
  </svg>`,

  coffee_cup: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M6 12H21V20C21 23.3 18.3 26 15 26H12C8.7 26 6 23.3 6 20V12Z" fill="#fff" stroke="#334155" stroke-width="1.7"/>
    <rect x="6.8" y="16.5" width="13.4" height="3.2" fill="#10b981"/>
    <path d="M21 14H23.5C25.4 14 27 15.6 27 17.5C27 19.4 25.4 21 23.5 21H21" stroke="#334155" stroke-width="1.8"/>
    <path d="M11 8C11 6.5 12.5 6.5 12.5 5M16 8C16 6.5 17.5 6.5 17.5 5" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M5 27.5H23" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  cake_plate: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="6" y="13" width="20" height="12" rx="3" fill="#f59e0b" stroke="#92400e" stroke-width="1.5"/>
    <rect x="6.6" y="18" width="18.8" height="2.8" fill="#fff7ed"/>
    <path d="M6 15C6 12.5 8 11 10.5 11H21.5C24 11 26 12.5 26 15H6Z" fill="#5c2d0c"/>
    <circle cx="16" cy="9" r="3" fill="#ef4444"/>
    <path d="M4 26.5H28" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  bistro_table: `<svg viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="11" rx="11" ry="4" fill="#fafaf9" stroke="#d97706" stroke-width="2"/>
    <path d="M16 15V26M10 26H22" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  menu_board: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="7" y="5" width="18" height="22" rx="2.5" fill="#1e293b" stroke="#b45309" stroke-width="2.4"/>
    <path d="M11 10H21" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>
    <path d="M11 15H20M11 19H18M11 23H19" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  teapot: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="18" r="8.5" fill="#38bdf8" stroke="#0369a1" stroke-width="1.6"/>
    <path d="M8.5 18H23.5" stroke="#fff" stroke-width="2.2"/>
    <path d="M8 16L4 13" stroke="#0284c7" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M24 14C27 14 28 16 28 18C28 20 26.5 21.5 24 21.5" stroke="#0284c7" stroke-width="2.2"/>
    <circle cx="16" cy="8.2" r="2" fill="#fbbf24"/>
  </svg>`,

  water_bottle: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="9" y="10" width="9" height="17" rx="3" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
    <rect x="11.2" y="5" width="4.6" height="5" rx="1" fill="#1d4ed8"/>
    <rect x="9.8" y="15" width="7.4" height="5" fill="#f8fafc"/>
    <path d="M20.5 17H27L26 27H21.5L20.5 17Z" fill="#bae6fd" stroke="#0284c7" stroke-width="1.4"/>
  </svg>`,

  phone_booth: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M9 8C9 5.5 12 4 16 4C20 4 23 5.5 23 8H9Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.4"/>
    <rect x="9" y="8" width="14" height="20" rx="1.5" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="11.5" y="11" width="9" height="12" fill="#bae6fd"/>
    <path d="M16 11V23M11.5 15H20.5M11.5 19H20.5" stroke="#dc2626" stroke-width="1.4"/>
  </svg>`,

  double_decker: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="4" y="6" width="24" height="18" rx="3.5" fill="#dc2626" stroke="#991b1b" stroke-width="1.6"/>
    <rect x="6.5" y="8.5" width="19" height="4.5" rx="1" fill="#bae6fd"/>
    <rect x="6.5" y="15.5" width="19" height="4.5" rx="1" fill="#7dd3fc"/>
    <path d="M4.8 14.3H27.2" stroke="#fef3c7" stroke-width="1.5"/>
    <circle cx="9.5" cy="25" r="2.6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.2"/>
    <circle cx="22.5" cy="25" r="2.6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.2"/>
  </svg>`,

  clock_tower: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M16 3L21 10H11L16 3Z" fill="#334155"/>
    <rect x="10" y="10" width="12" height="18" rx="1" fill="#e7cba9" stroke="#b45309" stroke-width="1.4"/>
    <circle cx="16" cy="15.5" r="3.6" fill="#fffbeb" stroke="#d97706" stroke-width="1.4"/>
    <path d="M16 13.5V15.5L17.5 16.5" stroke="#0f172a" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M10.5 22H21.5M10.5 25H21.5" stroke="#d97706" stroke-width="1.2"/>
  </svg>`,

  street_lamp: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M12 8L16 4L20 8H12Z" fill="#1e293b"/>
    <path d="M12.5 8H19.5L18.5 15H13.5L12.5 8Z" fill="#fef08a" stroke="#1e293b" stroke-width="1.4"/>
    <path d="M16 15V28M12 28H20M12 18H20" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  post_box: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M10 10C10 6.8 12.7 5 16 5C19.3 5 22 6.8 22 10H10Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.4"/>
    <rect x="10.5" y="10" width="11" height="15" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="13" y="13" width="6" height="2" rx="1" fill="#0f172a"/>
    <rect x="13.5" y="17.5" width="5" height="4.5" rx="0.8" fill="#f8fafc"/>
    <rect x="9" y="25" width="14" height="3" rx="1" fill="#0f172a"/>
  </svg>`,

  bicycle: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="8.5" cy="21" r="5" stroke="#1e293b" stroke-width="2.2"/>
    <circle cx="23.5" cy="21" r="5" stroke="#1e293b" stroke-width="2.2"/>
    <path d="M8.5 21L14.5 13H21L23.5 21M14.5 13L16 21H8.5M21 13L22.5 9H25.5" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5 11H16.5" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="23" y="11" width="4.5" height="4" rx="1" fill="#d97706"/>
  </svg>`,

  // === HUD, UI & GUIDE ICONS ===
  star: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M16 3.5L19.8 11.2L28.3 12.4L22.1 18.4L23.6 26.8L16 22.8L8.4 26.8L9.9 18.4L3.7 12.4L12.2 11.2L16 3.5Z" fill="#facc15" stroke="#d97706" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>`,

  quiz: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" fill="#f59e0b" stroke="#b45309" stroke-width="1.6"/>
    <path d="M12.5 12.5C12.5 10.6 14.1 9.2 16 9.2C17.9 9.2 19.5 10.6 19.5 12.4C19.5 14 18.3 14.8 17.1 15.5C16.3 16 16 16.5 16 17.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="16" cy="21.5" r="1.6" fill="#fff"/>
  </svg>`,

  book: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M5 7C5 5.9 5.9 5 7 5H15V26H7C5.9 26 5 25.1 5 24V7Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1.5"/>
    <path d="M17 5H25C26.1 5 27 5.9 27 7V24C27 25.1 26.1 26 25 26H17V5Z" fill="#60a5fa" stroke="#1e3a8a" stroke-width="1.5"/>
    <path d="M9 11H12.5M9 15H12.5M19.5 11H23M19.5 15H23" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  sun: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="6" fill="#facc15" stroke="#d97706" stroke-width="1.8"/>
    <path d="M16 4V7M16 25V28M4 16H7M25 16H28M7.5 7.5L9.7 9.7M22.3 22.3L24.5 24.5M24.5 7.5L22.3 9.7M9.7 22.3L7.5 24.5" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  sunset: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M8 20C8 15.6 11.6 12 16 12C20.4 12 24 15.6 24 20H8Z" fill="#fb923c" stroke="#c2410c" stroke-width="1.6"/>
    <path d="M4 22H28M8 26H24" stroke="#f97316" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M16 6V9M8.5 10.5L10.5 12.5M23.5 10.5L21.5 12.5" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  moon: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M23.5 19.8C22 20.4 20.4 20.6 18.7 20.3C14 19.4 10.9 14.9 11.8 10.2C12.1 8.5 12.9 7 14 5.8C9.2 6.6 5.6 10.8 5.6 15.9C5.6 21.6 10.2 26.2 15.9 26.2C19.6 26.2 22.8 24.2 24.6 21.3C24.2 20.8 23.9 20.3 23.5 19.8Z" fill="#fde047" stroke="#ca8a04" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="22" cy="9" r="1.5" fill="#fef08a"/>
    <circle cx="25.5" cy="13" r="1.1" fill="#fef08a"/>
  </svg>`,

  speaker: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M6 12.5H11L18 7V25L11 19.5H6V12.5Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M22 12C23.5 13.5 23.5 18.5 22 20M25 9.5C27.8 12.5 27.8 19.5 25 22.5" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  speaker_muted: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M6 12.5H11L18 7V25L11 19.5H6V12.5Z" fill="#94a3b8" stroke="#475569" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M22 13L27 19M27 13L22 19" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  target: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="11" fill="#fff" stroke="#ef4444" stroke-width="2.6"/>
    <circle cx="16" cy="16" r="6.5" fill="#fff" stroke="#ef4444" stroke-width="2.4"/>
    <circle cx="16" cy="16" r="2.6" fill="#ef4444"/>
  </svg>`,

  cam_view: `<svg viewBox="0 0 32 32" fill="none">
    <rect x="4" y="9" width="17" height="14" rx="3" fill="#475569"/>
    <path d="M21 13.5L28 9.5V22.5L21 18.5V13.5Z" fill="#64748b"/>
    <circle cx="11" cy="16" r="3" fill="#7dd3fc"/>
  </svg>`,

  owl: `<svg viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="19" rx="9.5" ry="9.5" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.5"/>
    <ellipse cx="16" cy="21.5" rx="5.5" ry="5.5" fill="#fef3c7"/>
    <circle cx="12.5" cy="15.5" r="3.4" fill="#fff" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="19.5" cy="15.5" r="3.4" fill="#fff" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="12.5" cy="15.5" r="1.4" fill="#0f172a"/>
    <circle cx="19.5" cy="15.5" r="1.4" fill="#0f172a"/>
    <path d="M14.5 18.5L16 20.5L17.5 18.5H14.5Z" fill="#f59e0b"/>
    <rect x="9" y="8" width="14" height="2.4" rx="1.2" fill="#1e293b"/>
    <path d="M11.5 8C11.5 5 13.5 4 16 4C18.5 4 20.5 5 20.5 8H11.5Z" fill="#1e293b"/>
  </svg>`,

  lock: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M11 14V10.5C11 7.7 13.2 5.5 16 5.5C18.8 5.5 21 7.7 21 10.5V14" stroke="#64748b" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="7" y="14" width="18" height="13" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1.6"/>
    <circle cx="16" cy="20" r="1.8" fill="#475569"/>
  </svg>`,

  hint: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M16 4C11.5 4 8 7.5 8 12C8 15 9.6 17.5 12 18.9V22H20V18.9C22.4 17.5 24 15 24 12C24 7.5 20.5 4 16 4Z" fill="#fde047" stroke="#ca8a04" stroke-width="1.6"/>
    <path d="M12.5 25H19.5M14 28H18" stroke="#64748b" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  fire: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M16.5 4C16.5 4 23 9.5 23 16.5C23 21.5 19.8 26 16 26C12.2 26 9 22.5 9 17.8C9 14.5 11 11.8 12.2 10.5C12.2 10.5 12 13.5 14 14.5C14 11 16.5 4 16.5 4Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M16 24C14 24 12.5 22.2 12.5 20C12.5 18 14.5 16 16 14.5C17.5 16 19.5 18 19.5 20C19.5 22.2 18 24 16 24Z" fill="#fde047"/>
  </svg>`,

  trophy: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M9 6H23V13C23 16.9 19.9 20 16 20C12.1 20 9 16.9 9 13V6Z" fill="#facc15" stroke="#b45309" stroke-width="1.6"/>
    <path d="M9 8H5.5C5.5 12 7 14 9 14M23 8H26.5C26.5 12 25 14 23 14" stroke="#d97706" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 20V25M11 26H21" stroke="#b45309" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  check: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" fill="#10b981"/>
    <path d="M10.5 16.2L14.2 20L21.8 12" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  search: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="14" cy="14" r="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2.4"/>
    <path d="M20 20L27 27" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  chat: `<svg viewBox="0 0 32 32" fill="none">
    <path d="M5 9C5 6.8 6.8 5 9 5H23C25.2 5 27 6.8 27 9V19C27 21.2 25.2 23 23 23H13L7 27V23H9C6.8 23 5 21.2 5 19V9Z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="11.5" cy="14" r="1.6" fill="#fff"/>
    <circle cx="16" cy="14" r="1.6" fill="#fff"/>
    <circle cx="20.5" cy="14" r="1.6" fill="#fff"/>
  </svg>`,

  globe: `<svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="11.5" fill="#38bdf8" stroke="#0369a1" stroke-width="1.6"/>
    <path d="M10 10C12 8.5 15 9 16 11C17 13 14.5 15 15 17C15.5 19 18 19 19 21C19.5 22.5 18 25 16 25.5" fill="#4ade80"/>
    <path d="M19 9C21 10 23 12 24 14.5C22 15.5 20.5 15 19.5 13.5C18.5 12 18 10 19 9Z" fill="#4ade80"/>
    <circle cx="16" cy="16" r="11.5" stroke="#0369a1" stroke-width="1.6"/>
  </svg>`,

  // Friendly NPC Character Badges
  npc_pilot: `<svg viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="17" fill="#dbeafe"/>
    <circle cx="18" cy="18" r="8" fill="#fed7aa"/>
    <path d="M10 14C10 10 13.5 8 18 8C22.5 8 26 10 26 14H10Z" fill="#1e3a8a"/>
    <rect x="15" y="10" width="6" height="2" rx="1" fill="#facc15"/>
    <circle cx="15" cy="18" r="1.3" fill="#0f172a"/>
    <circle cx="21" cy="18" r="1.3" fill="#0f172a"/>
    <path d="M15.5 21.5C16.5 22.8 19.5 22.8 20.5 21.5" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  npc_conductor: `<svg viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="17" fill="#fee2e2"/>
    <circle cx="18" cy="18.5" r="8" fill="#fed7aa"/>
    <path d="M9.5 14H26.5L24.5 9.5H11.5L9.5 14Z" fill="#991b1b"/>
    <rect x="15" y="10.5" width="6" height="2" rx="1" fill="#fbbf24"/>
    <circle cx="15" cy="18.5" r="1.3" fill="#0f172a"/>
    <circle cx="21" cy="18.5" r="1.3" fill="#0f172a"/>
    <path d="M15.5 22C16.5 23.2 19.5 23.2 20.5 22" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  npc_reception: `<svg viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="17" fill="#ede9fe"/>
    <circle cx="18" cy="19" r="8" fill="#fed7aa"/>
    <path d="M10 18C10 12 13 9 18 9C23 9 26 12 26 18C24 15 21 13.5 18 13.5C15 13.5 12 15 10 18Z" fill="#7c2d12"/>
    <circle cx="15" cy="19" r="1.3" fill="#0f172a"/>
    <circle cx="21" cy="19" r="1.3" fill="#0f172a"/>
    <path d="M15.5 22.5C16.5 23.8 19.5 23.8 20.5 22.5" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  npc_barista: `<svg viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="17" fill="#fef3c7"/>
    <circle cx="18" cy="19" r="8" fill="#fed7aa"/>
    <path d="M11 13.5C11 10 14 8.5 18 8.5C22 8.5 25 10 25 13.5H11Z" fill="#059669"/>
    <circle cx="15" cy="19" r="1.3" fill="#0f172a"/>
    <circle cx="21" cy="19" r="1.3" fill="#0f172a"/>
    <path d="M15.5 22.5C16.5 23.8 19.5 23.8 20.5 22.5" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  npc_londoner: `<svg viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="17" fill="#d1fae5"/>
    <circle cx="18" cy="20" r="7.5" fill="#fed7aa"/>
    <rect x="10" y="13" width="16" height="2.4" rx="1.2" fill="#1e293b"/>
    <path d="M12.5 13C12.5 8.8 14.5 7 18 7C21.5 7 23.5 8.8 23.5 13H12.5Z" fill="#1e293b"/>
    <rect x="12.5" y="11" width="11" height="2" fill="#dc2626"/>
    <circle cx="15.2" cy="19.5" r="1.3" fill="#0f172a"/>
    <circle cx="20.8" cy="19.5" r="1.3" fill="#0f172a"/>
    <path d="M15.5 23C16.5 24.2 19.5 24.2 20.5 23" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
};

export function icon(name: string, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  const svg = SVG_MAP[name] || SVG_MAP.star;
  return `<span class="ui-icon ui-icon--${size}" aria-hidden="true">${svg}</span>`;
}
