from pydantic import ConfigDict, EmailStr, BaseModel, Field
from typing import Optional



# Creating users schemas for request and response
class UserInCreate(BaseModel):
  first_name: str
  last_name: str
  email: EmailStr # To restrict the email.
  password: str


# This is what we send back to the client after creating a user.
class UserOutput(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    phone: str | None = None
    school: str | None = None
    grade: str | None = None

    major: str | None = None
    gpa: str | None = None
    sat: str | None = None
    grad_year: str | None = None

    interests: str | None = None
    activities: str | None = None

    path: str | None = None

    model_config = ConfigDict(from_attributes=True) # This is to tell Pydantic to read data from the SQLAlchemy model attributes.


# What we expect from user when they want to update the properties of their account.

class UserInUpdate(BaseModel):
    first_name: Optional[str] = None # Adding None to avoid inconsistent
    last_name: Optional[str] = None
    email: Optional[str] = None

    phone: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[str] = None

    major: Optional[str] = None
    gpa: Optional[str] = None
    sat: Optional[str] = None
    grad_year: Optional[str] = None

    interests: Optional[str] = None
    activities: Optional[str] = None

    path: Optional[str] = None

    profile_image: Optional[str] = None

# If the user wants to login.
class UserInLogin(BaseModel):
  email: EmailStr
  password: str


# Token given to user with the output.
class UserWithToken(BaseModel):
  token: str
  user: UserOutput


# This is for Password Change
class PasswordChangeSchema(BaseModel):
    old_password: str
    new_password: str = Field(min_length=6)

class MessageResponse(BaseModel):
   message: str