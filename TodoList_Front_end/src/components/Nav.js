import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/userActions';
import '../styles/Nav.css';

const Nav = () => {
    const user = useSelector(state => state.user);
    const isLoggedIn = user && user.isLoggedIn;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
	    console.log("logout click!!!");
            const response = await fetch('http://15.164.226.28:4000/user/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ userId: user.id })
            });
	    console.log("response : ", response);
            if (!response.ok) {
                throw new Error('로그아웃에 실패했습니다.');
            }
            const data = await response.json();
            if(data.success) {
                // Redux에서 사용자 정보를 지움
                dispatch(logout());
                // 로그아웃 후 리다이렉션
                return navigate('/login');
            }
        } catch (error) {
            console.error('로그아웃 오류:', error.message);
        }
    };

    return (
        <div className="App-nav">
            <Link to="/" className="home-btn"></Link>
            <Link to="/calendar" className="calendar-btn"></Link>
            <Link to="/category" className="category-btn"></Link>
            {isLoggedIn ? (
                <button className="nav-logout-btn" onClick={handleLogout}></button>
            ) : (
                <Link to="/login" className="nav-login-btn"></Link>
            )}
        </div>
    );
}

export default Nav;
