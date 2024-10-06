import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import routes from './routes'; 
import {configEnvironment} from './config/environment';
import {getConnection} from './utils/connection';
import logger from './utils/logger';
import "./utils/triggerEvents";
import "./utils/cron";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const morganFormat = ":method :url :status :response-time ms";

app.use(morgan('combined'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(configEnvironment.assets);
app.use(limiter);
app.use(cors());

routes(app);

getConnection();

app.use(express.static('public')); // Serve static files from 'public' directory

// Handle all other GET requests to serve a view (if applicable)
app.get('*', (req, res) => res.sendFile(configEnvironment.view));


app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).json({ message: 'Internal Server Error' });
});

const server = createServer(app);

// Start the server
server.listen(configEnvironment.port, () => {
  logger.info(`Listening on port ${configEnvironment.port} in ${process.env.NODE_ENV} environment`);
  console.log(`Listening on port ${configEnvironment.port} in ${process.env.NODE_ENV} environment`);
});
