# SeismoPulse Studio — Industry Seismic Visualizer & Analytics Platform

SeismoPulse Studio is an industry-grade earthquake analysis workstation combining real-time global seismic mapping, multi-view geospatial cartography with tectonic fault overlays, an embedded Power BI-style business intelligence graph suite, a MongoDB aggregation pipeline runner, predictive seismic modeling, and a comprehensive educational safety and emergency response center.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural decisions below have been aligned with your selections from Phase 1. Review the key features and execution blueprint below before we begin building.

- **Confirmed Decision 1: Built-in Power BI Analytics Suite with MongoDB Pipeline**: The application will feature a full Power BI-inspired interactive dashboard (DAX-style KPI cards, cross-filtering charts, Gutenberg-Richter $b$-value power law analysis, depth-magnitude scatter distributions) coupled with a live MongoDB Query & Aggregation Pipeline Studio ($match, $group, $bucket, $geoNear runner against live GeoJSON seismic events).
- **Confirmed Decision 2: Multi-View Seismic Map with Fault Overlays**: An interactive Leaflet map offering instant layer switching between Street (Carto Voyager), Satellite Terrain (Esri Imagery / Topo), and Dark Seismology, accompanied by global tectonic plate boundary vector overlays, pulsing magnitude rings, and depth-stratified color ramps.
- **Confirmed Decision 3: Comprehensive Educational & Emergency Center**: Features an interactive scored Earthquake Safety Quiz with seismologist explanations, an emergency go-bag readiness checklist, a searchable Global Emergency Helpline directory (with one-touch emergency templates), and step-by-step survival protocols.

---

## 1. Overview & Core Concept

- **What It Does**: SeismoPulse Studio provides structural engineers, geophysicists, emergency coordinators, educators, and citizens with a single unified platform for real-time earthquake monitoring, big-data seismic graph intelligence, predictive risk calculations, and life-saving safety preparedness.
- **Target Audience & Persona**:
  - *Geotechnical & Hazard Analysts*: Requiring real-time USGS feeds, magnitude-frequency regression, depth profiling, and MongoDB aggregation pipelines.
  - *Disaster Response & Safety Officers*: Looking for rapid epicenter intelligence, tsunami threat evaluations, and emergency helpline routing.
  - *Educators & Citizens*: Seeking clear historical catastrophe comparisons, interactive survival guides, and safety readiness quizzes.
- **Key Value**: Bridges the gap between raw geophysical data streams and actionable visual intelligence—enabling users to query live seismic records like a database architect, explore correlations like a BI analyst, and prepare for disasters with expert safety guidance.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Live Seismic Explorer & Geospatial Stage**: The user lands on the global command console showing live real-time earthquakes (fetched from USGS GeoJSON feeds with custom magnitude/time filters). Clicking any quake centers the multi-view map, highlights tectonic boundaries, and displays focal depth, energy yield (Joules / TNT equivalent), and estimated shake intensity (MMI).
2. **Power BI Visual Analytics Studio**: The user switches to the BI Graph tab. Selecting a magnitude bin or region cross-filters the entire dashboard in real time—updating depth distributions, cumulative energy release curves, and the Gutenberg-Richter recurrence model.
3. **MongoDB Pipeline Workbench**: The user navigates to the database query tab, chooses an aggregation template (e.g., "$geoNear Pacific Rim clusters" or "$bucket depth strata"), edits the MQL pipeline, executes it in real time, and views the formatted JSON results alongside an explain-plan execution visualizer.
4. **Predictive Analytics & Hazard Simulator**: The user inputs earthquake parameters or selects an active event to calculate Omori-Utsu aftershock decay probabilities, peak ground acceleration (PGA), and tsunami potential.
5. **Historical Catastrophes & Safety Hub**: Users explore interactive case studies (1960 Valdivia, 2011 Tohoku, 2023 Turkey-Syria), take the interactive 10-question survival quiz, calculate their emergency go-bag readiness score, and search the international helpline directory.

