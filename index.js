const express = require('express');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('node:path');
const { clientRouter } = require('./routers/client');
const { homeRouter } = require('./routers/home');
const { Db } = require('./utlis/db');
const { handleError, NotFoundError } = require('./utlis/errors');

function createApp(db = new Db()) {
  const app = express();
  app.locals.db = db;
  app.use(methodOverride('_method'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public'), { index: false }));
  app.engine('.hbs', hbs.engine({ extname: '.hbs' }));
  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'views'));
  app.use('/', homeRouter);
  app.use('/client', clientRouter);
  app.use((req, res, next) => next(new NotFoundError()));
  app.use(handleError);
  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, '127.0.0.1', () => {
    console.log(`CRM: http://127.0.0.1:${port}`);
  });
}

module.exports = { createApp };
