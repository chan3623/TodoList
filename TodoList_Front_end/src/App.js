import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Nav from './components/Nav';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import LoginUtilPage from './pages/LoginUtilPage';
import ChangePw from './pages/ChangePw';
import CategoryPage from './pages/CategoryPage';

const App = () => {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/join', '/loginUtil/id', '/loginUtil/pw', '/changePw'];

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/loginUtil/:type" element={<LoginUtilPage />} />
        <Route path="/changePw" element={<ChangePw />} />
      </Routes>
      {!hideNavRoutes.includes(location.pathname) && <Nav />}
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
