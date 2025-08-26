import React from 'react';
import Captcha from '../components/Captcha.js';

const IdForm = (props) => {
    const { handleSubmitId, userName, userPhone, handleUserNameChange, handleUserPhoneChange, setCaptchaValid } = props;
    return (
        <form onSubmit={handleSubmitId} className="util-form form-style">
            <input 
                type="text" 
                placeholder="이름" 
                className="util-input" 
                value={userName} 
                onChange={handleUserNameChange} 
            />
            <input 
                type="text" 
                placeholder="휴대전화 번호" 
                className="util-input" 
                value={userPhone} 
                onChange={handleUserPhoneChange}
            />
            <Captcha onCaptchaValid={setCaptchaValid} />
            <button type="submit" className="submit-btn">확인</button>
        </form>
    );
};

export default IdForm;
