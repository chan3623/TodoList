import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import IdForm from './IdForm';
import PwForm from './PwForm';
import Modal from '../components/Modal';
import '../assets/styles/LoginUtil.css';

const LoginUtilPage = () => {
    const [util, setUtil] = useState('id');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [redirectPath, setRedirectPath] = useState('/login');
    const [redirectState, setRedirectState] = useState({});
    const [captchaValid, setCaptchaValid] = useState(false);

    const navigate = useNavigate();
    const { type } = useParams();

    useEffect(() => {
        if (type === 'pw') {
            setUtil('pw');
        } else {
            setUtil('id');
        }
    }, [type]);

    useEffect(() => {
        setUserName('');
        setUserPhone('');
        setUserEmail('');
    }, [util]);

    const changeUtil = (newUtil) => {
        setUtil(newUtil);
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handleUserPhoneChange = (e) => {
        setUserPhone(e.target.value);
    };

    const handleUserEmailChange = (e) => {
        setUserEmail(e.target.value);
    };

    const handleSubmitId = async (e) => {
        e.preventDefault();
        if (!captchaValid) {
            setErrorMessage('캡차를 정확히 입력해주세요.');
            setShowModal(true);
            setRedirectPath('/loginUtil/id');
            return;
        }
        try {
            const response = await fetch('http://15.164.226.28:4000/user/idFind', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'user_name': userName, 'user_phone': userPhone }),
            });
            if (!response.ok) {
                throw new Error('일치하는 정보 없음.');
            }
            const data = await response.json();
            if (data.success) {
                setErrorMessage(`이메일: ${data.user_email}`);
                setRedirectPath('/login');
                setShowModal(true);
            } else {
                setErrorMessage('일치하는 회원 정보가 없습니다.');
                setUserName('');
                setUserPhone('');
                setRedirectPath('/loginUtil/id');
                setShowModal(true);
            }
        } catch (error) {
            console.error('아이디 찾기 오류:', error.message);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (!captchaValid) {
            setErrorMessage('캡차를 정확히 입력해주세요.');
            setShowModal(true);
            setRedirectPath('/loginUtil/pw');
            return;
        }
        try {
            const response = await fetch('http://15.164.226.28:4000/user/pwFind', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'user_name': userName, 'user_email': userEmail }),
            });
            if (!response.ok) {
                throw new Error('일치하는 정보 없음.');
            }
            const data = await response.json();
            if (data.success) {
                setErrorMessage('입력한 이메일로 임시 비밀번호를 전송하였습니다.');
                setRedirectPath('/login');
                setRedirectState({ from: '/loginUtil/pw' });
                setShowModal(true);
            } else {
                setErrorMessage('일치하는 회원정보가 없습니다.');
                setRedirectPath('/loginUtil/pw');
                setUserName('');
                setUserEmail('');
                setShowModal(true);
            }
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate(redirectPath, { state: redirectState });
    };

    return (
        <main className="App-util App-main">
            <section className="join_section App-section">
                <div className="title-container">
                    <Link
                        to="/loginUtil/id"
                        className={`section-title ${util === 'id' ? '' : 'none'}`}
                        onClick={() => changeUtil('id')}
                    >
                        아이디 찾기
                    </Link>
                    <Link
                        to="/loginUtil/pw"
                        className={`section-title ${util === 'pw' ? '' : 'none'}`}
                        onClick={() => changeUtil('pw')}
                    >
                        비밀번호 찾기
                    </Link>
                </div>
                {util === 'id' && (
                    <IdForm
                        handleSubmitId={handleSubmitId}
                        userName={userName}
                        userPhone={userPhone}
                        handleUserNameChange={handleUserNameChange}
                        handleUserPhoneChange={handleUserPhoneChange}
                        setCaptchaValid={setCaptchaValid} // 캡차 유효성 설정 콜백 전달
                    />
                )}
                {util === 'pw' && (
                    <PwForm
                        handleSubmitPassword={handleSubmitPassword}
                        userName={userName}
                        userEmail={userEmail}
                        handleUserNameChange={handleUserNameChange}
                        handleUserEmailChange={handleUserEmailChange}
                        setCaptchaValid={setCaptchaValid} // 캡차 유효성 설정 콜백 전달
                    />
                )}
            </section>
            {showModal && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </main>
    );
}

export default LoginUtilPage;
