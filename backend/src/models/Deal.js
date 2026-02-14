import mongoose from 'mongoose';
import {
    DEAL_TYPES,
    DEAL_STAGES,
    DEAL_STATUS,
    CASH_FLOW_STATUS,
    ORG_STRUCTURES,
    MANAGEMENT_STYLES,
    TALENT_RETENTION_RISK,
    INFRASTRUCTURE_TYPES,
    DEV_METHODOLOGIES,
    STRATEGIC_MOTIVES,
    ASSIGNMENT_STATUS
} from '../utils/constants.js';

const dealSchema = new mongoose.Schema({
    // Basic Information
    dealName: {
        type: String,
        required: [true, 'Deal name is required'],
        trim: true
    },
    targetCompanyName: {
        type: String,
        required: [true, 'Target company name is required'],
        trim: true
    },
    dealType: {
        type: String,
        required: [true, 'Deal type is required'],
        enum: Object.values(DEAL_TYPES)
    },
    dealValue: {
        type: Number,
        min: 0
    },
    dealDescription: {
        type: String,
        trim: true
    },

    // Assignment Fields (Phase 2)
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedAt: {
        type: Date
    },
    assignmentStatus: {
        type: String,
        enum: Object.values(ASSIGNMENT_STATUS),
        default: null  // null when unassigned
    },

    expectedCloseDate: {
        type: Date
    },

    // Industry Match Data
    industryMatch: {
        targetIndustry: { type: String, required: true },
        acquirerIndustry: { type: String, required: true },
        targetMarketShare: { type: Number, min: 0, max: 100 },
        acquirerMarketShare: { type: Number, min: 0, max: 100 },
        targetMarkets: [{ type: String }],
        strategicMotive: {
            type: String,
            enum: Object.values(STRATEGIC_MOTIVES)
        }
    },

    // Financial Data
    financials: {
        target: {
            revenue: { type: Number, required: true, min: 0 },
            ebitda: { type: Number, required: true },
            netProfit: { type: Number, required: true },
            debt: { type: Number, required: true, min: 0 },
            growthRate: { type: Number, required: true },
            cashFlowStatus: {
                type: String,
                required: true,
                enum: Object.values(CASH_FLOW_STATUS)
            }
        },
        acquirer: {
            revenue: { type: Number, required: true, min: 0 },
            ebitda: { type: Number, required: true },
            netProfit: { type: Number, required: true }
        }
    },

    // Cultural Data
    cultural: {
        missionStatement: { type: String },
        organizationalStructure: {
            type: String,
            required: true,
            enum: Object.values(ORG_STRUCTURES)
        },
        managementStyle: {
            type: String,
            required: true,
            enum: Object.values(MANAGEMENT_STYLES)
        },
        employeeCount: { type: Number, required: true, min: 0 },
        turnoverRate: { type: Number, required: true, min: 0, max: 100 },
        avgCompensation: { type: Number, required: true, min: 0 },
        keyManagementStrength: { type: Number, required: true, min: 1, max: 10 },
        talentRetentionRisk: {
            type: String,
            required: true,
            enum: Object.values(TALENT_RETENTION_RISK)
        }
    },

    // Technology Data
    technology: {
        primaryTechnologies: [{ type: String }],
        infrastructureType: {
            type: String,
            required: true,
            enum: Object.values(INFRASTRUCTURE_TYPES)
        },
        databases: [{ type: String }],
        developmentMethodology: {
            type: String,
            required: true,
            enum: Object.values(DEV_METHODOLOGIES)
        },
        securityCertifications: [{ type: String }],
        legacySystems: { type: Boolean, default: false },
        modernizationGap: { type: Number, required: true, min: 1, max: 10 }
    },

    // Fit Score Results
    fitScore: {
        rawFitScore: { type: Number, min: 0, max: 100 },
        adjustedFitScore: { type: Number, min: 0, max: 100 },
        weights: {
            industryMatch: { type: Number, min: 0, max: 1 },
            financials: { type: Number, min: 0, max: 1 },
            cultural: { type: Number, min: 0, max: 1 },
            technology: { type: Number, min: 0, max: 1 }
        },
        metricBreakdown: {
            industryMatch: {
                input: { type: Number, min: 0, max: 1 },
                weight: { type: Number, min: 0, max: 1 },
                weightedScore: { type: Number }
            },
            financials: {
                input: { type: Number, min: 0, max: 1 },
                weight: { type: Number, min: 0, max: 1 },
                weightedScore: { type: Number }
            },
            cultural: {
                input: { type: Number, min: 0, max: 1 },
                weight: { type: Number, min: 0, max: 1 },
                weightedScore: { type: Number }
            },
            technology: {
                input: { type: Number, min: 0, max: 1 },
                weight: { type: Number, min: 0, max: 1 },
                weightedScore: { type: Number }
            }
        },
        adjustmentFactors: {
            marketCondition: { type: Number, min: -20, max: 20, default: 0 },
            integrationTimeline: { type: String },
            culturalSensitivity: { type: String },
            regulatoryComplexity: { type: String }
        },
        categoryInterpretation: { type: String },
        strengths: [{ type: String }],
        risks: [{ type: String }],
        recommendations: [{ type: String }]
    },

    // Workflow Status
    currentStage: {
        type: String,
        required: true,
        enum: Object.values(DEAL_STAGES),
        default: DEAL_STAGES.SOURCING
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(DEAL_STATUS),
        default: DEAL_STATUS.ACTIVE
    },

    // Collaboration
    notes: [{
        content: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    attachments: [{
        filename: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],

    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for performance
dealSchema.index({ createdBy: 1 });
dealSchema.index({ assignedTo: 1 }); // For filtering deals by assigned analyst
dealSchema.index({ currentStage: 1 });
dealSchema.index({ dealType: 1 });
dealSchema.index({ 'fitScore.adjustedFitScore': 1 });
dealSchema.index({ createdAt: -1 });
dealSchema.index({ targetCompanyName: 'text', dealName: 'text' });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
