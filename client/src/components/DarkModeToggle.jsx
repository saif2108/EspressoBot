import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button className="dark-mode-toggle" onClick={toggleTheme}>
      <div className="toggle-slider">
        <span className="toggle-icon sun-icon">☀️</span>
        <span className="toggle-icon moon-icon">🌙</span>
      </div>
    </button>
  );
};

export default DarkModeToggle;