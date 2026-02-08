import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('departments').select('*').order('name', { ascending: true });
                if (error) throw error;
                setDepartments(data || []);
            } catch (error) {
                console.error('Error fetching departments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    if (loading) return (
        <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
            <p>Loading departments...</p>
        </div>
    );

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Departments</h2>
                <p>Our faculty is organized into departments that foster collaboration and specialized expertise.</p>
            </div>
            <div className="departments-list">
                {(departments.length > 0 ? departments : [
                    { id: 1, name: 'Science & Innovation', description: 'Physics, Chemistry, Biology, and Laboratory research.' },
                    { id: 2, name: 'Mathematics & ICT', description: 'Logical reasoning, coding, and digital literacy.' },
                    { id: 3, name: 'Humanities & Culture', description: 'Geography, History, Literature, and Creative Arts.' },
                    { id: 4, name: 'Languages & Communication', description: 'English, Literature, and Local Languages.' }
                ]).map(dept => (
                    <div key={dept.id} className="dept-item reveal-on-scroll">
                        <h4>{dept.name}</h4>
                        <p>{dept.description}</p>
                    </div>
                ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <a
                    href="/departments"
                    className="cta-button"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                    }}
                >
                    View Full Faculty & Departments
                </a>
            </div>
        </section>
    );
};

export default DepartmentList;
