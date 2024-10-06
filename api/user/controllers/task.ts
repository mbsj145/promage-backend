import { Request, Response } from 'express';
import { Task } from '../models/task';
import { Project } from '../models/project';
import {ResponsEnum} from '../../../config/resCodes';
import eventPublisher from '../../../utils/eventEmit';
import { sendResponse, errReturned } from '../../../config/dto';

// Get tasks of a project
export const getTasks = async (req: Request, res: Response): Promise<any> => {
    try {
        const tasks = await Task.find({ projectId: req['params']['projectId'] });
        if(tasks.length > 0)
            return sendResponse(res, ResponsEnum['SUCCESS'], 'List of project tasks!', tasks);
        else 
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project tasks no found!');
    } catch (error) {
        errReturned(res, error);
    }
};

// Create a new task for a project
export const createtask = async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req['params'];
        const { title, description, status } = req['body'];
        const project = await Project.findById(id);
        if(!project)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project no found!');

        const newTask = new Task({ title, description, status, projectId: project._id });
        await newTask.save();
        project.tasks.push(newTask._id as string);
        await project.save();
        eventPublisher.emit('TASK_CREATED', { title, description, status, projectId: project._id });
        return sendResponse(res, ResponsEnum['SUCCESS'], `Project task created successfully!`, newTask);

    } catch (error) {
        errReturned(res, error);
    }
};

// Edit a task
export const editTask = async (req: Request, res: Response): Promise<any> => {
    try {
        let {id} = req['params'];
        let { title, description, status } = req['body'];
        const task = await Task.findById(id);
        if(!task)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Task no found!');

        title = !!title.trim() ? title : task['title'];
        description = !!description.trim() ? description : task['description'];
        status = !!status.trim() ? status : task['status'];
        
        await Task.findByIdAndUpdate(id,{ title, description, status });
        eventPublisher.emit('TASK_UPDATED', { id, title, description, status });
        return sendResponse(res, ResponsEnum['SUCCESS'], `Task update successfully!`);

    } catch (error) {
        errReturned(res, error);
    }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const { projectId, taskId } = req["params"];
        
        // Find the project and remove the task by its taskId
        const project = await Project.findById(projectId);
        if(!project)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project no found!');

        // Find the task index
        const taskIndex = project.tasks.findIndex(task => task.toString() === taskId);
        if (taskIndex === -1)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Task not found!');

        // Remove the task from the tasks array
        project.tasks.splice(taskIndex, 1);

        // Save the updated project
        await project.save();

        // Remove from task
        const removeTask = await Task.findByIdAndDelete(taskId);

        if(removeTask){
            eventPublisher.emit('TASK_DELETED', removeTask);
            return sendResponse(res, ResponsEnum['SUCCESS'], 'Task deleted!');
        }
        return sendResponse(res, ResponsEnum['BADREQUEST'], 'Task not deleted!');

    } catch (error) {
        errReturned(res, error);
    }
};