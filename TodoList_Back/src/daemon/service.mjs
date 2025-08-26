import dotenv from 'dotenv';
dotenv.config({ path: './src/config/.env' });
import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';

class Service {
    constructor(id) {
        this.id = id;
        this.express = express;
    }
    serviceOn() {
        const app = this.express();
        const MySQLSessionStore = MySQLStore(session);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());
        const options = {
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE
        };
        const sessionStore = new MySQLSessionStore(options);
        app.use(session({
            secret: process.env.COOKIE_SECRET || 'default_secret',
            resave: false,
            saveUninitialized: false,
            store: sessionStore
        }));
        return app;
    }
}
const service = new Service("service", express);
export default service.serviceOn();