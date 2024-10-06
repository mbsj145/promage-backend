import { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    projectManager: string;
    isCompleted: Boolean;
    tasks: string[];
}

export interface ITask extends Document {
    title: string;
    description: string;
    status: string;
    projectId: Schema.Types.ObjectId;
}

export interface IWebhook extends Document {
    url: string;
    event: string;
}