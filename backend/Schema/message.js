import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      enum: ['Audio', 'Text'],
    },
    seen: {
      type: Boolean,
      default: false,
      required: true,
    },
    seenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("messages", messageSchema);

export default Message;
