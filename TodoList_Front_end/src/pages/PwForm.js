import React from 'react';
import Captcha from '../components/Captcha.js';

const PwForm = (props) => {
    const { handleSubmitPassword, userName, userEmail, handleUserNameChange, handleUserEmailChange, setCaptchaValid } = props;
    return (
        <form onSubmit={handleSubmitPassword} className="util-form form-style">
            <input 
                type="text" 
                placeholder="이름" 
                className="util-input" 
                value={userName} 
                onChange={handleUserNameChange} 
            />
            <input 
                type="text" 
                placeholder="이메일" 
                className="util-input" 
                value={userEmail} 
                onChange={handleUserEmailChange} 
            />
            <Captcha onCaptchaValid={setCaptchaValid} />
            <button type="submit" className="submit-btn">확인</button>
        </form>
    );
};

export default PwForm;
