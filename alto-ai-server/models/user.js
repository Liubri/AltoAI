import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true },
  username: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
});

export const User = mongoose.model("User", userSchema);