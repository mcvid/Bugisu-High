import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UniversalHero from '../ui/UniversalHero';

const AcademicHero = () => {
    const { t } = useTranslation(['academics']);
    return (
        <UniversalHero pagePath="/academics" height="50vh">
            <div className="academics-hero-content">
                <h1>{t('hero_title')}</h1>
                <p className="lead">
                    {t('hero_desc')}
                </p>
            </div>
        </UniversalHero>
    );
};

export default AcademicHero;
