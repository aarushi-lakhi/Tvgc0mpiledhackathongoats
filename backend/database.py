import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "grid_assets.db"

_SCHEMA = """
CREATE TABLE IF NOT EXISTS assets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id    TEXT UNIQUE NOT NULL,
    lat         REAL NOT NULL,
    lng         REAL NOT NULL,
    score       INTEGER NOT NULL,
    risk_label  TEXT NOT NULL,
    summary     TEXT NOT NULL,
    image_b64   TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with _get_conn() as conn:
        conn.executescript(_SCHEMA)


def _next_asset_id(conn: sqlite3.Connection) -> str:
    row = conn.execute("SELECT MAX(id) AS max_id FROM assets").fetchone()
    seq = (row["max_id"] or 50) + 1
    return f"AUS-{seq:03d}"


def insert_asset(
    lat: float,
    lng: float,
    score: int,
    risk_label: str,
    summary: str,
    image_b64: str | None = None,
) -> str:
    """Insert a new asset row and return its asset_id."""
    with _get_conn() as conn:
        asset_id = _next_asset_id(conn)
        conn.execute(
            """
            INSERT INTO assets (asset_id, lat, lng, score, risk_label, summary, image_b64)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (asset_id, lat, lng, score, risk_label, summary, image_b64),
        )
        return asset_id


def _score_to_risk(score: int) -> str:
    if score >= 70:
        return "high"
    if score >= 50:
        return "medium"
    return "low"


def get_all_assets() -> list[dict]:
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT asset_id, lat, lng, score, risk_label, summary FROM assets ORDER BY score DESC"
        ).fetchall()
    return [
        {
            "asset_id": r["asset_id"],
            "lat": r["lat"],
            "lng": r["lng"],
            "score": r["score"],
            "risk": _score_to_risk(r["score"]),
            "risk_label": r["risk_label"],
            "summary": r["summary"],
        }
        for r in rows
    ]
