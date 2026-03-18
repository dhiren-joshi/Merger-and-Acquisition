import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Export comparison to PDF
 */
export const exportComparisonToPDF = async (deals) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        let yOffset = margin;

        // Helper function to add new page if needed
        const checkPageBreak = (requiredSpace) => {
            if (yOffset + requiredSpace > pageHeight - margin) {
                pdf.addPage();
                yOffset = margin;
                return true;
            }
            return false;
        };

        // Title
        pdf.setFontSize(20);
        pdf.setTextColor(31, 41, 55); // gray-900
        pdf.text('Deal Comparison Report', margin, yOffset);
        yOffset += 10;

        // Metadata
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128); // gray-500
        pdf.text(`Generated on ${formatDate(new Date())}`, margin, yOffset);
        pdf.text(`Comparing ${deals.length} deals`, pageWidth - margin - 40, yOffset);
        yOffset += 10;

        // Separator line
        pdf.setDrawColor(229, 231, 235); // gray-200
        pdf.line(margin, yOffset, pageWidth - margin, yOffset);
        yOffset += 8;

        // Summary Section
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text('Summary', margin, yOffset);
        yOffset += 8;

        deals.forEach((deal, index) => {
            checkPageBreak(25);

            pdf.setFontSize(11);
            pdf.setTextColor(17, 24, 39);
            pdf.text(`${index + 1}. ${deal.targetCompanyName}`, margin + 5, yOffset);
            yOffset += 6;

            pdf.setFontSize(9);
            pdf.setTextColor(107, 114, 128);

            const fitScore = Math.round(deal.fitScore?.adjustedFitScore || 0);
            const dealValue = deal.dealValue ? formatCurrency(deal.dealValue) : 'N/A';

            pdf.text(`   Fit Score: ${fitScore}/100`, margin + 5, yOffset);
            yOffset += 5;
            pdf.text(`   Deal Type: ${deal.dealType}`, margin + 5, yOffset);
            yOffset += 5;
            pdf.text(`   Deal Value: ${dealValue}`, margin + 5, yOffset);
            yOffset += 5;
            pdf.text(`   Stage: ${deal.currentStage}`, margin + 5, yOffset);
            yOffset += 7;
        });

        yOffset += 5;

        // Detailed Comparison Table
        checkPageBreak(30);
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text('Detailed Metrics Comparison', margin, yOffset);
        yOffset += 8;

        // Table headers
        const colWidth = contentWidth / (deals.length + 1);
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.setFillColor(79, 70, 229); // primary-600

        pdf.rect(margin, yOffset, colWidth, 7, 'F');
        pdf.text('Metric', margin + 2, yOffset + 5);

        deals.forEach((deal, index) => {
            const x = margin + colWidth * (index + 1);
            pdf.rect(x, yOffset, colWidth, 7, 'F');
            const dealName = deal.targetCompanyName.length > 12
                ? deal.targetCompanyName.substring(0, 12) + '...'
                : deal.targetCompanyName;
            pdf.text(dealName, x + 2, yOffset + 5);
        });
        yOffset += 7;

        // Table rows
        const metrics = [
            { label: 'Fit Score', getValue: (d) => `${Math.round(d.fitScore?.adjustedFitScore || 0)}/100` },
            { label: 'Deal Value', getValue: (d) => d.dealValue ? formatCurrency(d.dealValue) : 'N/A' },
            { label: 'Deal Type', getValue: (d) => d.dealType || 'N/A' },
            { label: 'Stage', getValue: (d) => d.currentStage || 'N/A' },
            { label: 'Industry Match', getValue: (d) => `${Math.round((d.fitScore?.metricBreakdown?.industryMatch?.weightedScore || 0) * 100)}` },
            { label: 'Financials', getValue: (d) => `${Math.round((d.fitScore?.metricBreakdown?.financials?.weightedScore || 0) * 100)}` },
            { label: 'Cultural Fit', getValue: (d) => `${Math.round((d.fitScore?.metricBreakdown?.cultural?.weightedScore || 0) * 100)}` },
            { label: 'Tech Compatibility', getValue: (d) => `${Math.round((d.fitScore?.metricBreakdown?.technology?.weightedScore || 0) * 100)}` },
            { label: 'Revenue', getValue: (d) => d.financials?.target?.revenue ? formatCurrency(d.financials.target.revenue) : 'N/A' },
            { label: 'EBITDA', getValue: (d) => d.financials?.target?.ebitda ? formatCurrency(d.financials.target.ebitda) : 'N/A' },
            { label: 'Growth Rate', getValue: (d) => d.financials?.target?.growthRate ? `${d.financials.target.growthRate}%` : 'N/A' },
        ];

        pdf.setTextColor(55, 65, 81); // gray-700

        metrics.forEach((metric, rowIndex) => {
            checkPageBreak(6);

            const bgColor = rowIndex % 2 === 0 ? [249, 250, 251] : [255, 255, 255]; // gray-50 / white
            pdf.setFillColor(...bgColor);
            pdf.rect(margin, yOffset, contentWidth, 6, 'F');

            pdf.setFontSize(8);
            pdf.text(metric.label, margin + 2, yOffset + 4);

            deals.forEach((deal, colIndex) => {
                const x = margin + colWidth * (colIndex + 1);
                const value = metric.getValue(deal);
                const displayValue = value.length > 15 ? value.substring(0, 15) + '...' : value;
                pdf.text(displayValue, x + 2, yOffset + 4);
            });

            yOffset += 6;
        });

        yOffset += 10;

        // Key Insights Section
        checkPageBreak(30);
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text('Key Insights', margin, yOffset);
        yOffset += 8;

        // Highest Fit Score
        const highestFitDeal = [...deals].sort((a, b) =>
            (b.fitScore?.adjustedFitScore || 0) - (a.fitScore?.adjustedFitScore || 0)
        )[0];

        pdf.setFontSize(10);
        pdf.setTextColor(22, 163, 74); // green-600
        pdf.text('✓ Highest Fit Score:', margin + 5, yOffset);
        pdf.setTextColor(55, 65, 81);
        pdf.text(`${highestFitDeal.targetCompanyName} (${Math.round(highestFitDeal.fitScore?.adjustedFitScore || 0)}/100)`, margin + 40, yOffset);
        yOffset += 7;

        // Highest Value
        const highestValueDeal = [...deals].sort((a, b) =>
            (b.dealValue || 0) - (a.dealValue || 0)
        )[0];

        if (highestValueDeal.dealValue) {
            pdf.setFontSize(10);
            pdf.setTextColor(59, 130, 246); // blue-600
            pdf.text('$ Highest Deal Value:', margin + 5, yOffset);
            pdf.setTextColor(55, 65, 81);
            pdf.text(`${highestValueDeal.targetCompanyName} (${formatCurrency(highestValueDeal.dealValue)})`, margin + 45, yOffset);
            yOffset += 7;
        }

        // Recommendation
        checkPageBreak(20);
        pdf.setFontSize(10);
        pdf.setTextColor(139, 92, 246); // purple-600
        pdf.text('⭐ Recommendation:', margin + 5, yOffset);
        yOffset += 6;

        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99); // gray-600
        const recommendationText = `Based on fit score analysis, ${highestFitDeal.targetCompanyName} presents the strongest strategic fit.`;
        pdf.text(recommendationText, margin + 5, yOffset, { maxWidth: contentWidth - 10 });

        // Footer
        const totalPages = pdf.internal.pages.length - 1; // pages is 1-indexed, first element is metadata
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(156, 163, 175); // gray-400
            pdf.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
            pdf.text(
                'Generated by M&A Platform',
                pageWidth - margin,
                pageHeight - 10,
                { align: 'right' }
            );
        }

        // Save PDF
        const fileName = `deal-comparison-${new Date().getTime()}.pdf`;
        pdf.save(fileName);

        return true;
    } catch (error) {
        console.error('PDF export error:', error);
        throw error;
    }
};

