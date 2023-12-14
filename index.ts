import express, { Express } from 'express';
import { apiKeyMiddleware } from "./src/apiKeyMiddleware";

import helmet from 'helmet';
import cors =  require('cors');
import dotenv from 'dotenv';
import routes from "./src/routes";
import bodyParser = require('body-parser');

dotenv.config();

const app: Express = express();
let port: any = process.env.PORT;

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(apiKeyMiddleware);
app.use(routes);

app.use(function(req, res) {
  res.status(404).json("404 Not Found");
});

app.listen(port, () => {
  console.log(`⚡️[API]: API is running on ` + port);
}).on('error', () => {
  console.log(`⚡️[Error]: API cannot run ` + port)
});