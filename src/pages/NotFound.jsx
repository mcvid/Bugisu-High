import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div style={{
            height: 'calc(100vh - var(--header-height))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '8rem', fontWeight: 'bold', color: 'var(--color-orange)', lineHeight: 1 }}>404</h1>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-black)' }}>Page Not Found</h2>
            <p style={{ color: 'var(--color-grey-dark)', maxWidth: '500px', marginBottom: '2rem' }}>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/" className="btn btn-primary">
                    <Home size={18} style={{ marginRight: '0.5rem' }} /> Back to Home
                </Link>
                <button onClick={() => window.history.back()} className="btn btn-outline">
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
