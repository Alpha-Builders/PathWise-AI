import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
import os
from dotenv import load_dotenv
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB = 5
MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024


async def upload_profile_image(file: UploadFile, user_id: int) -> str:
    """
    Upload a profile image to Cloudinary and return the secure URL.
    - Stored under the folder  'pathwise/profiles/'
    - Public ID is deterministic per user so re-uploading replaces the old image
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: JPEG, PNG, WEBP, GIF.",
        )

    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum allowed size is {MAX_SIZE_MB} MB.",
        )

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="pathwise/profiles", # This is the folder i have created for the profiles for pathwise.
            public_id=f"user_{user_id}",
            overwrite=True,             # replace previous avatar automatically
            resource_type="image",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")