/**
 * Export comparison with charts (uses html2canvas)
 */
export const exportComparisonWithCharts = async (deals) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yOffset = margin;

        // Title
        pdf.setFontSize(20);
        pdf.setTextColor(31, 41, 55);
        pdf.text('Deal Comparison Report', margin, yOffset);
        yOffset += 10;

        // Metadata
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Generated on ${formatDate(new Date())}`, margin, yOffset);
        yOffset += 10;

        // Capture radar chart
        const radarElement = document.querySelector('[data-chart="radar"]');
        if (radarElement) {
            const canvas = await html2canvas(radarElement, {
                scale: 2,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (yOffset + imgHeight > pageHeight - margin) {
                pdf.addPage();
                yOffset = margin;
            }

            pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
            yOffset += imgHeight + 10;
        }

        // Capture comparison table
        const tableElement = document.querySelector('[data-table="comparison"]');
        if (tableElement) {
            const canvas = await html2canvas(tableElement, {
                scale: 2,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (yOffset + imgHeight > pageHeight - margin) {
                pdf.addPage();
                yOffset = margin;
            }

            pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
        }

        // Save PDF
        const fileName = `deal-comparison-charts-${new Date().getTime()}.pdf`;
        pdf.save(fileName);

        return true;
    } catch (error) {
        console.error('PDF export with charts error:', error);
        throw error;
    }
};
