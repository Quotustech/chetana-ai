import mongoose, { Document, Schema, Types } from "mongoose";

export interface IJobRole extends Document {
    _id: Types.ObjectId;
    jobRole: string;
    jobName: string;
    description?: string;
}

const jobSchema: Schema<IJobRole> = new Schema(
    {
        jobRole: {
            type: String,
            required: true
        },
        jobName: {
            type: String,
            required: true
        },
        description:{
            type: String
        }
    },
    {
      timestamps: true
    }
)

const Job = mongoose.model<IJobRole>("JobRole", jobSchema);

export default Job;