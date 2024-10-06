import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/models';

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
});

export const Task = mongoose.model<ITask>('Task', taskSchema);