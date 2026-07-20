from fastapi import APIRouter, HTTPException

from app.models.schemas import RegisterRequest, LoginRequest, AuthResponse
from app.services.auth_service import auth_service

router = APIRouter()


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest):
    try:
        result = auth_service.register(payload.email, payload.password, payload.display_name)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    try:
        result = auth_service.login(payload.email, payload.password)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")