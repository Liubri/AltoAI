import mongoose from "mongoose";

const { Schema } = mongoose;

const songSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  uri: { type: String, required: true },
  id: { type: String, required: true },
  image: { type: String, default: null },
  duration: { type: Number, required: true },
  preview: { type: String, default: null }
});

export const Song = mongoose.model("Song", songSchema);