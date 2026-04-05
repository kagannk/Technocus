from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
from app.services.cloudinary_service import upload_image
from app.api.deps import get_current_active_admin

router = APIRouter()

@router.post("/image", response_model=dict)
async def upload_single_image(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_active_admin)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
        
    try:
        url = await upload_image(file)
        return {"url": url}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.post("/images", response_model=List[str])
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    current_admin=Depends(get_current_active_admin)
):
    urls = []
    for f in files:
        if not f.content_type.startswith("image/"):
            continue
        try:
            url = await upload_image(f)
            urls.append(url)
        except Exception:
            pass
    return urls
