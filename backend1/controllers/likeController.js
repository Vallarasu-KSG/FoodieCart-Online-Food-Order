import Like from "../models/Like.js";

// Toggle like/unlike
export const toggleLike = async (req, res) => {
  const { itemId, itemName } = req.body;
  const userId = req.userId; // authMiddleware sets this

  if (!itemId || !userId) {
    return res.status(400).json({ message: "Missing itemId or userId" });
  }

  try {
    let likeDoc = await Like.findOne({ itemId });

    if (!likeDoc) {
      likeDoc = new Like({ itemId, itemName, likedBy: [userId] });
      await likeDoc.save();
      return res.json({ totalLikes: 1, liked: true });
    }

    if (likeDoc.likedBy.includes(userId)) {
      // Remove like
      likeDoc.likedBy = likeDoc.likedBy.filter(id => id !== userId);
      await likeDoc.save();
      return res.json({ totalLikes: likeDoc.likedBy.length, liked: false });
    } else {
      // Add like
      likeDoc.likedBy.push(userId);
      await likeDoc.save();
      return res.json({ totalLikes: likeDoc.likedBy.length, liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get total likes for an item
export const getLikes = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.userId; // authMiddleware

  if (!itemId) return res.status(400).json({ message: "Missing itemId" });

  try {
    const likeDoc = await Like.findOne({ itemId });

    const totalLikes = likeDoc ? likeDoc.likedBy.length : 0;
    const liked = likeDoc ? likeDoc.likedBy.includes(userId) : false;
    const likedUsers = likeDoc ? likeDoc.likedBy : []; // Return all users

    res.json({ totalLikes, liked, likedUsers });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Server error" });
  }
};