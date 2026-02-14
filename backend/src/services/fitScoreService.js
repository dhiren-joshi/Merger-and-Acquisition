import { FIT_SCORE_WEIGHTS, FIT_SCORE_CATEGORIES, CASH_FLOW_STATUS, TALENT_RETENTION_RISK } from '../utils/constants.js';

/**
 * Fit Score Calculation Service
 * Implements the weighted metric algorithm as per product specification
 */

class FitScoreService {
    /**
     * Calculate fit score for a deal
     * @param {Object} dealData - Complete deal data
     * @param {Object} customWeights - Optional custom weights
     * @returns {Object} Fit score results with breakdown
     */
    calculateFitScore(dealData, customWeights = null) {
        // Step 1: Get weights for deal type
        const weights = customWeights || FIT_SCORE_WEIGHTS[dealData.dealType];

        if (!weights) {
            // Fallback weights if deal type invalid or missing
            return this.getEmptyScore();
        }

        // Helper for safe number
        const safeNum = (num) => Number(num) || 0;

        // Step 2: Normalize each metric to 0-1 scale
        const normalizedMetrics = {
            industryMatch: this.normalizeIndustryMatch(dealData.industryMatch || {}),
            financials: this.normalizeFinancials(dealData.financials || {}),
            cultural: this.normalizeCultural(dealData.cultural || {}),
            technology: this.normalizeTechnology(dealData.technology || {})
        };

        // Step 3: Calculate weighted scores
        const metricBreakdown = {
            industryMatch: {
                input: normalizedMetrics.industryMatch,
                weight: weights.industryMatch,
                weightedScore: normalizedMetrics.industryMatch * weights.industryMatch
            },
            financials: {
                input: normalizedMetrics.financials,
                weight: weights.financials,
                weightedScore: normalizedMetrics.financials * weights.financials
            },
            cultural: {
                input: normalizedMetrics.cultural,
                weight: weights.cultural,
                weightedScore: normalizedMetrics.cultural * weights.cultural
            },
            technology: {
                input: normalizedMetrics.technology,
                weight: weights.technology,
                weightedScore: normalizedMetrics.technology * weights.technology
            }
        };

        // Step 4: Calculate raw fit score (0-100)
        let rawFitScore = (
            metricBreakdown.industryMatch.weightedScore +
            metricBreakdown.financials.weightedScore +
            metricBreakdown.cultural.weightedScore +
            metricBreakdown.technology.weightedScore
        ) * 100;

        // Ensure rawFitScore is a valid finite number
        if (!Number.isFinite(rawFitScore)) rawFitScore = 0;

        // Step 5: Apply contextual modifiers
        const adjustmentFactors = dealData.contextualModifiers || {};
        const adjustedFitScore = this.applyModifiers(rawFitScore, adjustmentFactors);

        // Step 6: Determine category
        const categoryInterpretation = this.getCategoryInterpretation(adjustedFitScore);

        // Step 7: Generate insights
        const strengths = this.generateStrengths(normalizedMetrics, metricBreakdown);
        const risks = this.generateRisks(normalizedMetrics, metricBreakdown);
        const recommendations = this.generateRecommendations(normalizedMetrics, categoryInterpretation);

        return {
            rawFitScore: Math.round(rawFitScore * 100) / 100,
            adjustedFitScore: Math.round(adjustedFitScore * 100) / 100,
            weights,
            metricBreakdown,
            adjustmentFactors,
            categoryInterpretation,
            strengths,
            risks,
            recommendations
        };
    }

    getEmptyScore() {
        return {
            rawFitScore: 0,
            adjustedFitScore: 0,
            weights: {},
            metricBreakdown: {},
            adjustmentFactors: {},
            categoryInterpretation: 'Unknown',
            strengths: [],
            risks: [],
            recommendations: []
        };
    }

