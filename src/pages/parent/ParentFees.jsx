import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CreditCard,
    ArrowLeft,
    Smartphone,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    Search,
    History,
    FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './ParentFees.css';

const ParentFees = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentStep, setPaymentStep] = useState('list'); // list, amount, phone, processing, success
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');



    const [verifying, setVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // success, failed

    useEffect(() => {
        // Check for URL params (return from Flutterwave)
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const txRef = params.get('tx_ref');

        if (status && txRef) {
            handleVerification(status, txRef);
        } else {
            fetchStudentFees();
        }
    }, []);

    const handleVerification = async (status, txRef) => {
        setVerifying(true);
        // Clear params to avoid loop
        window.history.replaceState({}, document.title, window.location.pathname);

        if (status === 'successful' || status === 'completed') {
            setPaymentStep('success'); // Show success UI
            setVerificationStatus('success');
            // We fetch the latest fees which should now include the new payment
            await fetchStudentFees();
        } else {
            console.warn(`Payment failed with status: ${status}`);
            alert(`Payment was not successful. Status: ${status}. If you believe this is an error, please contact support.`);
            setPaymentStep('list');
        }
        setVerifying(false);
    }

    const fetchStudentFees = async () => {
        const parentPhone = sessionStorage.getItem('parentPhone');
        if (!parentPhone) {
            navigate('/parents');
            return;
        }

        setLoading(true);
        const { data: studentsData, error } = await supabase
            .from('students')
            .select('*')
            .eq('parent_phone', parentPhone);

        if (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
            return;
        }

        // For each student, fetch their balance and recent transactions
        const studentsWithDetails = await Promise.all((studentsData || []).map(async (student) => {
            // Get Balance
            const { data: balanceData } = await supabase.rpc('get_student_balance', { student_uuid: student.id });

            // Get Transactions (Fee Payments)
            const { data: transactionsData } = await supabase
                .from('fee_payments')
                .select('*')
                .eq('student_id', student.id)
                .order('created_at', { ascending: false });

            return {
                ...student,
                current_balance: balanceData,
                transactions: transactionsData || []
            };
        }));

        setStudents(studentsWithDetails);
        setLoading(false);
    };

    // Calculate Total Outstanding for the Summary Card
    const totalOutstanding = students.reduce((sum, student) => sum + (student.current_balance || 0), 0);
    // Combine all transactions for the history view, sorted by date
    const allTransactions = students.flatMap(s => s.transactions).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const handleStartPayment = (student) => {
        setSelectedStudent(student);
        setPaymentStep('amount');
    };

    const handleConfirmAmount = () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        setPaymentStep('phone');
    };

    const handleInitiatePayment = async () => {
        if (!phone || phone.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }
        setPaymentStep('processing');

        try {
            // 1. Call Backend to Securely Init Payment
            const parentPhone = sessionStorage.getItem('parentPhone'); // Use logged in phone tracking if needed, or user input
            // Ideally we send both: payer_phone (input) and parent context

            const { data, error } = await supabase.functions.invoke('payment-init', {
                body: {
                    amount: parseInt(amount),
                    student_id: selectedStudent.id,
                    student_name: selectedStudent.student_name,
                    phone: phone, // Payer phone
                    email: "parent@bugisuhighschool.com", // Placeholder or fetch actual
                    name: "Parent" // Placeholder
                }
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            // 2. Redirect to Secure Payment Page
            if (data.link) {
                window.location.href = data.link;
            } else {
                throw new Error('No payment link received');
            }

        } catch (err) {
            console.error('Payment Error:', err);
            alert('Failed to initiate payment: ' + err.message);
            setPaymentStep('list');
        }
    };

    const resetFlow = () => {
        setPaymentStep('list');
        setSelectedStudent(null);
        setAmount('');
        setPhone('');
    };

    if (loading || verifying) return <div className="fees-loading">
        {verifying ? 'Verifying payment status...' : 'Loading financial records...'}
    </div>;

    return (
        <div className="parent-fees-container">
            {/* Header */}
            <header className="fees-header">
                <button className="back-btn" onClick={() => paymentStep === 'list' ? navigate('/parents/portal') : setPaymentStep('list')}>
                    <ArrowLeft size={20} />
                </button>
                <h1>{paymentStep === 'list' ? 'Fee Management' : 'Secure Payment'}</h1>
            </header>

            <div className="fees-content">
                {paymentStep === 'list' && (
                    <div className="fade-in">
                        {/* Summary Card */}
                        <div className="summary-card">
                            <div className="summary-info">
                                <span>Total Outstanding</span>
                                <h2>UGX {totalOutstanding.toLocaleString()}</h2>
                            </div>
                            <div className="summary-icon">
                                <CreditCard size={32} />
                            </div>
                        </div>

                        {/* Student Balances */}
                        <section className="students-fees-section">
                            <h3>Outstanding Balances</h3>
                            <div className="student-fee-list">
                                {students.map(student => (
                                    <div key={student.id} className="student-fee-card">
                                        <div className="student-info">
                                            <h4>{student.student_name}</h4>
                                            <p>{student.class_grade} | {student.student_reg_number}</p>
                                        </div>
                                        <div className="balance-info">
                                            <span className="balance-label">Current Balance</span>
                                            <span className="balance-amount">UGX {student.current_balance ? student.current_balance.toLocaleString() : '0'}</span>
                                        </div>
                                        <button className="pay-now-btn" onClick={() => handleStartPayment(student)}>
                                            Pay Fees
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recent History */}
                        <section className="history-section">
                            <div className="section-header">
                                <h3>Payment History</h3>
                                <History size={18} color="#6b7280" />
                            </div>
                            <div className="history-list">
                                {allTransactions.length > 0 ? allTransactions.map(tx => (
                                    <div key={tx.id} className="history-item">
                                        <div className="tx-icon">
                                            <FileText size={18} color={tx.status === 'completed' || tx.status === 'successful' ? '#22c55e' : '#f97316'} />
                                        </div>
                                        <div className="tx-details">
                                            <span className="tx-type">{tx.provider === 'flutterwave' ? 'Mobile Money' : 'Cash Payment'}</span>
                                            <span className="tx-date">{new Date(tx.created_at).toLocaleDateString()}</span>
                                            {tx.status === 'pending' && <small style={{ color: 'orange' }}> (Pending)</small>}
                                        </div>
                                        <div className="tx-amount">
                                            <span className="amount">UGX {tx.amount_paid.toLocaleString()}</span>
                                            <span className={`status ${tx.status === 'successful' ? 'completed' : tx.status}`}>{tx.status}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>No payment history found.</p>
                                )}
                            </div>
                        </section>

                        {/* Quick Reference / USSD */}
                        <section className="quick-reference-section fade-in">
                            <h3>Quick Reference (USSD)</h3>
                            <div className="reference-grid">
                                <div className="ref-card mtn">
                                    <div className="ref-header">
                                        <Smartphone size={16} />
                                        <span>MTN MoMo</span>
                                    </div>
                                    <strong>*165*80#</strong>
                                    <p>School Code: <strong>BHS01</strong></p>
                                </div>
                                <div className="ref-card airtel">
                                    <div className="ref-header">
                                        <Smartphone size={16} />
                                        <span>Airtel Money</span>
                                    </div>
                                    <strong>*185*4*9#</strong>
                                    <p>Merchant ID: <strong>654321</strong></p>
                                </div>
                            </div>
                            <div className="support-card">
                                <AlertCircle size={18} color="#f97316" />
                                <div>
                                    <p>Need help with payments?</p>
                                    <small>Call Accountant: +256 700 000 000</small>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {paymentStep === 'amount' && (
                    <div className="payment-step fade-in">
                        <div className="step-card">
                            <h3>Enter Amount</h3>
                            <p>Paying for: <strong>{selectedStudent.student_name}</strong></p>
                            <div className="input-group">
                                <span className="currency">UGX</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="quick-amounts">
                                {[50000, 100000, 200000, 500000].map(val => (
                                    <button key={val} onClick={() => setAmount(val)}>
                                        {val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                            <button className="confirm-btn" onClick={handleConfirmAmount}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {paymentStep === 'phone' && (
                    <div className="payment-step fade-in">
                        <div className="step-card">
                            <h3>Mobile Money Details</h3>
                            <p>Final Amount: <strong>UGX {parseInt(amount).toLocaleString()}</strong></p>

                            <div className="provider-selector">
                                <div className="provider active">
                                    <div className="dot"></div>
                                    <span>MTN MoMo / Airtel Money</span>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Phone Number</label>
                                <div className="phone-input">
                                    <Smartphone size={18} />
                                    <input
                                        type="tel"
                                        placeholder="07XX XXX XXX"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="security-notice">
                                <AlertCircle size={14} />
                                <span style={{ color: '#166534', fontWeight: 'bold' }}>You will be redirected to the secure payment page to complete the transaction.</span>
                            </div>

                            <button className="simulate-btn" onClick={handleInitiatePayment}>
                                Pay Securely
                            </button>
                        </div>
                    </div>
                )}

                {paymentStep === 'processing' && (
                    <div className="processing-view fade-in">
                        <div className="loader-container">
                            <div className="pulse-circle"></div>
                            <div className="pulse-circle delay"></div>
                            <Smartphone size={48} className="processing-icon" />
                        </div>
                        <h3>Processing Payment</h3>
                        <p>Waiting for you to authorize the transaction on your phone...</p>
                        <div className="processing-steps">
                            <div className="mini-step done">Initiating transaction...</div>
                            <div className="mini-step active">Awaiting PIN entry...</div>
                        </div>
                    </div>
                )}

                {paymentStep === 'success' && (
                    <div className="success-view fade-in">
                        <div className="success-icon-wrapper">
                            <CheckCircle2 size={80} color="#22c55e" />
                        </div>
                        <h2>Payment Successful!</h2>
                        <p>Your payment of UGX {parseInt(amount).toLocaleString()} has been received.</p>

                        <div className="receipt-box">
                            <div className="receipt-row">
                                <span>Receipt ID</span>
                                <strong>#BHS-{Math.floor(Math.random() * 900000) + 100000}</strong>
                            </div>
                            <div className="receipt-row">
                                <span>Student</span>
                                <strong>{selectedStudent.student_name}</strong>
                            </div>
                            <div className="receipt-row">
                                <span>Method</span>
                                <strong>Mobile Money</strong>
                            </div>
                        </div>

                        <button className="finish-btn" onClick={resetFlow}>
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentFees;
