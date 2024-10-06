import { Router } from 'express';

import * as project from './controllers/project';
import * as task from './controllers/task';
import * as webhook from './controllers/webhook';

const router = Router();

/**************************  Get List Of Projects   *************************/
router.get('/project', project.getProjects);

/**************************  Get Project By Id *************************/
router.get('/project/:id', project.getProjectById);

/**************************  Create Project *************************/
router.post('/project', project.createProject);

/**************************  Edit Project By Id *************************/
router.put('/project/:id', project.editProject);

/**************************  Delete Project By Id *************************/
router.delete('/project/:id', project.deleteProject);

/**************************  Create New Task *************************/
router.post('/project/:id/task', task.createtask);

/**************************  Edit Task *************************/
router.put('/task/:id', task.editTask);

/**************************  Get Task By Project Id *************************/
router.get('/task/:projectId', task.getTasks);

/**************************  Delete Task *************************/
router.delete('/project/:projectId/task/:taskId', task.deleteTask);

/**************************  Create New Webhook ************************/
router.post('/webhook', webhook.createWebhook);

/**************************  Edit Webhook *************************/
router.put('/webhook/:id', webhook.editWebhook);

/**************************  Get Webhooks *************************/
router.get('/webhook', webhook.getWebhooks);

/**************************  Delete Webhook *************************/
router.delete('/webhook/:id', webhook.deleteWebhook);

/**************************  Test Webhook *************************/
router.post('/testwebhook', webhook.testEvent);

module.exports = router;