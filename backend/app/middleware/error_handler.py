from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import CvNotFoundError


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(CvNotFoundError)
    def handle_cv_not_found(request: Request, exc: CvNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})
