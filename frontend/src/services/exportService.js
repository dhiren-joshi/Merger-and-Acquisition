import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { getFitScoreCategory } from '../utils/constants';

export const exportToPDF = (deal) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Helper function to add spacing
    const addSpace = (space = 10) => {
        yPos += space;
        if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = 20;
        }
    };

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('M&A Fit Score Analysis', pageWidth / 2, yPos, { align: 'center' });
    addSpace(15);

    // Company Name and Deal Type
    doc.setFontSize(16);
    doc.text(deal.targetCompanyName, pageWidth / 2, yPos, { align: 'center' });
    addSpace(8);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Deal: ${deal.dealName} | Type: ${deal.dealType}`, pageWidth / 2, yPos, { align: 'center' });
    addSpace(15);

    // Fit Score Box
    const fitScore = Math.round(deal.fitScore?.adjustedFitScore || 0);
    const category = getFitScoreCategory(fitScore);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, pageWidth - 40, 30, 'F');

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Fit Score:', 30, yPos + 12);
    doc.text(`${fitScore}/100`, 80, yPos + 12);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(category, 30, yPos + 24);
    addSpace(40);

    // Deal Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Deal Information', 20, yPos);
    addSpace(8);

    const dealInfo = [
        ['Deal Value', deal.dealValue ? formatCurrency(deal.dealValue) : 'N/A'],
        ['Current Stage', deal.currentStage || 'N/A'],
        ['Status', deal.status || 'N/A'],
        ['Created', formatDate(deal.createdAt)],
        ['Last Updated', formatDate(deal.updatedAt)]
    ];

    doc.autoTable({
        startY: yPos,
        head: [],
        body: dealInfo,
        theme: 'plain',
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 'auto' }
        },
        margin: { left: 20 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Metric Breakdown
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Metric Breakdown', 20, yPos);
    addSpace(8);

    if (deal.fitScore?.metricBreakdown) {
        const metrics = deal.fitScore.metricBreakdown;
        const metricData = [
            ['Metric', 'Raw Score', 'Weight', 'Weighted Score'],
            [
                'Industry Match',
                formatPercentage((metrics.industryMatch?.input || 0) * 100),
                formatPercentage((metrics.industryMatch?.weight || 0) * 100),
                formatPercentage((metrics.industryMatch?.weightedScore || 0) * 100)
            ],
            [
                'Financials',
                formatPercentage((metrics.financials?.input || 0) * 100),
                formatPercentage((metrics.financials?.weight || 0) * 100),
                formatPercentage((metrics.financials?.weightedScore || 0) * 100)
            ],
            [
                'Cultural Fit',
                formatPercentage((metrics.cultural?.input || 0) * 100),
                formatPercentage((metrics.cultural?.weight || 0) * 100),
                formatPercentage((metrics.cultural?.weightedScore || 0) * 100)
            ],
            [
                'Technology',
                formatPercentage((metrics.technology?.input || 0) * 100),
                formatPercentage((metrics.technology?.weight || 0) * 100),
                formatPercentage((metrics.technology?.weightedScore || 0) * 100)
            ]
        ];

        doc.autoTable({
            startY: yPos,
            head: [metricData[0]],
            body: metricData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 20, right: 20 }
        });

        yPos = doc.lastAutoTable.finalY + 15;
    }

    // Check if we need a new page
    if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
    }

    // Strengths Section
    if (deal.fitScore?.strengths && deal.fitScore.strengths.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Strengths', 20, yPos);
        addSpace(8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        deal.fitScore.strengths.forEach((strength, index) => {
            const lines = doc.splitTextToSize(`• ${strength}`, pageWidth - 50);
            doc.text(lines, 25, yPos);
            yPos += lines.length * 5 + 2;
        });
        addSpace(10);
    }

    // Risks Section
    if (deal.fitScore?.risks && deal.fitScore.risks.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Risks', 20, yPos);
        addSpace(8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        deal.fitScore.risks.forEach((risk, index) => {
            const lines = doc.splitTextToSize(`• ${risk}`, pageWidth - 50);
            doc.text(lines, 25, yPos);
            yPos += lines.length * 5 + 2;
        });
        addSpace(10);
    }

    // Recommendations Section
    if (deal.fitScore?.recommendations && deal.fitScore.recommendations.length > 0) {
        // Check if we need a new page
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Recommendations', 20, yPos);
        addSpace(8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        deal.fitScore.recommendations.forEach((rec, index) => {
            const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 50);
            doc.text(lines, 25, yPos);
            yPos += lines.length * 5 + 2;
        });
    }

    // Footer on every page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `Generated on ${formatDate(new Date())} | Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save(`${deal.dealName.replace(/\s+/g, '_')}_FitScore_Analysis.pdf`);
};

export const exportToJSON = (deal) => {
    const dataStr = JSON.stringify(deal, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${deal.dealName.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
