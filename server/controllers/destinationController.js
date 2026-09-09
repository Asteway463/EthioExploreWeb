import {
  getAllDestinations,
  getDestinationById,
  upsertDestination,
  deleteDestination,
} from "../models/destinationModel.js";
import { getRatingsByDestination } from "../models/ratingModel.js";
import { getCommentsByDestination } from "../models/commentModel.js";
import { getPhotosByDestination } from "../models/photoModel.js";

/**
 * Get all destinations with query, region, category, price filters
 */
export async function getDestinations(req, res) {
  try {
    const { query, region, category, maxPrice } = req.query;
    const destinations = await getAllDestinations({ query, region, category, maxPrice });
    return res.status(200).json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    console.error("Error in getDestinations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve destinations",
    });
  }
}

/**
 * Get single destination with aggregated ratings, comments, and community photos
 */
export async function getDestinationDetails(req, res) {
  try {
    const { id } = req.params;
    const destination = await getDestinationById(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const [ratings, comments, photos] = await Promise.all([
      getRatingsByDestination(destination.id),
      getCommentsByDestination(destination.id),
      getPhotosByDestination(destination.id),
    ]);

    return res.status(200).json({
      success: true,
      destination: {
        ...destination,
        rating: ratings.count > 0 ? ratings.average : destination.rating || 4.8,
        reviewsCount: ratings.count > 0 ? ratings.count : destination.reviewsCount || 10,
        comments,
        photos,
      },
    });
  } catch (error) {
    console.error("Error in getDestinationDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve destination details",
    });
  }
}

/**
 * Create or update destination (Admin)
 */
export async function saveDestination(req, res) {
  try {
    const data = req.body;
    if (!data.name || !data.region) {
      return res.status(400).json({
        success: false,
        message: "Destination name and region are required.",
      });
    }

    const saved = await upsertDestination(data);
    return res.status(200).json({
      success: true,
      message: "Destination saved successfully",
      destination: saved,
    });
  } catch (error) {
    console.error("Error in saveDestination:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save destination",
    });
  }
}

/**
 * Delete destination (Admin)
 */
export async function removeDestination(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteDestination(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Destination not found to delete",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Destination removed successfully",
    });
  } catch (error) {
    console.error("Error in removeDestination:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove destination",
    });
  }
}

export default {
  getDestinations,
  getDestinationDetails,
  saveDestination,
  removeDestination,
};
