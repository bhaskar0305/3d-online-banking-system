import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePdfStatement = (account, transactions) => {
  const doc = new jsPDF();

  // Primary Header Palette
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 40, 'F');

  // Bank Title & Logo Text
  doc.setTextColor(212, 175, 55); // Metallic Gold
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('APEX DIGITAL BANKING', 14, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Account Statement & Audit Trail', 14, 30);

  // Account & Customer Details
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Account Summary', 14, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Account Holder: ${account?.ownerName || 'N/A'}`, 14, 60);
  doc.text(`Account Number: ${account?.accountNumber || 'N/A'}`, 14, 67);
  doc.text(`Account Type: ${account?.accountType || 'SAVINGS'}`, 14, 74);

  doc.text(`Generated On: ${new Date().toLocaleString()}`, 120, 60);
  doc.text(`Available Balance: $${Number(account?.balance || 0).toFixed(2)}`, 120, 67);
  doc.text(`Status: ACTIVE / VERIFIED`, 120, 74);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 82, 196, 82);

  // Transaction History Table
  const tableRows = transactions.map((tx) => [
    tx.transactionId ? tx.transactionId.substring(0, 8) + '...' : 'N/A',
    new Date(tx.timestamp).toLocaleString(),
    tx.description || tx.type,
    tx.sourceAccount?.accountNumber === account?.accountNumber ? 'DEBIT' : 'CREDIT',
    `$${Number(tx.amount).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 88,
    head: [['Tx ID', 'Date & Time', 'Description', 'Type', 'Amount']],
    body: tableRows,
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Footer Disclaimer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'This is a computer-generated account statement and does not require a physical signature.',
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(`Page ${i} of ${pageCount}`, 180, doc.internal.pageSize.height - 10);
  }

  // Download PDF
  doc.save(`APEX_Statement_${account?.accountNumber || 'Account'}.pdf`);
};