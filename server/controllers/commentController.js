import {
  getCommentsByDestination,
  createComment,
  updateComment,
  deleteComment,
} from "../models/commentModel.js";

/**
 * Get comments for a destination
 */
export async function getComments(req, res) {
  try {
    const { id } = req.params;
    const comments = await getCommentsByDestination(id);
    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error in getComments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load comments",
    });
  }
}

/**
 * Add a comment (authenticated)
 */
export async function postComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text cannot be empty.",
      });
    }

    const comment = await createComment({
      destinationId: id,
      userId: req.user.id,
      userName: req.user.name || "Explorer",
      text,
    });

    return res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      comment,
    });
  } catch (error) {
    console.error("Error in postComment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post comment",
    });
  }
}

/**
 * Edit comment (owner or admin)
 */
export async function editComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text cannot be empty.",
      });
    }

    const isAdmin = req.user.role === "admin";
    const updated = await updateComment(id, req.user.id, text, isAdmin);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment updated",
      comment: updated,
    });
  } catch (error) {
    console.error("Error in editComment:", error);
    return res.status(error.message.includes("Unauthorized") ? 403 : 500).json({
      success: false,
      message: error.message || "Failed to update comment",
    });
  }
}

/**
 * Delete comment (owner or admin)
 */
export async function removeComment(req, res) {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";
    const deleted = await deleteComment(id, req.user.id, isAdmin);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error in removeComment:", error);
    return res.status(error.message.includes("Unauthorized") ? 403 : 500).json({
      success: false,
      message: error.message || "Failed to delete comment",
    });
  }
}

export default {
  getComments,
  postComment,
  editComment,
  removeComment,
};
