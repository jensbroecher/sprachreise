# ✈️ Sprachreise: Ticket to London

Ein interaktives 3D-Edutainment-Lernspiel für einfaches Reise-Englisch (Niveau A1), gebaut mit **Three.js**, **TypeScript/Vite** und **Sand3D** (Python + Headless-Blender `bpy`).

## ✨ Features
- **5 liebevolle 3D-Reise-Stationen (30 Vokabeln + 10 Szenerie-Modelle = 40 Sand3D-Modelle):**
  1. **✈️ Airport (Flughafen):** *Suitcase, Passport, Backpack, Camera, Airplane, Departure Gate* (+ Control Tower & Luggage Cart)
  2. **🚆 Train Station (Bahnhof):** *Train, Ticket Machine, Map, Bench, Umbrella, Clock* (+ Railway Signal & Platform Canopy)
  3. **🏨 Boutique Hotel (Hotel):** *Bell, Key, Bed, Lamp, Armchair, Window* (+ Reception Desk & Hotel Sign)
  4. **☕ Cozy Café (Café):** *Coffee, Cake, Table, Menu, Tea, Water* (+ Espresso Counter & Topiary Plants)
  5. **🇬🇧 London Square (London):** *Phone Booth, Bus, Clock Tower, Street Lamp, Postbox, Bicycle* (+ Park Fountain & Park Trees)
- **40 prozedural erzeugte Sand3D-Modelle (`.glb`):** Alle 3D-Objekte werden per Python-Skript in `assets_src/build_assets.py` & `assets_src/extra_models.py` gebaut und als `.glb` nach `public/models/` exportiert.
- **Interaktives Lernen:**
  - 3D-Objekte anklicken für englische Aussprache (Web Speech API), Lautschrift, deutsche Übersetzung & Beispielsatz
  - 15 abwechslungsreiche Aufgaben (3 pro Station): **Objekt-Suche (Hören & Klicken)**, **Reise-Dialoge** und **Satzbau-Rätsel**
  - **Reise-Wörterbuch** zum Nachschlagen & Anhören aller 30 Wörter
  - **Reisepass** mit 5 sammelbaren Stempeln

## 🚀 Starten

```bash
npm run dev
```
Danach im Browser öffnen: `http://localhost:5173`

## 🧩 Alle 40 Sand3D-Modelle neu bauen / anpassen

```bash
npm run assets
```
(oder direkt: `.venv\Scripts\python.exe assets_src/build_assets.py`)
