from fastapi import APIRouter
from app.api.admin import router as admin_router
from app.api.results import router as results_router
from app.api.governance import router as governance_router
from app.api.audit import router as audit_router

api_router = APIRouter(prefix="/api")

api_router.include_router(admin_router)
api_router.include_router(results_router)
api_router.include_router(governance_router)
api_router.include_router(audit_router)

__all__ = ["api_router"]
