import mongoose, { Schema } from 'mongoose';
import { IWebhook } from '../interfaces/models';

const webhookSchema = new Schema<IWebhook>({
    url: { type: String, required: true },
    event: { 
        type: String, enum: 
        ['PROJECT_CREATED','PROJECT_UPDATED','PROJECT_ENDED', 
        'PROJECT_DELETED','TASK_CREATED', 
        'TASK_UPDATED','TASK_DELETED'], 
        required: true 
    }, // e.g., 'PROJECT_CREATED'
    
  });
  
export const Webhook = mongoose.model<IWebhook>('Webhook', webhookSchema);