// Deal Types
export const DEAL_TYPES = {
    TECH_ACQUISITION: 'Tech Acquisition',
    MARKET_EXPANSION: 'Market Expansion',
    TALENT_ACQUISITION: 'Talent Acquisition',
    DISTRESSED_BUY: 'Distressed Buy'
};

// Deal Stages
export const DEAL_STAGES = {
    SOURCING: 'Sourcing',
    EVALUATION: 'Evaluation',
    NEGOTIATION: 'Negotiation',
    CLOSING: 'Closing'
};

// Deal Status
export const DEAL_STATUS = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected'
};

// Cash Flow Status
export const CASH_FLOW_STATUS = [
    'Strong positive',
    'Positive',
    'Neutral',
    'Negative',
    'Strong negative'
];

// Organizational Structures
export const ORG_STRUCTURES = [
    'Flat',
    'Hierarchical',
    'Matrix',
    'Other'
];

// Management Styles
export const MANAGEMENT_STYLES = [
    'Autocratic',
    'Democratic',
    'Laissez-faire',
    'Situational'
];

// Talent Retention Risk
export const TALENT_RETENTION_RISK = [
    'Low',
    'Moderate',
    'High',
    'Critical'
];

// Infrastructure Types
export const INFRASTRUCTURE_TYPES = [
    'Cloud',
    'On-Premise',
    'Hybrid'
];

// Development Methodologies
export const DEV_METHODOLOGIES = [
    'Agile',
    'Waterfall',
    'DevOps',
    'Other'
];

// Strategic Motives
export const STRATEGIC_MOTIVES = [
    'Exploitation',
    'Exploration'
];

// Fit Score Color Mapping
export const FIT_SCORE_COLORS = {
    strong: '#10b981',     // 81-100
    good: '#84cc16',       // 61-80
    moderate: '#f59e0b',   // 41-60
    weak: '#f97316',       // 21-40
    poor: '#ef4444'        // 0-20
};

// Get color based on fit score
export const getFitScoreColor = (score) => {
    if (score >= 81) return FIT_SCORE_COLORS.strong;
    if (score >= 61) return FIT_SCORE_COLORS.good;
    if (score >= 41) return FIT_SCORE_COLORS.moderate;
    if (score >= 21) return FIT_SCORE_COLORS.weak;
    return FIT_SCORE_COLORS.poor;
};

// Get category label
export const getFitScoreCategory = (score) => {
    if (score >= 81) return 'Strong Fit';
    if (score >= 61) return 'Good Fit';
    if (score >= 41) return 'Moderate Fit';
    if (score >= 21) return 'Weak Fit';
    return 'Poor Fit';
};

// API Base URL
export const API_BASE_URL = '/api';