    /**
     * Normalize industry match metric (0-1)
     */
    normalizeIndustryMatch(industryData) {
        let score = 0.5; // Base score

        // Same industry bonus
        if (industryData.targetIndustry && industryData.acquirerIndustry &&
            industryData.targetIndustry === industryData.acquirerIndustry) {
            score += 0.3;
        } else if (this.isRelatedIndustry(industryData.targetIndustry, industryData.acquirerIndustry)) {
            score += 0.15;
        }

        // Market share alignment
        const targetShare = Number(industryData.targetMarketShare) || 0;
        const acquirerShare = Number(industryData.acquirerMarketShare) || 0;

        const marketShareDiff = Math.abs(targetShare - acquirerShare);
        if (marketShareDiff < 10) {
            score += 0.15;
        } else if (marketShareDiff < 25) {
            score += 0.08;
        }

        // Strategic motive alignment
        if (industryData.strategicMotive === 'Exploitation') {
            score += 0.05; // Same industry is simpler
        }

        return Math.min(score, 1);
    }

    /**
     * Normalize financial metrics (0-1)
     */
    normalizeFinancials(financialData) {
        let score = 0;
        const target = financialData.target || {};
        const acquirer = financialData.acquirer || {};

        const targetRev = Number(target.revenue) || 0;
        const acquirerRev = Number(acquirer.revenue) || 0;

        // Revenue scale comparison (30% weight)
        // Avoid division by zero
        let revenueRatio = 0;
        if (acquirerRev > 0) {
            revenueRatio = targetRev / acquirerRev;
        }

        if (revenueRatio >= 0.5 && revenueRatio <= 2.0) {
            score += 0.30;
        } else if (revenueRatio >= 0.3 && revenueRatio <= 3.0) {
            score += 0.20;
        } else if (revenueRatio >= 0.2 && revenueRatio <= 5.0) {
            score += 0.10;
        }

        // EBITDA margin alignment (25% weight)
        const targetEbitda = Number(target.ebitda) || 0;
        const acquirerEbitda = Number(acquirer.ebitda) || 0;

        const targetMargin = targetRev > 0 ? targetEbitda / targetRev : 0;
        const acquirerMargin = acquirerRev > 0 ? acquirerEbitda / acquirerRev : 0;
        const marginDiff = Math.abs(targetMargin - acquirerMargin);

        if (marginDiff < 0.05) {
            score += 0.25;
        } else if (marginDiff < 0.10) {
            score += 0.18;
        } else if (marginDiff < 0.20) {
            score += 0.10;
        }

        // Profitability (20% weight)
        const targetProfit = Number(target.netProfit) || 0;
        const acquirerProfit = Number(acquirer.netProfit) || 0;

        if (targetProfit > 0 && acquirerProfit > 0) {
            score += 0.20;
        } else if (targetProfit > 0 || acquirerProfit > 0) {
            score += 0.10;
        }

        // Cash flow status (15% weight)
        const cashFlowScore = this.getCashFlowScore(target.cashFlowStatus);
        score += cashFlowScore * 0.15;

        // Growth rate (10% weight)
        const growthRate = Number(target.growthRate) || 0;
        if (growthRate > 0) {
            score += Math.min(growthRate / 100, 0.10);
        }

        return Math.min(score, 1);
    }

    /**
     * Normalize cultural/operational fit (0-1)
     */
    normalizeCultural(culturalData) {
        let score = 0.3; // Base score

        // Key management strength (30% weight)
        const strength = Number(culturalData.keyManagementStrength) || 5; // Default to 5
        score += (strength / 10) * 0.30;

        // Talent retention risk (30% weight)
        const retentionScore = this.getTalentRetentionScore(culturalData.talentRetentionRisk);
        score += retentionScore * 0.30;

        // Turnover rate (20% weight)
        const turnover = Number(culturalData.turnoverRate) || 0;
        if (turnover < 10) {
            score += 0.20;
        } else if (turnover < 20) {
            score += 0.12;
        } else if (turnover < 30) {
            score += 0.06;
        }

        // Employee count scalability (20% weight)
        const employees = Number(culturalData.employeeCount) || 0;
        if (employees > 0 && employees < 1000) {
            score += 0.20;
        } else if (employees >= 1000) {
            score += 0.10;
        }

        return Math.min(score, 1);
    }

