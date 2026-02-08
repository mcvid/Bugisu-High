import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF report card for a student
 */
export const generateReportCardPDF = (student, grades, metadata, competencies, term, year) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    try {
        doc.addImage('/logo.png', 'PNG', 15, 10, 20, 20);
    } catch (e) {
        console.warn('Logo not found for report card');
    }

    doc.setFontSize(18);
    doc.setTextColor(22, 101, 52); // green-800
    doc.text('Bugisu High School', 40, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Excellence, Integrity, Service', 40, 26);
    doc.text('Academic Report Card', 40, 31);

    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(15, 38, pageWidth - 15, 38);

    // --- Student Info ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(student.student_name, 15, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Reg No: ${student.student_reg_number}`, 15, 56);
    doc.text(`Class: ${student.class_grade}`, 15, 62);

    doc.text(`Term: ${term} ${year}`, pageWidth - 15, 50, { align: 'right' });
    doc.text(`Curriculum: CBC`, pageWidth - 15, 56, { align: 'right' });

    // --- Academic Performance Table ---
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.text('ACADEMIC PERFORMANCE', 15, 75);

    const academicBody = grades.map(g => [
        g.subjects?.name || 'Unknown',
        `${g.marks}%`,
        g.grade,
        g.teacher_comment || 'Good progress.'
    ]);

    doc.autoTable({
        startY: 80,
        head: [['Subject', 'Score', 'Grade', 'Teacher\'s Comment']],
        body: academicBody,
        theme: 'striped',
        headStyles: { fillColor: [22, 101, 52], textColor: 255 },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'center' }
        }
    });

    // --- Skills & Competencies ---
    let finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.text('SKILLS & COMPETENCIES', 15, finalY);

    const compBody = (competencies.length > 0 ? competencies : [
        { skill_name: 'Communication', achievement_level: 'Meets Expectations' },
        { skill_name: 'Critical Thinking', achievement_level: 'Approaching Expectations' },
        { skill_name: 'Collaboration', achievement_level: 'Meets Expectations' },
        { skill_name: 'Creativity', achievement_level: 'Needs Support' }
    ]).map(c => [c.skill_name, c.achievement_level]);

    doc.autoTable({
        startY: finalY + 5,
        head: [['Core Competency', 'Achievement Level']],
        body: compBody,
        theme: 'grid',
        headStyles: { fillColor: [100, 100, 100], textColor: 255 },
        margin: { right: pageWidth / 2 + 5 }, // Only take half page
    });

    // --- Attendance & Conduct (Right Side) ---
    const sideY = finalY + 5;
    const sideX = pageWidth / 2 + 10;

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('ATTENDANCE', sideX, sideY + 5);
    doc.setFont('helvetica', 'normal');
    const attendance = `${metadata.attendance_present || 0} / ${metadata.attendance_total || 90} days`;
    doc.text(`Present: ${attendance}`, sideX, sideY + 12);

    doc.setFont('helvetica', 'bold');
    doc.text('CONDUCT', sideX, sideY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(`Behavior: ${metadata.conduct_rating || 'Satisfactory'}`, sideX, sideY + 32);
    doc.text(`Punctuality: ${metadata.punctuality_rating || 'Good'}`, sideX, sideY + 38);

    // --- Final Remarks ---
    finalY = Math.max(doc.lastAutoTable.finalY, sideY + 45) + 15;

    doc.setFont('helvetica', 'bold');
    doc.text('FINAL REMARKS', 15, finalY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Class Teacher: ${metadata.teacher_remark || 'A determined student with a positive attitude.'}`, 15, finalY + 8, { maxWidth: pageWidth - 30 });
    doc.text(`Head Teacher: ${metadata.headteacher_remark || 'Encouraging results. Focus more on technical subjects.'}`, 15, finalY + 20, { maxWidth: pageWidth - 30 });

    // --- Official Stamp/Sign Area ---
    const footerY = pageWidth > 250 ? 250 : doc.internal.pageSize.height - 30;
    doc.setLineWidth(0.2);
    doc.line(15, footerY, 70, footerY);
    doc.line(pageWidth - 70, footerY, pageWidth - 15, footerY);

    doc.setFontSize(8);
    doc.text('Class Teacher Signature', 15, footerY + 5);
    doc.text('School Stamp & Date', pageWidth - 15, footerY + 5, { align: 'right' });

    // Save
    doc.save(`ReportCard_${student.student_name}_${term}_${year}.pdf`);
};
