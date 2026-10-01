import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportPassportToPdf(
  elementId: string,
  studentUsername: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Passport export element not found in DOM.');
  }

  // Clone or capture element with high DPI
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  const safeUsername = (studentUsername || 'student').toLowerCase().replace(/[^a-z0-9_]/g, '');
  pdf.save(`${safeUsername}_skillpass_verified.pdf`);
}
