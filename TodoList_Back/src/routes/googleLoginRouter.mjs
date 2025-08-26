import express from 'express';
import googleController from '../controller/googleController.mjs'

class GoogleRouter{
    constructor(id, express){
        this.id = id;
        this.router = express.Router();
        // this.userController = userController;
    }
    setup(){
        this.router.get('/login/google', googleController.login);
        this.router.get('/auth/google/', googleController.callback);
        this.router.get('/logout', googleController.logout);
        return this.router;
    }
}
const googleRouter = new GoogleRouter("googleRouter", express);
export default googleRouter;