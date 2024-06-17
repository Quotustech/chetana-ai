import mongoose, { Document, Schema, Types } from "mongoose";

export interface IQuestion extends Document{
    _id:  Types.ObjectId;
    job: Schema.Types.ObjectId;
    question: string
}

const questionSchema : Schema<IQuestion> = new Schema(
    {
        job:{
            type: Schema.Types.ObjectId,
            ref: "JobRole",
        },
        question:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Question = mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
