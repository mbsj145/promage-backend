import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import routes from '../../../routes'; 
import { Task } from '../models/task';
import { Project } from '../models/project';
import { IProject } from '../interfaces/models';
import { ResponsEnum } from '../../../config/resCodes';
import { configEnvironment } from '../../../config/environment';


const app = express();
app.use(express.json());
routes(app);

beforeAll(async () => {
  // Connect to your test database
  await mongoose.connect(configEnvironment.mongo.db_url as string);

});

afterAll(async () => {
  // Close the connection after tests
  await mongoose.connection.close();
});


describe('Project Controller', () => {

    beforeEach(async ()=>{
      await Project.deleteMany({});
      await Task.deleteMany({});
    })

    afterEach(async () => {
       await Project.deleteMany({});
       await Task.deleteMany({});
    });

    describe('GET /project', () => {
        it('should return all running projects', async () => {
            const project = new Project({
                name: 'Test Project',
                description: 'Description',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                projectManager: 'Manager'
            });
            await project.save();
            const res = await request(app).get('/api/v1/project');
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('List of all running projects!');
        });

        it('should return a message when no projects are running', async () => {
            const res = await request(app).get('/api/v1/project');
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
            expect(res.body.message).toBe('No project in running stage!');
        });
    });

    describe('POST /project', () => {
        it('should create a new project', async () => {
            const projectData = {
                name: 'New Project',
                description: 'Project description',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                projectManager: 'Manager'
            };
            const res = await request(app).post('/api/v1/project').send(projectData);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('Create project successfully!');
            expect(res.body.body).toHaveProperty('_id');
        });

        it('should return error when required fields are missing', async () => {
            const res = await request(app).post('/api/v1/project').send({});
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
            expect(res.body.message).toMatch(/Please provide/);
        });
    });

    describe('GET /project/:id', () => {
        it('should return project details by id', async () => {
            const project = new Project({
                name: 'Test Project',
                description: 'Description',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                projectManager: 'Manager'
            });
            await project.save();

            const res = await request(app).get(`/api/v1/project/${project._id}`);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.body._id).toBe(project.id.toString());
        });

        it('should return error if project not found', async () => {
            const id = "invalidId";
            const res = await request(app).get(`/api/v1/project/${id}`);
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });

    describe('PUT /project/:id', () => {
        it('should edit project details', async () => {
            const project = new Project({
                name: 'Test Project',
                description: 'Description',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                projectManager: 'Manager'
            });
            await project.save();

            const updatedData = {
                projectManager: 'New Manager',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000 * 2),
                description: 'Updated description'
            };
            const res = await request(app).put(`/api/v1/project/${project._id}`).send(updatedData);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('Update project details successfully!');
        });

        it('should return error if project not found', async () => {
            const res = await request(app).put('/api/v1/project/invalidId').send({});
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });

    describe('DELETE /project/:id', () => {
        it('should delete a project by id', async () => {
            const project = new Project({
                name: 'Test Project',
                description: 'Description',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                projectManager: 'Manager'
            });
            await project.save();

            const res = await request(app).delete(`/api/v1/project/${project._id}`);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('Delete project details successfully!');
        });

        it('should return error if project not found for deletion', async () => {
            const res = await request(app).delete('/api/v1/project/invalidId');
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });
});

describe('Task Controller', () => {
    
    let projectId: string;
    let savedProject: IProject;

    beforeEach(async () => {
        await Project.deleteMany({});
        await Task.deleteMany({});

        const project = new Project({
            name: 'Test Project',
            description: 'Project Description',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000), // 1 day later
            projectManager: 'Manager'
        });
        savedProject = await project.save();
        projectId = savedProject.id;
    });

    afterEach(async () => {
        await Project.deleteMany({});
        await Task.deleteMany({});
    });

    describe('GET /task/:id', () => {
        it('should return all tasks for a project', async () => {

            const task = new Task({
                title: 'Test Task',
                description: 'Task Description',
                status: 'Pending',
                projectId
            });
            await task.save();

            const res = await request(app).get(`/api/v1/task/${projectId}`);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('List of project tasks!');
        });

        it('should return a message when no tasks are found', async () => {
            const res = await request(app).get(`/api/v1/task/${projectId}`);
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });

    describe('POST /project/:projectId/task', () => {
        it('should create a new task for a project', async () => {
            const taskData = {
                title: 'New Task',
                description: 'Task description',
                status: 'Pending'
            };

            const res = await request(app).post(`/api/v1/project/${projectId}/task`).send(taskData);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('Project task created successfully!');
            expect(res.body.body).toHaveProperty('_id');
        });

        it('should return error if project not found', async () => {
            const res = await request(app).post(`/api/v1/project/invalidId/task`).send({
                title: 'New Task',
                description: 'Task description',
                status: 'Pending'
            });
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });

    describe('PUT /task/:id', () => {
        let taskId: string;

        beforeEach(async () => {
            const task = new Task({
                title: 'Task to Edit',
                description: 'Edit description',
                status: 'Pending',
                projectId
            });
            const savedTask = await task.save();
            taskId = savedTask.id;
        });

        it('should edit an existing task', async () => {
            const updatedTaskData = {
                title: 'Updated Task',
                description: 'Updated description',
                status: 'Completed'
            };

            const res = await request(app).put(`/api/v1/task/${taskId}`).send(updatedTaskData);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('Task update successfully!');
        });

        it('should return error if task not found', async () => {
            const res = await request(app).put(`/api/v1/task/invalidId`).send({
                title: 'Updated Task',
                description: 'Updated description',
                status: 'Completed'
            });
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });

    describe('DELETE /project/:projectId/task/:taskId', () => {
        let taskId: string;

        beforeEach(async () => {
            const task = new Task({
                title: 'Task to Delete',
                description: 'Delete description',
                status: 'Pending',
                projectId
            });
            const savedTask = await task.save();
            taskId = savedTask.id;
            savedProject.tasks.push(taskId as string);
            await savedProject.save();
        });


        it('should delete a task', async () => {
            const res = await request(app).delete(`/api/v1/project/${projectId}/task/${taskId}`);
            expect(res.status).toBe(200);
            expect(res.body.code).toBe(ResponsEnum['SUCCESS']);
            expect(res.body.message).toBe('Task deleted!');
        });

        it('should return error if task not found', async () => {
            const res = await request(app).delete(`/api/v1/project/${projectId}/task/invalidId`);
            expect(res.status).toBe(400);
            expect(res.body.code).toBe(ResponsEnum['BADREQUEST']);
        });
    });
});