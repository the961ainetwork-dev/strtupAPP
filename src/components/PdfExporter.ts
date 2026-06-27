import { jsPDF } from "jspdf";

export function exportCanvasToPdf(title: string, content: string, clusterName: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // --- Header styling ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("AI PORTAL // MULTI-CLUSTER INTELLIGENCE ENGINE", margin, 15);
  doc.text("SECURITY LEVEL: PRIME UNLOCKED", pageWidth - margin - 55, 15);

  // Divider line
  doc.setDrawColor(148, 163, 184); // Slate-400
  doc.setLineWidth(0.4);
  doc.line(margin, 17, pageWidth - margin, 17);

  // --- Title and metadata ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(title || "COGNITIVE SYNTHESIS SUMMARY", margin, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text(`Active Pillar: ${clusterName.toUpperCase()}`, margin, 34);
  doc.text(`Generated At: ${new Date().toLocaleString()}`, margin, 39);
  doc.text(`Integrity Code: Grounded [Gemini-3.5-Flash]`, margin, 44);

  // Another line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(margin, 48, pageWidth - margin, 48);

  // --- Body text wrapping ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59); // Slate-800

  const lines = doc.splitTextToSize(content || "No content assembled in scratchpad yet.", contentWidth);
  
  let y = 56;
  const pageLimit = pageHeight - margin - 15;

  lines.forEach((line: string) => {
    if (y > pageLimit) {
      // Draw footer for the finished page
      drawFooter(doc, pageWidth, pageHeight, margin);
      
      // Create new page
      doc.addPage();
      
      // Draw header on new page
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("AI PORTAL // COGNITIVE SYNTHESIS SUMMARY", margin, 15);
      doc.setDrawColor(148, 163, 184);
      doc.line(margin, 17, pageWidth - margin, 17);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      y = 25;
    }
    
    doc.text(line, margin, y);
    y += 6.5; // Line spacing
  });

  // Final footer
  drawFooter(doc, pageWidth, pageHeight, margin);

  // Trigger download
  const formattedTitle = (title || "synthesis_report").trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`${formattedTitle}_compile.pdf`);
}

function drawFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  
  doc.text("SECURE SOURCE-GROUNDED RESEARCH PROTOCOL // PRIME Tier", margin, pageHeight - 10);
  doc.text(`CONFIDENTIAL - DO NOT DISTRIBUTE // PAGE ${doc.getNumberOfPages()}`, pageWidth - margin - 75, pageHeight - 10);
}
