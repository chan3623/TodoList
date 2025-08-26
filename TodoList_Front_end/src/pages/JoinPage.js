import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Modal from '../components/Modal';
import '../assets/styles/Join.css';

const JoinPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [emailCertification, setEmailCertification] = useState('');
    const [isEmailCertificationValid, setIsEmailCertificationValid] = useState(false);
    const [userPassword, setUserPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [phoneCertification, setPhoneCertification] = useState('');
    const [isPhoneCertificationValid, setIsPhoneCertificationValid] = useState(false);
    const [userBirth, setUserBirth] = useState('');
    const [birthDateError, setBirthDateError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*_\-?])[A-Za-z\d!@#$%^&*_\-?]{10,}$/;
    const phoneRegex = /^010[0-9]{4}[0-9]{4}$/;
    const birthDateRegex = /^\d{4}\d{2}\d{2}$/;

    const handleUserEmailChange = (e) => {
        setUserEmail(e.target.value);
        if (!emailRegex.test(e.target.value)) {
            setEmailError('유효한 이메일 주소를 입력해주세요.');
            setIsEmailValid(false);
        } else {
            setEmailError('');
            setIsEmailValid(true);
        }
    };

    const handleEmailCertificationChange = (e) => {
        setEmailCertification(e.target.value);
    };

    const handleUserPasswordChange = (e) => {
        const value = e.target.value;
        setUserPassword(value);
        if (value && !passwordRegex.test(value)) {
            setPasswordError('영어 대소문자, 숫자, 특수기호(!@#$%^&*_-?) 포함 10자리 이상');
        } else {
            setPasswordError('');
        }

        if (confirmPassword && value !== confirmPassword) {
            setPasswordMatchError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordMatchError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value && userPassword !== value) {
            setPasswordMatchError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordMatchError('');
        }
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    }

    const handleUserPhoneChange = (e) => {
        const value = e.target.value;
        setUserPhone(value);

        if (!/^[0-9]*$/.test(value)) {
            setPhoneError('휴대전화 번호는 숫자로만 입력하세요.');
            setIsPhoneValid(false);
        }

        else if (!phoneRegex.test(value)) {
            setPhoneError('휴대전화 번호는 01012345678 형식이어야 합니다.');
            setIsPhoneValid(false);
        } else {
            setPhoneError('');
            setIsPhoneValid(true);
        }
    };

    const handlePhoneCertificationChange = (e) => {
        setPhoneCertification(e.target.value);
    }

    const handleUserBirthChange = (e) => {
        setUserBirth(e.target.value);
        if (!birthDateRegex.test(e.target.value)) {
            setBirthDateError('생년월일은 YYYYMMDD 형식이어야 합니다.');
        } else {
            setBirthDateError('');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailCertification || !phoneCertification || !userEmail || !userPassword || !userName || !userPhone || !userBirth) {
            alert('모든 정보를 입력하고 인증해주세요.');
            return;
        }
        try {
            const response = await fetch('http://kkms4001.iptime.org:33042/user/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'user_email': userEmail, 'user_pw': userPassword, 'user_name': userName, 'user_phone': userPhone, 'user_birth': userBirth }),
            });
            if (!response.ok) {
                throw new Error('회원가입에 실패했습니다.');
            }
            const data = await response.json();
            if (data) {
                setErrorMessage('회원가입이 완료되었습니다.');
                setShowModal(true);
                await navigate('/login', { state: { from: '/join' } })
            } else {
                console.log("회원가입 실패");
            }
        } catch (error) {
            console.error('회원가입 오류 :', error.message);
        }
    };

    const handleCheckedEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/user/checkedEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'user_email': userEmail }),
            });
            if (!response.ok) {
                throw new Error('인증에 실패했습니다.');
            }
            const data = await response.json();
            if (data) {
                setErrorMessage('입력하신 이메일로 인증 번호 메일이 발송되었습니다.');
                setShowModal(true);
                setIsEmailCertificationValid(true);
                setEmailError('');
            } else {
                setIsEmailCertificationValid(false);
                setEmailError('중복된 이메일입니다.');
            }
        } catch (error) {
            console.error('중복 검사 오류 : ', error.message);
            setIsEmailCertificationValid(false);
        }
    };

    const handleCheckedEmailCertificationNumber = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/user/certificationEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'certificationNumber': emailCertification }),
            });
            if (!response.ok) {
                throw new Error('인증에 실패했습니다.');
            }
            const data = await response.json();
            if (data) {
                setErrorMessage('인증이 완료되었습니다.');
                setShowModal(true);
            } else {
                setErrorMessage('인증에 실패하였습니다.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('인증 오류 : ', error.message);
        }
    };

    const handleCheckedPhone = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/user/checkedPhone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'user_phone': userPhone }),
            });
            if (!response.ok) {
                throw new Error('인증에 실패했습니다.');
            }
            const data = await response.json();
            if (data) {
                setErrorMessage('입력한 휴대전화 번호로 인증 번호 문자가 발송되었습니다.');
                setShowModal(true);
                setIsPhoneCertificationValid(true);
                setPhoneError('사용가능한 휴대전화 번호입니다.');
            }
        } catch (error) {
            console.error('중복 검사 오류 : ', error.message);
            setIsPhoneCertificationValid(false);
        }
    };

    const handleCheckedPhoneCertificationNumber = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://kkms4001.iptime.org:33042/user/certificationPhone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'certificationNumber': phoneCertification }),
            });
            if (!response.ok) {
                throw new Error('인증에 실패했습니다.');
            }
            const data = await response.json();
            if (data) {
                setErrorMessage('인증이 완료되었습니다.');
                setShowModal(true);
            } else {
                setErrorMessage('인증에 실패하였습니다.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('인증 오류 : ', error.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <main className="App-join App-main">
            <section className="join-section App-section">
                <h2 className="section-title">회원가입</h2>
                <form className="join-form form-style" action="post" onSubmit={handleSubmit}>
                    <div className="join-list">
                        <div className="join-icon email-icon"></div>
                        <div className="join-input-container">
                            <input 
                                type="text" 
                                name="email" 
                                placeholder="이메일" 
                                className="join-input" 
                                value={userEmail} 
                                onChange={handleUserEmailChange}
                            ></input>
                            <button 
                                type="button" 
                                className="input-btn" 
                                onClick={handleCheckedEmail}
                                disabled={!isEmailValid}
                            >인증</button>
                        </div>
                    </div>
                    {emailError && <p className="error-message">{emailError}</p>}
                    <div className="join-list">
                        <div className="join-icon security-icon"></div>
                        <div className="join-input-container">
                            <input 
                                type="text" 
                                name="emailCertification" 
                                placeholder="이메일 인증번호" 
                                className="join-input" 
                                value={emailCertification} 
                                onChange={handleEmailCertificationChange}
                            ></input>
                            <button 
                                type="button" 
                                className="input-btn" 
                                onClick={handleCheckedEmailCertificationNumber} 
                                disabled={!isEmailCertificationValid}
                            >확인</button>
                        </div>
                    </div>
                    <div className="join-list">
                        <div className="join-icon password-icon"></div>
                        <div className="join-input-container">
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                className="join-input"
                                value={userPassword}
                                onChange={handleUserPasswordChange}
                            />
                        </div>
                    </div>
                    <p className="password-error" style={{ color: passwordError ? '#ff2e00' : '#a9a9a9' }}>
                        {passwordError || '영어 대소문자, 숫자, 특수기호(!@#$%^&*_-?) 포함 10자리 이상'}
                    </p>
                    <div className="join-list">
                        <div className="join-icon password-check-icon"></div>
                        <div className="join-input-container">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                className="join-input password-input"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                        </div>
                    </div>
                    {passwordMatchError && <p className="password-error" style={{ color: 'red' }}>{passwordMatchError}</p>}
                    <div className="join-list">
                        <div className="join-icon profile-icon"></div>
                        <div className="join-input-container">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="이름" 
                                className="join-input" 
                                value={userName} 
                                onChange={handleUserNameChange}
                            ></input>
                        </div>
                    </div>
                    <div className="join-list">
                        <div className="join-icon phone-icon"></div>
                        <div className="join-input-container">
                            <input 
                                type="text" 
                                name="phone" 
                                placeholder="휴대전화 번호 ('-'제외)" 
                                className="join-input" 
                                value={userPhone} 
                                onChange={handleUserPhoneChange}
                            ></input>
                            <button 
                                type="button" 
                                className="input-btn" 
                                onClick={handleCheckedPhone}
                                disabled={!isPhoneValid}
                            >인증</button>
                        </div>
                    </div>
                    {phoneError && <p className="error-message">{phoneError}</p>}
                    <div className="join-list">
                        <div className="join-icon security-icon"></div>
                        <div className="join-input-container">
                            <input 
                                type="text" 
                                name="phoneCertification" 
                                placeholder="휴대전화 인증번호" 
                                className="join-input" 
                                value={phoneCertification} 
                                onChange={handlePhoneCertificationChange}
                            ></input>
                            <button 
                                type="button" 
                                className="input-btn" 
                                onClick={handleCheckedPhoneCertificationNumber} 
                                disabled={!isPhoneCertificationValid}
                            >확인</button>
                        </div>
                    </div>
                    <div className="join-list">
                        <div className="join-icon birth-icon"></div>
                        <div className="join-input-container">
                            <input 
                                type="text" 
                                name="birth" 
                                placeholder="생년월일(ex: YYYYMMDD)" 
                                className="join-input" 
                                value={userBirth} 
                                onChange={handleUserBirthChange}
                            ></input>
                        </div>
                    </div>
                    {birthDateError && <p className="error-message">{birthDateError}</p>}
                    <button type="submit" className="submit-btn">회원가입</button>
                </form>
            </section>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </main>
    )
}

export default JoinPage;