### Visual Identity & Theme
- **Aesthetic Direction**: Clinical, high-precision scientific telemetry inspired by geophysics instrumentation labs and modern BI workstations.
- **Color Palette (60-30-10 Disciplined Budget)**:
  - *60% Dominant Field*: Obsidian slate (`#0B0F17`) canvas with crisp neutral contrast.
  - *30% Structural Panels*: Deep telemetry panels (`#111827`), hairline dividers (`#1E293B`), and muted slate typography (`#94A3B8`).
  - *10% Precision Accents*: High-visibility seismic amber (`#F59E0B`), tectonic laser cyan (`#06B6D4`), and magnitude alert crimson (`#EF4444`).
  - *Depth Color Ramp*: Shallow (<30km: `#EF4444`), Intermediate (30–70km: `#F97316`), Deep (70–300km: `#EAB308`), Ultra-deep (>300km: `#06B6D4`).
- **Typography & Hierarchy**:
  - *Display & Wordmark*: `Plus Jakarta Sans` for clean, confident titles and navigation.
  - *Telemetry & Analytics*: `JetBrains Mono` / `tabular-nums` for coordinates, magnitudes, Joules, and timestamps.
  - *Prose*: `DM Sans` for readable educational guidelines and case studies.
- **Top Bar Contract**:
  - `[SeismoPulse Studio]` — `[Live Map, Power BI Studio, Mongo Query, Predictive Tools, Safety & Helpline]` — `[Emergency Quick-Dial CTA]`

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Live USGS GeoJSON Feeds with Smart Caching**:
  - *Chosen Approach*: Stream live data directly from official USGS endpoints (`all_day.geojson`, `2.5_week.geojson`, `significant_month.geojson`) with an in-memory client cache and simulated offline fallback dataset.
  - *Why*: Provides 100% genuine, minute-by-minute accurate real-world data without requiring external server credentials or API keys.
  - *Alternatives Considered*: Hardcoded static sample data (rejected: breaks the real-time requirement).
- **Decision 2: Leaflet with Multi-Provider Tiles and Vector Fault Lines**:
  - *Chosen Approach*: Multi-layer Leaflet integration with Carto Voyager (street), Esri World Imagery (satellite/terrain), and Carto Dark Matter, bundled with Hugo Ahlenius / Bird's global plate boundary GeoJSON dataset.
  - *Why*: High-speed, touch-responsive, lightweight, zero billing requirement, zero rate limits, and custom SVG pulse rendering for epicenters.
- **Decision 3: In-Browser Power BI Visual Engine with Cross-Filtering**:
  - *Chosen Approach*: A purpose-built BI canvas featuring responsive SVG/Canvas charts (Gutenberg-Richter log-linear regression, energy release accumulation, depth histograms) that support bidirectional cross-filtering like Power BI Desktop.
  - *Why*: Delivers an immediate, zero-friction BI experience without requiring users to have Microsoft Power BI tenant credentials or paid workspace capacities.
- **Decision 4: Client-Side MongoDB Query & Aggregation Pipeline Engine**:
  - *Chosen Approach*: A real MQL parser supporting `$match`, `$group`, `$sort`, `$project`, `$bucket`, and `$geoNear` operating on the real-time earthquake collection.
  - *Why*: Gives users hands-on experience writing and executing database aggregation pipelines directly in the app.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SeismoPulse Studio App                          │
