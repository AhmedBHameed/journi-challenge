import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import xss from 'src/services/xss-clean';
import initLogger from 'src/util/initLogger';
import logWelcome from 'src/util/logWelcome';
import helmet from 'helmet';
import logger from 'src/services/Logger';
import {PageNotFoundController} from 'src/controllers/PageNotFound';
import environment from 'src/config/environment';
import {connectRedis} from 'src/services/redisClient';
import {CountriesMetadataController} from 'src/controllers/CountriesMetadata';

const {port, allowDomains} = environment;

export default async (): Promise<void> => {
  initLogger();

  const app = express();

  await connectRedis();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowDomains.indexOf(origin) !== -1) {
          callback(null, true);
          return;
        }
        const error = new Error('Not allowed by CORS');
        logger.error(error);
        callback(error);
      },
      credentials: true,
    })
  );
  app.use(helmet({contentSecurityPolicy: false}));
  app.use(xss());
  app.set('view engine', 'handlebars');
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.post('/api/v1/closest-countries', CountriesMetadataController);

  app.use('*', PageNotFoundController);

  app.listen(port, logWelcome);
};
