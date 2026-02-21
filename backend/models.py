from pydantic import BaseModel, Field
from typing import Optional


class ImageAnalysisRequest(BaseModel):
    image_base64: str
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class ImageAnalysisResponse(BaseModel):
    asset_id: str
    score: int = Field(..., ge=0, le=100)
    risk_label: str
    summary: str
    lat: float
    lng: float


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class AssetOut(BaseModel):
    asset_id: str
    lat: float
    lng: float
    score: int
    risk: str
    risk_label: str
    summary: str


class AssetsListResponse(BaseModel):
    count: int
    assets: list[AssetOut]
