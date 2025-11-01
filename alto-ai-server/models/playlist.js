import mongoose from "mongoose";

const { Schema } = mongoose;

// Playlist schema
const playlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  playlist: { type: [{type:Schema.Types.ObjectId, ref: "Song"}], default: [] }
});

export const Playlist = mongoose.model("Playlist", playlistSchema);