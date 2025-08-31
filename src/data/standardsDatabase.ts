// Comprehensive regulatory standards database with detailed content
export interface StandardSection {
  id: string
  title: string
  description: string
  requirements: string[]
  keyPoints: string[]
  commonPitfalls: string[]
  auditFocus: string[]
  relatedSections?: string[]
  complianceLevel: 'basic' | 'intermediate' | 'advanced'
  estimatedHours: number
}

export interface RegulatoryStandard {
  id: string
  name: string
  fullName: string
  region: string
  category: string
  description: string
  effectiveDate: string
  lastUpdated: string
  applicability: string[]
  keyBenefits: string[]
  implementationTips: string[]
  commonChallenges: string[]
  relatedStandards: string[]
  estimatedImplementationTime: string
  sections: StandardSection[]
  tags: string[]
  riskLevel: 'low' | 'medium' | 'high'
  industryFocus: string[]
}

export const comprehensiveStandardsDatabase: RegulatoryStandard[] = [
  {
    id: 'FDA_QSR',
    name: 'FDA 21 CFR Part 820',
    fullName: 'Quality System Regulation',
    region: 'United States',
    category: 'Medical Devices',
    description: 'The FDA Quality System Regulation (QSR) establishes requirements for medical device manufacturers to ensure devices are safe and effective.',
    effectiveDate: '1996-06-01',
    lastUpdated: '2023-12-01',
    applicability: ['Medical Device Manufacturers', 'Contract Manufacturers', 'Importers', 'Specification Developers'],
    keyBenefits: [
      'FDA compliance and market access',
      'Improved product quality and safety',
      'Reduced risk of recalls and enforcement actions',
      'Enhanced customer confidence',
      'Systematic approach to quality management'
    ],
    implementationTips: [
      'Start with risk assessment and management planning',
      'Focus on design controls early in development',
      'Establish robust document control systems',
      'Implement comprehensive supplier qualification',
      'Plan for regular internal audits and management reviews'
    ],
    commonChallenges: [
      'Complex design control requirements',
      'Extensive documentation requirements',
      'Supplier qualification and monitoring',
      'Change control procedures',
      'Software validation requirements'
    ],
    relatedStandards: ['ISO_13485', 'ISO_14971', 'IEC_62304'],
    estimatedImplementationTime: '12-18 months',
    tags: ['FDA', 'Medical Devices', 'Quality System', 'US Market'],
    riskLevel: 'high',
    industryFocus: ['Medical Device Manufacturing', 'Healthcare Technology'],
    sections: [
      {
        id: '820.30',
        title: 'Design Controls',
        description: 'Requirements for controlling the design and development of medical devices to ensure they meet user needs and intended uses.',
        requirements: [
          'Design and development planning',
          'Design input requirements',
          'Design output specifications',
          'Design review procedures',
          'Design verification activities',
          'Design validation studies',
          'Design transfer procedures',
          'Design change controls'
        ],
        keyPoints: [
          'Risk-based approach to design control rigor',
          'User needs must be clearly defined and documented',
          'Design outputs must meet design input requirements',
          'Verification ensures design outputs meet input requirements',
          'Validation ensures device meets user needs in actual use'
        ],
        commonPitfalls: [
          'Inadequate design input specifications',
          'Lack of traceability between inputs and outputs',
          'Insufficient design review documentation',
          'Poor change control procedures',
          'Inadequate validation in actual use conditions'
        ],
        auditFocus: [
          'Design control procedures and implementation',
          'Design history file completeness',
          'Traceability of design inputs to outputs',
          'Design review meeting minutes and decisions',
          'Verification and validation protocols and reports'
        ],
        relatedSections: ['820.40', '820.186'],
        complianceLevel: 'advanced',
        estimatedHours: 120
      },
      {
        id: '820.40',
        title: 'Document Controls',
        description: 'Requirements for establishing and maintaining procedures to control all documents and data that pertain to the quality system.',
        requirements: [
          'Document approval and issue procedures',
          'Document review and update procedures',
          'Document change control procedures',
          'Document distribution procedures',
          'Obsolete document control procedures'
        ],
        keyPoints: [
          'All quality system documents must be controlled',
          'Documents must be approved before release',
          'Changes must be reviewed and approved',
          'Current versions must be available at points of use',
          'Obsolete documents must be prevented from unintended use'
        ],
        commonPitfalls: [
          'Using uncontrolled documents in production',
          'Inadequate change control procedures',
          'Poor document version control',
          'Lack of document approval signatures',
          'Obsolete documents not properly removed'
        ],
        auditFocus: [
          'Document control procedures',
          'Current document availability',
          'Change control records',
          'Document approval evidence',
          'Obsolete document control'
        ],
        relatedSections: ['820.30', '820.184'],
        complianceLevel: 'basic',
        estimatedHours: 40
      },
      {
        id: '820.50',
        title: 'Purchasing Controls',
        description: 'Requirements for establishing and maintaining procedures to ensure purchased or otherwise received products and services conform to specified requirements.',
        requirements: [
          'Supplier evaluation and selection procedures',
          'Purchasing data specifications',
          'Supplier agreements and contracts',
          'Receiving, inspection, and testing procedures',
          'Supplier monitoring and re-evaluation procedures'
        ],
        keyPoints: [
          'Suppliers must be evaluated based on their ability to meet requirements',
          'Purchasing documents must contain clear specifications',
          'Purchased products must be inspected or verified',
          'Supplier performance must be monitored',
          'Non-conforming purchased products must be controlled'
        ],
        commonPitfalls: [
          'Inadequate supplier qualification procedures',
          'Unclear purchasing specifications',
          'Insufficient incoming inspection',
          'Poor supplier performance monitoring',
          'Lack of supplier agreements'
        ],
        auditFocus: [
          'Supplier qualification records',
          'Purchasing document adequacy',
          'Incoming inspection procedures',
          'Supplier performance records',
          'Non-conforming product handling'
        ],
        relatedSections: ['820.80', '820.90'],
        complianceLevel: 'intermediate',
        estimatedHours: 60
      },
      {
        id: '820.70',
        title: 'Production and Process Controls',
        description: 'Requirements for establishing and maintaining procedures for production and in-process controls to ensure devices conform to specifications.',
        requirements: [
          'Production and process control procedures',
          'Equipment maintenance and monitoring',
          'Personnel training and qualification',
          'Environmental controls where needed',
          'Process validation where required'
        ],
        keyPoints: [
          'Production must be controlled to ensure consistent output',
          'Equipment must be suitable and properly maintained',
          'Personnel must be qualified for their tasks',
          'Environmental conditions must be controlled when necessary',
          'Processes must be validated when output cannot be verified'
        ],
        commonPitfalls: [
          'Inadequate process control procedures',
          'Poor equipment maintenance',
          'Insufficient personnel training',
          'Lack of environmental controls',
          'Inadequate process validation'
        ],
        auditFocus: [
          'Production control procedures',
          'Equipment maintenance records',
          'Personnel training records',
          'Environmental monitoring data',
          'Process validation protocols'
        ],
        relatedSections: ['820.75', '820.72'],
        complianceLevel: 'intermediate',
        estimatedHours: 80
      },
      {
        id: '820.80',
        title: 'Identification and Traceability',
        description: 'Requirements for establishing and maintaining procedures for identifying products during all stages of production, distribution, and installation.',
        requirements: [
          'Product identification procedures',
          'Traceability procedures where required',
          'Status identification procedures',
          'Installation identification where applicable'
        ],
        keyPoints: [
          'Products must be identified throughout production',
          'Traceability is required for implantable devices',
          'Product status must be identified',
          'Installation records may be required for certain devices'
        ],
        commonPitfalls: [
          'Inadequate product identification',
          'Poor traceability record keeping',
          'Unclear status identification',
          'Missing installation records'
        ],
        auditFocus: [
          'Product identification methods',
          'Traceability record completeness',
          'Status identification clarity',
          'Installation record adequacy'
        ],
        relatedSections: ['820.186', '820.184'],
        complianceLevel: 'basic',
        estimatedHours: 30
      },
      {
        id: '820.90',
        title: 'Nonconforming Product',
        description: 'Requirements for establishing and maintaining procedures to control products that do not conform to specified requirements.',
        requirements: [
          'Nonconformance identification procedures',
          'Nonconformance documentation procedures',
          'Nonconformance evaluation procedures',
          'Disposition decision procedures',
          'Rework and repair procedures where applicable'
        ],
        keyPoints: [
          'Nonconforming products must be identified and segregated',
          'Nonconformances must be documented and investigated',
          'Appropriate disposition must be determined',
          'Rework and repair must be controlled',
          'Effectiveness of corrective actions must be verified'
        ],
        commonPitfalls: [
          'Inadequate nonconformance identification',
          'Poor investigation procedures',
          'Inappropriate disposition decisions',
          'Uncontrolled rework activities',
          'Inadequate corrective action verification'
        ],
        auditFocus: [
          'Nonconformance identification methods',
          'Investigation documentation',
          'Disposition decision rationale',
          'Rework procedure adequacy',
          'Corrective action effectiveness'
        ],
        relatedSections: ['820.100', '820.198'],
        complianceLevel: 'intermediate',
        estimatedHours: 50
      }
    ]
  },
  {
    id: 'ISO_13485',
    name: 'ISO 13485:2016',
    fullName: 'Medical devices - Quality management systems - Requirements for regulatory purposes',
    region: 'International',
    category: 'Medical Devices',
    description: 'ISO 13485 specifies requirements for a quality management system where an organization needs to demonstrate its ability to provide medical devices that consistently meet customer and applicable regulatory requirements.',
    effectiveDate: '2016-03-01',
    lastUpdated: '2023-11-01',
    applicability: ['Medical Device Manufacturers', 'Service Providers', 'Distributors', 'Importers'],
    keyBenefits: [
      'International market access and recognition',
      'Harmonized quality management approach',
      'Risk-based thinking integration',
      'Regulatory compliance framework',
      'Continuous improvement processes'
    ],
    implementationTips: [
      'Understand regulatory requirements in target markets',
      'Implement risk-based thinking throughout the QMS',
      'Focus on document control and record keeping',
      'Establish effective management review processes',
      'Plan for third-party certification audits'
    ],
    commonChallenges: [
      'Complex regulatory requirements interpretation',
      'Risk management integration',
      'Document and record control',
      'Management review effectiveness',
      'Corrective and preventive action systems'
    ],
    relatedStandards: ['FDA_QSR', 'ISO_14971', 'ISO_9001'],
    estimatedImplementationTime: '9-15 months',
    tags: ['ISO', 'Medical Devices', 'Quality Management', 'International'],
    riskLevel: 'medium',
    industryFocus: ['Medical Device Manufacturing', 'Healthcare Technology', 'Biotechnology'],
    sections: [
      {
        id: '4.1',
        title: 'General Requirements',
        description: 'General requirements for establishing, implementing, maintaining and continually improving a quality management system.',
        requirements: [
          'Quality management system establishment',
          'Process identification and management',
          'Resource provision',
          'Risk-based thinking application',
          'Continual improvement'
        ],
        keyPoints: [
          'QMS must be appropriate to the organization and its context',
          'Processes must be identified, documented, and managed',
          'Risk-based thinking must be applied throughout',
          'Continual improvement must be demonstrated',
          'Top management commitment is essential'
        ],
        commonPitfalls: [
          'Inadequate process identification',
          'Poor risk-based thinking application',
          'Lack of management commitment',
          'Insufficient resource allocation',
          'Weak continual improvement processes'
        ],
        auditFocus: [
          'QMS scope and boundaries',
          'Process identification and interaction',
          'Risk-based thinking evidence',
          'Management commitment demonstration',
          'Continual improvement records'
        ],
        complianceLevel: 'basic',
        estimatedHours: 60
      },
      {
        id: '7.3',
        title: 'Design and Development',
        description: 'Requirements for controlling the design and development of medical devices.',
        requirements: [
          'Design and development planning',
          'Design and development inputs',
          'Design and development outputs',
          'Design and development review',
          'Design and development verification',
          'Design and development validation',
          'Design and development changes'
        ],
        keyPoints: [
          'Design planning must consider regulatory requirements',
          'Design inputs must be complete and unambiguous',
          'Design outputs must meet input requirements',
          'Regular design reviews must be conducted',
          'Verification and validation must be appropriate'
        ],
        commonPitfalls: [
          'Incomplete design inputs',
          'Inadequate design reviews',
          'Insufficient verification activities',
          'Poor validation in actual use conditions',
          'Weak change control procedures'
        ],
        auditFocus: [
          'Design planning adequacy',
          'Design input completeness',
          'Design output verification',
          'Design review effectiveness',
          'Validation in use conditions'
        ],
        relatedSections: ['4.1', '8.2'],
        complianceLevel: 'advanced',
        estimatedHours: 100
      },
      {
        id: '8.2',
        title: 'Monitoring and Measurement',
        description: 'Requirements for monitoring and measuring processes, products, and the quality management system.',
        requirements: [
          'Customer satisfaction monitoring',
          'Internal audit program',
          'Process monitoring and measurement',
          'Product monitoring and measurement',
          'Measurement equipment control'
        ],
        keyPoints: [
          'Customer satisfaction must be monitored',
          'Internal audits must be planned and conducted',
          'Processes must be monitored for effectiveness',
          'Products must be measured against requirements',
          'Measurement equipment must be controlled'
        ],
        commonPitfalls: [
          'Inadequate customer satisfaction monitoring',
          'Poor internal audit planning',
          'Insufficient process monitoring',
          'Inadequate product measurement',
          'Poor measurement equipment control'
        ],
        auditFocus: [
          'Customer satisfaction data',
          'Internal audit program',
          'Process monitoring methods',
          'Product measurement records',
          'Equipment calibration records'
        ],
        relatedSections: ['8.3', '8.4'],
        complianceLevel: 'intermediate',
        estimatedHours: 70
      },
      {
        id: '8.3',
        title: 'Control of Nonconforming Product',
        description: 'Requirements for controlling products that do not conform to specified requirements.',
        requirements: [
          'Nonconformance identification',
          'Nonconformance control procedures',
          'Disposition decision making',
          'Corrective action implementation',
          'Record keeping requirements'
        ],
        keyPoints: [
          'Nonconforming products must be identified and controlled',
          'Appropriate disposition must be determined',
          'Corrective actions must address root causes',
          'Records of nonconformances must be maintained',
          'Effectiveness of actions must be verified'
        ],
        commonPitfalls: [
          'Poor nonconformance identification',
          'Inadequate root cause analysis',
          'Ineffective corrective actions',
          'Poor record keeping',
          'Lack of effectiveness verification'
        ],
        auditFocus: [
          'Nonconformance identification methods',
          'Disposition decision rationale',
          'Corrective action adequacy',
          'Record completeness',
          'Effectiveness verification'
        ],
        relatedSections: ['8.4', '8.5'],
        complianceLevel: 'intermediate',
        estimatedHours: 50
      }
    ]
  },
  {
    id: 'EU_MDR',
    name: 'EU MDR 2017/745',
    fullName: 'Medical Device Regulation (EU) 2017/745',
    region: 'European Union',
    category: 'Medical Devices',
    description: 'The European Medical Device Regulation establishes requirements for placing medical devices on the EU market, ensuring high level of safety and health protection.',
    effectiveDate: '2021-05-26',
    lastUpdated: '2023-10-01',
    applicability: ['Medical Device Manufacturers', 'Authorized Representatives', 'Importers', 'Distributors', 'Notified Bodies'],
    keyBenefits: [
      'EU market access for medical devices',
      'Enhanced patient safety and device performance',
      'Increased transparency and traceability',
      'Harmonized regulatory framework across EU',
      'Improved post-market surveillance'
    ],
    implementationTips: [
      'Establish comprehensive technical documentation',
      'Implement robust post-market surveillance',
      'Ensure proper classification and conformity assessment',
      'Establish authorized representative if needed',
      'Plan for UDI system implementation'
    ],
    commonChallenges: [
      'Complex technical documentation requirements',
      'Post-market surveillance obligations',
      'Clinical evidence requirements',
      'UDI system implementation',
      'Notified body capacity constraints'
    ],
    relatedStandards: ['ISO_13485', 'ISO_14971', 'IEC_62304'],
    estimatedImplementationTime: '18-24 months',
    tags: ['EU', 'Medical Devices', 'CE Marking', 'European Market'],
    riskLevel: 'high',
    industryFocus: ['Medical Device Manufacturing', 'Healthcare Technology', 'Diagnostics'],
    sections: [
      {
        id: 'Annex_I',
        title: 'General Safety and Performance Requirements',
        description: 'Essential requirements that medical devices must meet to ensure safety and performance.',
        requirements: [
          'General safety and performance requirements',
          'Requirements regarding design and construction',
          'Requirements regarding information supplied with device',
          'Requirements regarding clinical evaluation and post-market clinical follow-up'
        ],
        keyPoints: [
          'Devices must be safe and perform as intended',
          'Benefits must outweigh risks',
          'Design must eliminate or reduce risks',
          'Information must be clear and understandable',
          'Clinical evidence must support safety and performance'
        ],
        commonPitfalls: [
          'Inadequate risk-benefit analysis',
          'Poor clinical evidence',
          'Unclear labeling and instructions',
          'Insufficient usability considerations',
          'Weak post-market surveillance planning'
        ],
        auditFocus: [
          'Risk management documentation',
          'Clinical evaluation reports',
          'Labeling and instructions adequacy',
          'Usability engineering evidence',
          'Post-market surveillance plan'
        ],
        complianceLevel: 'advanced',
        estimatedHours: 150
      },
      {
        id: 'Annex_II',
        title: 'Technical Documentation',
        description: 'Requirements for technical documentation that demonstrates conformity with essential requirements.',
        requirements: [
          'Device description and intended purpose',
          'Risk management documentation',
          'Design and manufacturing information',
          'Clinical evaluation documentation',
          'Post-market surveillance plan'
        ],
        keyPoints: [
          'Documentation must be comprehensive and current',
          'All essential requirements must be addressed',
          'Clinical data must support intended use',
          'Manufacturing process must be documented',
          'Post-market data must be planned and collected'
        ],
        commonPitfalls: [
          'Incomplete technical documentation',
          'Outdated clinical data',
          'Poor manufacturing documentation',
          'Inadequate post-market planning',
          'Weak regulatory compliance documentation'
        ],
        auditFocus: [
          'Technical documentation completeness',
          'Clinical evaluation adequacy',
          'Manufacturing process documentation',
          'Post-market surveillance planning',
          'Regulatory compliance evidence'
        ],
        relatedSections: ['Annex_I', 'Annex_III'],
        complianceLevel: 'advanced',
        estimatedHours: 120
      },
      {
        id: 'Annex_III',
        title: 'Conformity Assessment Procedures',
        description: 'Procedures for demonstrating conformity with essential requirements based on device classification.',
        requirements: [
          'Quality management system assessment',
          'Technical documentation assessment',
          'Type examination procedures',
          'Production quality assurance',
          'Product quality assurance'
        ],
        keyPoints: [
          'Conformity assessment route depends on device class',
          'Notified body involvement required for higher risk devices',
          'Quality system must be certified where required',
          'Technical documentation must be assessed',
          'Ongoing surveillance is required'
        ],
        commonPitfalls: [
          'Wrong conformity assessment route selection',
          'Inadequate notified body engagement',
          'Poor quality system implementation',
          'Incomplete technical file',
          'Weak ongoing compliance monitoring'
        ],
        auditFocus: [
          'Conformity assessment route justification',
          'Notified body certificates',
          'Quality system certification',
          'Technical file completeness',
          'Ongoing compliance evidence'
        ],
        relatedSections: ['Annex_II', 'Article_52'],
        complianceLevel: 'advanced',
        estimatedHours: 100
      }
    ]
  },
  {
    id: 'ISO_14971',
    name: 'ISO 14971:2019',
    fullName: 'Medical devices - Application of risk management to medical devices',
    region: 'International',
    category: 'Risk Management',
    description: 'ISO 14971 specifies terminology, principles and a process for risk management of medical devices, including software as a medical device.',
    effectiveDate: '2019-12-01',
    lastUpdated: '2023-09-01',
    applicability: ['Medical Device Manufacturers', 'Software Developers', 'Risk Management Teams', 'Regulatory Affairs'],
    keyBenefits: [
      'Systematic risk management approach',
      'Enhanced patient and user safety',
      'Regulatory compliance support',
      'Improved decision-making processes',
      'Reduced liability and recalls'
    ],
    implementationTips: [
      'Establish comprehensive risk management process',
      'Train team members on risk management principles',
      'Integrate with design and development processes',
      'Maintain risk management file throughout lifecycle',
      'Plan for post-market risk management activities'
    ],
    commonChallenges: [
      'Risk identification completeness',
      'Risk estimation accuracy',
      'Risk control measure effectiveness',
      'Residual risk acceptability',
      'Post-market risk management'
    ],
    relatedStandards: ['ISO_13485', 'FDA_QSR', 'EU_MDR'],
    estimatedImplementationTime: '6-12 months',
    tags: ['ISO', 'Risk Management', 'Medical Devices', 'Safety'],
    riskLevel: 'medium',
    industryFocus: ['Medical Device Manufacturing', 'Software Development', 'Healthcare Technology'],
    sections: [
      {
        id: '4',
        title: 'Risk Management System',
        description: 'Requirements for establishing and maintaining a risk management system.',
        requirements: [
          'Risk management policy establishment',
          'Risk management file creation',
          'Risk management process definition',
          'Competence and training requirements',
          'Risk management plan development'
        ],
        keyPoints: [
          'Top management must establish risk management policy',
          'Risk management file must be maintained',
          'Process must be documented and implemented',
          'Personnel must be competent in risk management',
          'Risk management plan must be device-specific'
        ],
        commonPitfalls: [
          'Inadequate management commitment',
          'Poor risk management file maintenance',
          'Unclear process documentation',
          'Insufficient training',
          'Generic risk management plans'
        ],
        auditFocus: [
          'Risk management policy adequacy',
          'Risk management file completeness',
          'Process documentation clarity',
          'Training records',
          'Risk management plan specificity'
        ],
        complianceLevel: 'basic',
        estimatedHours: 40
      },
      {
        id: '5',
        title: 'Risk Analysis',
        description: 'Requirements for systematic risk analysis throughout the device lifecycle.',
        requirements: [
          'Intended use and reasonably foreseeable misuse identification',
          'Hazard identification',
          'Risk estimation',
          'Risk evaluation criteria establishment'
        ],
        keyPoints: [
          'All intended uses must be identified',
          'Reasonably foreseeable misuse must be considered',
          'Hazards must be systematically identified',
          'Risks must be estimated using appropriate methods',
          'Risk evaluation criteria must be pre-established'
        ],
        commonPitfalls: [
          'Incomplete use scenario identification',
          'Poor hazard identification',
          'Inadequate risk estimation methods',
          'Unclear risk evaluation criteria',
          'Insufficient consideration of use errors'
        ],
        auditFocus: [
          'Use scenario completeness',
          'Hazard identification methods',
          'Risk estimation adequacy',
          'Risk evaluation criteria',
          'Use error consideration'
        ],
        relatedSections: ['6', '7'],
        complianceLevel: 'intermediate',
        estimatedHours: 80
      },
      {
        id: '6',
        title: 'Risk Evaluation',
        description: 'Requirements for evaluating risks against pre-established criteria.',
        requirements: [
          'Risk acceptability determination',
          'Risk-benefit analysis where applicable',
          'Risk evaluation documentation'
        ],
        keyPoints: [
          'Risks must be evaluated against pre-established criteria',
          'Unacceptable risks must be reduced',
          'Risk-benefit analysis may be needed',
          'Risk evaluation must be documented',
          'Multiple risk control options should be considered'
        ],
        commonPitfalls: [
          'Inconsistent risk evaluation',
          'Poor risk-benefit analysis',
          'Inadequate documentation',
          'Failure to consider multiple control options',
          'Unclear acceptability decisions'
        ],
        auditFocus: [
          'Risk evaluation consistency',
          'Risk-benefit analysis adequacy',
          'Documentation completeness',
          'Control option consideration',
          'Acceptability decision rationale'
        ],
        relatedSections: ['5', '7'],
        complianceLevel: 'intermediate',
        estimatedHours: 60
      },
      {
        id: '7',
        title: 'Risk Control',
        description: 'Requirements for implementing risk control measures to reduce unacceptable risks.',
        requirements: [
          'Risk control option analysis',
          'Risk control measure implementation',
          'Residual risk evaluation',
          'Risk-benefit analysis for residual risks',
          'Risk control effectiveness verification'
        ],
        keyPoints: [
          'Risk control measures must follow hierarchy of precedence',
          'Inherently safe design is preferred',
          'Protective measures should be implemented where needed',
          'Information for safety must be provided',
          'Residual risks must be acceptable',
          'New risks from control measures must be considered'
        ],
        commonPitfalls: [
          'Not following control hierarchy',
          'Inadequate control measure implementation',
          'Poor residual risk evaluation',
          'Insufficient verification of effectiveness',
          'Creating new unacceptable risks'
        ],
        auditFocus: [
          'Control hierarchy application',
          'Control measure adequacy',
          'Residual risk acceptability',
          'Effectiveness verification',
          'New risk consideration'
        ],
        relatedSections: ['6', '8'],
        complianceLevel: 'advanced',
        estimatedHours: 100
      }
    ]
  }
]

