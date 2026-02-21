"""Seed data for grid assets — matches RAW_MARKERS from Dashboard.tsx."""

SEED_ASSETS = [
    # Downtown & Central
    {"asset_id": "AUS-001", "lat": 30.2672, "lng": -97.7431, "score": 87, "risk_label": "Vegetation Encroachment"},
    {"asset_id": "AUS-002", "lat": 30.2749, "lng": -97.7341, "score": 92, "risk_label": "Transformer Rust"},
    {"asset_id": "AUS-003", "lat": 30.2655, "lng": -97.7525, "score": 64, "risk_label": "Wire Fatigue"},
    {"asset_id": "AUS-004", "lat": 30.2800, "lng": -97.7400, "score": 28, "risk_label": "None Detected"},
    {"asset_id": "AUS-005", "lat": 30.2600, "lng": -97.7500, "score": 78, "risk_label": "Vegetation Encroachment"},
    {"asset_id": "AUS-006", "lat": 30.2720, "lng": -97.7380, "score": 55, "risk_label": "Pole Degradation"},
    {"asset_id": "AUS-007", "lat": 30.2690, "lng": -97.7460, "score": 32, "risk_label": "None Detected"},
    {"asset_id": "AUS-008", "lat": 30.2775, "lng": -97.7355, "score": 85, "risk_label": "Overloaded Circuit"},
    {"asset_id": "AUS-009", "lat": 30.2625, "lng": -97.7490, "score": 58, "risk_label": "Wire Fatigue"},
    {"asset_id": "AUS-010", "lat": 30.2710, "lng": -97.7420, "score": 25, "risk_label": "None Detected"},
    # East Austin
    {"asset_id": "AUS-011", "lat": 30.2630, "lng": -97.7180, "score": 91, "risk_label": "Transformer Overheating"},
    {"asset_id": "AUS-012", "lat": 30.2580, "lng": -97.7120, "score": 62, "risk_label": "Insulator Cracking"},
    {"asset_id": "AUS-013", "lat": 30.2700, "lng": -97.7100, "score": 83, "risk_label": "Underground Cable Fault"},
    {"asset_id": "AUS-014", "lat": 30.2650, "lng": -97.7250, "score": 19, "risk_label": "None Detected"},
    {"asset_id": "AUS-015", "lat": 30.2710, "lng": -97.7150, "score": 51, "risk_label": "Capacitor Bank Failure"},
    # South Austin / South Congress
    {"asset_id": "AUS-016", "lat": 30.2450, "lng": -97.7530, "score": 88, "risk_label": "Substation Flooding Risk"},
    {"asset_id": "AUS-017", "lat": 30.2380, "lng": -97.7470, "score": 67, "risk_label": "Pole Degradation"},
    {"asset_id": "AUS-018", "lat": 30.2500, "lng": -97.7600, "score": 22, "risk_label": "None Detected"},
    {"asset_id": "AUS-019", "lat": 30.2420, "lng": -97.7650, "score": 79, "risk_label": "Vegetation Encroachment"},
    {"asset_id": "AUS-020", "lat": 30.2350, "lng": -97.7580, "score": 59, "risk_label": "Conductor Sag"},
    # Zilker / Barton Springs
    {"asset_id": "AUS-021", "lat": 30.2640, "lng": -97.7700, "score": 53, "risk_label": "Wire Fatigue"},
    {"asset_id": "AUS-022", "lat": 30.2670, "lng": -97.7750, "score": 30, "risk_label": "Minor Corrosion"},
    {"asset_id": "AUS-023", "lat": 30.2580, "lng": -97.7800, "score": 81, "risk_label": "Tree Limb Contact"},
    # North Austin / Mueller
    {"asset_id": "AUS-024", "lat": 30.2980, "lng": -97.7060, "score": 15, "risk_label": "None Detected"},
    {"asset_id": "AUS-025", "lat": 30.3020, "lng": -97.7120, "score": 48, "risk_label": "Recloser Malfunction"},
    {"asset_id": "AUS-026", "lat": 30.3100, "lng": -97.7200, "score": 90, "risk_label": "Transformer Overloading"},
    {"asset_id": "AUS-027", "lat": 30.2950, "lng": -97.7250, "score": 21, "risk_label": "None Detected"},
    # The Domain / North Central
    {"asset_id": "AUS-028", "lat": 30.3950, "lng": -97.7250, "score": 57, "risk_label": "Switch Gear Wear"},
    {"asset_id": "AUS-029", "lat": 30.3900, "lng": -97.7350, "score": 86, "risk_label": "Feeder Line Degradation"},
    {"asset_id": "AUS-030", "lat": 30.4000, "lng": -97.7180, "score": 27, "risk_label": "None Detected"},
    {"asset_id": "AUS-031", "lat": 30.3850, "lng": -97.7420, "score": 61, "risk_label": "Capacitor Bank Failure"},
    # UT Campus / Hyde Park
    {"asset_id": "AUS-032", "lat": 30.2850, "lng": -97.7350, "score": 54, "risk_label": "Conductor Sag"},
    {"asset_id": "AUS-033", "lat": 30.2920, "lng": -97.7380, "score": 18, "risk_label": "None Detected"},
    {"asset_id": "AUS-034", "lat": 30.2880, "lng": -97.7280, "score": 76, "risk_label": "Aging Infrastructure"},
    # West Lake Hills / Westlake
    {"asset_id": "AUS-035", "lat": 30.2930, "lng": -97.7950, "score": 84, "risk_label": "Vegetation Encroachment"},
    {"asset_id": "AUS-036", "lat": 30.2870, "lng": -97.8050, "score": 63, "risk_label": "Pole Lean Detected"},
    {"asset_id": "AUS-037", "lat": 30.2750, "lng": -97.8100, "score": 24, "risk_label": "Minor Corrosion"},
    # South Lamar / Bouldin Creek
    {"asset_id": "AUS-038", "lat": 30.2520, "lng": -97.7620, "score": 89, "risk_label": "Overloaded Circuit"},
    {"asset_id": "AUS-039", "lat": 30.2480, "lng": -97.7700, "score": 52, "risk_label": "Insulator Cracking"},
    {"asset_id": "AUS-040", "lat": 30.2550, "lng": -97.7550, "score": 31, "risk_label": "None Detected"},
    # Southeast Austin / Riverside
    {"asset_id": "AUS-041", "lat": 30.2400, "lng": -97.7250, "score": 93, "risk_label": "Underground Cable Fault"},
    {"asset_id": "AUS-042", "lat": 30.2350, "lng": -97.7350, "score": 66, "risk_label": "Switch Gear Wear"},
    {"asset_id": "AUS-043", "lat": 30.2450, "lng": -97.7150, "score": 20, "risk_label": "None Detected"},
    {"asset_id": "AUS-044", "lat": 30.2300, "lng": -97.7200, "score": 82, "risk_label": "Transformer Rust"},
    # Far North / Round Rock edge
    {"asset_id": "AUS-045", "lat": 30.4200, "lng": -97.7000, "score": 56, "risk_label": "Wire Fatigue"},
    {"asset_id": "AUS-046", "lat": 30.4350, "lng": -97.7100, "score": 80, "risk_label": "Feeder Line Degradation"},
    {"asset_id": "AUS-047", "lat": 30.4250, "lng": -97.7250, "score": 16, "risk_label": "None Detected"},
    # Southwest Austin / Oak Hill
    {"asset_id": "AUS-048", "lat": 30.2350, "lng": -97.8500, "score": 77, "risk_label": "Tree Limb Contact"},
    {"asset_id": "AUS-049", "lat": 30.2420, "lng": -97.8400, "score": 60, "risk_label": "Pole Degradation"},
    {"asset_id": "AUS-050", "lat": 30.2500, "lng": -97.8300, "score": 29, "risk_label": "None Detected"},
]
