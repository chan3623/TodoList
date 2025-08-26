import express from 'express';
import kakaoController from '../controller/kakaoController.mjs';

class KakaoRouter{
    constructor(id, express){
        this.id = id;
        this.router = express.Router();
        // this.userController = userController;
    }
    setup(){
        this.router.get('/login/kakao', kakaoController.login);
        this.router.get('/auth/kakao', kakaoController.kakaoLoginDataGet); 
        return this.router;
    }
}
const kakaoRouter = new KakaoRouter("kakaoRouter", express);
export default kakaoRouter;