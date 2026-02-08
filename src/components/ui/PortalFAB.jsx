import React, { useState } from 'react';
import { Plus, X, CreditCard, FileText, Download, Calendar, BookOpen } from 'lucide-react';
import './PortalFAB.css';

/**
 * PortalFAB provides contextual quick actions for Students and Parents.
 * @param {Object} props
 * @param {'student' | 'parent'} props.role - User role to determine actions.
 * @param {Function} props.onAction - Callback when an action is clicked.
 */
const PortalFAB = ({ role, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = role === 'parent' ? [
        { id: 'fees', label: 'Pay Fees', icon: CreditCard, color: '#f97316' },
        { id: 'report', label: 'View Report', icon: FileText, color: '#10b981' },
        { id: 'idcard', label: 'Download ID', icon: Download, color: '#3b82f6' }
    ] : [
        { id: 'timetable', label: 'Timetable', icon: Calendar, color: '#8b5cf6' },
        { id: 'materials', label: 'Study materials', icon: BookOpen, color: '#f59e0b' },
        { id: 'results', label: 'My Results', icon: FileText, color: '#ec4899' }
    ];

    const handleAction = (actionId) => {
        if (onAction) onAction(actionId);
        setIsOpen(false);
    };

    return (
        <div className={`portal-fab-container ${isOpen ? 'open' : ''}`}>
            <div className="fab-menu-backdrop" onClick={() => setIsOpen(false)} />

            <div className="fab-actions">
                {actions.map((action, index) => (
                    <div
                        key={action.id}
                        className="fab-action-item"
                        style={{ '--index': index }}
                    >
                        <span className="fab-action-label">{action.label}</span>
                        <button
                            className="fab-action-btn"
                            style={{ backgroundColor: action.color }}
                            onClick={() => handleAction(action.id)}
                            title={action.label}
                        >
                            <action.icon size={20} color="white" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                className={`fab-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Quick Actions"
            >
                {isOpen ? <X size={28} /> : <Plus size={28} />}
            </button>
        </div>
    );
};

export default PortalFAB;
