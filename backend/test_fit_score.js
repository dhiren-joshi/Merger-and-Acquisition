import fitScoreService from './src/services/fitScoreService.js';
import { DEAL_TYPES } from './src/utils/constants.js';

const emptyDeal = {
    dealType: DEAL_TYPES.TECH_ACQUISITION,
    industryMatch: { targetMarketShare: '', acquirerMarketShare: '' },
    financials: { target: { revenue: '' }, acquirer: { revenue: '' } },
    cultural: {},
    technology: {}
};

try {
    const score = fitScoreService.calculateFitScore(emptyDeal);
    console.log('Calculation successful:', JSON.stringify(score, null, 2));

    if (Number.isFinite(score.rawFitScore)) {
        console.log('PASS: rawFitScore is finite number');
    } else {
        console.error('FAIL: rawFitScore is', score.rawFitScore);
    }
} catch (error) {
    console.error('Calculation failed:', error);
}
