import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import './ImportGuideModal.css';

const ImportGuideModal = ({ type, onClose, onProceed }) => {
    const guides = {
        students: {
            title: "Student Import Guide",
            description: "Import multiple students from an Excel file",
            columns: [
                { name: "student_name", required: true, example: "John Doe Mukasa", note: "Full legal name" },
                { name: "student_reg_number", required: true, example: "BHS/2026/0001", note: "Must be UNIQUE" },
                { name: "class_grade", required: true, example: "Senior 1", note: "Senior 1-6" },
                { name: "parent_phone", required: false, example: "+256700123456", note: "Recommended" },
                { name: "parent_email", required: false, example: "parent@example.com", note: "Optional" }
            ],
            dos: [
                "Use the exact column names shown above",
                "Ensure student_reg_number is unique for each student",
                "Save file as .xlsx or .xls format",
                "Keep the header row (first row with column names)"
            ],
            donts: [
                "Don't use duplicate registration numbers",
                "Don't change column names",
                "Don't merge cells or use formulas",
                "Don't leave student_name or student_reg_number empty"
            ]
        },
        grades: {
            title: "Grades/Marks Import Guide",
            description: "Import marks for the selected class and subject",
            columns: [
                { name: "Reg Number", required: true, example: "BHS/2026/0001", note: "Pre-filled - DO NOT EDIT" },
                { name: "Student Name", required: true, example: "John Doe", note: "Pre-filled - DO NOT EDIT" },
                { name: "Mark (0-100)", required: true, example: "85", note: "Enter score here (0-100)" }
            ],
            dos: [
                "Download the template first (it's pre-filled with students)",
                "Only fill the 'Mark (0-100)' column",
                "Use numbers between 0 and 100",
                "Leave blank if student was absent (row will be skipped)"
            ],
            donts: [
                "Don't change the Reg Number or Student Name columns",
                "Don't delete rows (just leave Mark blank to skip)",
                "Don't use letters (A, B, C) - use numbers only",
                "Don't enter marks above 100 or below 0"
            ]
        },
        payments: {
            title: "Fee Payments Import Guide",
            description: "Import bulk payment records",
            columns: [
                { name: "Reg No", required: true, example: "BHS/2026/0001", note: "Pre-filled - DO NOT EDIT" },
                { name: "Student Name", required: true, example: "John Doe", note: "Pre-filled - DO NOT EDIT" },
                { name: "Class", required: true, example: "Senior 1", note: "Pre-filled - DO NOT EDIT" },
                { name: "Amount", required: true, example: "500000", note: "Payment amount in UGX" },
                { name: "Date", required: false, example: "2026-02-01", note: "Leave empty = today" },
                { name: "Ref No", required: false, example: "BANK/001", note: "Receipt/Bank reference" }
            ],
            dos: [
                "Download the template first (it's pre-filled with all students)",
                "Only fill the 'Amount' column for students who paid",
                "Use numbers only (no commas or 'UGX')",
                "Delete rows or leave Amount blank for students who haven't paid"
            ],
            donts: [
                "Don't change Reg No, Student Name, or Class columns",
                "Don't use commas in amounts (500000 not 500,000)",
                "Don't add currency symbols (UGX, Shs)",
                "Don't import the same file twice (creates duplicates)"
            ]
        }
    };

    const guide = guides[type];
    if (!guide) return null;

    return (
        <div className="import-guide-overlay" onClick={onClose}>
            <div className="import-guide-modal" onClick={(e) => e.stopPropagation()}>
                <div className="import-guide-header">
                    <div>
                        <h2>{guide.title}</h2>
                        <p>{guide.description}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="import-guide-content">
                    {/* Required Columns */}
                    <section className="guide-section">
                        <h3>📋 Required Excel Columns</h3>
                        <div className="columns-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Column Name</th>
                                        <th>Required</th>
                                        <th>Example</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guide.columns.map((col, idx) => (
                                        <tr key={idx}>
                                            <td><code>{col.name}</code></td>
                                            <td>
                                                {col.required ? (
                                                    <span className="badge badge-required">Required</span>
                                                ) : (
                                                    <span className="badge badge-optional">Optional</span>
                                                )}
                                            </td>
                                            <td>{col.example}</td>
                                            <td>{col.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Do's and Don'ts */}
                    <div className="dos-donts-grid">
                        <section className="guide-section dos">
                            <h3><CheckCircle size={20} /> Do's</h3>
                            <ul>
                                {guide.dos.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="guide-section donts">
                            <h3><XCircle size={20} /> Don'ts</h3>
                            <ul>
                                {guide.donts.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Warning */}
                    <div className="guide-warning">
                        <AlertTriangle size={20} />
                        <div>
                            <strong>Important:</strong> The system will validate your file and show a preview before importing.
                            Invalid rows will be highlighted in red and skipped.
                        </div>
                    </div>
                </div>

                <div className="import-guide-footer">
                    <button className="btn btn-outline" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={onProceed}>
                        I Understand - Proceed to Import
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportGuideModal;
