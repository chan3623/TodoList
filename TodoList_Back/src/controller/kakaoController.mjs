import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config({ path: './config/.env' });

class KakaoController {
    // 생성자: 인스턴스 생성 시 id를 받아 설정하고 클라이언트 ID와 리다이렉트 URL을 설정합니다.
    constructor(id) {
        this.id = id;
    }
    // 로그인 메서드: 카카오 로그인 페이지로 리다이렉트합니다.
    login(req, res){
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.kakaoClientId}&redirect_uri=${process.env.kakaoRedirectUri}&response_type=code&prompt=login`;
        res.redirect(kakaoAuthUrl); // 카카오 인증 페이지로 리다이렉트
    }

    // 카카오 로그인 데이터를 가져오는 메서드: 액세스 토큰을 요청하고 사용자 정보를 가져옵니다.
    async kakaoLoginDataGet (req, res){
        const { code } = req.query; // 쿼리에서 인증 코드를 가져옴
        const tokenRequestUrl = 'https://kauth.kakao.com/oauth/token'; // 토큰 요청 URL
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id',process.env.kakaoClientId);
        params.append('redirect_uri', process.env.kakaoRedirectUri);
        params.append('code', code);

        try {
            // 액세스 토큰 요청
            const tokenResponse = await fetch(tokenRequestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            // 토큰 요청이 실패한 경우 에러를 발생시킴
            if (!tokenResponse.ok) {
                throw new Error('Error getting access token');
            }

            // 액세스 토큰 데이터 파싱
            const tokenData = await tokenResponse.json();
            const { access_token } = tokenData;

            // 액세스 토큰을 사용하여 사용자 정보 요청
            const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            // 사용자 정보 요청이 실패한 경우 에러를 발생시킴
            if (!userResponse.ok) {
                throw new Error('Error getting user info from Kakao');
            }

            // 사용자 데이터 파싱
            const userData = await userResponse.json();
            const kakaoId = userData.id; // 카카오 아이디 추출
            const kakaoAccountEmail = userData.kakao_account.email; //카카오 계정 ID 추출

            // 사용자 인증 성공 메시지 전송
            res.send('Successfully authenticated with Kakao! Kakao ID: ' + kakaoAccountEmail);
        } catch (error) {
            // 에러 발생 시 콘솔에 에러 메시지 출력하고 클라이언트에 에러 메시지 전송
            console.error(error.message, error);
            res.status(500).send(error.message);
        }
    }

    // 로그아웃 메서드: 세션을 삭제하고 홈페이지로 리다이렉트합니다.
    logout(req, res){
        req.session.destroy((err) => {
            if (err) {
                // 세션 삭제 중 에러 발생 시 에러 메시지 전송
                console.error('Error destroying session:', err);
                res.status(500).send('Error destroying session');
            } else {
                // 로그아웃 성공 시 홈페이지로 리다이렉트
                res.redirect('/');
            }
        });
    }
}

// KakaoController 인스턴스 생성 및 익스포트
const kakaoController = new KakaoController("kakaoController");
export default kakaoController;