# ✈️ Sprachreise: Ticket to London

Ein interaktives 3D-Edutainment-Lernspiel für einfaches Reise-Englisch (Niveau A1), gebaut mit **Three.js**, **TypeScript/Vite** und **Sand3D** (Python + Headless-Blender `bpy`).

## ✨ Features
- **5 liebevolle 3D-Reise-Stationen (42 prozedurale Sand3D-Modelle):**
  1. **✈️ Airport (Flughafen):** *Suitcase, Passport, Backpack, Camera, Airplane, Departure Gate* (+ Control Tower & Luggage Cart)
  2. **🚆 Train Station (Bahnhof):** *Train, Ticket Machine, Map, Bench, Umbrella, Clock* (+ Railway Signal & Platform Canopy)
  3. **🏨 Boutique Hotel (Hotel):** *Bell, Key, Bed, Lamp, Armchair, Window* (+ Reception Desk & Hotel Sign)
  4. **☕ Cozy Café (Café):** *Coffee, Cake, Table, Menu, Tea, Water* (+ Espresso Counter, Topiary Plants & animierter Kaffee-/Teedampf)
  5. **🇬🇧 London Square (London):** *Phone Booth, Bus, Clock Tower, Street Lamp, Postbox, Bicycle* (+ sprudelnder Parkbrunnen & Sand3D-Eichen)
- **Lebendige 3D-Welt:**
  - 🎈 Animierter **Sand3D-Heißluftballon** kreist hoch über jeder Insel
  - 🦉 **Barnaby die Reise-Eule** (Sand3D-Begleiter) steht auf jeder Insel und gibt englische Reisetipps
  - ☀️ / 🌇 / 🌙 **Tag-, Abendrot- & Sternennacht-Modus** mit 3D-Sternenhimmel & leuchtenden Straßenlaternen/Lampen
  - 🎉 **3D-Konfetti-Feuerwerk** bei neu entdeckten Vokabeln, gelösten Aufgaben & Reisepass-Stempeln
- **Interaktives Lernen:**
  - 3D-Objekte anklicken für englische Aussprache (`Web Speech API`), Lautschrift, deutsche Übersetzung & Beispielsatz
  - **15 Reise-Aufgaben** (3 pro Station): Hör- & Suchspiel, kurze Dialoge und Satzbau-Rätsel
  - **🧠 Vokabel-Quiz:** 8-Fragen-Runden mit Hör-Verstehen, Übersetzen & Serien-Zähler (`🔥`)
  - **📖 Reise-Wörterbuch**, **🛂 Reisepass (5 Stempel)** & automatisches Speichern (`localStorage`)

## 🚀 Starten

```bash
npm run dev
```
Danach im Browser öffnen: `http://localhost:5173`

## 🧩 Alle 42 Sand3D-Modelle neu bauen / anpassen

```bash
npm run assets
```
(oder direkt: `.venv\Scripts\python.exe assets_src/build_assets.py`)

## 👨‍💻 Autor & Lizenz

Entwickelt von **Jens Andreas Bröcher — MatchNetworks UG (haftungsbeschränkt)**.

Dieses Projekt steht unter der **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** Lizenz (siehe [LICENSE](./LICENSE)).  
**Nicht-kommerzielle Nutzung** (Teilen, Lernen, Weiterentwickeln) ist unter Namensnennung ausdrücklich erlaubt; eine kommerzielle Nutzung bedarf der vorherigen Zustimmung der MatchNetworks UG (haftungsbeschränkt).

