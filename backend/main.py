import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env", override=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import database
import agent as sql_agent
from image_analysis import analyze_image
from models import (
    ImageAnalysisRequest,
    ImageAnalysisResponse,
    ChatRequest,
    ChatResponse,
    AssetsListResponse,
    AssetOut,
)

app = FastAPI(title="Micro-GridAware API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    database.init_db()
    database.seed_if_empty()


@app.post("/api/analyze-image", response_model=ImageAnalysisResponse)
def analyze_image_endpoint(req: ImageAnalysisRequest):
    try:
        result = analyze_image(req.image_base64)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini analysis failed: {exc}")

    asset_id = database.insert_asset(
        lat=req.lat,
        lng=req.lng,
        score=result.vulnerability_score,
        risk_label=result.risk_label,
        summary=result.summary,
        image_b64=req.image_base64[:200],
    )

    sql_agent.reset()

    return ImageAnalysisResponse(
        asset_id=asset_id,
        score=result.vulnerability_score,
        risk_label=result.risk_label,
        summary=result.summary,
        lat=req.lat,
        lng=req.lng,
    )


@app.get("/api/assets", response_model=AssetsListResponse)
def list_assets():
    rows = database.get_all_assets()
    return AssetsListResponse(
        count=len(rows),
        assets=[AssetOut(**r) for r in rows],
    )


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    try:
        answer = sql_agent.query(req.message)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Agent query failed: {exc}")
    return ChatResponse(response=answer)
