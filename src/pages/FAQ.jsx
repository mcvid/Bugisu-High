import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, HelpCircle, Book, Calendar, Users } from 'lucide-react';
import SEO from '../components/SEO';
import './FAQ.css';

const FAQ = () => {
    const { t } = useTranslation(['faq', 'common']);
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        {
            category: t('categories.general'),
            icon: <HelpCircle size={24} />,
            questions: [
                {
                    question: t('general.q1'),
                    answer: t('general.a1')
                },
                {
                    question: t('general.q2'),
                    answer: t('general.a2')
                },
                {
                    question: t('general.q3'),
                    answer: t('general.a3')
                }
            ]
        },
        {
            category: t('categories.admissions'),
            icon: <Calendar size={24} />,
            questions: [
                {
                    question: t('admissions.q1'),
                    answer: t('admissions.a1')
                },
                {
                    question: t('admissions.q2'),
                    answer: t('admissions.a2')
                },
                {
                    question: t('admissions.q3'),
                    answer: t('admissions.a3')
                }
            ]
        },
        {
            category: t('categories.academics'),
            icon: <Book size={24} />,
            questions: [
                {
                    question: t('academics.q1'),
                    answer: t('academics.a1')
                },
                {
                    question: t('academics.q2'),
                    answer: t('academics.a2')
                }
            ]
        },
        {
            category: t('categories.student_life'),
            icon: <Users size={24} />,
            questions: [
                {
                    question: t('student_life.q1'),
                    answer: t('student_life.a1')
                },
                {
                    question: t('student_life.q2'),
                    answer: t('student_life.a2')
                }
            ]
        }
    ];

    return (
        <div className="faq-page">
            <SEO
                title={t('hero_title')}
                description="Find answers to common questions about Bugisu High School admissions, academics, and student life."
                url="/faq"
            />

            <div className="faq-hero">
                <div className="container">
                    <h1>{t('hero_title')}</h1>
                    <p>{t('hero_subtitle')}</p>
                </div>
            </div>

            <div className="container faq-content">
                {faqData.map((section, catIndex) => (
                    <div key={catIndex} className="faq-section">
                        <div className="faq-category-header">
                            <span className="faq-category-icon">{section.icon}</span>
                            <h2>{section.category}</h2>
                        </div>

                        <div className="faq-list">
                            {section.questions.map((faq, index) => {
                                const globalIndex = `${catIndex}-${index}`;
                                const isActive = activeIndex === globalIndex;
                                return (
                                    <div
                                        key={index}
                                        className={`faq-item ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleAccordion(globalIndex)}
                                    >
                                        <div className="faq-question">
                                            <h3>{faq.question}</h3>
                                            <span className="faq-toggle">
                                                {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </span>
                                        </div>
                                        <div className={`faq-answer ${isActive ? 'open' : ''}`}>
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="container faq-cta text-center">
                <h3>{t('cta_title')}</h3>
                <p>{t('cta_desc')}</p>
                <a href="/contact" className="btn btn-primary">{t('cta_btn')}</a>
            </div>
        </div>
    );
};

export default FAQ;
