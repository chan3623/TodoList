// import googleModel from '../model/googleModel.mjs';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

class GoogleController {
    constructor(id) {
        this.id = id;
        // Passport Google OAuth Strategy 설정
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }));
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
    }

    // Google OAuth 로그인 요청 처리
    login(req, res, next) {
        passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'consent' })(req, res, next);
    }

    // Google OAuth 콜백 처리
    callback(req, res) {
        passport.authenticate('google', { failureRedirect: '/' })(req, res, () => {
            if (req.isAuthenticated() && req.user && req.user.id) {
                console.log(req.user.id); // 유저의 고유 아이디
                console.log(req.user.emails[0].value); //구글 계정 이메일
            } else {
                console.log("User not logged in.");
            }
            res.redirect('/');
        });
    }

    // 로그아웃 처리
    logout(req, res, next) {
        req.logout(err => {
            if (err) { return next(err); }
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        });
    }

}

const googleController = new GoogleController("googleController");
export default googleController;
