import React from 'react';
import { Shield, AlertTriangle, ArrowLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './SchoolRules.css';

const SchoolRules = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.opener) {
            window.close();
        } else {
            navigate(-1);
        }
    };

    const rules = [
        "Contempt of Authority: Refusing to take orders, refusing punishment or disobedience of any kind-Punishable by indefinite suspension.",
        "Drinking alcohol or being in possession of any alcoholic beverages, smoking and use of other related drugs-Punishable by indefinite suspension.",
        "Bullying or teasing, inciting, fighting, hooliganism-Punishable by not less than three (3) weeks suspension.",
        "Being in possession of stolen property, attempted theft and conversion of property-Punishable by indefinite suspension.",
        "Dodging lessons or classes or assembly or prayers or physical training exercise or staying in the dormitory during class time or meals or any programed school activity-Punishable by not less than 3 weeks suspension.",
        "Dodging examinations-Punishable by indefinite suspension.",
        "Disturbing during class time or prep time or loitering outside or late coming, idleness and disorderliness or gossip-Punishable by manual labour or two (2) weeks suspension.",
        "Promiscuous behaviours and any form sexual related offence-Punishable by indefinite suspension.",
        "Misuse of school property or any damage- Punishable by two (2) weeks suspension and replacement of the damaged property/item.",
        "Cheating or attempting to cheat or having undue advantage over other students during examinations-Punishable by suspension of not less than three (3) weeks.",
        "Trespassing or going to staff quarters, staffroom or going to any unauthorized area in the school-Punishable by indefinite suspension.",
        "Sneaking in and out of school-Punishable by indefinite suspension/buying two rolls of chain link.",
        "Freedom of worship should be carried out within the stipulated confinements, failure to adhere to is - Punishable at discretion of disciplinary committee.",
        "Forgery of documents/impersonation including altering permission chits or reports or official documents or telling lies or making false allegations-Punishable by indefinite suspension depending on the nature of the forgery/police case.",
        "Disorderliness including shabbiness, indecent dressing or exposure like mini-skirts, jeans, panty-trousers, skin tights, pedal trousers, capes, shades etc or not wearing full school uniform or untidiness in the dormitory/school compound/premises-Punishable by manual labour, impounding of the respective attire and failure to adjust accordingly will lead to indefinite suspension.",
        "Dodging housework or assigned duty by the school administration-Punishable by three (3) weeks suspension plus public apology. Failure to reform will lead to indefinite suspension.",
        "Using vulgar language-Punishable by suspension of two (2) weeks plus reform card. Failure to reform will lead to indefinite suspension.",
        "Refusing to stay in the assigned class or dormitory or sleeping on a different bed other than the officially known bed or sharing of beds, shall be treated as contempt of authority- Punishable by indefinite suspension.",
        "Refusing to cut off hair as required by the school-Punishable by two (2) weeks suspension.",
        "Theft and trading activities of any kind amongst students- Punishable by replacement of the item (s) and indefinite suspension.",
        "A student who attends to visitors during class time without permission-Punishable by two (2) weeks of suspension.",
        "Any student found communicating with anybody through the fence-Punishable by two (2) weeks suspension.",
        "Washing in the dormitory and pouring water through the windows-Punishable by bringing two (2) bags of cement or 4 tins of paint or indefinite suspension.",
        "Possession of illegal items in school e.g. mobile phones, sharp objects of any form or radios-Punishable by confiscation or indefinite suspension.",
        "Any student, who is suspended and pardoned, is assumed to be on last warning. If such a student commits any other offence- Punishable by indefinite suspension.",
        "Day scholars, strangers found in the dormitory facilities and the one who entertains them-Punishable by three (3) weeks suspension.",
        "Visitation and reporting to school should be between 8:00 a.m. to 6:00 p.m, failure to adhere to the gazetted time is -Punishable by going back home and reporting back with a parent/guardian"
    ];

    return (
        <div className="school-rules-page fade-in">
            <div className="container" style={{ maxWidth: '900px', width: '100%', marginBottom: '2rem' }}>
                <button
                    onClick={handleBack}
                    className="back-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                >
                    {window.opener ? <X size={18} /> : <ArrowLeft size={18} />}
                    {window.opener ? 'Close Window' : 'Back'}
                </button>
            </div>

            <div className="rules-header">
                <Shield size={48} className="rules-icon" />
                <h1>School Rules and Regulations</h1>
                <h2>Code of Punishment</h2>
            </div>

            <div className="rules-container">
                <div className="rules-intro">
                    <AlertTriangle size={24} />
                    <p>All students are expected to adhere strictly to the following rules. Failure to comply will result in the specified disciplinary actions.</p>
                </div>

                <ol className="rules-list">
                    {rules.map((rule, index) => {
                        const [offense, punishment] = rule.split('-Punishable');
                        return (
                            <li key={index} className="rule-item">
                                <div className="rule-content">
                                    <span className="rule-text">{offense}</span>
                                    {punishment && (
                                        <div className="rule-punishment">
                                            <strong>Punishable:</strong> {punishment.replace(/^ by/, '')}
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <div className="rules-footer">
                    <p>“We strive for excellence”</p>
                </div>
            </div>
        </div>
    );
};

export default SchoolRules;
