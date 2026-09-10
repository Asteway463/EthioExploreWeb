import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getDestinations, getDestinationDetails } from "../controllers/destinationController.js";
import { getComments, postComment, editComment, removeComment } from "../controllers/commentController.js";
import { getPhotos, postPhoto, removePhoto } from "../controllers/photoController.js";

const router = express.Router();

router.get("/", getDestinations);
router.get("/:id", getDestinationDetails);
router.get("/:id/comments", getComments);
router.get("/:id/photos", getPhotos);

router.post("/:id/comments", authenticateToken, postComment);
router.put("/:id/comments/:commentId", authenticateToken, editComment);
router.delete("/:id/comments/:commentId", authenticateToken, removeComment);

router.post("/:id/photos", authenticateToken, postPhoto);
router.delete("/:id/photos/:photoId", authenticateToken, removePhoto);

export default router;
