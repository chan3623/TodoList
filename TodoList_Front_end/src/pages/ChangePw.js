import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import Modal from '../components/Modal';
import '../assets/styles/ChangePw.css';

const ChangePw = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const navigate = useNavigate();

    const user = useSelector(state => state.user);

    useEffect(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    }, []);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*_\-?])[A-Za-z\d!@#$%^&*_\-?]{10,}$/;

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        if (value && !passwordRegex.test(value)) {
            setNewPasswordError('영어 대소문자, 숫자, 특수기호(!@#$%^&*_-?) 포함 10자리 이상');
        } else {
            setNewPasswordError('');
        }

        if (confirmNewPassword && value !== confirmNewPassword) {
            setPasswordMatchError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordMatchError('');
        }
    };

    const handleConfirmNewPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmNewPassword(value);
        if (value && newPassword !== value) {
            setPasswordMatchError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordMatchError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newPassword !== confirmNewPassword) {
                throw new Error('새 비밀번호가 일치하지 않습니다.');
            }

            const response = await fetch('http://kkms4001.iptime.org:33042/user/pwChange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "user_email": user.user.user_email, "user_pw": currentPassword, "change_pw": newPassword }),

            });
            if (!response.ok) {
                throw new Error('비밀번호 변경 실패');
            }
            const data = await response.json();
            if (data.success) {
                setErrorMessage('변경된 비밀번호로 다시 로그인해주세요.');
                setIsPasswordChanged(true);
                setShowModal(true);
            } else {
                setErrorMessage('현재 비밀번호가 맞지 않습니다.');
                setShowModal(true); 
            }
        } catch (error) {
            console.error('비밀번호 변경 오류:', error.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        if (isPasswordChanged) {
            navigate('/login'); // 모달 닫을 때 로그인 페이지로 이동
        }
    };

    return (
        <main className="App-change-password App-main">
            <section className="change-password-section App-section">
                <h2 className="section-title">비밀번호 변경</h2>
                <form className="change-password-form" onSubmit={handleSubmit}>
                    <div className="change-password-box">
                        <input 
                            type="password" 
                            className="change-password-input"
                            placeholder="현재 비밀번호"
                            value={currentPassword} 
                            onChange={handleCurrentPasswordChange} required 
                        />
                    </div>
                    <div className="change-password-box">
                        <input 
                            type="password"
                            className="change-password-input"
                            placeholder="새 비밀번호"
                            value={newPassword} 
                            onChange={handleNewPasswordChange} 
                            required 
                        />
                        {newPasswordError && <p className="password-error-message">{newPasswordError}</p>}
                    </div>
                    <div className="change-password-box">
                        <input 
                            type="password" 
                            className="change-password-input"
                            placeholder="새 비밀번호 확인"
                            value={confirmNewPassword} 
                            onChange={handleConfirmNewPasswordChange} required 
                        />
                        {passwordMatchError && <p className="password-error-message">{passwordMatchError}</p>}
                    </div>
                    <button type="submit" className="change-btn">비밀번호 변경</button>
                </form>
            </section>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </main>
    );
};

export default ChangePw;
