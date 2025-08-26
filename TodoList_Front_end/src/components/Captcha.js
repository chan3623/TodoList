import React, { useEffect, useState } from 'react';
import '../assets/styles/Captcha.css';

const Captcha = ({ onCaptchaValid }) => {
    const [captchaTest, setCaptchaTest] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    useEffect(() => {
        generateCaptcha();
    }, []);

    useEffect(() => {
        if (captchaInput === captchaTest) {
            onCaptchaValid(true);
        } else {
            onCaptchaValid(false);
        }
    }, [captchaInput, captchaTest, onCaptchaValid]);

    const generateCaptcha = () => {
        let canvas = document.getElementById('captcha');
        let myCanvas = canvas.getContext('2d');
        let captchaText = '';
        const captchaList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 6; i++) {
            captchaText += captchaList.charAt(Math.floor(Math.random() * captchaList.length));
        }
        setCaptchaTest(captchaText);

        myCanvas.font = '20px Arial';
        myCanvas.fillStyle = '#fff';
        myCanvas.clearRect(0, 0, canvas.width, canvas.height);

        // 텍스트의 너비 측정
        const textWidth = myCanvas.measureText(captchaText).width;
        const x = (canvas.width - textWidth) / 2;
        const y = (canvas.height / 2) + 10;

        myCanvas.fillText(captchaText, x, y);
    };

    return (
        <div className="captcha-box">
            <div className="captcha-canvas">
                <button className='reset-btn' id="reRefreshBtn" type="button" onClick={generateCaptcha}></button>
                <canvas id="captcha" className="captcha" width="150px" height="40px"></canvas>
            </div>
            <input
                className="captcha-input"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="캡차 입력"
            />
        </div>
    );
};

export default Captcha;
