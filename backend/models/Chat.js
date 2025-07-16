import mongoose from "mongoose";

function arrayLimit(val) {
  return val.length === 2;
}

const chatSchema = mongoose.Schema(
  {
    users: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: [arrayLimit, "Chat must have exactly two users"],
      required: true,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