export const getStandardById = (id: string): RegulatoryStandard | undefined => {
  return comprehensiveStandardsDatabase.find(standard => standard.id === id)
}

export const getStandardsByCategory = (category: string): RegulatoryStandard[] => {
  return comprehensiveStandardsDatabase.filter(standard => standard.category === category)
}

export const getStandardsByRegion = (region: string): RegulatoryStandard[] => {
  return comprehensiveStandardsDatabase.filter(standard => standard.region === region)
}

export const getStandardsByIndustry = (industry: string): RegulatoryStandard[] => {
  return comprehensiveStandardsDatabase.filter(standard => 
    standard.industryFocus.includes(industry)
  )
}

export const searchStandards = (query: string): RegulatoryStandard[] => {
  const lowerQuery = query.toLowerCase()
  return comprehensiveStandardsDatabase.filter(standard => 
    standard.name.toLowerCase().includes(lowerQuery) ||
    standard.description.toLowerCase().includes(lowerQuery) ||
    standard.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    standard.sections.some(section => 
      section.title.toLowerCase().includes(lowerQuery) ||
      section.description.toLowerCase().includes(lowerQuery)
    )
  )
}

export const getRelatedStandards = (standardId: string): RegulatoryStandard[] => {
  const standard = getStandardById(standardId)
  if (!standard) return []
  
  return standard.relatedStandards
    .map(id => getStandardById(id))
    .filter(Boolean) as RegulatoryStandard[]
}

export const getSectionById = (standardId: string, sectionId: string): StandardSection | undefined => {
  const standard = getStandardById(standardId)
  if (!standard) return undefined
  
  return standard.sections.find(section => section.id === sectionId)
}