from db.repository.userRepo import UserRepository
from db.schema.user import UserInCreate, UserInLogin, UserOutput, UserWithToken
from core.security.authHandler import AuthHandler
from core.security.hashHelper import HashHelper
from sqlalchemy.orm import Session
from fastapi import HTTPException


class UserService:
  def __init__(self, session: Session):
    self.__userRepository = UserRepository(session=session)

  def signup(self, user_details: UserInCreate) -> UserWithToken:
    if self.__userRepository.user_exist_by_email(email=user_details.email):
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user_details.model_dump()
    user_dict["password"] = HashHelper.get_password_hash(user_details.password)

    user = self.__userRepository.create_user(user_data=user_dict)

    token = AuthHandler.sign_jwt(user_id=user.id)

    return UserWithToken(
        token=token,
        user=UserOutput.model_validate(user)
    )

  def login(self, login_details: UserInLogin) -> UserWithToken:
    user = self.__userRepository.get_user_by_email(email=login_details.email)

    if not user or not HashHelper.verify_password(
        plain_password=login_details.password,
        hashed_password=user.password
    ):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = AuthHandler.sign_jwt(user_id=user.id)

    return UserWithToken(
        token=token,
        user=UserOutput.model_validate(user)
    )