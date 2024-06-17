import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
  user: mongoose.Schema.Types.ObjectId;
  question: string;
  answer: string;
  groupId: string;
}

const chatSchema: Schema<IChat> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
