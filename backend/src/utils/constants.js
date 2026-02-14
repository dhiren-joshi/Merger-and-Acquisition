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

// Fit Score Weights by Deal Type
export const FIT_SCORE_WEIGHTS = {
    [DEAL_TYPES.TECH_ACQUISITION]: {
        industryMatch: 0.15,
        financials: 0.15,
        cultural: 0.10,
        technology: 0.60
    },
    [DEAL_TYPES.MARKET_EXPANSION]: {
        industryMatch: 0.50,
        financials: 0.20,
        cultural: 0.20,
        technology: 0.10
    },
    [DEAL_TYPES.TALENT_ACQUISITION]: {
        industryMatch: 0.10,
        financials: 0.10,
        cultural: 0.50,
        technology: 0.30
    },
    [DEAL_TYPES.DISTRESSED_BUY]: {
        industryMatch: 0.05,
        financials: 0.70,
        cultural: 0.15,
        technology: 0.10
    }
};

// Fit Score Categories
export const FIT_SCORE_CATEGORIES = {
    STRONG: { min: 81, max: 100, label: 'Strong Fit', description: 'Highly Recommended - Proceed with confidence' },
    GOOD: { min: 61, max: 80, label: 'Good Fit', description: 'Recommended - Proceed with caution' },
    MODERATE: { min: 41, max: 60, label: 'Moderate Fit', description: 'Consider - Thorough due diligence required' },
    WEAK: { min: 21, max: 40, label: 'Weak Fit', description: 'Risky - Significant concerns to address' },
    POOR: { min: 0, max: 20, label: 'Poor Fit', description: 'Not Recommended - Consider alternatives' }
};

// User Roles (Manager and Analyst only)
export const USER_ROLES = {
    MANAGER: 'Manager',
    ANALYST: 'Analyst'
};

// Assignment Status (for Phase 2)
export const ASSIGNMENT_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    REASSIGNED: 'Reassigned'
};

// Cash Flow Status Options
export const CASH_FLOW_STATUS = {
    STRONG_POSITIVE: 'Strong positive',
    POSITIVE: 'Positive',
    NEUTRAL: 'Neutral',
    NEGATIVE: 'Negative',
    STRONG_NEGATIVE: 'Strong negative'
};

// Organizational Structures
export const ORG_STRUCTURES = {
    FLAT: 'Flat',
    HIERARCHICAL: 'Hierarchical',
    MATRIX: 'Matrix',
    OTHER: 'Other'
};

// Management Styles
export const MANAGEMENT_STYLES = {
    AUTOCRATIC: 'Autocratic',
    DEMOCRATIC: 'Democratic',
    LAISSEZ_FAIRE: 'Laissez-faire',
    SITUATIONAL: 'Situational'
};

// Talent Retention Risk
export const TALENT_RETENTION_RISK = {
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
    CRITICAL: 'Critical'
};

// Infrastructure Types
export const INFRASTRUCTURE_TYPES = {
    CLOUD: 'Cloud',
    ON_PREMISE: 'On-Premise',
    HYBRID: 'Hybrid'
};

// Development Methodologies
export const DEV_METHODOLOGIES = {
    AGILE: 'Agile',
    WATERFALL: 'Waterfall',
    DEVOPS: 'DevOps',
    OTHER: 'Other'
};

// Strategic Motives
export const STRATEGIC_MOTIVES = {
    EXPLOITATION: 'Exploitation',
    EXPLORATION: 'Exploration'
};
