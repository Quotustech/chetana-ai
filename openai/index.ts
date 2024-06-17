import fs from 'fs';
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoute from './src/routes/api';
import mongoose from "mongoose";
import https from "https";
import * as moduleAlias from 'module-alias';
import * as path from 'path';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import { info } from 'console';
import { title } from 'process';
import { version } from 'os';
import { ErrorMiddleware } from './src/middleware/error';
import ErrorHandler from './src/utils/ErrorHandler';

// Set up module alias
moduleAlias.addAlias('@deep', path.join(__dirname, 'deep'));

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

const swaggerOptions : swaggerJsdoc.options = {
     definition:{
      openapi: "3.0.0",
      info:{
        title:"Techmate",
        version:"1.0.0",
        description: "Techmate API Documentations. \n There will be a common API end point for Internal server error \n\n Use <span style='background-color:yellow' >/ap/v1/</span> before hitting any API call. \n\n\n Ex &nbsp; &nbsp; https://15.207.108.49:5000/api/v1/auth/register"
      },
      servers:[{
        url: "https://15.207.108.49:5000"
      }]
    },
    apis: ["./src/docs/api/v1/*.yaml"]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/docs/api/v1", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

const DB = process.env.DATABASE_URL as string;

mongoose
  .connect(DB)
  .then(() => {
    // seedData()
    console.log("Database connected");
  })
  .catch((error: any) => console.log("no connection", error));

app.use(bodyParser.json({ limit: '10mb' }));



app.use(cors());

app.use('/api', apiRoute);
// app.use("/docs/api/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res , next) => {
  console.log(`Received a request: ${req.method} ${req.url}`);
  const error = new ErrorHandler(`Cant find ${req.originalUrl} on the Server` , 404)
  next(error);
});

app.use(ErrorMiddleware);


const options = {
  key: fs.readFileSync('certificates/key.pem'),
  cert: fs.readFileSync('certificates/cert.pem')
}

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});
