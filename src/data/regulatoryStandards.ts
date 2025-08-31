export interface StandardSection {
  id: string
  number: string
  title: string
  content: string
  requirements: string[]
  related?: string[]
  searchableContent?: string[]
  keyTerms?: string[]
}

export interface RegulatoryStandard {
  id: string
  name: string
  fullName: string
  region: string
  category: string
  description: string
  sections: number
  lastUpdated: string
  status: string
  officialUrl?: string
  sections_detail?: StandardSection[]
  keyPoints?: string[]
  applicability?: string[]
  searchableContent?: string[]
  tags?: string[]
  relatedStandards?: string[]
  complianceLevel?: 'Mandatory' | 'Recommended' | 'Optional'
  industry?: string[]
  effectiveDate?: string
  nextReview?: string
}

export const regulatoryStandards: RegulatoryStandard[] = [
  // FDA Standards
  {
    id: 'fda-qsr',
    name: 'FDA 21 CFR Part 820',
    fullName: 'Quality System Regulation for Medical Devices',
    region: 'United States',
    category: 'Medical Devices',
    description: 'Establishes quality system requirements for medical device manufacturers to ensure devices are safe and effective',
    sections: 25,
    lastUpdated: '2023-08-15',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Medical Devices', 'Pharmaceuticals'],
    effectiveDate: '1996-06-01',
    nextReview: '2024-12-01',
    officialUrl: 'https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-system-qs-regulationmedical-device-good-manufacturing-practices',
    keyPoints: [
      'Design controls for Class II and III devices',
      'Risk-based approach to quality management',
      'Document and data controls requirements',
      'Management responsibility and planning',
      'Purchasing and supplier controls',
      'Product identification and traceability',
      'Production and process controls',
      'Acceptance activities and inspection',
      'Nonconforming product management',
      'Corrective and preventive actions (CAPA)',
      'Labeling and packaging controls',
      'Handling, storage, distribution, and installation',
      'Records management and retention',
      'Servicing and complaint handling'
    ],
    applicability: ['Medical Device Manufacturers', 'Contract Manufacturers', 'Importers', 'Distributors'],
    searchableContent: [
      'quality system regulation', 'design controls', 'CAPA', 'corrective preventive action',
      'document control', 'management responsibility', 'risk management', 'validation',
      'verification', 'traceability', 'nonconforming product', 'supplier control'
    ],
    tags: ['FDA', 'QSR', 'Medical Devices', 'Quality Management', 'Design Controls', 'CAPA'],
    relatedStandards: ['iso-13485', 'iso-14971', 'fda-510k'],
    sections_detail: [
      {
        id: '820.30',
        number: '820.30',
        title: 'Design Controls',
        content: 'Each manufacturer of any class III or class II device, and the class I devices listed in section 820.30(a)(2), shall establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.',
        requirements: [
          'Design and development planning (820.30(b))',
          'Design input requirements (820.30(c))',
          'Design output requirements (820.30(d))',
          'Design review procedures (820.30(e))',
          'Design verification (820.30(f))',
          'Design validation (820.30(g))',
          'Design transfer (820.30(h))',
          'Design changes (820.30(i))',
          'Design history file (820.30(j))'
        ],
        related: ['820.40', '820.180', '820.181'],
        searchableContent: [
          'design controls', 'design planning', 'design inputs', 'design outputs',
          'design review', 'verification', 'validation', 'design transfer', 'design history file'
        ],
        keyTerms: ['Design Controls', 'V&V', 'DHF', 'Design Review', 'Design Transfer']
      },
      {
        id: '820.40',
        number: '820.40',
        title: 'Document Controls',
        content: 'Each manufacturer shall establish and maintain procedures to control all documents that are required by this part or that are used by the manufacturer to ensure device quality.',
        requirements: [
          'Document approval and authorization (820.40(a))',
          'Document distribution controls (820.40(b))',
          'Document changes and modifications (820.40(c))',
          'Document obsolescence management (820.40(d))'
        ],
        related: ['820.30', '820.181', '820.186'],
        searchableContent: [
          'document control', 'document approval', 'document distribution', 'document changes',
          'obsolete documents', 'version control', 'authorized personnel'
        ],
        keyTerms: ['Document Control', 'Version Control', 'Authorization', 'Distribution']
      },
      {
        id: '820.50',
        number: '820.50',
        title: 'Purchasing Controls',
        content: 'Each manufacturer shall establish and maintain procedures to ensure that all purchased or otherwise received product and services conform to specified requirements.',
        requirements: [
          'Evaluation of suppliers, contractors, and consultants (820.50(a))',
          'Purchasing data specifications (820.50(b))',
          'Verification of purchased product (820.50(c))'
        ],
        related: ['820.60', '820.80'],
        searchableContent: [
          'purchasing controls', 'supplier evaluation', 'supplier qualification',
          'purchasing data', 'incoming inspection', 'received product verification'
        ],
        keyTerms: ['Supplier Control', 'Purchasing', 'Incoming Inspection', 'Supplier Evaluation']
      },
      {
        id: '820.100',
        number: '820.100',
        title: 'Corrective and Preventive Action',
        content: 'Each manufacturer shall establish and maintain procedures for implementing corrective and preventive action.',
        requirements: [
          'Analysis of quality data to identify existing and potential causes of nonconforming product',
          'Investigation of the cause of nonconformities relating to product, processes, and quality system',
          'Identification of action needed to correct and prevent recurrence of nonconforming product',
          'Verification or validation of the corrective and preventive action',
          'Implementation and recording of changes in methods and procedures',
          'Information on quality problems and corrective and preventive actions shall be disseminated'
        ],
        related: ['820.90', '820.198'],
        searchableContent: [
          'CAPA', 'corrective action', 'preventive action', 'nonconforming product',
          'root cause analysis', 'investigation', 'verification of effectiveness'
        ],
        keyTerms: ['CAPA', 'Root Cause Analysis', 'Corrective Action', 'Preventive Action']
      }
    ]
  },

  // ISO Standards
  {
    id: 'iso-13485',
    name: 'ISO 13485:2016',
    fullName: 'Medical Devices - Quality Management Systems - Requirements for Regulatory Purposes',
    region: 'International',
    category: 'Medical Devices',
    description: 'Specifies requirements for a quality management system where an organization needs to demonstrate its ability to provide medical devices that consistently meet customer and applicable regulatory requirements',
    sections: 42,
    lastUpdated: '2023-09-01',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Medical Devices', 'In Vitro Diagnostics'],
    effectiveDate: '2016-03-01',
    nextReview: '2025-03-01',
    officialUrl: 'https://www.iso.org/standard/59752.html',
    keyPoints: [
      'Risk-based approach to quality management system',
      'Regulatory compliance emphasis throughout',
      'Design and development controls for medical devices',
      'Post-market surveillance requirements',
      'Advisory notices and field safety corrective actions',
      'Statistical techniques for monitoring and measuring',
      'Management review and continual improvement',
      'Documentation and record control requirements'
    ],
    applicability: ['Medical Device Organizations', 'Regulatory Bodies', 'Notified Bodies', 'IVD Manufacturers'],
    searchableContent: [
      'quality management system', 'QMS', 'medical device quality', 'regulatory compliance',
      'post-market surveillance', 'advisory notices', 'field safety corrective action',
      'design and development', 'risk management', 'statistical techniques'
    ],
    tags: ['ISO', 'QMS', 'Medical Devices', 'Quality Management', 'Regulatory'],
    relatedStandards: ['fda-qsr', 'iso-14971', 'iso-9001', 'eu-mdr'],
    sections_detail: [
      {
        id: '7.3',
        number: '7.3',
        title: 'Design and Development',
        content: 'The organization shall plan and control the design and development of the medical device.',
        requirements: [
          'Design and development planning (7.3.2)',
          'Design and development inputs (7.3.3)',
          'Design and development outputs (7.3.4)',
          'Design and development review (7.3.5)',
          'Design and development verification (7.3.6)',
          'Design and development validation (7.3.7)',
          'Control of design and development changes (7.3.8)',
          'Design and development files (7.3.9)'
        ],
        related: ['4.2', '8.2', '7.5'],
        searchableContent: [
          'design and development', 'design planning', 'design inputs', 'design outputs',
          'design review', 'verification', 'validation', 'design files', 'usability engineering'
        ],
        keyTerms: ['Design and Development', 'Usability Engineering', 'Clinical Evaluation', 'Risk Management']
      },
      {
        id: '8.2.1',
        number: '8.2.1',
        title: 'Feedback',
        content: 'The organization shall establish and maintain procedures for feedback as an early warning system for quality problems and for input into the risk management process.',
        requirements: [
          'Procedures for handling feedback from users and other sources',
          'Investigation of feedback related to quality problems',
          'Feedback as input to risk management processes',
          'Trending and analysis of feedback data'
        ],
        related: ['8.2.2', '8.2.3', '8.5'],
        searchableContent: [
          'feedback', 'early warning system', 'quality problems', 'user feedback',
          'complaint handling', 'adverse events', 'trending analysis'
        ],
        keyTerms: ['Feedback', 'Early Warning', 'User Experience', 'Quality Problems']
      },
      {
        id: '8.2.2',
        number: '8.2.2',
        title: 'Complaint Handling',
        content: 'The organization shall establish and maintain procedures for receiving, reviewing and evaluating complaints.',
        requirements: [
          'Procedures for complaint handling process',
          'Investigation requirements for complaints',
          'Evaluation of need for corrective action',
          'Reporting to regulatory authorities when required',
          'Trending and analysis of complaint data'
        ],
        related: ['8.2.1', '8.2.3', '8.5'],
        searchableContent: [
          'complaint handling', 'complaint investigation', 'regulatory reporting',
          'adverse events', 'corrective action', 'trending analysis'
        ],
        keyTerms: ['Complaints', 'Investigation', 'Regulatory Reporting', 'Adverse Events']
      }
    ]
  },

  // EU MDR
  {
    id: 'eu-mdr',
    name: 'EU MDR 2017/745',
    fullName: 'European Medical Device Regulation',
    region: 'European Union',
    category: 'Medical Devices',
    description: 'Regulation on medical devices in the European Union, establishing requirements for placing medical devices on the EU market',
    sections: 123,
    lastUpdated: '2023-07-20',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Medical Devices', 'Active Implantable Medical Devices'],
    effectiveDate: '2021-05-26',
    nextReview: '2027-05-26',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745',
    keyPoints: [
      'Strengthened clinical evidence requirements',
      'Enhanced post-market surveillance obligations',
      'New device classification rules and criteria',
      'Increased transparency through EUDAMED database',
      'Stricter requirements for high-risk devices',
      'Enhanced obligations for economic operators',
      'New requirements for notified bodies',
      'Comprehensive technical documentation requirements'
    ],
    applicability: ['EU Medical Device Manufacturers', 'Authorized Representatives', 'Notified Bodies', 'Importers', 'Distributors'],
    searchableContent: [
      'medical device regulation', 'EU MDR', 'clinical evidence', 'post-market surveillance',
      'EUDAMED', 'notified body', 'conformity assessment', 'CE marking',
      'authorized representative', 'technical documentation', 'clinical investigation'
    ],
    tags: ['EU', 'MDR', 'Medical Devices', 'CE Marking', 'Clinical Evidence', 'EUDAMED'],
    relatedStandards: ['iso-13485', 'iso-14971', 'eu-ivdr', 'mdd-93-42-eec'],
    sections_detail: [
      {
        id: 'article-61',
        number: 'Article 61',
        title: 'Clinical Evidence',
        content: 'Clinical evidence shall be based on clinical data providing sufficient clinical evidence to support the intended use of the device.',
        requirements: [
          'Clinical data from clinical investigations',
          'Clinical data from literature and databases',
          'Clinical data from post-market clinical follow-up',
          'Clinical evaluation plan and report',
          'Demonstration of safety and performance'
        ],
        related: ['article-62', 'article-74', 'annex-xiv'],
        searchableContent: [
          'clinical evidence', 'clinical data', 'clinical investigation', 'clinical evaluation',
          'post-market clinical follow-up', 'safety and performance', 'literature review'
        ],
        keyTerms: ['Clinical Evidence', 'Clinical Data', 'Clinical Evaluation', 'PMCF']
      },
      {
        id: 'article-83',
        number: 'Article 83',
        title: 'Post-Market Surveillance System',
        content: 'Manufacturers shall plan, establish, document, implement, maintain and update a post-market surveillance system.',
        requirements: [
          'Post-market surveillance plan',
          'Collection and analysis of post-market data',
          'Proactive and systematic processes',
          'Risk-based approach to surveillance',
          'Regular review and update of surveillance system'
        ],
        related: ['article-84', 'article-85', 'article-86'],
        searchableContent: [
          'post-market surveillance', 'surveillance plan', 'post-market data',
          'risk-based surveillance', 'proactive surveillance', 'systematic surveillance'
        ],
        keyTerms: ['Post-Market Surveillance', 'PMS Plan', 'Risk-Based Approach']
      }
    ]
  },

  // ISO 14971 Risk Management
  {
    id: 'iso-14971',
    name: 'ISO 14971:2019',
    fullName: 'Medical Devices - Application of Risk Management to Medical Devices',
    region: 'International',
    category: 'Risk Management',
    description: 'Specifies terminology, principles and a process for risk management of medical devices, including software as a medical device',
    sections: 18,
    lastUpdated: '2023-06-10',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Medical Devices', 'Software as Medical Device'],
    effectiveDate: '2019-12-01',
    nextReview: '2024-12-01',
    officialUrl: 'https://www.iso.org/standard/72704.html',
    keyPoints: [
      'Risk management process throughout device lifecycle',
      'Risk analysis and evaluation methodology',
      'Risk control measures implementation',
      'Residual risk evaluation and acceptability',
      'Risk management file documentation',
      'Production and post-production information analysis'
    ],
    applicability: ['Medical Device Manufacturers', 'Risk Managers', 'Quality Professionals', 'Software Developers'],
    searchableContent: [
      'risk management', 'risk analysis', 'risk evaluation', 'risk control',
      'residual risk', 'risk management file', 'hazard identification',
      'risk assessment', 'risk mitigation', 'benefit-risk analysis'
    ],
    tags: ['ISO', 'Risk Management', 'Medical Devices', 'Safety', 'Hazard Analysis'],
    relatedStandards: ['iso-13485', 'fda-qsr', 'iec-62304', 'iso-62366'],
    sections_detail: [
      {
        id: '4',
        number: '4',
        title: 'General Requirements for Risk Management System',
        content: 'The manufacturer shall establish, document and maintain a risk management system.',
        requirements: [
          'Risk management policy establishment',
          'Risk management process definition',
          'Competence and responsibility assignment',
          'Risk management plan development',
          'Risk management file establishment'
        ],
        related: ['5', '6', '7'],
        searchableContent: [
          'risk management system', 'risk management policy', 'risk management plan',
          'competence', 'responsibility', 'risk management file'
        ],
        keyTerms: ['Risk Management System', 'Risk Policy', 'Competence', 'Risk Plan']
      },
      {
        id: '5',
        number: '5',
        title: 'Risk Analysis',
        content: 'The manufacturer shall document the intended use and reasonably foreseeable misuse of the medical device.',
        requirements: [
          'Intended use and reasonably foreseeable misuse identification',
          'Identification of characteristics related to safety',
          'Identification of hazards and hazardous situations',
          'Estimation of risk for each hazardous situation'
        ],
        related: ['4', '6', '7'],
        searchableContent: [
          'risk analysis', 'intended use', 'reasonably foreseeable misuse',
          'hazard identification', 'hazardous situations', 'risk estimation'
        ],
        keyTerms: ['Risk Analysis', 'Hazard Identification', 'Intended Use', 'Misuse']
      }
    ]
  },

  // FDA 510(k)
  {
    id: 'fda-510k',
    name: 'FDA 21 CFR Part 807',
    fullName: 'Establishment Registration and Device Listing for Manufacturers and Initial Importers of Devices',
    region: 'United States',
    category: 'Medical Devices',
    description: 'Requirements for 510(k) premarket notification submissions for medical devices',
    sections: 15,
    lastUpdated: '2023-05-15',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Medical Devices'],
    effectiveDate: '1976-05-28',
    nextReview: '2024-05-28',
    officialUrl: 'https://www.fda.gov/medical-devices/premarket-submissions/premarket-notification-510k',
    keyPoints: [
      'Premarket notification requirements',
      'Substantial equivalence determination',
      'Predicate device identification',
      'Clinical data requirements',
      'Labeling requirements',
      'Quality system information'
    ],
    applicability: ['Medical Device Manufacturers', 'Device Importers', 'FDA Reviewers'],
    searchableContent: [
      '510k', 'premarket notification', 'substantial equivalence', 'predicate device',
      'clinical data', 'labeling', 'quality system', 'FDA submission'
    ],
    tags: ['FDA', '510(k)', 'Premarket', 'Substantial Equivalence', 'Medical Devices'],
    relatedStandards: ['fda-qsr', 'fda-pma', 'iso-13485']
  },

  // IEC 62304 Software
  {
    id: 'iec-62304',
    name: 'IEC 62304:2006',
    fullName: 'Medical Device Software - Software Life Cycle Processes',
    region: 'International',
    category: 'Software',
    description: 'Defines the life cycle requirements for medical device software, ensuring safety and effectiveness',
    sections: 12,
    lastUpdated: '2023-03-20',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Software as Medical Device', 'Medical Device Software'],
    effectiveDate: '2006-05-01',
    nextReview: '2025-05-01',
    officialUrl: 'https://www.iec.ch/publications/iec-62304-medical-device-software-software-life-cycle-processes',
    keyPoints: [
      'Software safety classification (Class A, B, C)',
      'Software development life cycle processes',
      'Risk management integration',
      'Software verification and validation',
      'Configuration management requirements',
      'Problem resolution processes'
    ],
    applicability: ['Software Developers', 'Medical Device Manufacturers', 'Quality Assurance Teams'],
    searchableContent: [
      'medical device software', 'software life cycle', 'software safety classification',
      'verification and validation', 'configuration management', 'problem resolution',
      'software development process', 'Class A B C software'
    ],
    tags: ['IEC', 'Software', 'Medical Device Software', 'Life Cycle', 'Safety Classification'],
    relatedStandards: ['iso-14971', 'iso-13485', 'iec-62366']
  },

  // ISO 62366 Usability
  {
    id: 'iso-62366',
    name: 'IEC 62366-1:2015',
    fullName: 'Medical Devices - Application of Usability Engineering to Medical Devices',
    region: 'International',
    category: 'Usability',
    description: 'Specifies a process for manufacturers to analyze, specify, develop and evaluate the usability of medical devices',
    sections: 14,
    lastUpdated: '2023-04-10',
    status: 'Active',
    complianceLevel: 'Recommended',
    industry: ['Medical Devices', 'Software as Medical Device'],
    effectiveDate: '2015-02-01',
    nextReview: '2025-02-01',
    officialUrl: 'https://www.iec.ch/publications/iec-62366-1-medical-devices-application-usability-engineering-medical-devices',
    keyPoints: [
      'Usability engineering process',
      'Use-related risk analysis',
      'User interface design and evaluation',
      'Formative and summative evaluation',
      'Usability engineering file documentation'
    ],
    applicability: ['UX/UI Designers', 'Medical Device Manufacturers', 'Human Factors Engineers'],
    searchableContent: [
      'usability engineering', 'use-related risk', 'user interface design',
      'formative evaluation', 'summative evaluation', 'usability engineering file',
      'human factors', 'user testing'
    ],
    tags: ['IEC', 'Usability', 'Human Factors', 'User Interface', 'Medical Devices'],
    relatedStandards: ['iso-14971', 'iec-62304', 'iso-13485']
  },

  // EU IVDR
  {
    id: 'eu-ivdr',
    name: 'EU IVDR 2017/746',
    fullName: 'European In Vitro Diagnostic Medical Devices Regulation',
    region: 'European Union',
    category: 'In Vitro Diagnostics',
    description: 'Regulation on in vitro diagnostic medical devices in the European Union',
    sections: 113,
    lastUpdated: '2023-08-01',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['In Vitro Diagnostics', 'Laboratory Diagnostics'],
    effectiveDate: '2022-05-26',
    nextReview: '2027-05-26',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0746',
    keyPoints: [
      'Risk-based classification system',
      'Enhanced clinical evidence requirements',
      'Reference laboratory requirements',
      'Quality management system requirements',
      'Post-market surveillance obligations'
    ],
    applicability: ['IVD Manufacturers', 'Reference Laboratories', 'Notified Bodies'],
    searchableContent: [
      'in vitro diagnostic', 'IVDR', 'reference laboratory', 'clinical evidence',
      'risk classification', 'quality management', 'post-market surveillance'
    ],
    tags: ['EU', 'IVDR', 'In Vitro Diagnostics', 'Reference Laboratory', 'Clinical Evidence'],
    relatedStandards: ['eu-mdr', 'iso-13485', 'iso-15189']
  },

  // GDPR
  {
    id: 'eu-gdpr',
    name: 'EU GDPR 2016/679',
    fullName: 'General Data Protection Regulation',
    region: 'European Union',
    category: 'Data Protection',
    description: 'Regulation on the protection of natural persons with regard to the processing of personal data',
    sections: 99,
    lastUpdated: '2023-09-15',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['All Industries', 'Healthcare', 'Technology'],
    effectiveDate: '2018-05-25',
    nextReview: '2025-05-25',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679',
    keyPoints: [
      'Lawful basis for processing personal data',
      'Data subject rights and freedoms',
      'Data protection by design and by default',
      'Data protection impact assessments',
      'Breach notification requirements',
      'Data protection officer appointments'
    ],
    applicability: ['Data Controllers', 'Data Processors', 'Healthcare Organizations', 'Technology Companies'],
    searchableContent: [
      'GDPR', 'personal data', 'data protection', 'data subject rights',
      'lawful basis', 'data processing', 'privacy by design', 'data breach',
      'data protection officer', 'DPO', 'consent'
    ],
    tags: ['EU', 'GDPR', 'Data Protection', 'Privacy', 'Personal Data'],
    relatedStandards: ['iso-27001', 'hipaa']
  },

  // HIPAA
  {
    id: 'hipaa',
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    region: 'United States',
    category: 'Healthcare Privacy',
    description: 'Federal law that provides data privacy and security provisions for safeguarding medical information',
    sections: 8,
    lastUpdated: '2023-07-01',
    status: 'Active',
    complianceLevel: 'Mandatory',
    industry: ['Healthcare', 'Health Insurance', 'Healthcare Technology'],
    effectiveDate: '2003-04-14',
    nextReview: '2024-04-14',
    officialUrl: 'https://www.hhs.gov/hipaa/index.html',
    keyPoints: [
      'Protected health information (PHI) safeguards',
      'Administrative, physical, and technical safeguards',
      'Business associate agreements',
      'Breach notification requirements',
      'Patient rights and access',
      'Minimum necessary standard'
    ],
    applicability: ['Covered Entities', 'Business Associates', 'Healthcare Providers', 'Health Plans'],
    searchableContent: [
      'HIPAA', 'protected health information', 'PHI', 'safeguards',
      'business associate', 'breach notification', 'patient rights',
      'minimum necessary', 'administrative safeguards', 'technical safeguards'
    ],
    tags: ['HIPAA', 'Healthcare', 'Privacy', 'PHI', 'Safeguards'],
    relatedStandards: ['hitech', 'eu-gdpr']
  },

  // ISO 27001
  {
    id: 'iso-27001',
    name: 'ISO/IEC 27001:2022',
    fullName: 'Information Security Management Systems - Requirements',
    region: 'International',
    category: 'Information Security',
    description: 'Specifies requirements for establishing, implementing, maintaining and continually improving an information security management system',
    sections: 32,
    lastUpdated: '2023-10-01',
    status: 'Active',
    complianceLevel: 'Recommended',
    industry: ['All Industries', 'Information Technology', 'Healthcare'],
    effectiveDate: '2022-10-25',
    nextReview: '2025-10-25',
    officialUrl: 'https://www.iso.org/standard/27001',
    keyPoints: [
      'Information security management system (ISMS)',
      'Risk-based approach to information security',
      'Continual improvement process',
      'Security controls implementation',
      'Management commitment and leadership',
      'Competence and awareness requirements'
    ],
    applicability: ['All Organizations', 'IT Departments', 'Security Teams', 'Risk Managers'],
    searchableContent: [
      'information security', 'ISMS', 'security management system',
      'risk-based approach', 'security controls', 'continual improvement',
      'confidentiality', 'integrity', 'availability'
    ],
    tags: ['ISO', 'Information Security', 'ISMS', 'Risk Management', 'Security Controls'],
    relatedStandards: ['iso-27002', 'nist-csf', 'eu-gdpr']
  }
]

