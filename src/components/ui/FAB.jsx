import React, { useState } from 'react';
import { Plus, Send, Phone, MessageCircle, X, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { triggerHaptic } from '../../lib/mobileUtils';
import './FAB.css';

const FAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation(['common']);

    const toggleMenu = () => {
        triggerHaptic(15);
        setIsOpen(!isOpen);
    };

    const openChat = (e) => {
        e.preventDefault();
        triggerHaptic(20);
        window.dispatchEvent(new CustomEvent('open-live-chat'));
        setIsOpen(false);
    };

    return (
        <div className={`fab-container ${isOpen ? 'open' : ''}`}>
            <div className="fab-options">
                <a href="tel:+256000000000" className="fab-option" title="Call Us">
                    <span className="fab-label">Call</span>
                    <Phone size={20} />
                </a>
                <a href="https://wa.me/256000000000" target="_blank" rel="noopener noreferrer" className="fab-option" title="WhatsApp">
                    <span className="fab-label">WhatsApp</span>
                    <MessageCircle size={20} />
                </a>
                <a href="mailto:info@bugisuhighschool.ac.ug" className="fab-option" title="Email Us">
                    <span className="fab-label">Email</span>
                    <Send size={20} />
                </a>
                <button onClick={openChat} className="fab-option" title="Live Chat">
                    <span className="fab-label">Live Chat</span>
                    <MessageSquare size={20} />
                </button>
            </div>
            <button
                className={`fab-main ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Contact options"
            >
                {isOpen ? <X size={28} /> : <Plus size={28} />}
            </button>
        </div>
    );
};

export default FAB;
