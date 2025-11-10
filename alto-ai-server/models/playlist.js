import mongoose from "mongoose";

const { Schema } = mongoose;

// Playlist schema
const playlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  playlist: { type: [{type:Schema.Types.ObjectId, ref: "Song"}], default: [] },
  prompt: { type: String, required: true },
  title: { type: String, required: true, default: "Alto-AI" },
},{ timestamps: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);