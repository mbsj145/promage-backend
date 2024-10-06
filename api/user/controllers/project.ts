import { Request, Response } from 'express';
import { Task } from '../models/task';
import { Project } from '../models/project';
import {ResponsEnum} from '../../../config/resCodes';
import eventPublisher from '../../../utils/eventEmit';
import { sendResponse, errReturned } from '../../../config/dto';


// Get all projects with filter for running projects
export const getProjects = async (req: Request, res: Response): Promise<any> => {
    try {
        const now = new Date();
        const projects = await Project.find({ endDate: { $gte: now } });
        if(projects.length > 0)
            return sendResponse(res, ResponsEnum['SUCCESS'], 'List of all running projects!', projects);
        else 
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'No project in running stage!');
    } catch (error) {
        errReturned(res, error);
    }
};

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<any> => {
    try {
        let data = req["body"];
        let required = ["name", "description","startDate", "endDate", "projectManager"];
        for (let key of required)
            if (!data[key] || !data[key].trim())
                return errReturned(res, `Please provide ${key}`);           
        
        const newProject = new Project({ ...data, tasks: [] });
        const saveProject = await newProject.save();
        eventPublisher.emit('PROJECT_CREATED', data);
        return sendResponse(res, ResponsEnum['SUCCESS'], 'Create project successfully!', saveProject);

    } catch (error) {
        errReturned(res, error);
    }
};

// Get project details by id
export const getProjectById = async (req: Request, res: Response): Promise<any> => {
    try {
        const project = await Project.findById(req['params']['id']).populate('tasks');
        if(project)
            return sendResponse(res, ResponsEnum['SUCCESS'], 'Get project successfully!', project);
        else 
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project not found!');

    } catch (error) {
        errReturned(res, error);
    }
};

//  Edit project details (manager, startDate, endDate, description)
export const editProject = async (req: Request, res: Response): Promise<any> => {
    try {
        let {id} = req["params"];
        let {projectManager, startDate, endDate, description} = req["body"];
        
        const findProject = await Project.findById(id);

        if(!findProject)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project not found!');

        projectManager = !!projectManager.trim() ? projectManager : findProject['projectManager'];
        startDate = !!startDate.trim() ? startDate : findProject['startDate'];
        endDate = !!endDate.trim() ? endDate : findProject['endDate'];
        description = !!description.trim() ? description : findProject['description'];

        await Project.findByIdAndUpdate(id,{projectManager,startDate,endDate,description});
        eventPublisher.emit('PROJECT_UPDATED', {id,projectManager,startDate,endDate,description});
        return sendResponse(res, ResponsEnum['SUCCESS'], 'Update project details successfully!');

    } catch (error) {
        errReturned(res, error);
    }
};

// Delete project by id
export const deleteProject = async (req: Request, res: Response): Promise<any> => {
    try {
        let {id} = req["params"];
        
        const project = await Project.findById(id);
        if(!project)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project not found!');

        const deleteProject = await Project.deleteOne({_id:id});
        await Task.deleteMany({projectId:id});

        if(deleteProject){
            eventPublisher.emit('PROJECT_DELETED', project);
            return sendResponse(res, ResponsEnum['SUCCESS'], 'Delete project details successfully!', deleteProject);
        }
        return sendResponse(res, ResponsEnum['BADREQUEST'], 'Project not deleted!');

    } catch (error) {
        errReturned(res, error);
    }
};