├────────────────────────────────────────────────────────────────────────┤
│ Top Bar: Brand Wordmark | 5 Main Tab Views | Emergency Actions         │
├────────────────────────────────────────────────────────────────────────┤
│ State Management: Active Filter State | Selected Quake | Quake Store   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                  Live Data Provider (USGS Feeds)                   │ │
│ │  - Real-time GeoJSON Poller (1m/2.5m/significant feeds)             │ │
│ │  - GeoJSON Normalizer & Energy Computation ($E = 10^{4.8+1.5M}$)   │ │
│ │  - Tectonic Plate Boundary GeoJSON Layers                          │ │
│ └──────────────────────────────────┬─────────────────────────────────┘ │
│                                    │                                   │
│           ┌────────────────────────┼────────────────────────┐          │
│           ▼                        ▼                        ▼          │
│ ┌───────────────────┐    ┌───────────────────┐    ┌──────────────────┐ │
│ │ 1. Map Visualizer │    │ 2. Power BI Suite │    │ 3. Mongo Studio  │ │
│ │ - Street/Terrain/ │    │ - DAX KPI Cards   │    │ - MQL Aggregator │ │
│ │   Dark Tile Switch│    │ - Gutenberg Law   │    │ - Stage Pipeline │ │
│ │ - Fault Overlays  │    │ - Depth Histogram │    │ - Explain Plan   │ │
│ │ - Pulsing Radii   │    │ - Cross-filtering │    │ - JSON Inspector │ │
│ └───────────────────┘    └───────────────────┘    └──────────────────┘ │
│           │                        │                        │          │
│           └────────────────────────┼────────────────────────┘          │
│                                    ▼                                   │
│           ┌─────────────────────────────────────────────────┐          │
│           │ 4. Predictive Hazard & Physics Suite            │          │
│           │  - Omori-Utsu Aftershock Probability Model      │          │
│           │  - Peak Ground Acceleration (PGA) Calculator    │          │
│           │  - Tsunami Early Assessment Matrix              │          │
│           └────────────────────────┬────────────────────────┘          │
│                                    ▼                                   │
│           ┌─────────────────────────────────────────────────┐          │
│           │ 5. Educational Safety & Emergency Helpline Hub  │          │
│           │  - 10-Question Scored Interactive Safety Quiz   │          │
│           │  - Interactive Go-Bag Checklist with Progress   │          │
│           │  - Global Emergency Helpline Directory (30+ c.) │          │
│           │  - Historical Archive (Valdivia, Tohoku, etc.)  │          │
│           └─────────────────────────────────────────────────┘          │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping
- `App.tsx`: Root shell controlling active navigation view, global earthquake feed state, selected event details, and emergency quick-modal.
- `components/SeismicMap.tsx`: Leaflet multi-view map component with base tile switcher (street, satellite, dark), GeoJSON tectonic plate boundary layer, depth-coded markers with pulsing wave animations, and inspect drawer.
- `components/PowerBIDashboard.tsx`: Executive analytics canvas with DAX KPI cards, Gutenberg-Richter log-magnitude chart, depth dispersion scatter plot, cumulative energy graph, and cross-filter slicers.
- `components/MongoStudio.tsx`: MongoDB Aggregation Pipeline IDE with pre-built stages, editable MQL JSON input, real-time query execution engine, stage timing benchmarks, and syntax-highlighted document output.
- `components/PredictiveTools.tsx`: Scientific simulator calculating aftershock probability distribution over $t$ days, distance-attenuated PGA, and tsunami risk matrix based on focal depth and magnitude.
- `components/SafetyAndQuiz.tsx`: Interactive multi-step safety quiz with instant scoring and explanations, survival checklist with local storage completion tracking, and emergency call directory with direct phone and SMS actions.
- `components/HistoricalArchive.tsx`: Interactive archive of humanity's greatest earthquakes with casualty comparisons, fault rupture length, and engineering lessons.

---

## 5. Execution Steps

1. **Setup & Dependencies**: Install `leaflet` and `@types/leaflet` for the high-performance multi-view map.
2. **Data Pipeline & Geophysical Utils**: Implement USGS GeoJSON client fetcher, seismic energy formula calculators, plate boundary coordinates, and historical catastrophe records.
3. **Seismic Map Component**: Build the interactive Leaflet map with view switching (street, terrain, dark), tectonic plate fault lines, depth colors, and pulse animations.
4. **Power BI Analytics Suite**: Build the cross-filtering BI visual engine with interactive charts, KPIs, and Gutenberg-Richter regression.
5. **MongoDB Aggregation Studio**: Build the MQL query engine, aggregation stage visualizer, and document inspector.
6. **Predictive Analytics & Hazard Tools**: Implement Omori-Utsu aftershock decay and ground-motion attenuation formulas.
7. **Educational Safety, Quiz & Helplines**: Build the interactive quiz with instant feedback, the emergency go-bag checklist, and the international helpline directory.
8. **Refinement & Verification**: Verify Top Bar contract, anti-slop guidelines, responsive layout across all viewports, and complete compilation.
