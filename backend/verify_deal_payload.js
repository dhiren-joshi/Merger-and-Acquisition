import mongoose from 'mongoose';
import Deal from './src/models/Deal.js';
import fitScoreService from './src/services/fitScoreService.js';
import {
    DEAL_TYPES,
    STRATEGIC_MOTIVES,
    ORG_STRUCTURES,
    MANAGEMENT_STYLES,
    TALENT_RETENTION_RISK,
    INFRASTRUCTURE_TYPES,
    DEV_METHODOLOGIES,
    CASH_FLOW_STATUS
} from './src/utils/constants.js';

// Mock specific ObjectId for required fields
const MOCK_USER_ID = new mongoose.Types.ObjectId();

// 1. Simulate the payload from FitScoreForm.jsx
// This exactly matches the structure in handleSubmit()
const simulatedFrontendPayload = {
    dealName: "Test Deal Verification",
    targetCompanyName: "Target Corp",
    dealType: "Tech Acquisition", // Matches string in frontend
    dealValue: 5000000,
    dealDescription: "Test description",

    industryMatch: {
        targetIndustry: "Software",
        acquirerIndustry: "Software",
        targetMarketShare: 15,
        acquirerMarketShare: 25,
        targetMarkets: ["USA", "Europe"],
        strategicMotive: "Exploitation" // Matches string in frontend
    },

    financials: {
        target: {
            revenue: 1000000,
            ebitda: 200000,
            netProfit: 150000,
            debt: 50000,
            growthRate: 10,
            cashFlowStatus: "Positive" // Matches string in frontend
        },
        acquirer: {
            revenue: 5000000,
            ebitda: 1000000,
            netProfit: 800000
        }
    },

    cultural: {
        missionStatement: "To be the best",
        organizationalStructure: "Flat",
        managementStyle: "Democratic",
        employeeCount: 50,
        turnoverRate: 12,
        avgCompensation: 80000,
        keyManagementStrength: 8,
        talentRetentionRisk: "Low"
    },

    technology: {
        primaryTechnologies: ["React", "Node"],
        infrastructureType: "Cloud",
        databases: ["MongoDB"],
        developmentMethodology: "Agile",
        securityCertifications: ["ISO27001"],
        legacySystems: false,
        modernizationGap: 7
    }
};

async function verifyPayload() {
    try {
        console.log("1. Calculating Fit Score...");
        // This tests my recent fix in fitScoreService
        const fitScoreResult = fitScoreService.calculateFitScore(simulatedFrontendPayload);

        console.log("   Fit Score Data:", {
            raw: fitScoreResult.rawFitScore,
            adjusted: fitScoreResult.adjustedFitScore,
            category: fitScoreResult.categoryInterpretation
        });

        console.log("\n2. constructing Deal document...");
        const dealDoc = new Deal({
            ...simulatedFrontendPayload,
            fitScore: fitScoreResult,
            createdBy: MOCK_USER_ID
        });

        console.log("3. Validating against Mongoose Schema...");
        await dealDoc.validate();

        console.log("\n✅ VALIDATION SUCCESS! The payload matches the schema.");
        console.log("If this script passes, but the app fails, the issue is likely:");
        console.log(" - User ID / Auth token missing in request");
        console.log(" - Database connection issues");
        console.log(" - Specific field data being sent as string instead of Number (though schema handles primitive casting)");

    } catch (error) {
        console.error("\n❌ VALIDATION FAILED");
        if (error.name === 'ValidationError') {
            console.error("Validation Errors:");
            Object.keys(error.errors).forEach(key => {
                console.error(` - ${key}: ${error.errors[key].message}`);
                console.error(`   Value: ${error.errors[key].value}`);
            });
        } else {
            console.error(error);
        }
    }
}

verifyPayload();
