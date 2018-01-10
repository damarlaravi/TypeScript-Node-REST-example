import * as dotenv from 'dotenv';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

import { useExpressServer } from 'routing-controllers';
import {default as routers} from './routers';
import { PassportConfig } from './config/passport';
import {SampleController} from "./controllers/SampleController";
import * as path from "path";

class App {

    public express: express.Application;

    constructor() {
        this.setEnvironment();
        this.express = express();
        this.database();
        this.middleware();
        this.routes();
        this.setupControllers();
    }

    /**
     * database connection
     */
    private database(): void {
        mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, {
            useMongoClient: true,
            connectTimeoutMS: 1000
        });
        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.  ');
            process.exit();
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully url is ::  ', `${process.env.MONGODB_URI}`);
            process.exit();
        });
    }

    /**
     * http(s) request middleware
     */
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // dev only
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if(req.method === 'OPTIONS'){
                res.status(200).send();
            } else {
                next();
            }
        });
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        const pConfig = new PassportConfig(passport);
        pConfig.init();
    }

    /**
     * app environment configuration
     */
    private setEnvironment(): void {
        dotenv.config({path: path.resolve(__dirname, './../.env.example')});
        // console.log(' Port is ::  ', process.env.PORT);
    }

    /**
     * set controllers
     */
    private setupControllers() : void {
        useExpressServer(this.express, {
            controllers: [SampleController]
        });
    }

    /**
     * API main v1 routes
     */
    private routes(): void {
        this.express.use('/v1', routers);
        this.express.use('/', (req, res) => {
            res.status(404).send({ error: `path doesn't exist`});
        });
    }
}

export default new App().express;
