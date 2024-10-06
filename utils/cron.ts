import cron from 'node-cron';
import {Project} from '../api/user/models/project';
import eventPublisher from './eventEmit';

const checkForExpiredProjects = async () => {
    const now = new Date();
    try {
      const expiredProjects = await Project.find({$and:[{ endDate: { $lte: now }},{isCompleted:false}]});
      expiredProjects.forEach(async(project) => {
        eventPublisher.emit('PROJECT_ENDED', project);
        await Project.findByIdAndUpdate(project._id,{isCompleted:true});
      });

    } catch (error) {
      console.error('Error checking for expired projects:', error);
    }
  };
  
  // Schedule cron job to run every minute
  cron.schedule('* * * * *', checkForExpiredProjects);