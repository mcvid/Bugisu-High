import React from 'react';
import { Menu } from 'lucide-react';
import '../Navbar.css'; // Correct relative path from ui/ directory

const FloatingMenuButton = ({ onClick, visible }) => {
    return (
        <button
            className={`floating-menu-btn ${visible ? 'visible' : ''}`}
            onClick={onClick}
            aria-label="Open Menu"
        >
            <Menu size={24} />
            <span className="floating-menu-text">Menu</span>
        </button>
    );
};

export default FloatingMenuButton;
