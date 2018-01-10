import 'reflect-metadata';
import * as http from 'http';
import * as debug from 'debug';
import * as winston from 'winston';

import App from './App';

class Server {
    private static serverInstance: Server;
    private server: any;
    private port: number;

    public getServerInstance(): any {
        return this.server;
    }

    public static bootstrap(): Server {
        if (!this.serverInstance) {
            this.serverInstance = new Server();
            return this.serverInstance;
        } else {
            return this.serverInstance;
        }
    }

    private static debugMod(): void {
        debug('ts-express:server');
        winston.add(winston.transports.File, {filename: 'application.log'});
    }

    public constructor() {
        Server.debugMod();
        this.runServer();
    }

    private runServer(): void {
        // console.log(' Coming Here ');
        this.port = Server.normalizePort(process.env.PORT || 3500);
        App.set('port', this.port);
        this.createServer();
    }

    private createServer() {
        this.server = http.createServer(App);
        this.server.listen(this.port);

        this.server.on('listening', () => {
            let address = this.server.address();
            console.log('  Server is running on :: ', address);
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            debug(`Listening on ${bind}`);
        });

        this.server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') throw error;
            console.error(error);
            process.exit(1);
        });
    }

    /**
     * normalize port
     * @param {number | string} val
     * @returns {number}
     */
    private static normalizePort(val: number | string): number {
        // console.log('Value Getting :: ', val);
        return (typeof val === 'string') ? parseInt(val, 10) : val;
    }
}

export const server = Server.bootstrap();