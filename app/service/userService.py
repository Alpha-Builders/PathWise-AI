from db.repository.userRepo import UserRepository
from db.schema.user import (
    UserInCreate,
    UserInLogin,
    UserOutput,
    UserWithToken,
    UserInUpdate,
    PasswordChangeSchema
)
from core.security.authHandler import AuthHandler
from core.security.hashHelper import HashHelper
from sqlalchemy.orm import Session
from fastapi import HTTPException




class UserService:
    def __init__(self, session: Session):
        self.__userRepository = UserRepository(session=session)

    # SIGNUP
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

    # ───────────────────────── LOGIN
    def login(self, login_details: UserInLogin) -> UserWithToken:
        user = self.__userRepository.get_user_by_email(email=login_details.email)

        if not user or not HashHelper.verify_password(
            login_details.password,
            user.password
        ):
            raise HTTPException(status_code=400, detail="Invalid email or password")

        token = AuthHandler.sign_jwt(user_id=user.id)

        return UserWithToken(
            token=token,
            user=UserOutput.model_validate(user)
        )

    # ───────────────────────── GET USER
    def get_user_by_id(self, user_id: int) -> UserOutput:
        user = self.__userRepository.get_user_by_id(user_id=user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserOutput.model_validate(user)

    # ───────────────────────── UPDATE USER (PATCH STYLE)
    def update_user(self, user_id: int, payload: UserInUpdate) -> UserOutput:
        data = payload.model_dump(exclude_unset=True)

        if not data:
            raise HTTPException(status_code=400, detail="No data provided for update")

        # If password ever comes through here, hash it
        if "password" in data:
            data["password"] = HashHelper.get_password_hash(data["password"])

        user = self.__userRepository.update_user(user_id=user_id, data=data)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserOutput.model_validate(user)

    #  CHANGE PASSWORD (FIXED)
    def change_password(self, user_id: int, payload: PasswordChangeSchema):
        user = self.__userRepository.get_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 1. verify old password
        if not HashHelper.verify_password(payload.old_password, user.password):
            raise HTTPException(status_code=400, detail="Incorrect old password")

        # 2. prevent reusing same password
        if HashHelper.verify_password(payload.new_password, user.password):
            raise HTTPException(
                status_code=400,
                detail="New password cannot be same as old password"
            )

        # 3. hash new password
        hashed_password = HashHelper.get_password_hash(payload.new_password)

        # 4. update user via repository
        updated_user = self.__userRepository.update_user(
            user_id=user_id,
            data={"password": hashed_password}
        )

        if not updated_user:
            raise HTTPException(status_code=500, detail="Password update failed")

        return {"message": "Password updated successfully"}