// Enhanced search functionality
export function searchStandards(
  standards: RegulatoryStandard[],
  query: string,
  category?: string,
  region?: string,
  tags?: string[]
): RegulatoryStandard[] {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  
  return standards.filter(standard => {
    // Category filter
    if (category && category !== 'all') {
      const categoryMatch = standard.category.toLowerCase().includes(category.replace('-', ' '))
      if (!categoryMatch) return false
    }
    
    // Region filter
    if (region && region !== 'all') {
      if (standard.region.toLowerCase() !== region.toLowerCase()) return false
    }
    
    // Tags filter
    if (tags && tags.length > 0) {
      const hasMatchingTag = tags.some(tag => 
        standard.tags?.some(standardTag => 
          standardTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
      if (!hasMatchingTag) return false
    }
    
    // Search query
    if (searchTerms.length === 0) return true
    
    const searchableText = [
      standard.name,
      standard.fullName,
      standard.description,
      standard.region,
      standard.category,
      ...(standard.searchableContent || []),
      ...(standard.keyPoints || []),
      ...(standard.applicability || []),
      ...(standard.tags || []),
      ...(standard.industry || [])
    ].join(' ').toLowerCase()
    
    return searchTerms.every(term => searchableText.includes(term))
  })
}

// Get related standards
export function getRelatedStandards(standardId: string): RegulatoryStandard[] {
  const standard = regulatoryStandards.find(s => s.id === standardId)
  if (!standard || !standard.relatedStandards) return []
  
  return regulatoryStandards.filter(s => 
    standard.relatedStandards!.includes(s.id)
  )
}

// Get categories with counts
export function getCategories(): Array<{id: string, name: string, count: number}> {
  const categoryMap = new Map<string, number>()
  
  regulatoryStandards.forEach(standard => {
    const category = standard.category
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })
  
  const categories = [
    { id: 'all', name: 'All Standards', count: regulatoryStandards.length }
  ]
  
  categoryMap.forEach((count, category) => {
    categories.push({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      count
    })
  })
  
  return categories
}

// Get regions with counts
export function getRegions(): Array<{id: string, name: string, count: number}> {
  const regionMap = new Map<string, number>()
  
  regulatoryStandards.forEach(standard => {
    const region = standard.region
    regionMap.set(region, (regionMap.get(region) || 0) + 1)
  })
  
  const regions = [
    { id: 'all', name: 'All Regions', count: regulatoryStandards.length }
  ]
  
  regionMap.forEach((count, region) => {
    regions.push({
      id: region.toLowerCase().replace(/\s+/g, '-'),
      name: region,
      count
    })
  })
  
  return regions
}

// Get all available tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  
  regulatoryStandards.forEach(standard => {
    standard.tags?.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}