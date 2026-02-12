import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import dealService from '../../services/dealService';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    DEAL_TYPES,
    CASH_FLOW_STATUS,
    ORG_STRUCTURES,
    MANAGEMENT_STYLES,
    TALENT_RETENTION_RISK,
    INFRASTRUCTURE_TYPES,
    DEV_METHODOLOGIES,
    STRATEGIC_MOTIVES
} from '../../utils/constants';

const STEPS = [
    'Basic Information',
    'Industry & Strategic Data',
    'Financial Metrics',
    'Cultural & Operational',
    'Technology Stack',
    'Review & Submit'
];

export default function FitScoreForm() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Basic
        dealName: '',
        targetCompanyName: '',
        dealType: '',
        dealValue: '',
        dealDescription: '',

        // Industry Match
        industryMatch: {
            targetIndustry: '',
            acquirerIndustry: '',
            targetMarketShare: '',
            acquirerMarketShare: '',
            targetMarkets: [],
            strategicMotive: ''
        },

        // Financials
        financials: {
            target: {
                revenue: '',
                ebitda: '',
                netProfit: '',
                debt: '',
                growthRate: '',
                cashFlowStatus: ''
            },
            acquirer: {
                revenue: '',
                ebitda: '',
                netProfit: ''
            }
        },

        // Cultural
        cultural: {
            missionStatement: '',
            organizationalStructure: '',
            managementStyle: '',
            employeeCount: '',
            turnoverRate: '',
            avgCompensation: '',
            keyManagementStrength: 5,
            talentRetentionRisk: ''
        },

        // Technology
        technology: {
            primaryTechnologies: [],
            infrastructureType: '',
            databases: [],
            developmentMethodology: '',
            securityCertifications: [],
            legacySystems: false,
            modernizationGap: 5
        }
    });

    const handleChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleNestedChange = (section, subsection, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };

    const handleArrayChange = (section, field, value) => {
        const values = value.split(',').map(v => v.trim()).filter(v => v);
        handleChange(section, field, values);
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Convert string numbers to numbers
            const processedData = {
                ...formData,
                dealValue: formData.dealValue ? Number(formData.dealValue) : undefined,
                industryMatch: {
                    ...formData.industryMatch,
                    targetMarketShare: Number(formData.industryMatch.targetMarketShare),
                    acquirerMarketShare: Number(formData.industryMatch.acquirerMarketShare)
                },
                financials: {
                    target: {
                        revenue: Number(formData.financials.target.revenue),
                        ebitda: Number(formData.financials.target.ebitda),
                        netProfit: Number(formData.financials.target.netProfit),
                        debt: Number(formData.financials.target.debt),
                        growthRate: Number(formData.financials.target.growthRate),
                        cashFlowStatus: formData.financials.target.cashFlowStatus
                    },
                    acquirer: {
                        revenue: Number(formData.financials.acquirer.revenue),
                        ebitda: Number(formData.financials.acquirer.ebitda),
                        netProfit: Number(formData.financials.acquirer.netProfit)
                    }
                },
                cultural: {
                    ...formData.cultural,
                    employeeCount: Number(formData.cultural.employeeCount),
                    turnoverRate: Number(formData.cultural.turnoverRate),
                    avgCompensation: Number(formData.cultural.avgCompensation),
                    keyManagementStrength: Number(formData.cultural.keyManagementStrength)
                },
                technology: {
                    ...formData.technology,
                    modernizationGap: Number(formData.technology.modernizationGap)
                }
            };

            await dealService.createDeal(processedData);
            toast.success('Deal created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create deal');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Information</h2>

                        <div>
                            <label className="label">Deal Name *</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.dealName}
                                onChange={(e) => handleChange(null, 'dealName', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Target Company Name *</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.targetCompanyName}
                                onChange={(e) => handleChange(null, 'targetCompanyName', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Deal Type *</label>
                            <select
                                className="input"
                                value={formData.dealType}
                                onChange={(e) => handleChange(null, 'dealType', e.target.value)}
                                required
                            >
                                <option value="">Select Deal Type</option>
                                {Object.values(DEAL_TYPES).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Deal Value (Optional)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="e.g., 5000000"
                                value={formData.dealValue}
                                onChange={(e) => handleChange(null, 'dealValue', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="label">Description (Optional)</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.dealDescription}
                                onChange={(e) => handleChange(null, 'dealDescription', e.target.value)}
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry & Strategic Data</h2>

                        <div>
                            <label className="label">Target Industry *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., Software & Technology"
                                value={formData.industryMatch.targetIndustry}
                                onChange={(e) => handleChange('industryMatch', 'targetIndustry', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Acquirer Industry *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., Software & Technology"
                                value={formData.industryMatch.acquirerIndustry}
                                onChange={(e) => handleChange('industryMatch', 'acquirerIndustry', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Target Market Share (%)</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="0"
                                    max="100"
                                    value={formData.industryMatch.targetMarketShare}
                                    onChange={(e) => handleChange('industryMatch', 'targetMarketShare', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">Acquirer Market Share (%)</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="0"
                                    max="100"
                                    value={formData.industryMatch.acquirerMarketShare}
                                    onChange={(e) => handleChange('industryMatch', 'acquirerMarketShare', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Target Markets (comma-separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., North America, Europe, Asia"
                                value={formData.industryMatch.targetMarkets.join(', ')}
                                onChange={(e) => handleArrayChange('industryMatch', 'targetMarkets', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="label">Strategic Motive *</label>
                            <select
                                className="input"
                                value={formData.industryMatch.strategicMotive}
                                onChange={(e) => handleChange('industryMatch', 'strategicMotive', e.target.value)}
                                required
                            >
                                <option value="">Select Motive</option>
                                {STRATEGIC_MOTIVES.map(motive => (
                                    <option key={motive} value={motive}>{motive}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Metrics</h2>

                        <h3 className="text-lg font-semibold text-gray-700 mt-6">Target Company</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Revenue *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.target.revenue}
                                    onChange={(e) => handleNestedChange('financials', 'target', 'revenue', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">EBITDA *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.target.ebitda}
                                    onChange={(e) => handleNestedChange('financials', 'target', 'ebitda', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Net Profit *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.target.netProfit}
                                    onChange={(e) => handleNestedChange('financials', 'target', 'netProfit', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Debt *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.target.debt}
                                    onChange={(e) => handleNestedChange('financials', 'target', 'debt', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Growth Rate (%) *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.target.growthRate}
                                    onChange={(e) => handleNestedChange('financials', 'target', 'growthRate', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Cash Flow Status *</label>
                                <select
                                    className="input"
                                    value={formData.financials.target.cashFlowStatus}
                                    onChange={(e) => handleNestedChange('financials', 'target', 'cashFlowStatus', e.target.value)}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {CASH_FLOW_STATUS.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700 mt-6">Acquirer Company</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="label">Revenue *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.acquirer.revenue}
                                    onChange={(e) => handleNestedChange('financials', 'acquirer', 'revenue', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">EBITDA *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.acquirer.ebitda}
                                    onChange={(e) => handleNestedChange('financials', 'acquirer', 'ebitda', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Net Profit *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.financials.acquirer.netProfit}
                                    onChange={(e) => handleNestedChange('financials', 'acquirer', 'netProfit', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cultural & Operational Fit</h2>

                        <div>
                            <label className="label">Mission Statement (Optional)</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.cultural.missionStatement}
                                onChange={(e) => handleChange('cultural', 'missionStatement', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Organizational Structure *</label>
                                <select
                                    className="input"
                                    value={formData.cultural.organizationalStructure}
                                    onChange={(e) => handleChange('cultural', 'organizationalStructure', e.target.value)}
                                    required
                                >
                                    <option value="">Select Structure</option>
                                    {ORG_STRUCTURES.map(structure => (
                                        <option key={structure} value={structure}>{structure}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Management Style *</label>
                                <select
                                    className="input"
                                    value={formData.cultural.managementStyle}
                                    onChange={(e) => handleChange('cultural', 'managementStyle', e.target.value)}
                                    required
                                >
                                    <option value="">Select Style</option>
                                    {MANAGEMENT_STYLES.map(style => (
                                        <option key={style} value={style}>{style}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Employee Count *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.cultural.employeeCount}
                                    onChange={(e) => handleChange('cultural', 'employeeCount', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Turnover Rate (%) *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.cultural.turnoverRate}
                                    onChange={(e) => handleChange('cultural', 'turnoverRate', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Average Compensation *</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.cultural.avgCompensation}
                                    onChange={(e) => handleChange('cultural', 'avgCompensation', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Talent Retention Risk *</label>
                                <select
                                    className="input"
                                    value={formData.cultural.talentRetentionRisk}
                                    onChange={(e) => handleChange('cultural', 'talentRetentionRisk', e.target.value)}
                                    required
                                >
                                    <option value="">Select Risk Level</option>
                                    {TALENT_RETENTION_RISK.map(risk => (
                                        <option key={risk} value={risk}>{risk}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Key Management Strength (1-10) *</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                className="w-full"
                                value={formData.cultural.keyManagementStrength}
                                onChange={(e) => handleChange('cultural', 'keyManagementStrength', e.target.value)}
                            />
                            <div className="text-center text-2xl font-bold text-primary-600">
                                {formData.cultural.keyManagementStrength}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>

                        <div>
                            <label className="label">Primary Technologies (comma-separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., React, Node.js, Python"
                                value={formData.technology.primaryTechnologies.join(', ')}
                                onChange={(e) => handleArrayChange('technology', 'primaryTechnologies', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="label">Infrastructure Type *</label>
                            <select
                                className="input"
                                value={formData.technology.infrastructureType}
                                onChange={(e) => handleChange('technology', 'infrastructureType', e.target.value)}
                                required
                            >
                                <option value="">Select Infrastructure</option>
                                {INFRASTRUCTURE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Databases (comma-separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., MongoDB, PostgreSQL"
                                value={formData.technology.databases.join(', ')}
                                onChange={(e) => handleArrayChange('technology', 'databases', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="label">Development Methodology *</label>
                            <select
                                className="input"
                                value={formData.technology.developmentMethodology}
                                onChange={(e) => handleChange('technology', 'developmentMethodology', e.target.value)}
                                required
                            >
                                <option value="">Select Methodology</option>
                                {DEV_METHODOLOGIES.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Security Certifications (comma-separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g., ISO 27001, SOC2"
                                value={formData.technology.securityCertifications.join(', ')}
                                onChange={(e) => handleArrayChange('technology', 'securityCertifications', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.technology.legacySystems}
                                    onChange={(e) => handleChange('technology', 'legacySystems', e.target.checked)}
                                />
                                <span>Has Legacy Systems</span>
                            </label>
                        </div>

                        <div>
                            <label className="label">Modernization Gap (1-10) *</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                className="w-full"
                                value={formData.technology.modernizationGap}
                                onChange={(e) => handleChange('technology', 'modernizationGap', e.target.value)}
                            />
                            <div className="text-center text-2xl font-bold text-primary-600">
                                {formData.technology.modernizationGap}
                            </div>
                            <p className="text-sm text-gray-500 text-center">10 = Completely Modern</p>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Submit</h2>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">Basic Information</h3>
                                <p className="text-sm text-gray-600">Deal: {formData.dealName}</p>
                                <p className="text-sm text-gray-600">Target: {formData.targetCompanyName}</p>
                                <p className="text-sm text-gray-600">Type: {formData.dealType}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Industry</h3>
                                <p className="text-sm text-gray-600">Target: {formData.industryMatch.targetIndustry}</p>
                                <p className="text-sm text-gray-600">Acquirer: {formData.industryMatch.acquirerIndustry}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Financials</h3>
                                <p className="text-sm text-gray-600">Target Revenue: ${formData.financials.target.revenue}</p>
                                <p className="text-sm text-gray-600">Growth Rate: {formData.financials.target.growthRate}%</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Cultural</h3>
                                <p className="text-sm text-gray-600">Employees: {formData.cultural.employeeCount}</p>
                                <p className="text-sm text-gray-600">Structure: {formData.cultural.organizationalStructure}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Technology</h3>
                                <p className="text-sm text-gray-600">Infrastructure: {formData.technology.infrastructureType}</p>
                                <p className="text-sm text-gray-600">Methodology: {formData.technology.developmentMethodology}</p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Once submitted, the Fit Score will be automatically calculated based on your inputs.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {STEPS.map((step, index) => (
                        <div
                            key={index}
                            className={`text-xs font-medium ${index === currentStep
                                    ? 'text-primary-600'
                                    : index < currentStep
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                }`}
                        >
                            {index + 1}. {step}
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Form Content */}
            <div className="card mb-6">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                </button>

                {currentStep < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2"
                    >
                        {loading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Create Deal</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
