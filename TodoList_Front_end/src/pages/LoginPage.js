import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { loginSuccess } from '../redux/actions/userActions';
import Modal from '../components/Modal';
import '../assets/styles/Login.css';

const LoginPage = () => {
    const [userEmail, setUserEmail] = useState('guest');
    const [userPassword, setUserPassword] = useState('guest1234');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const location = useLocation();

    const dispatch = useDispatch();

    const handleUserEmailChange = (e) => {
        setUserEmail(e.target.value);
    };

    const handleUserPasswordChange = (e) => {
        setUserPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://15.164.226.28:4000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'user_email': userEmail, 'user_pw': userPassword }),
            });
            if (!response.ok) {
                throw new Error('로그인에 실패했습니다.');
            }
            const data = await response.json();
            if (data.success) {
                console.log("로그인 성공");
                dispatch(loginSuccess(data));
                if (location.state && location.state.from === '/loginUtil/pw') {
                    navigate('/changePw');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMessage('로그인에 실패했습니다. 다시 시도해 주세요.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('로그인 오류: ' + error.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setErrorMessage('');
    };

    return (
        <main className="App-login App-main">
            <section className="login-section App-section">
                <h2 className="section-title">로그인</h2>
                <form className="login-form form-style" action="post" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="EMAIL"
                        className="login-input"
                        value={userEmail}
                        onChange={handleUserEmailChange}
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        className="login-input"
                        value={userPassword}
                        onChange={handleUserPasswordChange}
                    />
                    <button type="submit" className="submit-btn">로그인</button>
                </form>
                <div className="login-util">
                    <Link to="/loginUtil/id" className="login-btn">아이디 찾기</Link>
                    <Link to="/loginUtil/pw" className="login-btn">비밀번호 찾기</Link>
                    <Link to="/join" className="login-btn">회원가입</Link>
                </div>
            </section>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </main>
    );
};

export default LoginPage;
