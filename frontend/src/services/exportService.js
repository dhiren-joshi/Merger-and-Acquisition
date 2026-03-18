import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { getFitScoreCategory } from '../utils/constants';

/**
 * Enhanced PDF Export with Visual Charts
 */
export const exportToPDF = async (deal) => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let yPos = margin;

        // Helper function to check and handle page breaks
        const checkPageBreak = (requiredSpace) => {
            if (yPos + requiredSpace > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
                return true;
            }
            return false;
        };

        // ===== PAGE 1: HEADER AND SUMMARY =====

        // Title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55); // gray-900
        doc.text('M&A Fit Score Analysis', pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;

        // Company Name
        doc.setFontSize(18);
        doc.setTextColor(79, 70, 229); // primary-600
        doc.text(deal.targetCompanyName, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Deal Info
        doc.setFontSize(11);
        doc.setTextColor(107, 114, 128); // gray-500
        doc.text(`${deal.dealName} • ${deal.dealType}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;

        // Separator
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        // Fit Score Display Box
        const fitScore = Math.round(deal.fitScore?.adjustedFitScore || 0);
        const category = getFitScoreCategory(fitScore);

        // Score color based on value
        let scoreColor = [220, 38, 38]; // red
        if (fitScore >= 81) scoreColor = [34, 197, 94]; // green
        else if (fitScore >= 61) scoreColor = [59, 130, 246]; // blue
        else if (fitScore >= 41) scoreColor = [251, 146, 60]; // orange

        doc.setFillColor(249, 250, 251); // gray-50
        doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');

        doc.setFontSize(14);
        doc.setTextColor(75, 85, 99); // gray-600
        doc.text('Overall Fit Score', pageWidth / 2, yPos + 10, { align: 'center' });

        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...scoreColor);
        doc.text(`${fitScore}`, pageWidth / 2, yPos + 25, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(category, pageWidth / 2, yPos + 31, { align: 'center' });
        yPos += 45;

        // ===== DEAL INFORMATION TABLE =====
        checkPageBreak(40);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Deal Information', margin, yPos);
        yPos += 8;

        const dealInfo = [
            ['Deal Value', deal.dealValue ? formatCurrency(deal.dealValue) : 'N/A'],
            ['Current Stage', deal.currentStage || 'N/A'],
            ['Deal Type', deal.dealType || 'N/A'],
            ['Created', formatDate(deal.createdAt)],
            ['Last Updated', formatDate(deal.updatedAt)]
        ];

        autoTable(doc, {
            startY: yPos,
            body: dealInfo,
            theme: 'plain',
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50, textColor: [75, 85, 99] },
                1: { cellWidth: 'auto', textColor: [31, 41, 55] }
            },
            margin: { left: margin, right: margin },
            styles: { fontSize: 10 }
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // ===== METRIC BREAKDOWN TABLE =====
        checkPageBreak(50);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Metric Breakdown', margin, yPos);
        yPos += 8;

        if (deal.fitScore?.metricBreakdown) {
            const metrics = deal.fitScore.metricBreakdown;

            // Updated metric names to match current schema
            const metricData = [
                ['Metric', 'Raw Score', 'Weight', 'Weighted Score'],
                [
                    'Industry Match',
                    Math.round((metrics.industryMatch?.input || 0) * 100),
                    `${Math.round((metrics.industryMatch?.weight || 0) * 100)}%`,
                    Math.round((metrics.industryMatch?.weightedScore || 0) * 100)
                ],
                [
                    'Financial Health',
                    Math.round((metrics.financials?.input || 0) * 100),
                    `${Math.round((metrics.financials?.weight || 0) * 100)}%`,
                    Math.round((metrics.financials?.weightedScore || 0) * 100)
                ],
                [
                    'Cultural Fit',
                    Math.round((metrics.cultural?.input || 0) * 100),
                    `${Math.round((metrics.cultural?.weight || 0) * 100)}%`,
                    Math.round((metrics.cultural?.weightedScore || 0) * 100)
                ],
                [
                    'Technology Compatibility',
                    Math.round((metrics.technology?.input || 0) * 100),
                    `${Math.round((metrics.technology?.weight || 0) * 100)}%`,
                    Math.round((metrics.technology?.weightedScore || 0) * 100)
                ]
            ];

            autoTable(doc, {
                startY: yPos,
                head: [metricData[0]],
                body: metricData.slice(1),
                theme: 'striped',
                headStyles: {
                    fillColor: [79, 70, 229], // primary-600
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                bodyStyles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [249, 250, 251] },
                margin: { left: margin, right: margin }
            });

            yPos = doc.lastAutoTable.finalY + 15;
        }

        // ===== VISUAL CHARTS (if available) =====
        try {
            // Capture Circular Gauge
            const gaugeElement = document.querySelector('[data-testid="circular-gauge"]') ||
                document.querySelector('.circular-gauge');

            if (gaugeElement) {
                checkPageBreak(80);

                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(31, 41, 55);
                doc.text('Visual Score Representation', margin, yPos);
                yPos += 8;

                const canvas = await html2canvas(gaugeElement, {
                    scale: 2,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 60;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                doc.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 10;
            }
        } catch (error) {
            console.warn('Could not capture gauge chart:', error);
        }

        // ===== KEY INSIGHTS =====
        checkPageBreak(20);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Key Insights', margin, yPos);
        yPos += 10;

        // Strengths
        if (deal.fitScore?.strengths && deal.fitScore.strengths.length > 0) {
            checkPageBreak(20);

            doc.setFontSize(12);
            doc.setTextColor(22, 163, 74); // green-600
            doc.text('✓ Strengths', margin, yPos);
            yPos += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81); // gray-700

            deal.fitScore.strengths.forEach((strength, index) => {
                checkPageBreak(10);
                const lines = doc.splitTextToSize(`• ${strength}`, pageWidth - (margin * 2) - 5);
                doc.text(lines, margin + 3, yPos);
                yPos += lines.length * 4 + 2;
            });
            yPos += 5;
        }

        // Risks
        if (deal.fitScore?.risks && deal.fitScore.risks.length > 0) {
            checkPageBreak(20);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38); // red-600
            doc.text('⚠ Risks', margin, yPos);
            yPos += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);

            deal.fitScore.risks.forEach((risk, index) => {
                checkPageBreak(10);
                const lines = doc.splitTextToSize(`• ${risk}`, pageWidth - (margin * 2) - 5);
                doc.text(lines, margin + 3, yPos);
                yPos += lines.length * 4 + 2;
            });
            yPos += 5;
        }

        // Recommendations
        if (deal.fitScore?.recommendations && deal.fitScore.recommendations.length > 0) {
            checkPageBreak(20);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(79, 70, 229); // primary-600
            doc.text('→ Recommendations', margin, yPos);
            yPos += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);

            deal.fitScore.recommendations.forEach((rec, index) => {
                checkPageBreak(10);
                const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - (margin * 2) - 5);
                doc.text(lines, margin + 3, yPos);
                yPos += lines.length * 4 + 2;
            });
        }

        // ===== FOOTER ON EVERY PAGE =====
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(156, 163, 175); // gray-400

            doc.text(
                `Generated on ${formatDate(new Date())}`,
                margin,
                pageHeight - 10
            );

            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );

            doc.text(
                'M&A Platform',
                pageWidth - margin,
                pageHeight - 10,
                { align: 'right' }
            );
        }

        // Save the PDF using explicit blob download for reliable MIME type
        const fileName = `${deal.targetCompanyName.replace(/\s+/g, '_')}_FitScore_${new Date().getTime()}.pdf`;
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        return true;
    } catch (error) {
        console.error('PDF export error:', error);
        throw error;
    }
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