    /**
     * Normalize technology overlap (0-1)
     */
    normalizeTechnology(technologyData) {
        let score = 0;

        // Modernization gap (40% weight)
        const gap = Number(technologyData.modernizationGap) || 5; // Default to 5
        score += (gap / 10) * 0.40;

        // Legacy systems penalty (20% weight)
        if (!technologyData.legacySystems) {
            score += 0.20;
        } else {
            score += 0.08;
        }

        // Infrastructure type (20% weight)
        if (technologyData.infrastructureType === 'Cloud') {
            score += 0.20;
        } else if (technologyData.infrastructureType === 'Hybrid') {
            score += 0.12;
        } else {
            score += 0.05;
        }

        // Security certifications (10% weight)
        const certCount = technologyData.securityCertifications?.length || 0;
        score += Math.min(certCount * 0.025, 0.10);

        // Technology stack diversity (10% weight)
        const techCount = technologyData.primaryTechnologies?.length || 0;
        score += Math.min(techCount * 0.02, 0.10);

        return Math.min(score, 1);
    }

    /**
     * Apply contextual modifiers to raw score
     */
    applyModifiers(rawScore, modifiers) {
        let adjustedScore = rawScore;
        // Ensure modifiers is an object
        if (!modifiers) return rawScore;

        // Market condition modifier
        if (modifiers.marketCondition) {
            adjustedScore *= (1 + (Number(modifiers.marketCondition) || 0) / 100);
        }

        // Integration timeline modifier
        if (modifiers.integrationTimeline) {
            const timelineModifier = this.getTimelineModifier(modifiers.integrationTimeline);
            adjustedScore *= (1 + timelineModifier);
        }

        // Cultural sensitivity modifier
        if (modifiers.culturalSensitivity) {
            const culturalModifier = this.getCulturalModifier(modifiers.culturalSensitivity);
            adjustedScore *= (1 + culturalModifier);
        }

        // Regulatory complexity modifier
        if (modifiers.regulatoryComplexity) {
            const regulatoryModifier = this.getRegulatoryModifier(modifiers.regulatoryComplexity);
            adjustedScore *= (1 + regulatoryModifier);
        }

        const finalScore = Math.max(0, Math.min(100, adjustedScore));
        return Number.isFinite(finalScore) ? finalScore : 0;
    }

    /**
     * Get category interpretation for score
     */
    getCategoryInterpretation(score) {
        // Handle undefined or invalid score
        const safeScore = Number(score) || 0;

        for (const category of Object.values(FIT_SCORE_CATEGORIES)) {
            if (safeScore >= category.min && safeScore <= category.max) {
                return category.label;
            }
        }
        return FIT_SCORE_CATEGORIES.POOR.label;
    }

    /**
     * Generate strengths based on high-scoring metrics
     */
    generateStrengths(normalizedMetrics, metricBreakdown) {
        const strengths = [];

        if (normalizedMetrics.industryMatch > 0.75) {
            strengths.push('Strong industry alignment and strategic fit');
        }
        if (normalizedMetrics.financials > 0.75) {
            strengths.push('Excellent financial compatibility and synergy potential');
        }
        if (normalizedMetrics.cultural > 0.75) {
            strengths.push('High cultural alignment and low integration risk');
        }
        if (normalizedMetrics.technology > 0.75) {
            strengths.push('Superior technology stack compatibility');
        }

        return strengths;
    }

