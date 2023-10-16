import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { Server } from "socket.io";

const app = express()
app
    .use(bodyParser.json())
    .use(helmet())
    .use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
    .use(helmet.hidePoweredBy())
    .use(helmet.noSniff())
    .use(helmet.permittedCrossDomainPolicies())
    .use(compression())
    .use(cors())

const socketServer = new Server()

export {
    app, socketServer
}