import React from 'react';
// Parent Portal Authentication Utilities

const PARENT_AUTH_KEY = 'parentPortalAuth';
const SCHOOL_PASSWORD = 'BugisuLions2026'; // Change annually in August

export const parentAuth = {
    // Check if parent is authenticated
    isAuthenticated: () => {
        return sessionStorage.getItem(PARENT_AUTH_KEY) === 'true';
    },

    // Authenticate with password
    authenticate: (password) => {
        if (password && password.trim() === SCHOOL_PASSWORD) {
            sessionStorage.setItem(PARENT_AUTH_KEY, 'true');
            return true;
        }
        return false;
    },

    // Logout (clear session)
    logout: () => {
        sessionStorage.removeItem(PARENT_AUTH_KEY);
    },

    // Get current school year password (for admin reference)
    getCurrentPassword: () => {
        return SCHOOL_PASSWORD;
    }
};

// Protected Route Component
export const RequireParentAuth = ({ children }) => {
    const [isChecking, setIsChecking] = React.useState(true);

    React.useEffect(() => {
        if (!parentAuth.isAuthenticated()) {
            window.location.href = '/parents';
        } else {
            setIsChecking(false);
        }
    }, []);

    if (isChecking) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
                color: '#6b7280'
            }}>
                <p>Verifying access...</p>
            </div>
        );
    }

    return children;
};
