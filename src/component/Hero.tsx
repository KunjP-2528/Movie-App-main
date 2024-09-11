import React from 'react';
import SearchBar from './SearchBar';
import '../Style/Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="hero-background">
        {/* Background image */}
        <img src="https://plus.unsplash.com/premium_photo-1661544645334-30e5e0f71b3b?q=80&w=1903&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="background" />
      </div>
      <div className="hero-content">
        <SearchBar />
      </div>
    </div>
  );
};

export default Hero;
