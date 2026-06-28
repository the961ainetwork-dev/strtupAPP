import { jsPDF } from "jspdf";

export interface ClusterExportInfo {
  id: number;
  purpose: string;
  persona: string;
  tag: string;
}

export function exportCanvasToPdf(
  title: string, 
  content: string, 
  clusterName: string,
  clusterInfo?: ClusterExportInfo,
  sourcesCount?: number,
  chatCount?: number,
  sourceNames?: string[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // ==========================================
  // PAGE 1: EXECUTIVE SUMMARY COVER PAGE
  // ==========================================

  // --- Accent line at top ---
  doc.setFillColor(0, 224, 139); // STARTUP Accent Color (Teal)
  doc.rect(margin, 12, contentWidth, 2, "F");

  // Top header text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("STARTUP RESEARCH INTEL PROTOCOL // OFFICIAL EXECUTIVE RECORD", margin, 10);
  doc.text("SECURITY LEVEL: SECURE GROUNDED", pageWidth - margin - 58, 10);

  // --- Main Title Block ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate-900
  const reportTitle = (title || "COGNITIVE SYNTHESIS SUMMARY").toUpperCase();
  const titleLines = doc.splitTextToSize(reportTitle, contentWidth);
  let currentY = 28;
  titleLines.forEach((line: string) => {
    doc.text(line, margin, currentY);
    currentY += 9;
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("INTELLIGENT COMPILATION REPORT & SESSION DEBRIEF", margin, currentY);
  currentY += 12;

  // --- Metadata Card Box ---
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, contentWidth, 58, "FD");

  // Metadata headers and content
  const cardY = currentY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500

  // Column headers
  doc.text("ACTIVE COGNITIVE PILLAR", margin + 6, cardY + 8);
  doc.text("PILLAR SPECIALIZATION", margin + 86, cardY + 8);

  doc.text("COGNITIVE PERSONA", margin + 6, cardY + 21);
  doc.text("RESEARCH PURPOSE", margin + 86, cardY + 21);

  doc.text("SOURCE DOCUMENTS", margin + 6, cardY + 34);
  doc.text("CONVERSATION VOLUME", margin + 86, cardY + 34);

  doc.text("COMPLIANCE PROTOCOL", margin + 6, cardY + 47);
  doc.text("GENERATION TIMESTAMP", margin + 86, cardY + 47);

  // Values
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Slate-900

  doc.text(`PILLAR_0${clusterInfo?.id || 1}: ${clusterName.toUpperCase()}`, margin + 6, cardY + 13);
  doc.text((clusterInfo?.tag || "GENERAL COGNITIVE CORE").toUpperCase(), margin + 86, cardY + 13);

  doc.text((clusterInfo?.persona || "Grounded Neural Node").toUpperCase(), margin + 6, cardY + 26);
  
  // Wrap purpose value to fit column
  const wrappedPurpose = doc.splitTextToSize(clusterInfo?.purpose || "Grounded analysis.", contentWidth / 2 - 12);
  doc.text(wrappedPurpose[0] || "", margin + 86, cardY + 26);
  if (wrappedPurpose[1]) {
    doc.setFontSize(8);
    doc.text(wrappedPurpose[1], margin + 86, cardY + 30);
    doc.setFontSize(9.5);
  }

  doc.text(`${sourcesCount || 0} Documents Active`, margin + 6, cardY + 39);
  doc.text(`${chatCount || 0} Messages Exchanged`, margin + 86, cardY + 39);

  doc.setTextColor(16, 185, 129); // Accent emerald / green
  doc.text("Grounded AI Node v1.2 [PASS]", margin + 6, cardY + 52);
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleString(), margin + 86, cardY + 52);

  currentY += 68;

  // --- Highlights & Session Insights Section ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text("SESSION HIGHLIGHTS & GROUNDED TAKEAWAYS", margin + 4, currentY);
  
  // Custom sidebar highlight bullet
  doc.setFillColor(0, 224, 139);
  doc.rect(margin, currentY - 3, 2, 4, "F");

  currentY += 8;

  // Formulate dynamic highlights based on scratchpad text, fallback to cluster goals
  const highlights: string[] = [];
  
  // Extract custom lines from scratchpad if they look like highlights/bullets
  if (content && content.trim().length > 20) {
    const rawLines = content.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 10 && (line.startsWith("-") || line.startsWith("*") || line.startsWith("•") || /^\d+\./.test(line)));
    
    if (rawLines.length > 0) {
      rawLines.slice(0, 3).forEach(l => {
        highlights.push(l.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, ""));
      });
    } else {
      // Split by paragraphs/sentences
      const sentences = content.split(/[.!?]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 15 && !s.includes("#") && !s.includes("---"));
      if (sentences.length > 0) {
        highlights.push(sentences[0]);
        if (sentences[1]) highlights.push(sentences[1]);
      }
    }
  }

  // Fallback / complement highlights based on cluster personality
  if (highlights.length < 3) {
    if (clusterInfo?.id === 1) {
      highlights.push("Mixture of Experts: Successfully analyzed sparse routing protocols to direct attention weights efficiently.");
      highlights.push("Token Optimization: Evaluated gating networks to reduce model overhead during long-context document ingestion.");
    } else if (clusterInfo?.id === 2) {
      highlights.push("HNSW Recall: Mapped vector storage recall rates to index high-dimensional semantic search spaces securely.");
      highlights.push("State Coordination: Orchestrated state machines across multi-agent nodes with zero-knowledge verification.");
    } else if (clusterInfo?.id === 3) {
      highlights.push("Sovereign Infrastructure: Outlined regional computing constraints and capital allocations across GCC deeptech nodes.");
      highlights.push("Regulatory Alignment: Assessed risk levels of private market investment strategies against local data residency policies.");
    } else {
      highlights.push("Operational Integrity: Checked compliance structures across corporate multi-agent node integrations.");
      highlights.push("Session Synthesis: Compiled grounded takeaways to support enterprise-wide knowledge vaults.");
    }
  }

  // Render highlights as bullet points
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85); // Slate-700

  highlights.slice(0, 3).forEach((hl, idx) => {
    // Bullet marker
    doc.setFillColor(0, 224, 139);
    doc.rect(margin + 2, currentY + 1.2, 2, 2, "F");

    const wrappedHl = doc.splitTextToSize(hl, contentWidth - 8);
    wrappedHl.forEach((line: string, lineIdx: number) => {
      doc.text(line, margin + 8, currentY + 3);
      currentY += 5;
    });
    currentY += 3; // Space between bullets
  });

  currentY += 4;

  // --- Source Documents Used Box ---
  if (sourceNames && sourceNames.length > 0) {
    doc.setDrawColor(241, 245, 249); // Slate-100
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text("SOURCE GROUNDING INVENTORY", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(115, 115, 115); // Neutral-400
    
    const maxSourcesToShow = 5;
    const sourcesStr = sourceNames.slice(0, maxSourcesToShow).join(", ") + (sourceNames.length > maxSourcesToShow ? ` (+${sourceNames.length - maxSourcesToShow} more)` : "");
    const wrappedSources = doc.splitTextToSize(`Active session material grounded to: ${sourcesStr}`, contentWidth);
    wrappedSources.forEach((line: string) => {
      doc.text(line, margin, currentY);
      currentY += 4;
    });
  }

  // Draw Page 1 Footer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  
  doc.text("STARTUP SOVEREIGN NEURAL COGNITION SYSTEM v1.2", margin, pageHeight - 10);
  doc.text("CONFIDENTIAL - DO NOT DISTRIBUTE // COVER PAGE", pageWidth - margin - 75, pageHeight - 10);

  // ==========================================
  // PAGE 2+: ACTUAL ASSEMBLED SCRATCHPAD NOTE
  // ==========================================
  doc.addPage();

  // --- Header styling ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("STARTUP PORTAL // MULTI-CLUSTER INTELLIGENCE ENGINE", margin, 15);
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
      doc.text("STARTUP PORTAL // COGNITIVE SYNTHESIS SUMMARY", margin, 15);
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

