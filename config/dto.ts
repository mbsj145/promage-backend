import { Response } from 'express';

// Function to send a standard JSON response
export const sendResponse = (res: Response, code: number, message: string, data?: any) : Response => {
  const response = {
    code,
    message,
    body: data || []
  };
  return res.status(code).json(response);
};

// Function to redirect to a file
export const sendEmailResponse = (res: Response, file: string) => {
  return res.redirect(file);
};

// Ensure errReturned also returns a Response
export const errReturned = (res: Response, error: any): Response => {
    return res.status(400).json({
        code: 400,
        message: error || error.message || 'An error occurred'
    });
};