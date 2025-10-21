import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  likedBy: [{ type: String }] // store userIds
});

const Like = mongoose.model("Like", LikeSchema);
export default Like;
