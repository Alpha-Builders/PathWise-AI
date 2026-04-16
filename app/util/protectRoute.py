from fastapi import Depends, Header, HTTPException, status
from typing import Annotated, Union
from core.security.authHandler import AuthHandler
from core.database import get_db
from sqlalchemy.orm import Session

AUTH_PREFIX = "Bearer "


def get_current_user(
    authorization: Annotated[Union[str, None], Header()] = None
) -> int:

    auth_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Authentication Credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not authorization:
        raise auth_exception

    if not authorization.startswith(AUTH_PREFIX):
        raise auth_exception

    token = authorization[len(AUTH_PREFIX):].strip()

    try:
        payload = AuthHandler.decode_jwt(token)
    except Exception:
        raise auth_exception

    if not payload or "user_id" not in payload:
        raise auth_exception

    return payload["user_id"]