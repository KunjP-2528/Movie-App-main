
import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/Header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to='/'> <h1>PK<span style={{color:"red"}}>FLIX</span></h1></Link>
      </div>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Home</Link>
        <Link to="/watchlist" className="navbar__link">Watchlist</Link>
        <Link to="/favorites" className="navbar__link">Favorites</Link>
        <button onClick={handleThemeToggle} className="theme-toggle-button">
        {theme === 'light' ? '🌙' : '🌞'}
        </button>
      </div>
    </nav>
  );
};

export default Header;
