from fastapi import APIRouter, Depends, UploadFile, File
from util.protectRoute import get_current_user
from core.database import get_db
from db.schema.user import UserInCreate, UserInLogin, UserInUpdate, UserWithToken, UserOutput, PasswordChangeSchema
from fastapi import HTTPException
from service.userService import UserService
from util.cloudinary_helper import upload_profile_image
from sqlalchemy.orm import Session
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


authRouter = APIRouter()


@authRouter.post("/login", status_code=200, response_model=UserWithToken)
async def login(loginDetails: UserInLogin, db: Session = Depends(get_db)):
    try:
        return UserService(session=db).login(login_details=loginDetails)
    except HTTPException as e:
        raise e
    except Exception:
        logger.exception("Error in login")
        raise HTTPException(status_code=500, detail="Internal server error")


@authRouter.post("/signup", status_code=201, response_model=UserWithToken)
async def signup(signupDetails: UserInCreate, db: Session = Depends(get_db)):
    try:
        return UserService(session=db).signup(user_details=signupDetails)
    except HTTPException as e:
        raise e
    except Exception:
        logger.exception("Error in signup")
        raise HTTPException(status_code=500, detail="Internal server error")


@authRouter.get("/me", response_model=UserOutput)
def get_me(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = UserService(session=db)
    return service.get_user_by_id(user_id)


@authRouter.patch("/me", response_model=UserOutput)
def update_user(
    payload: UserInUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = UserService(session=db)
    return service.update_user(user_id, payload)


# This is so i can add profile picture for users.
@authRouter.post("/me/avatar", response_model=UserOutput)
async def upload_avatar(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a profile picture — stored on Cloudinary, URL saved to user record."""
    url = await upload_profile_image(file, user_id)
    service = UserService(session=db)
    return service.update_user(user_id, UserInUpdate(profile_image=url))


@authRouter.put("/change-password", status_code=200)
def change_password(
    payload: PasswordChangeSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    service = UserService(session=db)
    return service.change_password(user_id, payload)