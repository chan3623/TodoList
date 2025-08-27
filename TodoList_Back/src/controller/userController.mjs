import dotenv from 'dotenv';
dotenv.config({ path: './src/config/.env' });
import userModel from '../model/userModel.mjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import coolsms from 'coolsms-node-sdk';
import vo from '../valueObject/vo.mjs';
// controller
class UserController {
    constructor(id) {
        this.id = id;
        this.emailCheckValue = null;
        this.isEmail = false;
        this.phoneCheckValue = null;
        this.isPhone = false;
        // 메서드를 바인딩
        this.emailCheck = this.emailCheck.bind(this);
        this.sendMailCheck = this.sendMailCheck.bind(this);
        this.phoneCheck = this.phoneCheck.bind(this);
        this.checkAuthenticationNumber = this.checkAuthenticationNumber.bind(this);
        this.join = this.join.bind(this);
        this.pwFind = this.pwFind.bind(this);
    }
    // email 인증번호 발송 메소드
    emailSend(email, res) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.naver.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        this.emailCheckValue = crypto.randomBytes(3).toString('hex');
        const token = this.emailCheckValue;
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `이메일 확인을 위한 인증번호  : ${token}`
        };
        // 이메일 발송
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email 인증번호 전송 중 error:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            console.log("email 인증번호 전송 성공");
        });
    }
    // pw 메일로 전송
    pwSend(pw, email, res) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.naver.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: '[Cheli] verify password',
            text: `귀하의 비밀번호는 ${pw} 입니다. 로그인 후 신속히 비밀번호를 변경해주세요.`
        };

        // 이메일 발송
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('password 전송 중 error:', error); // 에러 로그 추가
                return res.status(500).json({ error: 'Failed to send email' });
            }
            console.log("password 전송 성공");
        });
    }
    // 이메일 중복확인 메소드
    emailCheck(req, res){
        const { user_email } = req.body;
        console.log("이메일 : ", user_email);
        userModel.emailCheckSearch(user_email, (err, result) => {
            if (err) {
                console.log("email check 중 ERROR 발생 : ", err);
                res.send(err);
            } else if (result.length === 0) {
                this.emailSend(user_email, res); // emailSend 메소드 호출
                res.send(true);
            } else if (result.length !== 0) {
                console.log("email 중복 발생 :", result[0]);
                res.send(false);
            }
        });
    }
    // 메일 인증번호 확인 메소드
    sendMailCheck(req, res) {
        const { certificationNumber } = req.body;
        console.log("유저가 보낸 인증번호 : ", req.body);
        console.log("내가 기억하는 인증번호 : ", this.emailCheckValue);
        if (certificationNumber === this.emailCheckValue) {
            res.send(true);
            console.log("이메일 인증 성공");
            this.isEmail = true;
        } else {
            res.send(false);
            console.log("이메일 인증 실패");
            this.isEmail = false;
        }
    }
    // 핸드폰 인증 서비스
    phoneCheck(req, res) {
        const { user_phone } = req.body;
        const mysms = coolsms.default;
        this.phoneCheckValue = Math.floor(100000 + Math.random() * 900000);
        const token = this.phoneCheckValue;
        const messageService = new mysms(process.env.PHONE_KEY, process.env.PHONE_SECRET);
        const result = messageService.sendOne({
            to: `${user_phone}`,
            from: process.env.PHONE_NUMBER,
            text: `안녕하세요 요청하신 인증번호는 [${token}]입니다.`
        });
        res.send(true);
    }
    // 핸드폰 인증번호 확인
    checkAuthenticationNumber(req, res) {
        const { certificationNumber } = req.body;
        console.log("유저가 보낸 휴대폰 인증번호 : ", req.body);
        console.log("내가 기억하는 휴대폰 인증번호 : ", this.phoneCheckValue);
        if (parseInt(certificationNumber) === parseInt(this.phoneCheckValue)) {
            res.send(true);
            console.log("휴대폰 인증 성공");
            this.isPhone = true;
        } else {
            res.send(false);
            console.log("휴대폰 인증 실패");
            this.isPhone = false;
        }
    }
    // 회원가입 요청
    join(req, res){
        const { user_email, user_pw, user_name, user_phone, user_birth } = req.body;
        if (this.isEmail) {
            userModel.joinEmailAndPhoneCheck(user_email, (err, result) => {
                if (err) {
                    console.log("이메일 중복 검사 도중 ERROR 발생 : ", err);
                    res.send(err);
                } else if (result.length !== 0) {
                    res.send({ "emailAndPhone": false });
                } else if (result.length === 0) {
                    userModel.userInfoSave({ user_email, user_pw, user_name, user_phone, user_birth },
                        (err, result) => {
                            if (err) {
                                console.log("회원정보 저장 도중 ERROR 발생 : ", err);
                                res.send(err);
                            } else {
                                res.send({ "join": true });
                            }
                        });
                }
            });
        } else {
            console.log("이메일 인증이 완료되지 않았습니다.");
            res.send({ "emailPhoneCertification": false });
        }
    }
    // 로그인 요청
    login(req, res) {
        const { user_email, user_pw } = req.body;
        console.log("ID, PW 값  : ", req.body);
        userModel.emailAndPwCheck({ user_email, user_pw }, (err, result) => {
            if (err) {
                console.log("email, pw check 중 ERROR 발생 : ", err);
            } else if (result.length === 0) {
                res.send({ "success": false });
                console.log("아이디 비밀번호 일치하지 않음");
            } else if (result.length !== 0) {
                if (!req.session.user) {
                    req.session.user = {};
                }
                req.session.user.email = result[0].user_email;
                req.session.user.name = result[0].user_name;
                vo.user_email = result[0].user_email;
                vo.user_name = result[0].user_name;
                console.log("vo확인 : ", vo.user_email, vo.user_name);
                req.session.save(() => {
                    console.log("세션에 저장한 값", req.session.user.email, req.session.user.name);
                    console.log("로그인 성공");
                    res.send({
                        "success": true, "user_email": req.session.user.email,
                        "user_name": req.session.user.name
                    });
                });
            }
        });
    }
    // 로그아웃
    logout(req, res) {
        if(vo.user_email === "guest"){
            userModel.guestDayListRemove((err, result) => {
                if(err){
                    console.log("게스트 정보 삭제 중 ERROR 발생 : ", err);
                    res.send(err);
                }else{
                    userModel.guestCategoryListRemove((error, deleteResult) => {
                        if(error){
                            console.log("게스트 카테고리 정보 삭제 중 ERROR 발생 : ", error);
                            res.send(error);
                        }else{
                            console.log("게스트 관련 정보 초기화 완료");
                            req.session.destroy((err) => {
                                if (err) {
                                    console.error('Session destruction error:', err);
                                } else {
                                    res.clearCookie('connect.sid'); // 세션 쿠키를 제거합니다.
                                    console.log("사용자 로그아웃");
                                    vo.user_email = "";
                                    vo.user_name = "";
                                    res.send({"success" : true});
                                }
                            });
                        }
                    });
                }
            });
        }else{
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                } else {
                    res.clearCookie('connect.sid'); // 세션 쿠키를 제거합니다.
                    console.log("사용자 로그아웃");
                    vo.user_email = "";
                    vo.user_name = "";
                    res.send({"success" : true});
                }
            });
        }
    }
    // 아이디 찾기 요청
    idFind(req, res) {
        const { user_name, user_phone } = req.body;
        console.log("ID찾기 정보 : ", req.body);
        userModel.userIdFind({ user_name, user_phone }, (err, result) => {
            if (err) {
                console.log("ID찾던 중 ERROR 발생 : ", err);
                res.send(err);
            } else if (result.length !== 0) {
                console.log(result[0].user_email);
                res.send({ "success": true, "user_email": result[0].user_email });
            } else if (result.length === 0) {
                console.log("정보와 일치하는 ID가 없습니다.");
                res.send({ "success": false });
            }
        });
    }
    // 비밀번호 찾기 요청
    pwFind(req, res){
        const { user_email, user_name } = req.body;
        userModel.userPwFind({ user_email, user_name }, (err, result) => {
            if (err) {
                console.log("비밀번호 조회 중 ERROR 발생 : ", err);
            } else if (result.length !== 0) {
                const changePw = crypto.randomBytes(6).toString('hex');
                userModel.userPwRandomChange({ user_email, user_name }, changePw, (err, result) => {
                    if (err) {
                        console.log("비밀번호 랜덤 변경 중 ERROR 발생 : ", err);
                        res.send(err);
                    } else {
                        this.pwSend(changePw, user_email, res);
                        res.send({ "success": true });
                    }
                });
            } else if (result.length === 0) {
                res.send({ "success": false });
            }
        });
    }
    // 비밀번호 변경
    pwChange(req, res) {
        const { user_email, user_pw, change_pw } = req.body;
        userModel.userPwCheck(user_email, user_pw, (err, result) => {
            if (err) {
                console.log("비밀번호 확인 도중 ERROR 발생 : ", err);
                res.send(err);
            } else if (result.length !== 0) {
                userModel.userPwChange(user_email, change_pw, (error, checkResult) => {
                    if (error) {
                        console.log("비밀번호 변경 도중 ERROR 발생 : ", error);
                        res.send(error);
                    } else {
                        res.send({ "success": true });
                    }
                });
            } else if (result.length === 0) {
                res.send({ "success": false });
            }
        });
    }
}
const userController = new UserController("userController");
export default userController;
