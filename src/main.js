import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';
import log from './log';
import routes from './controllers';
import config from './config';
import { errorHandle, db } from './utils';
import * as scheduler from './rss/scheduler';

db.init();

cloudinary.config(config.cloudinary);

// error handle
process.on('unhandledRejection', (err) => {
  throw err;
});

process.on('uncaughtException', (err) => {
  log.error('uncaughtException:', err);
});

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.0.159:3001',
    'https://polskifrontend-front.herokuapp.com',
    'http://www.polskifrontend.pl',
    'https://www.polskifrontend.pl',
    'http://polskifrontend.pl',
    'https://polskifrontend.pl'
  ],
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Access-Token'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.set('secret', config.secret);
process.env.JWT_SECRET = config.secret;

app.use('/', routes);

app.use(errorHandle);

scheduler.initRssParsingSchedule();

const port = process.env.PORT || config.port;
app.listen(port, () => {
  log.info(`App is listening on ${port}.`);
});

export default app;