    /**
     * Generate risks based on low-scoring metrics
     */
    generateRisks(normalizedMetrics, metricBreakdown) {
        const risks = [];

        if (normalizedMetrics.industryMatch < 0.5) {
            risks.push('Industry mismatch may limit synergy opportunities');
        }
        if (normalizedMetrics.financials < 0.5) {
            risks.push('Significant financial differences create integration challenges');
        }
        if (normalizedMetrics.cultural < 0.5) {
            risks.push('Cultural incompatibility raises retention and integration concerns');
        }
        if (normalizedMetrics.technology < 0.5) {
            risks.push('Technology stack differences require substantial integration effort');
        }

        return risks;
    }

    /**
     * Generate recommendations based on score and metrics
     */
    generateRecommendations(normalizedMetrics, categoryInterpretation) {
        const recommendations = [];

        if (categoryInterpretation === 'Strong Fit' || categoryInterpretation === 'Good Fit') {
            recommendations.push('Proceed with detailed due diligence');
            recommendations.push('Develop comprehensive integration plan');
        } else if (categoryInterpretation === 'Moderate Fit') {
            recommendations.push('Conduct thorough risk assessment');
            recommendations.push('Identify specific mitigation strategies for low-scoring areas');
        } else {
            recommendations.push('Reassess strategic rationale for this acquisition');
            recommendations.push('Consider alternative targets with higher fit scores');
        }

        // Specific recommendations based on weak areas
        if (normalizedMetrics.cultural < 0.6) {
            recommendations.push('Develop detailed cultural integration and change management plan');
        }
        if (normalizedMetrics.technology < 0.6) {
            recommendations.push('Conduct technology integration assessment and timeline planning');
        }
        if (normalizedMetrics.financials < 0.6) {
            recommendations.push('Perform detailed financial modeling and synergy analysis');
        }

        return recommendations;
    }

    // Helper methods
    isRelatedIndustry(industry1, industry2) {
        // Simplified - in production, would use industry classification codes
        if (!industry1 || !industry2) return false;
        return industry1.split(' ')[0] === industry2.split(' ')[0];
    }

    getCashFlowScore(status) {
        if (!status) return 0.5;
        const scores = {
            [CASH_FLOW_STATUS.STRONG_POSITIVE]: 1.0,
            [CASH_FLOW_STATUS.POSITIVE]: 0.75,
            [CASH_FLOW_STATUS.NEUTRAL]: 0.5,
            [CASH_FLOW_STATUS.NEGATIVE]: 0.25,
            [CASH_FLOW_STATUS.STRONG_NEGATIVE]: 0.0
        };
        return scores[status] || 0.5;
    }

    getTalentRetentionScore(risk) {
        if (!risk) return 0.5;
        const scores = {
            [TALENT_RETENTION_RISK.LOW]: 1.0,
            [TALENT_RETENTION_RISK.MODERATE]: 0.7,
            [TALENT_RETENTION_RISK.HIGH]: 0.4,
            [TALENT_RETENTION_RISK.CRITICAL]: 0.1
        };
        return scores[risk] || 0.5;
    }

    getTimelineModifier(timeline) {
        if (!timeline) return 0;
        const modifiers = {
            'Fast (<6 months)': -0.15,
            'Standard (6-12 months)': 0,
            'Extended (>12 months)': 0.15
        };
        return modifiers[timeline] || 0;
    }

    getCulturalModifier(sensitivity) {
        if (!sensitivity) return 0;
        const modifiers = {
            'High sensitivity required': -0.25,
            'Standard sensitivity': 0,
            'Low sensitivity acceptable': 0.10
        };
        return modifiers[sensitivity] || 0;
    }

    getRegulatoryModifier(complexity) {
        if (!complexity) return 0;
        const modifiers = {
            'High regulatory burden': -0.20,
            'Standard regulatory': 0,
            'Low regulatory burden': 0.05
        };
        return modifiers[complexity] || 0;
    }
}

export default new FitScoreService();

