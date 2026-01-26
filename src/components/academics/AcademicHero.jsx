import React from 'react';
import { useTranslation } from 'react-i18next';

const AcademicHero = () => {
    const { t } = useTranslation(['academics']);
    return (
        <header className="academics-hero">
            <div className="container">
                <div className="academics-hero-content">
                    <h1>{t('hero_title')}</h1>
                    <p className="lead">
                        {t('hero_desc')}
                    </p>
                </div>
            </div>
        </header>
    );
};

export default AcademicHero;
