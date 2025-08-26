import express from 'express';
import userController from '../controller/userController.mjs'

// Router
class UserRouter {
    constructor(id, express) {
        this.id = id;
        this.router = express.Router();
    }
    setup() {
        // 이메일 중복 확인
        this.router.post('/checkedEmail', userController.emailCheck);
        // 이메일 인증번호 확인
        this.router.post('/certificationEmail', userController.sendMailCheck);
        // 휴대폰 중복 확인
        this.router.post('/checkedPhone', userController.phoneCheck);
        // 휴대폰 인증번호 확인
        this.router.post('/certificationPhone', userController.checkAuthenticationNumber);
        // 로그인
        this.router.post('/login', userController.login);
        //로그아웃
        this.router.delete('/logout', userController.logout);
        // 회원가입
        this.router.post('/join', userController.join);
        // 아이디 찾기
        this.router.post('/idFind', userController.idFind);
        // 비밀번호 찾기
        this.router.post('/pwFind', userController.pwFind);
        // 비밀번호 변경
        this.router.post('/pwChange', userController.pwChange);
        // 비밀번호 변경 시 현재 비밀번호가 맞는 지 확인
        return this.router;
    }
}
const userRouter = new UserRouter("userRouter", express);
export default userRouter;
