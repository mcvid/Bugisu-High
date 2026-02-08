import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF receipt for a fee payment
 * @param {Object} payment - The payment object (from fee_payments table)
 * @param {Object} student - The student object
 */
export const generateReceipt = (payment, student) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    // Logo (If available, otherwise text)
    // We assume logo.png is in public folder
    try {
        const img = new Image();
        img.src = '/logo.png';
        doc.addImage(img, 'PNG', 15, 10, 20, 20); // x, y, w, h
    } catch (e) {
        console.warn('Logo not found for receipt');
    }

    // School Name
    doc.setFontSize(18);
    doc.setTextColor(22, 101, 52); // green-800
    doc.text('Bugisu High School', 40, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Excellence, Integrity, Service', 40, 26);
    doc.text('P.O. Box 123, Mbale, Uganda', 40, 31);
    doc.text('Tel: +256 700 000 000 | Email: accounts@bugisuhigh.ac.ug', 40, 36);

    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(15, 45, pageWidth - 15, 45);

    // --- Receipt Title ---
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('PAYMENT RECEIPT', pageWidth / 2, 60, { align: 'center' });

    // --- Payment Details Box ---
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(15, 70, pageWidth - 30, 45, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(100);

    // Left Column
    doc.text('Receipt No:', 20, 80);
    doc.text('Date:', 20, 90);
    doc.text('Payment Method:', 20, 100);

    // Right Column values (Bold)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);

    // Receipt ID logic (use external_ref or fallback to short tx_ref)
    const receiptId = payment.external_ref || `BHS-${payment.tx_ref?.slice(0, 8).toUpperCase() || 'MANUAL'}`;
    doc.text(receiptId, 55, 80);
    doc.text(new Date(payment.created_at).toLocaleDateString('en-UG', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }), 55, 90);

    const method = payment.provider === 'flutterwave' ? 'Mobile Money (Flutterwave)' : (payment.provider || 'Cash');
    doc.text(method, 55, 100);


    // --- Student Details ---
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Student Name:', pageWidth / 2 + 10, 80);
    doc.text('Reg Number:', pageWidth / 2 + 10, 90);
    doc.text('Class:', pageWidth / 2 + 10, 100);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(student.student_name, pageWidth / 2 + 40, 80);
    doc.text(student.student_reg_number, pageWidth / 2 + 40, 90);
    doc.text(student.class_grade, pageWidth / 2 + 40, 100);

    // --- Amount Table ---
    doc.autoTable({
        startY: 125,
        head: [['Description', 'Amount (UGX)']],
        body: [
            ['School Fees Payment', new Intl.NumberFormat('en-UG').format(payment.amount_paid)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [22, 101, 52], textColor: 255, halign: 'center' },
        bodyStyles: { halign: 'center', fontSize: 12, cellPadding: 5 },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'right', fontStyle: 'bold' }
        },
        foot: [['TOTAL PAID', new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(payment.amount_paid)]],
        footStyles: { fillColor: [240, 253, 244], textColor: 0, fontStyle: 'bold', halign: 'right' }
    });

    // --- Footer ---
    const finalY = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('Thank you for your payment. Education is the best investment.', pageWidth / 2, finalY, { align: 'center' });
    doc.text('This receipt was generated electronically and is valid without a signature.', pageWidth / 2, finalY + 6, { align: 'center' });

    // Save
    doc.save(`Receipt_${student.student_name}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
};
