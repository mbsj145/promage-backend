import { Request, Response } from 'express';
import { Webhook } from '../models/webhook';
import {ResponsEnum} from '../../../config/resCodes';
import { sendResponse, errReturned } from '../../../config/dto';

// Get webhooks
export const getWebhooks = async (req: Request, res: Response): Promise<any> => {
    try {
        const webhooks = await Webhook.find({});
        if(webhooks.length > 0)
            return sendResponse(res, ResponsEnum['SUCCESS'], 'List of webhooks!', webhooks);
        else 
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Webhooks no found!');
    } catch (error) {
        errReturned(res, error);
    }
};

// Create a new webhook
export const createWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        let { url, event } = req['body'];
        let required = ["url", "event"];
        for (let key of required)
            if (!req['body'][key] || !req['body'][key].trim())
                return errReturned(res, `Please provide ${key}`);
        const webhookFind = await Webhook.findOne({$and:[{url},{event}]});
        if(webhookFind)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Webhook already created!');

        const newTask = new Webhook({ url, event });
        await newTask.save();
        return sendResponse(res, ResponsEnum['SUCCESS'], `Webhook created successfully!`, newTask);

    } catch (error) {
        errReturned(res, error);
    }
};

// Edit a webhook
export const editWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        let {id} = req['params'];
        let {url, event } = req['body'];
        const webhook = await Webhook.findById(id);
        if(!webhook)
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Webhook no found!');

        url = !!url.trim() ? url : webhook['url'];
        event = !!event.trim() ? event : webhook['event'];
        
        await Webhook.findByIdAndUpdate(id,{ url, event });
        return sendResponse(res, ResponsEnum['SUCCESS'], `Webhook update successfully!`);

    } catch (error) {
        errReturned(res, error);
    }
};

// Delete Webhook
export const deleteWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req["params"];
        // Remove from webhook
        const removeWebhook = await Webhook.findByIdAndDelete(id);

        if(removeWebhook)
            return sendResponse(res, ResponsEnum['SUCCESS'], 'Webook deleted!');
        else 
            return sendResponse(res, ResponsEnum['BADREQUEST'], 'Webook not deleted!');

    } catch (error) {
        errReturned(res, error);
    }
};

// Test Webhhok
export const testEvent = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req["body"];
        console.log("Webhook Event Listin:",data);
        return sendResponse(res, ResponsEnum['SUCCESS'], 'Webhook Event Data', data);

    } catch (error) {
        errReturned(res, error);
    }
};