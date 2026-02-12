import * as XLSX from 'xlsx';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';

export const exportToExcel = (deal) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Deal Summary
    const summaryData = [
        ['M&A FIT SCORE ANALYSIS'],
        [''],
        ['Target Company', deal.targetCompanyName],
        ['Deal Name', deal.dealName],
        ['Deal Type', deal.dealType],
        ['Deal Value', deal.dealValue ? formatCurrency(deal.dealValue) : 'N/A'],
        ['Current Stage', deal.currentStage],
        ['Status', deal.status],
        ['Created', formatDate(deal.createdAt)],
        ['Last Updated', formatDate(deal.updatedAt)],
        [''],
        ['FIT SCORE'],
        ['Raw Score', deal.fitScore?.rawFitScore || 'N/A'],
        ['Adjusted Score', deal.fitScore?.adjustedFitScore || 'N/A'],
        ['Category', deal.fitScore?.categoryInterpretation || 'N/A']
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    // Sheet 2: Fit Score Calculations
    if (deal.fitScore?.metricBreakdown) {
        const metrics = deal.fitScore.metricBreakdown;
        const calcData = [
            ['METRIC BREAKDOWN'],
            [''],
            ['Metric', 'Raw Score', 'Weight', 'Weighted Score'],
            [
                'Industry Match',
                (metrics.industryMatch?.input || 0),
                (metrics.industryMatch?.weight || 0),
                (metrics.industryMatch?.weightedScore || 0)
            ],
            [
                'Financials',
                (metrics.financials?.input || 0),
                (metrics.financials?.weight || 0),
                (metrics.financials?.weightedScore || 0)
            ],
            [
                'Cultural Fit',
                (metrics.cultural?.input || 0),
                (metrics.cultural?.weight || 0),
                (metrics.cultural?.weightedScore || 0)
            ],
            [
                'Technology',
                (metrics.technology?.input || 0),
                (metrics.technology?.weight || 0),
                (metrics.technology?.weightedScore || 0)
            ],
            [''],
            ['WEIGHTS'],
            ['Industry Match Weight', deal.fitScore.weights?.industryMatch || 0],
            ['Financials Weight', deal.fitScore.weights?.financials || 0],
            ['Cultural Fit Weight', deal.fitScore.weights?.cultural || 0],
            ['Technology Weight', deal.fitScore.weights?.technology || 0]
        ];

        const ws2 = XLSX.utils.aoa_to_sheet(calcData);
        ws2['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Calculations');
    }

    // Sheet 3: Detailed Data
    const detailData = [
        ['INDUSTRY MATCH'],
        ['Target Industry', deal.industryMatch?.targetIndustry || ''],
        ['Acquirer Industry', deal.industryMatch?.acquirerIndustry || ''],
        ['Target Market Share', deal.industryMatch?.targetMarketShare || ''],
        ['Acquirer Market Share', deal.industryMatch?.acquirerMarketShare || ''],
        ['Strategic Motive', deal.industryMatch?.strategicMotive || ''],
        [''],
        ['FINANCIAL DATA'],
        ['', 'Target', 'Acquirer'],
        ['Revenue', deal.financials?.target?.revenue || 0, deal.financials?.acquirer?.revenue || 0],
        ['EBITDA', deal.financials?.target?.ebitda || 0, deal.financials?.acquirer?.ebitda || 0],
        ['Net Profit', deal.financials?.target?.netProfit || 0, deal.financials?.acquirer?.netProfit || 0],
        ['Debt', deal.financials?.target?.debt || 0, ''],
        ['Growth Rate (%)', deal.financials?.target?.growthRate || 0, ''],
        ['Cash Flow Status', deal.financials?.target?.cashFlowStatus || '', ''],
        [''],
        ['CULTURAL DATA'],
        ['Organizational Structure', deal.cultural?.organizationalStructure || ''],
        ['Management Style', deal.cultural?.managementStyle || ''],
        ['Employee Count', deal.cultural?.employeeCount || ''],
        ['Turnover Rate (%)', deal.cultural?.turnoverRate || ''],
        ['Average Compensation', deal.cultural?.avgCompensation || ''],
        ['Talent Retention Risk', deal.cultural?.talentRetentionRisk || ''],
        [''],
        ['TECHNOLOGY DATA'],
        ['Infrastructure Type', deal.technology?.infrastructureType || ''],
        ['Development Methodology', deal.technology?.developmentMethodology || ''],
        ['Legacy Systems', deal.technology?.legacySystems ? 'Yes' : 'No'],
        ['Modernization Gap (1-10)', deal.technology?.modernizationGap || '']
    ];

    const ws3 = XLSX.utils.aoa_to_sheet(detailData);
    ws3['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Detailed Data');

    // Sheet 4: Insights
    const insightsData = [
        ['STRENGTHS'],
        ...((deal.fitScore?.strengths || []).map(s => [s])),
        [''],
        ['RISKS'],
        ...((deal.fitScore?.risks || []).map(r => [r])),
        [''],
        ['RECOMMENDATIONS'],
        ...((deal.fitScore?.recommendations || []).map(rec => [rec]))
    ];

    const ws4 = XLSX.utils.aoa_to_sheet(insightsData);
    ws4['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Insights');

    // Write the file
    XLSX.writeFile(wb, `${deal.dealName.replace(/\s+/g, '_')}_Analysis.xlsx`);
};
