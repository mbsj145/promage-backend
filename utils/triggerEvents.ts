import axios from 'axios';
import { Webhook } from '../api/user/models/webhook';
import eventPublisher from './eventEmit';

const triggerWebhooks = async (event: string, eventData: any) => {
  try {

    const webhooks = await Webhook.find({ event });

    webhooks.forEach((webhook) => {
      axios.post(webhook.url, eventData)
        .then(() => {
          console.log(`Webhook triggered: ${webhook.url}`);
        })
        .catch((err) => {
          console.error(`Failed to trigger webhook: ${webhook.url}`, err.message);
        });
    });

  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
};

// Listening to project creation event
eventPublisher.on('PROJECT_CREATED', (eventData) => {
  triggerWebhooks('PROJECT_CREATED', eventData);
});

// Listening to project updated event
eventPublisher.on('PROJECT_UPDATED', (eventData) => {
  triggerWebhooks('PROJECT_UPDATED', eventData);
});

// Listening to project ended event
eventPublisher.on('PROJECT_ENDED', (eventData) => {
  triggerWebhooks('PROJECT_ENDED', eventData);
});

// Listening to project deletion event
eventPublisher.on('PROJECT_DELETED', (eventData) => {
  triggerWebhooks('PROJECT_DELETED', eventData);
});

// Listening to task created event
eventPublisher.on('TASK_CREATED', (eventData) => {
  triggerWebhooks('TASK_CREATED', eventData);
});

// Listening to task updated event
eventPublisher.on('TASK_UPDATED', (eventData) => {
  triggerWebhooks('TASK_UPDATED', eventData);
});

// Listening to task deletion event
eventPublisher.on('TASK_DELETED', (eventData) => {
  triggerWebhooks('TASK_DELETED', eventData);
});
