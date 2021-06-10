import 'dotenv/config';
import express from 'express';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

const app = express();

const init = {
  middlewares() {
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
    app.use(express.json());
  },
  routes() {
    app.use(routes);
    app.use(Sentry.Handlers.errorHandler());
  },
  exceptionHandler() {
    // eslint-disable-next-line no-unused-vars
    app.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON(); // inform error to request

      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json(errors);
      }
      return res.status(500).json(`${res.sentry}\n`); // sentry error hash to request
    });
  },
};

Sentry.init(sentryConfig(Sentry, Tracing, app));
init.middlewares();
init.routes();
init.exceptionHandler();

export default app;
