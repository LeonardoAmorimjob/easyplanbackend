import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import path from 'path';
import cors from 'cors';
import sentryConfig from './Config/sentry';
import Rotas from './Rotas';

import './Bd';

class App {
  constructor() {
    this.servidor = express();
    Sentry.init(sentryConfig);

    this.middlewares();
    this.rotas();
    this.retornoExcessao();
  }

  middlewares() {
    this.servidor.use(Sentry.Handlers.requestHandler());
    this.servidor.use(cors());
    this.servidor.use(express.json());
    this.servidor.use(
      '/arquivos',
      express.static(path.resolve(__dirname, '..', 'temp', 'carregamento'))
    );
  }

  rotas() {
    this.servidor.use(Rotas);
    this.servidor.use(Sentry.Handlers.errorHandler());
  }

  retornoExcessao() {
    this.servidor.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const erros = await new Youch(err, req).toJSON();
        return res.status(500).json(erros);
      }

      return res.status(500).json({ erros: 'erro interno do servidor' });
    });
  }
}

export default new App().servidor;
