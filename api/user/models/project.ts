import mongoose, { Schema } from 'mongoose';
import { IProject } from '../interfaces/models';

const projectSchema = new Schema<IProject>({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    projectManager: { type: String, required: true, trim: true  },
    isCompleted: { type: Boolean, default:false},
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

export const Project = mongoose.model<IProject>('Project', projectSchema);