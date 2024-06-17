import mongoose, { Document, Schema } from "mongoose";

interface IChatGroup extends Document {
  user: mongoose.Schema.Types.ObjectId;
}

const chatGroupSchema: Schema<IChatGroup> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const ChatGroup = mongoose.model<IChatGroup>("ChatGroup", chatGroupSchema);
export default ChatGroup;
