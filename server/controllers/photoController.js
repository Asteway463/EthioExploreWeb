import { getPhotosByDestination, createPhoto, deletePhoto } from "../models/photoModel.js";

export async function getPhotos(req, res) {
  try {
    const { id } = req.params;
    const photos = await getPhotosByDestination(id);

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.error("Error in getPhotos:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load destination photos",
    });
  }
}

export async function postPhoto(req, res) {
  try {
    const { id } = req.params;
    const { imageUrl, caption = "" } = req.body;

    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Photo URL is required.",
      });
    }

    const photo = await createPhoto({
      destinationId: id,
      userId: req.user.id,
      userName: req.user.name || "Explorer",
      imageUrl: imageUrl.trim(),
      caption: caption?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    console.error("Error in postPhoto:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload photo",
    });
  }
}

export async function removePhoto(req, res) {
  try {
    const { id, photoId } = req.params;
    const photoLookupId = photoId || id;
    const isAdmin = req.user?.role === "admin";
    const deleted = await deletePhoto(photoLookupId, req.user.id, isAdmin);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Photo not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Error in removePhoto:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete photo",
    });
  }
}

export default {
  getPhotos,
  postPhoto,
  removePhoto,
};
