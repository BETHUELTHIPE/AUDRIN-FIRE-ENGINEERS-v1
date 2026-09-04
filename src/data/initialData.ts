import { 
  ServiceRecord, 
  HowWeWorkStage, 
  SiteRecord, 
  ServiceRequest, 
  PhotoEvidence, 
  VideoEvidence, 
  CalendarAppointment, 
  ZoomMeetingDetails, 
  AiMeetingMinutes,
  SansLogbookEntry,
  SansCocCertificate
} from '../types';

export const COMPANY_DETAILS = {
  legalName: 'AUDRIN FIRE ENGINEERS (PTY) LTD',
  tradingName: 'AUDRIN FIRE ENGINEERS',
  registrationNumber: 'K2026089596',
  tagline: 'Early Detection. Clear Warning. Safer Buildings.',
  director: 'Russia Bethuel Moukangwe (Managing Director, Lead Systems Engineer & Registered SAQCC Fire Commissioner)',
  managingDirector: {
    fullName: 'Russia Bethuel Moukangwe',
    role: 'Managing Director & Lead Systems Engineer',
    saqccDesignation: 'Registered SAQCC Fire Technician & Systems Commissioner',
    saqccRegistrationStatus: 'Active Registered SAQCC Fire Commissioner (Detection & Alarm Systems)',
    email: 'bethuelthipe@gmail.com',
    secondaryEmail: 'bethuelmoukangwe8@gmail.com',
    phones: ['071 415 6665', '072 037 8471'],
    linkedin: 'https://www.linkedin.com/in/bethuel-moukangwe',
    location: 'Kempton Park / Pretoria West, Gauteng, South Africa',
    qualifications: [
      'Registered SAQCC Fire Technician & Systems Commissioner (Detection & Alarm Systems)',
      'BSc in Mathematics and Applied Mathematics (University of South Africa)',
      'Data Engineering Specialist (EXPLOREAI Academy)',
      'BSc Physics Studies (University of Pretoria)',
      'Evaluator & Subject Specialist Team Leader (Umalusi Quality Council)',
      '17+ Years STEM & Physical Sciences Educational & Analytical Leadership'
    ]
  },
  phone: '071 415 6665 / 072 037 8471',
  phoneFormatted: '+27 71 415 6665 / +27 72 037 8471',
  email: 'bethuelthipe@gmail.com',
  address: '27 Tshivhase Street, Pretoria West, Pretoria, 0008, South Africa',
  operatingHours: 'Monday–Sunday, 07:00–20:00',
  serviceArea: 'South Africa (National commercial coverage)',
  sansStandard: 'SANS 10139 Recommended Practices for Fire Detection and Alarm Systems in Buildings',
  complianceNotice: 'All technical assessments, system categories, and engineering recommendations strictly adhere to SANS 10139, the approved fire strategy, project specifications, manufacturer engineering instructions, and local authority requirements.',
  disclaimerNotice: 'Audrin Fire Engineers provides commercial fire-detection and alarm engineering. The company does not supply or service fire extinguishers, hose reels, sprinklers, gas suppression systems, CCTV, or standalone security equipment. Document, photographic, or AI output alone does not constitute statutory verification.',
};

export const HOW_WE_WORK_STAGES: HowWeWorkStage[] = [
  {
    stepNumber: 1,
    title: 'Enquiry and Consultation',
    shortDescription: 'Initial technical consultation to establish facility fire safety objectives and regulatory parameters.',
    fullDescription: 'We conduct a structured review of your building classification, occupancy, existing fire detection assets, and project requirements to outline a compliant assessment strategy.',
    deliverables: ['Consultation summary', 'Regulatory alignment scope', 'Preliminary site access roadmap'],
    sansStandardNote: 'SANS 10139 Section 4: Initial consultation and determination of system objectives.',
    audioDurationSeconds: 14,
    narrationScript: 'Stage one: Enquiry and Consultation. We begin by understanding your facility layout, building classification, and fire safety objectives to determine the exact regulatory scope under SANS 10139 recommendations.'
  },
  {
    stepNumber: 2,
    title: 'Site Survey and System Assessment',
    shortDescription: 'Comprehensive on-site physical inspection of fire panels, loop integrity, detector placement, and ambient conditions.',
    fullDescription: 'Qualified engineering staff evaluate cable routes, ambient ceiling temperatures, airflows, acoustic sounder levels, compartmentation, and existing control equipment.',
    deliverables: ['Site survey report', 'Device condition log', 'Ambient risk and false-alarm vulnerability audit'],
    sansStandardNote: 'SANS 10139 Section 5: Physical site surveys and environment assessment.',
    audioDurationSeconds: 16,
    narrationScript: 'Stage two: Site Survey and System Assessment. Our engineers physically inspect control panels, detector spacing, sounder coverage, and environmental conditions to identify coverage gaps and false-alarm risks.'
  },
  {
    stepNumber: 3,
    title: 'System Category and Design',
    shortDescription: 'Specification of system category (Category M, L1–L5, P1–P2) and engineered cause-and-effect matrix.',
    fullDescription: 'We design conventional, addressable, or networked architectures precisely configured for property protection, life safety, or bespoke emergency warning protocols.',
    deliverables: ['System category specification', 'Cause-and-effect matrix', 'Device location schedules and loop calculations'],
    sansStandardNote: 'SANS 10139 Section 6 & 7: Selection of system category and design considerations.',
    audioDurationSeconds: 17,
    narrationScript: 'Stage three: System Category and Design. We specify the exact SANS 10139 system category—whether Category M, Life Safety L1 through L5, or Property Protection P1 to P2—and develop the cause-and-effect matrix.'
  },
  {
    stepNumber: 4,
    title: 'Scope and Quotation',
    shortDescription: 'Transparent, itemised technical scope of work, bill of materials, and project schedule.',
    fullDescription: 'Clear quotation based on verified equipment requirements, approved interfaces, and installation methodologies with no hidden costs or ambiguous allowances.',
    deliverables: ['Itemised bill of quantities', 'Technical methodology document', 'Project milestone timeline'],
    sansStandardNote: 'Standard commercial engineering procurement practices.',
    audioDurationSeconds: 13,
    narrationScript: 'Stage four: Scope and Quotation. You receive an itemised, transparent quotation with full technical specifications, hardware allowances, and clear milestone schedules.'
  },
  {
    stepNumber: 5,
    title: 'Installation',
    shortDescription: 'Precision installation of fire-rated cabling, detection devices, manual call points, and control panels.',
    fullDescription: 'Executed by trained technicians following manufacturer engineering guidelines, strict cable segregation, and robust zone identification practices.',
    deliverables: ['Installation progress logs', 'Cabling continuity check records', 'Device address mapping register'],
    sansStandardNote: 'SANS 10139 Section 8: Installation practices and cable requirements.',
    audioDurationSeconds: 15,
    narrationScript: 'Stage five: Installation. Our technicians install fire-resistant cabling, addressable control panels, optical and thermal detectors, and manual call points strictly to engineering specifications.'
  },
  {
    stepNumber: 6,
    title: 'Testing and Commissioning',
    shortDescription: 'Rigorous point-to-point device testing, loop resistance verification, sound level audibility tests, and interface checks.',
    fullDescription: 'Every detector, manual call point, sounder beacon, and approved interface (such as HVAC shutdown and access-release triggers) is thoroughly tested under simulated conditions.',
    deliverables: ['Point-to-point commissioning sheet', 'Acoustic sound level log (dB(A))', 'Interface tripping verification matrix'],
    sansStandardNote: 'SANS 10139 Section 9: Commissioning and verification testing.',
    audioDurationSeconds: 18,
    narrationScript: 'Stage six: Testing and Commissioning. Every single detector, sounder, and interface trigger undergoes point-to-point testing, including acoustic decibel checks and emergency HVAC shutdown verification.'
  },
  {
    stepNumber: 7,
    title: 'Handover and Maintenance',
    shortDescription: 'Formal client handover, operator training, supply of as-built records and logbooks, and scheduled preventative maintenance.',
    fullDescription: 'We deliver comprehensive logbooks, laminated zone charts, as-built schematics, and train facility managers on daily, weekly, and quarterly routine operations.',
    deliverables: ['Laminated zone chart', 'SANS 10139 fire logbook', 'Operator training completion register', 'Preventative maintenance contract'],
    sansStandardNote: 'SANS 10139 Section 10 & 11: System documentation, handover, and routine maintenance.',
    audioDurationSeconds: 18,
    narrationScript: 'Stage seven: Handover and Maintenance. We provide laminated zone charts, system logbooks, operator training for your facility team, and structured planned preventative maintenance.'
  }
];

export const APPROVED_SERVICES: ServiceRecord[] = [
  {
    id: 'srv-01',
    slug: 'fire-detection-site-surveys',
    title: 'Fire-Detection Consultation and Site Surveys',
    category: 'consultation_design',
    categoryLabel: 'Consultation & Surveys',
    shortDescription: 'Technical on-site surveys and condition audits of commercial fire detection equipment and compliance readiness.',
    fullDescription: 'Comprehensive evaluation of existing fire detection installations, physical detector placement, ambient environment factors, cable containment, and control panel health in commercial and industrial facilities.',
    scope: [
      'Visual and physical inspection of main fire alarm control panels and power supplies',
      'Evaluation of detector coverage against ceiling heights, beams, and airflow patterns',
      'Assessment of ambient dust, humidity, and temperature false-alarm drivers',
      'Review of acoustic audibility and visual alarm beacon placement',
      'Inspection of zone charts, logbooks, and existing as-built documentation'
    ],
    applicableBuildingTypes: ['Commercial Office Parks', 'Warehouses and Logistics Hubs', 'Industrial Manufacturing Facilities', 'Educational Campuses', 'Healthcare and Clinics', 'Retail Shopping Centres'],
    process: [
      'Initial document review of existing layouts and fire strategy',
      'Physical walkthrough with calibrated sound meters and inspection tools',
      'Detailed recording of panel configurations, loop counts, and device states',
      'Generation of structured survey findings and engineering recommendations'
    ],
    deliverables: ['Comprehensive Site Survey Report', 'Photographic Condition Log', 'Prioritised Remedial Action Schedule'],
    clientResponsibilities: ['Provide safe site access and escort to plant rooms', 'Supply existing building plans and previous maintenance records where available'],
    relatedServiceSlugs: ['system-assessment-and-design', 'false-alarm-investigation', 'zoning-and-as-built-records'],
    faqs: [
      { question: 'How long does a commercial site survey take?', answer: 'Surveys typically take between 2 to 6 hours depending on facility square meterage and the number of detection loops.' },
      { question: 'Will the survey disrupt our normal business operations?', answer: 'No. Visual and non-destructive survey inspections are conducted quietly without activating alarm sounders during working hours.' }
    ],
    featured: true,
    order: 1,
    isPublished: true,
    metaTitle: 'Fire-Detection Consultation & Site Surveys | Audrin Fire Engineers',
    metaDescription: 'Expert commercial fire alarm surveys and technical audits across South Africa aligned with SANS 10139 recommendations.'
  },
  {
    id: 'srv-02',
    slug: 'system-assessment-and-design',
    title: 'System Assessment and Design Support',
    category: 'consultation_design',
    categoryLabel: 'Consultation & Surveys',
    shortDescription: 'Engineered fire detection specifications, category selection (M, L1–L5, P1–P2), and cause-and-effect matrix design.',
    fullDescription: 'Technical design services defining system architecture, loop load calculations, battery backup autonomy, device layouts, and complex multi-building networked topologies.',
    scope: [
      'Selection of SANS 10139 System Category (M, L1, L2, L3, L4, L5, P1, P2)',
      'Loop loading, voltage drop, and standby battery capacity calculations',
      'Development of comprehensive cause-and-effect tripping matrices',
      'Integration design for approved fire-alarm interfaces (HVAC, access control release, dampers)'
    ],
    applicableBuildingTypes: ['Corporate Headquarters', 'High-density Warehouses', 'Data Centres', 'Hospitals and Care Facilities'],
    process: ['Fire strategy review', 'CAD layout drafting', 'Cause-and-effect logic development', 'Engineering peer review'],
    deliverables: ['Detailed Technical Specification', 'Cause-and-Effect Matrix Document', 'Device Schedule and Battery Calculations'],
    clientResponsibilities: ['Provide architectural CAD floorplans and approved fire strategy document'],
    relatedServiceSlugs: ['fire-detection-site-surveys', 'fire-alarm-installation', 'fire-alarm-interfaces'],
    faqs: [
      { question: 'What is the difference between Category L and Category P systems?', answer: 'Category L systems are designed for the protection of human life, whereas Category P systems are designed specifically for the protection of property.' }
    ],
    featured: true,
    order: 2,
    isPublished: true,
    metaTitle: 'Fire-Detection Design & Engineering | Audrin Fire Engineers',
    metaDescription: 'Engineered fire alarm design, category specification, and cause-and-effect matrix development aligned with SANS 10139.'
  },
  {
    id: 'srv-03',
    slug: 'fire-alarm-installation',
    title: 'Conventional, Addressable & Networked Fire-Alarm Installation',
    category: 'installation_commissioning',
    categoryLabel: 'Installation & Commissioning',
    shortDescription: 'Professional installation of fire-rated cabling, control panels, optical/thermal detectors, sounders, and call points.',
    fullDescription: 'Full turnkey installation of commercial fire detection hardware. From standalone conventional panels in smaller retail units to complex multi-panel networked addressable systems across multi-storey facilities.',
    scope: [
      'Installation of PH30/PH120 fire-resistant screened cabling with proper containment',
      'Mounting and termination of optical smoke, thermal heat, and multi-sensor detectors',
      'Installation of manual call points with protective flip covers at required escape heights',
      'Fitting of EN 54-23 compliant visual alarm devices (VADs) and high-output electronic sounders',
      'Installation of main control panels, repeater panels, and monitored power supply units'
    ],
    applicableBuildingTypes: ['Commercial High-Rise', 'Industrial Factories', 'Distribution Centres', 'Shopping Malls', 'Schools and Universities'],
    process: ['Containment and cable installation', 'Device mounting and addressing', 'Panel termination', 'Pre-commissioning circuit checks'],
    deliverables: ['Installation Progress Report', 'Cable Continuity Test Logs', 'As-fitted Device Address Schedule'],
    clientResponsibilities: ['Provide uninterrupted work area access and power supply isolation where required'],
    relatedServiceSlugs: ['testing-and-commissioning', 'system-modifications-and-upgrades', 'as-built-records-and-documentation'],
    faqs: [
      { question: 'Do you install wireless fire alarm systems?', answer: 'We engineer both hardwired fire-resistant cable installations and approved hybrid wireless detection systems where cable containment is architecturally restricted.' }
    ],
    featured: true,
    order: 3,
    isPublished: true,
    metaTitle: 'Commercial Fire-Alarm Installation | Audrin Fire Engineers',
    metaDescription: 'Certified installation of conventional and addressable fire detection networks across South Africa.'
  },
  {
    id: 'srv-04',
    slug: 'testing-and-commissioning',
    title: 'Testing and Commissioning',
    category: 'installation_commissioning',
    categoryLabel: 'Installation & Commissioning',
    shortDescription: 'Rigorous point-to-point testing, loop resistance audits, audibility decibel checks, and cause-and-effect verification.',
    fullDescription: 'Methodical verification ensuring every installed component operates strictly in accordance with design criteria and SANS 10139 recommendations. Includes 100% device activation and interface simulation.',
    scope: [
      '100% point-to-point functional activation of all detectors, call points, and interfaces',
      'Loop impedance, earth fault threshold, and signal communication integrity verification',
      'Sound level meter audibility testing (minimum 65 dB(A) or 75 dB(A) at bedhead)',
      'Verification of staged evacuation timing delays and coincidence (double-knock) logic',
      'Testing of auxiliary relay outputs for air handling plant shutdown and magnetic door releases'
    ],
    applicableBuildingTypes: ['All commercial, institutional, and industrial facilities'],
    process: ['Pre-testing loop scans', 'Simulated smoke/heat aerosol activations', 'Audibility decibel mapping', 'Interface trip sign-offs'],
    deliverables: ['Commissioning Verification Certificate', 'Complete Point-by-Point Test Sheet', 'Acoustic Sound Level Map'],
    clientResponsibilities: ['Notify building occupants in advance of planned alarm sounder activations during testing windows'],
    relatedServiceSlugs: ['fire-alarm-installation', 'cause-and-effect-review', 'handover-and-operator-training'],
    faqs: [
      { question: 'What decibel level is required in commercial offices?', answer: 'SANS 10139 recommends a general minimum sound level of 65 dB(A), or 5 dB(A) above any background noise persisting for more than 30 seconds.' }
    ],
    featured: true,
    order: 4,
    isPublished: true,
    metaTitle: 'Fire-Alarm Testing & Commissioning | Audrin Fire Engineers',
    metaDescription: 'Methodical point-to-point fire alarm testing and commissioning aligned with SANS 10139.'
  },
  {
    id: 'srv-05',
    slug: 'acceptance-and-verification-coordination',
    title: 'Acceptance and Verification Coordination Support',
    category: 'installation_commissioning',
    categoryLabel: 'Installation & Commissioning',
    shortDescription: 'Technical witness testing, third-party coordination, and verification dossier preparation for project handovers.',
    fullDescription: 'Coordination support assisting facility owners, consulting engineers, and main contractors during formal witness testing and handover sign-offs.',
    scope: [
      'Preparation of witness testing scripts and sampling protocols',
      'Facilitation of on-site functional demonstrations for consulting engineers and safety officers',
      'Compilation of verification dossiers including test certificates, battery sizing, and loop logs',
      'Resolution tracking for any identified punch-list or snags'
    ],
    applicableBuildingTypes: ['New Commercial Developments', 'Major Building Refurbishments', 'Industrial Expansion Projects'],
    process: ['Pre-witness audit', 'Structured live demonstration', 'Defect logging and resolution', 'Dossier sign-off'],
    deliverables: ['Verification Witnessing Dossier', 'Snag Resolution Matrix', 'Handover Sign-off Documentation'],
    clientResponsibilities: ['Coordinate attendance of key stakeholders and consulting engineers'],
    relatedServiceSlugs: ['testing-and-commissioning', 'handover-and-operator-training', 'as-built-records-and-documentation'],
    faqs: [
      { question: 'Do you issue statutory occupancy certificates?', answer: 'We provide technical commissioning records and verification data that consulting engineers and appointed competent persons require for their final statutory documentation.' }
    ],
    featured: false,
    order: 5,
    isPublished: true,
    metaTitle: 'Fire-Alarm Verification Coordination | Audrin Fire Engineers',
    metaDescription: 'Technical witness testing and acceptance coordination support for commercial fire detection systems.'
  },
  {
    id: 'srv-06',
    slug: 'planned-preventative-maintenance',
    title: 'Planned Preventative Maintenance',
    category: 'maintenance_testing',
    categoryLabel: 'Maintenance & Service',
    shortDescription: 'Quarterly, bi-annual, and annual scheduled maintenance to ensure continuous system readiness and false-alarm prevention.',
    fullDescription: 'Structured preventative service programmes aligned with SANS 10139 routine testing schedules. Prevents unnotified component failure, battery degradation, and sensor chamber drift.',
    scope: [
      'Quarterly sampling and functional activation of detectors and manual call points',
      'Standby battery conductance and load discharge testing',
      'Optical chamber contamination level checks and sensitivity recalibration',
      'Inspection of cable terminations, earth bonding, and power supply voltages',
      'Complete logbook updating and issuance of periodic inspection reports'
    ],
    applicableBuildingTypes: ['Offices', 'Logistics Warehouses', 'Hotels', 'Factories', 'Retail Malls'],
    process: ['Scheduled maintenance visits', 'Sequential device testing', 'Logbook endorsement', 'Actionable maintenance report'],
    deliverables: ['SANS 10139 Periodic Inspection Certificate', 'Service Defect Log', 'Battery Health & Life Expectancy Report'],
    clientResponsibilities: ['Facilitate routine site access and ensure on-site fire logbook is presented at each visit'],
    relatedServiceSlugs: ['fault-finding-and-emergency-faults', 'logbook-and-documentation-support', 'false-alarm-investigation'],
    faqs: [
      { question: 'How often should commercial fire alarm systems be serviced?', answer: 'SANS 10139 recommends periodic inspection and testing at intervals not exceeding 3 months (quarterly) for commercial premises.' }
    ],
    featured: true,
    order: 6,
    isPublished: true,
    metaTitle: 'Planned Fire-Alarm Maintenance | Audrin Fire Engineers',
    metaDescription: 'Quarterly and annual preventative maintenance for commercial fire detection systems across South Africa.'
  },
  {
    id: 'srv-07',
    slug: 'fault-finding-and-emergency-faults',
    title: 'Fault Finding, Repairs and Emergency Fault Support',
    category: 'faults_repairs',
    categoryLabel: 'Faults & Emergency Support',
    shortDescription: 'Rapid diagnostic troubleshooting of open circuits, earth faults, communication errors, and power supply failures.',
    fullDescription: 'Dedicated technical response to clear disruptive fire alarm panel faults, intermittent buzzer alerts, loop open/short circuits, missing devices, and unexplainable system trouble codes.',
    scope: [
      'Tracing and isolating earth faults and cable insulation breakdowns',
      'Locating loop open circuits, short circuits, and damaged containment',
      'Diagnostics of corrupted addressable communication protocols and loop card faults',
      'Repair and replacement of damaged detectors, sounders, call points, and power supplies',
      'Emergency panel restoration and temporary isolation of defective field spurs'
    ],
    applicableBuildingTypes: ['All commercial facilities with active fire detection trouble indications'],
    process: ['Rapid fault intake triage', 'On-site multimeter and loop analyser diagnostics', 'Defect repair and component replacement', 'Panel reset and verification'],
    deliverables: ['Emergency Fault Resolution Report', 'Root Cause Analysis Summary', 'Component Replacement Receipt'],
    clientResponsibilities: ['Provide immediate site access to main panel and plant rooms upon engineer arrival'],
    relatedServiceSlugs: ['false-alarm-investigation', 'system-modifications-and-upgrades', 'planned-preventative-maintenance'],
    faqs: [
      { question: 'What should we do if our panel is beeping continuously?', answer: 'Call our emergency fault desk on 071 415 6665. Silence the panel buzzer if trained to do so, note down any displayed error message, and do not isolate key zones without professional guidance.' }
    ],
    featured: true,
    order: 7,
    isPublished: true,
    metaTitle: 'Fire-Alarm Fault Finding & Emergency Repairs | Audrin Fire Engineers',
    metaDescription: 'Rapid troubleshooting and emergency fault finding for commercial fire alarm systems in South Africa.'
  },
  {
    id: 'srv-08',
    slug: 'system-modifications-and-upgrades',
    title: 'System Modifications, Upgrades and Device Relocation',
    category: 'faults_repairs',
    categoryLabel: 'Faults & Emergency Support',
    shortDescription: 'Reconfiguring detection loops, adding devices for new office layouts, and upgrading obsolete panels.',
    fullDescription: 'Adapting existing fire alarm systems to internal office renovations, partition alterations, warehouse rack expansions, or replacing discontinued control panels with modern addressable technology.',
    scope: [
      'Relocation of smoke and heat detectors following drywall partition alterations',
      'Addition of new detection loops and field devices to existing addressable panels',
      'Migration of legacy conventional systems to modern networked addressable platforms',
      'Software reprogramming of device descriptors, zone maps, and cause-and-effect rules'
    ],
    applicableBuildingTypes: ['Tenant fit-outs', 'Office refurbishments', 'Warehouse layout changes'],
    process: ['Survey of tenant changes', 'Cabling extension', 'Device addressing and relocation', 'Reprogramming and zone test'],
    deliverables: ['Modification Test Certificate', 'Updated Device Address Register', 'Revised Zone Matrix'],
    clientResponsibilities: ['Supply updated tenant partition layouts prior to commencement'],
    relatedServiceSlugs: ['fire-alarm-installation', 'testing-and-commissioning', 'zoning-and-as-built-records'],
    faqs: [
      { question: 'Can we move smoke detectors ourselves during office renovations?', answer: 'No. Moving detectors alters cable loop resistance, addressing, and coverage geometry. All modifications must be executed by qualified fire alarm engineers.' }
    ],
    featured: false,
    order: 8,
    isPublished: true,
    metaTitle: 'Fire-Alarm Upgrades & Device Relocation | Audrin Fire Engineers',
    metaDescription: 'Seamless device relocation and panel upgrades for commercial renovations and tenant fit-outs.'
  },
  {
    id: 'srv-09',
    slug: 'false-alarm-investigation',
    title: 'False-Alarm Investigation and Management',
    category: 'maintenance_testing',
    categoryLabel: 'Maintenance & Service',
    shortDescription: 'Technical root-cause analysis and mitigation strategies for chronic false alarms and unwanted activations.',
    fullDescription: 'Systematic analysis of persistent false alarms caused by steam, dust, cooking fumes, air conditioning drafts, electrical transients, or improper detector type selection.',
    scope: [
      'Panel event log download and timestamp trend analysis',
      'Evaluation of detector type suitability (e.g. replacing optical smoke with multi-criteria or thermal sensors in vulnerable areas)',
      'Environmental monitoring around false-alarm trigger points',
      'Implementation of alarm verification delays and coincidence detection logic'
    ],
    applicableBuildingTypes: ['Hotels & Kitchens', 'Industrial Manufacturing', 'Student Residences', 'Office Kitchenettes'],
    process: ['Log audit', 'Physical environment inspection', 'Sensor technology adjustment', 'Follow-up monitoring period'],
    deliverables: ['False-Alarm Root-Cause Report', 'Remedial Action Recommendations', 'Post-Adjustment Logbook Entry'],
    clientResponsibilities: ['Log exact times and observed circumstances for any unexplained alarm event in the logbook'],
    relatedServiceSlugs: ['planned-preventative-maintenance', 'cause-and-effect-review', 'system-modifications-and-upgrades'],
    faqs: [
      { question: 'Why are false alarms dangerous for a business?', answer: 'False alarms lead to occupant complacency ("cry wolf" syndrome), disruptive evacuation downtime, costly production stops, and unnecessary emergency services dispatch.' }
    ],
    featured: false,
    order: 9,
    isPublished: true,
    metaTitle: 'False-Alarm Investigation & Management | Audrin Fire Engineers',
    metaDescription: 'Eliminate disruptive false alarms with technical root-cause analysis and sensor recalibration.'
  },
  {
    id: 'srv-10',
    slug: 'cause-and-effect-review',
    title: 'Cause-and-Effect Review and Reprogramming',
    category: 'consultation_design',
    categoryLabel: 'Consultation & Surveys',
    shortDescription: 'Auditing and re-engineering system response logic, phased evacuation delays, and plant shutdown triggers.',
    fullDescription: 'Comprehensive review and configuration of fire alarm cause-and-effect matrices to ensure intended responses execute seamlessly during real alarm scenarios.',
    scope: [
      'Audit of existing panel programming against current building fire strategy',
      'Configuration of staged / phased evacuation alert and evacuate tone sequences',
      'Programming of auxiliary control relays for smoke extract fans and fire dampers',
      'Verification of emergency door release interfaces under mains-fail and alarm states'
    ],
    applicableBuildingTypes: ['Multi-Storey Office Towers', 'Complex Industrial Plants', 'Hospitals and Shopping Centres'],
    process: ['Strategy comparison', 'Logic reprogramming', 'Live interface simulation', 'Witness sign-off'],
    deliverables: ['Updated Cause-and-Effect Matrix Document', 'Software Configuration Backup File', 'Interface Test Certificate'],
    clientResponsibilities: ['Provide the approved building fire strategy and coordinate plant room shut-down permissions'],
    relatedServiceSlugs: ['fire-alarm-interfaces', 'testing-and-commissioning', 'system-assessment-and-design'],
    faqs: [
      { question: 'What is a cause-and-effect matrix in fire detection?', answer: 'It is a structured logic table defining exactly what actions (effects) the fire system must initiate—such as sounder alerts, fan shutdowns, and door releases—when specific detectors (causes) trigger.' }
    ],
    featured: false,
    order: 10,
    isPublished: true,
    metaTitle: 'Cause & Effect Fire-Alarm Engineering | Audrin Fire Engineers',
    metaDescription: 'Engineered cause-and-effect review, phased evacuation logic, and auxiliary relay programming.'
  },
  {
    id: 'srv-11',
    slug: 'fire-alarm-interfaces',
    title: 'Approved Fire-Alarm Interfaces',
    category: 'installation_commissioning',
    categoryLabel: 'Installation & Commissioning',
    shortDescription: 'Monitored interface connections to HVAC ventilation shutdown, access control releases, and status monitoring.',
    fullDescription: 'Engineering compliant interface connections between the fire alarm control panel and adjacent building systems. Note: We provide the monitored fire alarm interface only; standalone access control and HVAC mechanics remain under their respective contractors.',
    scope: [
      'Installation of monitored input/output interface modules (I/O units)',
      'Dry-contact relay integration for air handling unit (AHU) shutdown upon alarm',
      'Failsafe power interlock integration for electronic access control emergency exit doors',
      'Monitoring of sprinkler flow switches and gas suppression panel alarm/fault status contacts'
    ],
    applicableBuildingTypes: ['Commercial Buildings with Central HVAC', 'Secure Facilities with Magnetic Locks'],
    process: ['Interface wiring', 'Relay contact verification', 'Simulated alarm trip test', 'Fail-safe state verification'],
    deliverables: ['Interface Commissioning Record', 'Relay Wiring Diagram', 'Interface Sign-off Sheet'],
    clientResponsibilities: ['Ensure HVAC and Access Control contractors are present or accessible during interface testing'],
    relatedServiceSlugs: ['testing-and-commissioning', 'cause-and-effect-review', 'fire-alarm-installation'],
    faqs: [
      { question: 'Do you install magnetic locks and access control systems?', answer: 'No. We install the dedicated fire alarm interface relays that trigger access control power drops to ensure emergency exit doors release freely upon alarm.' }
    ],
    featured: false,
    order: 11,
    isPublished: true,
    metaTitle: 'Approved Fire-Alarm Interfaces | Audrin Fire Engineers',
    metaDescription: 'Compliant fire alarm interfaces for HVAC plant shutdown and emergency door release triggers.'
  },
  {
    id: 'srv-12',
    slug: 'zoning-and-as-built-records',
    title: 'Zone Charts, As-Built Records and System Documentation',
    category: 'documentation_training',
    categoryLabel: 'Documentation & Training',
    shortDescription: 'Laminated zone charts, CAD as-built floorplans, device address schedules, and compliance documentation.',
    fullDescription: 'Production of accurate, clear, and durable system documentation required by emergency responders, facility managers, and SANS 10139 recommendations.',
    scope: [
      'Design of laminated building zone charts mounted adjacent to main control panels',
      'CAD drafting of as-built fire detection layout drawings showing all device addresses',
      'Compilation of control panel operation manuals and circuit schedules',
      'Archival of system commissioning records and battery calculation sheets'
    ],
    applicableBuildingTypes: ['All commercial, industrial, and institutional premises'],
    process: ['Site verification of device locations', 'CAD drafting and zone boundary mapping', 'Printing, laminating, and on-site mounting'],
    deliverables: ['Laminated A3/A2 Zone Chart Mounted at Panel', 'Digital CAD / PDF As-Built Drawing Set', 'System Manual Dossier'],
    clientResponsibilities: ['Provide base architectural CAD files for the building'],
    relatedServiceSlugs: ['logbook-and-documentation-support', 'handover-and-operator-training', 'fire-detection-site-surveys'],
    faqs: [
      { question: 'Why is a zone chart required next to the fire alarm panel?', answer: 'A zone chart allows firefighters and staff to instantly determine the exact physical location of a fire or fault indicator without deciphering complex numerical addresses.' }
    ],
    featured: false,
    order: 12,
    isPublished: true,
    metaTitle: 'Fire-Alarm Zone Charts & As-Built Records | Audrin Fire Engineers',
    metaDescription: 'Durable laminated zone charts, CAD as-built drawings, and technical fire detection records.'
  },
  {
    id: 'srv-13',
    slug: 'logbook-and-documentation-support',
    title: 'Logbook Support and Compliance Auditing',
    category: 'documentation_training',
    categoryLabel: 'Documentation & Training',
    shortDescription: 'Supply of SANS 10139 fire alarm logbooks, entry audits, routine testing guidance, and document retention support.',
    fullDescription: 'Establishing and maintaining structured on-site fire alarm logbooks. Ensuring facility managers record daily, weekly, and quarterly test events in accordance with statutory expectations.',
    scope: [
      'Supply of standardised commercial fire alarm logbooks with clear operational guidance',
      'Review and auditing of historical user entries, fault logs, and false-alarm incidents',
      'Setup of weekly call-point testing schedules and staff rotation rosters',
      'Digital logbook backup and compliance gap analysis'
    ],
    applicableBuildingTypes: ['All commercial facilities with fire detection systems'],
    process: ['Logbook audit', 'Supply of custom logbook binder', 'Briefing responsible personnel', 'Scheduled verification audits'],
    deliverables: ['Audrin Commercial Fire Alarm Logbook', 'Compliance Audit Assessment Sheet', 'Weekly Test Schedule Template'],
    clientResponsibilities: ['Designate a responsible person on site to perform and record weekly call point tests'],
    relatedServiceSlugs: ['handover-and-operator-training', 'planned-preventative-maintenance', 'zoning-and-as-built-records'],
    faqs: [
      { question: 'What tests must a building manager perform weekly?', answer: 'SANS 10139 recommends operating one manual call point weekly during working hours using a different call point each week to confirm sounder operation and panel registration.' }
    ],
    featured: false,
    order: 13,
    isPublished: true,
    metaTitle: 'Fire-Alarm Logbook Support | Audrin Fire Engineers',
    metaDescription: 'Structured fire alarm logbooks, weekly testing schedules, and compliance documentation support.'
  },
  {
    id: 'srv-14',
    slug: 'handover-and-operator-training',
    title: 'Handover and Operator Training',
    category: 'documentation_training',
    categoryLabel: 'Documentation & Training',
    shortDescription: 'Structured training for facility managers on panel operation, fault response, weekly testing, and logbook keeping.',
    fullDescription: 'Practical hands-on training empowering your on-site facility personnel, security teams, and safety officers to operate the fire alarm control equipment confidently and safely.',
    scope: [
      'Instruction on understanding panel status indicators (Fire, Fault, Disablement, Power)',
      'Proper procedure for silencing buzzer alerts, acknowledging alarms, and performing system resets',
      'Demonstration of weekly manual call point testing with test keys without breaking glass',
      'Safe procedures for managing contractor hot-work isolations and zone disablements'
    ],
    applicableBuildingTypes: ['Commercial facilities, security control rooms, property management teams'],
    process: ['On-site interactive demonstration', 'Practical drill on test procedures', 'Issuance of quick-reference laminated guide', 'Attendee sign-off'],
    deliverables: ['Operator Training Attendance Register', 'Laminated Panel Quick-Reference Guide', 'Training Completion Certificate'],
    clientResponsibilities: ['Ensure designated building operators and safety officers attend the scheduled training session'],
    relatedServiceSlugs: ['logbook-and-documentation-support', 'testing-and-commissioning', 'zoning-and-as-built-records'],
    faqs: [
      { question: 'Who should attend the operator training?', answer: 'Facility managers, security control room operators, designated safety wardens, and building caretakers.' }
    ],
    featured: false,
    order: 14,
    isPublished: true,
    metaTitle: 'Fire-Alarm Operator Training | Audrin Fire Engineers',
    metaDescription: 'Hands-on operator training on fire panel operation, weekly tests, and emergency fault response.'
  }
];

export const GOOGLE_SHEETS_TABS = [
  'Clients',
  'Organisations',
  'Sites',
  'Service Requests',
  'Site Visits',
  'Pre-Work Reports',
  'Post-Work Reports',
  'Documents Register',
  'Photo Evidence Register',
  'Video Evidence Register',
  'Outstanding Items',
  'Completed Work',
  'Notification Status',
  'Executive Dashboard'
];

export const ZOOM_ROOM_CONFIG = {
  title: 'AUDRIN Technical Consultation Room (Pretoria Operations)',
  hostName: 'Bethuel Moukangwe (Director & Lead Fire Engineer)',
  joinUrl: 'https://zoom.us/j/84971562940?pwd=audrinfireengineers',
  meetingId: '849 7156 2940',
  passcode: 'AFE715',
  dialInNumbers: ['+27 11 083 8985 (Johannesburg)', '+27 21 300 2884 (Cape Town)'],
  waitingRoom: true,
  aiTranscriptConsentRequired: true
};

export const SAMPLE_SITES: SiteRecord[] = [
  {
    id: 'site-01',
    name: 'Menlyn Central Corporate Tower',
    address: '125 Dallas Avenue, Menlyn, Pretoria, 0181',
    city: 'Pretoria',
    postalCode: '0181',
    buildingType: 'Commercial High-Rise Office',
    systemType: 'Addressable',
    systemCategory: 'L1',
    panelMakeModel: 'Advanced Electronics Axis EN (4-Loop)',
    panelDetails: {
      brand: 'Advanced Electronics',
      model: 'Axis EN',
      loops: 4,
      zones: 16,
      totalDevices: 480
    },
    loopCount: 4,
    detectorCountApprox: 480,
    hasAsBuiltDrawings: true,
    hasZoneChart: true,
    hasLogbook: true,
    lastServiceDate: '2026-06-15',
    contactPerson: 'David Khumalo',
    contactPhone: '012 345 6789'
  },
  {
    id: 'site-02',
    name: 'Pretoria West Industrial Logistics Hub',
    address: '45 Industrial Ring Road, Pretoria West, Pretoria, 0183',
    city: 'Pretoria',
    postalCode: '0183',
    buildingType: 'High-Bay Logistics Warehouse',
    systemType: 'Networked',
    systemCategory: 'P1',
    panelMakeModel: 'Ziton ZP3 Multi-Panel Network',
    panelDetails: {
      brand: 'Ziton',
      model: 'ZP3 Networked',
      loops: 6,
      zones: 24,
      totalDevices: 620
    },
    loopCount: 6,
    detectorCountApprox: 620,
    hasAsBuiltDrawings: true,
    hasZoneChart: true,
    hasLogbook: true,
    lastServiceDate: '2026-07-10',
    contactPerson: 'Sarah Van Der Merwe',
    contactPhone: '012 555 4321'
  },
  {
    id: 'site-03',
    name: 'Centurion Medical & Healthcare Suites',
    address: '88 Hendrik Verwoerd Drive, Centurion, 0157',
    city: 'Centurion',
    postalCode: '0157',
    buildingType: 'Healthcare / Medical Facility',
    systemType: 'Addressable',
    systemCategory: 'L2',
    panelMakeModel: 'Kentec Syncro AS Addressable',
    panelDetails: {
      brand: 'Kentec',
      model: 'Syncro AS',
      loops: 2,
      zones: 8,
      totalDevices: 190
    },
    loopCount: 2,
    detectorCountApprox: 190,
    hasAsBuiltDrawings: false,
    hasZoneChart: true,
    hasLogbook: true,
    lastServiceDate: '2026-04-20',
    contactPerson: 'Dr. Thabo Sithole',
    contactPhone: '012 888 9090'
  }
];

export const SITES_DATA = SAMPLE_SITES;

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-01',
    referenceNumber: 'AFE-2026-0842',
    userId: 'usr-customer-01',
    clientName: 'Bethuel Moukangwe',
    clientEmail: 'bethuelmoukangwe8@gmail.com',
    clientPhone: '071 415 6665',
    organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
    siteId: 'site-01',
    siteName: 'Menlyn Central Corporate Tower',
    siteAddress: '125 Dallas Avenue, Menlyn, Pretoria, 0181',
    serviceSlug: 'planned-preventative-maintenance',
    serviceTitle: 'Planned Preventative Maintenance',
    urgency: 'routine',
    description: 'Quarterly SANS 10139 periodic inspection and detector testing across 4 addressable loops. Inspection of standby battery autonomy and smoke damper interfaces.',
    preferredVisitDate: '2026-09-10',
    panelBrandModel: 'Advanced Electronics Axis EN (4-Loop)',
    status: 'Work scheduled',
    statusHistory: [
      {
        id: 'sh-01',
        timestamp: '2026-09-01T08:30:00Z',
        status: 'Submitted',
        actor: 'Bethuel Moukangwe',
        actorRole: 'Customer',
        notes: 'Service request submitted through online portal.',
        isCustomerVisible: true
      },
      {
        id: 'sh-02',
        timestamp: '2026-09-01T09:15:00Z',
        status: 'Under review',
        actor: 'Operations Desk',
        actorRole: 'Operations Administrator',
        notes: 'Verified site details and maintenance cycle records.',
        isCustomerVisible: true
      },
      {
        id: 'sh-03',
        timestamp: '2026-09-01T11:00:00Z',
        status: 'Quotation issued',
        actor: 'Commercial Estimator',
        actorRole: 'Staff',
        notes: 'Formal quotation Q-2026-0842 issued to client.',
        isCustomerVisible: true
      },
      {
        id: 'sh-04',
        timestamp: '2026-09-01T14:20:00Z',
        status: 'Approved',
        actor: 'Bethuel Moukangwe',
        actorRole: 'Customer',
        notes: 'Client approved scope and quotation.',
        isCustomerVisible: true
      },
      {
        id: 'sh-05',
        timestamp: '2026-09-02T07:45:00Z',
        status: 'Work scheduled',
        actor: 'Lead Dispatcher',
        actorRole: 'Staff',
        notes: 'Assigned Senior Fire Alarm Technician Sipho Ndlovu for 2026-09-10.',
        isCustomerVisible: true
      }
    ],
    createdAt: '2026-09-01T08:30:00Z',
    updatedAt: '2026-09-02T07:45:00Z',
    assignedEngineer: 'Sipho Ndlovu (Pr. Tech / Fire Systems)',
    beforePhotosCount: 3,
    duringPhotosCount: 2,
    afterPhotosCount: 2,
    videosCount: 1,
    documentsCount: 3,
    hasPreWorkReport: true,
    hasPostWorkReport: true,
    hasPresentation: true,
    hasScheduledVisit: true,
    hasZoomMeeting: true,
    hasAiMinutes: true
  },
  {
    id: 'req-02',
    referenceNumber: 'AFE-2026-0849',
    userId: 'usr-customer-01',
    clientName: 'Bethuel Moukangwe',
    clientEmail: 'bethuelmoukangwe8@gmail.com',
    clientPhone: '071 415 6665',
    organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
    siteId: 'site-02',
    siteName: 'Pretoria West Industrial Logistics Hub',
    siteAddress: '45 Industrial Ring Road, Pretoria West, Pretoria, 0183',
    serviceSlug: 'fault-finding-and-emergency-faults',
    serviceTitle: 'Fault Finding, Repairs and Emergency Fault Support',
    urgency: 'urgent',
    description: 'Intermittent loop 2 open circuit fault reported on Ziton ZP3 panel. Buzzer sounding intermittently during evening shifts.',
    preferredVisitDate: '2026-09-03',
    panelBrandModel: 'Ziton ZP3 Multi-Panel Network',
    faultSymptoms: ['Loop open circuit warning', 'Panel buzzer trouble tone', 'Occasional missing device fault (Loop 2)'],
    status: 'Site survey scheduled',
    statusHistory: [
      {
        id: 'sh-10',
        timestamp: '2026-09-02T04:15:00Z',
        status: 'Submitted',
        actor: 'Bethuel Moukangwe',
        actorRole: 'Customer',
        notes: 'Fault report submitted via Emergency Dispatch Portal.',
        isCustomerVisible: true
      },
      {
        id: 'sh-11',
        timestamp: '2026-09-02T04:25:00Z',
        status: 'Site survey scheduled',
        actor: 'Emergency Triage Desk',
        actorRole: 'Operations Administrator',
        notes: 'Priority dispatch booked for technical fault finding.',
        isCustomerVisible: true
      }
    ],
    createdAt: '2026-09-02T04:15:00Z',
    updatedAt: '2026-09-02T04:25:00Z',
    assignedEngineer: 'Kagiso Molefe (Senior Field Engineer)',
    beforePhotosCount: 2,
    duringPhotosCount: 0,
    afterPhotosCount: 0,
    videosCount: 0,
    documentsCount: 1,
    hasPreWorkReport: true,
    hasPostWorkReport: false,
    hasPresentation: false,
    hasScheduledVisit: true,
    hasZoomMeeting: false,
    hasAiMinutes: false
  }
];

export const INITIAL_PHOTOS: PhotoEvidence[] = [
  {
    id: 'pho-01',
    requestId: 'req-01',
    stage: 'before',
    category: 'panel_display',
    categoryLabel: 'Main Control Panel Display',
    caption: 'Main panel status display prior to scheduled service showing standby condition and battery voltage log.',
    areaLocation: 'Ground Floor Security Control Room',
    equipmentRef: 'Panel FP-01 (Advanced Axis EN)',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    uploadedBy: 'Bethuel Moukangwe',
    uploaderRole: 'Customer',
    uploadedAt: '2026-09-01T08:45:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'a9f2c8d1045e771b9c23',
    pairedAfterPhotoId: 'pho-05'
  },
  {
    id: 'pho-02',
    requestId: 'req-01',
    stage: 'before',
    category: 'detector_device',
    categoryLabel: 'Optical Smoke Detector in High Airflow Zone',
    caption: 'Detector unit installed adjacent to HVAC return air grille showing visible airborne particulate accumulation.',
    areaLocation: 'Level 3 Open-Plan Accounting Wing',
    equipmentRef: 'Detector L2-D042 (Optical Smoke)',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    uploadedBy: 'Bethuel Moukangwe',
    uploaderRole: 'Customer',
    uploadedAt: '2026-09-01T08:48:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'b71239c09d5a812e44ff',
    pairedAfterPhotoId: 'pho-06'
  },
  {
    id: 'pho-03',
    requestId: 'req-01',
    stage: 'before',
    category: 'cable_route',
    categoryLabel: 'Containment & Cable Route',
    caption: 'Fire-resistant cabling containment inspection in riser shaft before quarterly terminal tightness check.',
    areaLocation: 'East Service Riser B2',
    equipmentRef: 'Loop 1 & 2 Riser Junction Box JB-R2',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    uploadedBy: 'Bethuel Moukangwe',
    uploaderRole: 'Customer',
    uploadedAt: '2026-09-01T08:50:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'e88102b48991a0c76512'
  },
  {
    id: 'pho-04',
    requestId: 'req-01',
    stage: 'during',
    category: 'testing',
    categoryLabel: 'Point-to-Point Aerosol Smoke Activation',
    caption: 'Testing technician introducing calibrated aerosol test gas using solo inspection pole tool.',
    areaLocation: 'Level 2 Executive Boardroom',
    equipmentRef: 'Detector L1-D018',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    uploadedBy: 'Sipho Ndlovu',
    uploaderRole: 'Staff Engineer',
    uploadedAt: '2026-09-01T15:20:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'c43209fa881112d67ea1'
  },
  {
    id: 'pho-05',
    requestId: 'req-01',
    stage: 'after',
    category: 'panel_display',
    categoryLabel: 'Completed Panel Status & Reset Verification',
    caption: 'Main panel restored to 100% normal quiescent state with clean event memory and verified mains power.',
    areaLocation: 'Ground Floor Security Control Room',
    equipmentRef: 'Panel FP-01 (Advanced Axis EN)',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    uploadedBy: 'Sipho Ndlovu',
    uploaderRole: 'Staff Engineer',
    uploadedAt: '2026-09-01T16:30:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'f991cba00122345efaa7',
    pairedBeforePhotoId: 'pho-01'
  },
  {
    id: 'pho-06',
    requestId: 'req-01',
    stage: 'after',
    category: 'detector_device',
    categoryLabel: 'Cleaned and Recalibrated Detector Unit',
    caption: 'Optical chamber serviced, cleared of airborne dust, and re-tested for sensitivity response within SANS limits.',
    areaLocation: 'Level 3 Open-Plan Accounting Wing',
    equipmentRef: 'Detector L2-D042',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    uploadedBy: 'Sipho Ndlovu',
    uploaderRole: 'Staff Engineer',
    uploadedAt: '2026-09-01T16:45:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'd887a022b7713490ec10',
    pairedBeforePhotoId: 'pho-02'
  }
];

export const INITIAL_VIDEOS: VideoEvidence[] = [
  {
    id: 'vid-01',
    requestId: 'req-01',
    title: 'Sounder Audibility & Strobe Sync Test',
    caption: 'Sounder audibility and visual alarm beacon strobe synchronisation test across Level 2 atrium.',
    description: 'Acoustic verification measuring 78.4 dB(A) at 3m with synchronized EN 54-23 beacon strobes.',
    location: 'Level 2 Atrium & Public Corridors',
    areaLocation: 'Level 2 Atrium & Public Corridors',
    equipmentRef: 'VAD Loop 1 Beacons & Sounders',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    durationSeconds: 18,
    resolution: '1080p HD (60fps)',
    uploadedBy: 'Sipho Ndlovu',
    uploadedAt: '2026-09-01T15:35:00Z',
    reviewStatus: 'approved',
    includedInReport: true,
    hash: 'v-99410ca77b',
    fileSizeBytes: 8450000,
    timestampMarkers: [
      { timeSeconds: 3, label: 'Sounder strobe activation' },
      { timeSeconds: 10, label: 'Decibel meter reading 78.4 dB(A)' },
      { timeSeconds: 15, label: 'System silence and reset' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: 'apt-01',
    requestId: 'req-01',
    requestRef: 'AFE-2026-0842',
    appointmentType: 'testing_commissioning_review',
    appointmentTypeLabel: 'Testing & Maintenance Review',
    title: 'Site Visit: Quarterly Fire Alarm Preventative Maintenance',
    description: 'Quarterly SANS 10139 routine device sampling, battery conductance check, and acoustic sounder pulse test.',
    date: '2026-09-10',
    siteName: 'Menlyn Central Corporate Tower',
    engineerName: 'Sipho Ndlovu (Lead Field Engineer)',
    startTime: '2026-09-10T09:00:00',
    endTime: '2026-09-10T13:00:00',
    timezone: 'Africa/Johannesburg',
    assignedStaff: 'Sipho Ndlovu',
    assignedStaffEmail: 'sipho@audrinfire.co.za',
    clientName: 'Bethuel Moukangwe',
    clientEmail: 'bethuelmoukangwe8@gmail.com',
    locationType: 'on_site',
    siteAddress: 'Menlyn Central Corporate Tower, 125 Dallas Ave, Pretoria',
    safePreparationNotes: 'Please ensure building security has logged the technician arrival and informed tenants that sounders may pulse briefly between 11:00 and 11:30.',
    googleCalendarEventId: 'gcal_evt_20260910_afe0842',
    syncStatus: 'synced',
    rsvpStatus: 'accepted',
    status: 'Confirmed'
  }
];

export const INITIAL_ZOOM_MEETING: ZoomMeetingDetails = {
  id: 'zm-01',
  requestId: 'req-01',
  appointmentId: 'apt-01',
  meetingTopic: 'Pre-Work Technical Scope & Cause-and-Effect Alignment',
  scheduledTime: '2026-09-03T10:00:00',
  durationMinutes: 45,
  meetingIdMasked: '849 •••• 2940',
  meetingIdReal: '849 7156 2940',
  passcodeMasked: '••••••',
  passcodeReal: 'AFE715',
  joinUrl: 'https://zoom.us/j/84971562940?pwd=audrinfireengineers',
  isHostReady: true,
  waitingRoomEnabled: true,
  participantConsentGiven: true,
  recordingStatus: 'completed'
};

export const INITIAL_AI_MINUTES: AiMeetingMinutes = {
  id: 'min-01',
  meetingId: 'zm-01',
  requestId: 'req-01',
  meetingTitle: 'Pre-Work Technical Scope & Cause-and-Effect Alignment',
  dateTime: '2026-09-02T10:00:00+02:00',
  attendees: [
    'Bethuel Moukangwe (Client Lead / Property Manager)',
    'Sipho Ndlovu (Lead Engineer / Audrin Fire Engineers)',
    'Kagiso Molefe (Technical Systems Specialist / Audrin Fire Engineers)'
  ],
  apologies: ['David Khumalo (Facility Security Officer)'],
  agenda: [
    '1. Review of Menlyn Central Tower 4-Loop panel history and recent false alarm indicators',
    '2. Scheduled quarterly maintenance scope and sounder testing time window',
    '3. Cause-and-effect HVAC air handling shutdown interlocks',
    '4. As-built zone chart updates and SANS 10139 logbook verification'
  ],
  executiveSummary: 'Audrin Fire Engineers met with facility management to finalize the scheduled quarterly inspection schedule for Menlyn Central Corporate Tower. The team confirmed that maintenance will proceed on September 10, 2026, with planned sounder audibility checks at 11:00. Interface tests for smoke dampers will be coordinated with the HVAC contractor.',
  discussionPoints: [
    {
      topic: 'Loop 2 Particulate Contamination',
      details: 'Client reported two intermittent false alarm alerts near the Level 3 return air grille. Engineer confirmed physical inspection and optical chamber cleaning will occur during the visit.',
      raisedBy: 'Bethuel Moukangwe'
    },
    {
      topic: 'Sounder Audibility Windows',
      details: 'Agreed that alarm bells and electronic sounders will only be pulsed between 11:00 and 11:30 AM to minimize corporate tenant disruption.',
      raisedBy: 'Sipho Ndlovu'
    },
    {
      topic: 'Emergency HVAC Damper Tripping',
      details: 'Facility team confirmed HVAC maintenance contractor will be on standby during the afternoon to verify damper close-state signals from the fire panel.',
      raisedBy: 'Kagiso Molefe'
    }
  ],
  clientConcerns: [
    'Minimizing sounder duration so boardroom video conferences are not interrupted.',
    'Ensuring an updated laminated zone chart is supplied for Ground Floor Security.'
  ],
  decisionsAgreed: [
    'Maintenance date locked for Thursday, 10 September 2026, starting at 09:00.',
    'Sounder testing strictly restricted to the 11:00–11:30 AM window with advance tenant broadcast.',
    'Pre-work condition report frozen and acknowledged by client before physical start.'
  ],
  actionItems: [
    {
      id: 'act-01',
      task: 'Issue tenant advance notice regarding scheduled 11:00 AM fire alarm sounder test',
      owner: 'Bethuel Moukangwe',
      dueDate: '2026-09-08',
      status: 'pending'
    },
    {
      id: 'act-02',
      task: 'Prepare calibrated solo aerosol testing poles, battery conductance analyser, and decibel meter',
      owner: 'Sipho Ndlovu',
      dueDate: '2026-09-09',
      status: 'in_progress'
    },
    {
      id: 'act-03',
      task: 'Draft revised Level 3 CAD as-built drawing showing relocated detector L2-D042',
      owner: 'Kagiso Molefe',
      dueDate: '2026-09-12',
      status: 'pending'
    }
  ],
  nextWorkflowStage: 'Installation & Testing Verification (Stage 6)',
  complianceDisclaimer: 'This meeting minutes document was generated with AI assistance from the consented audio recording and reviewed by Audrin Fire Engineers. This record is for coordination and operational management; it does not constitute statutory certification or a legal certificate of compliance.',
  version: 1,
  status: 'reviewed'
};

export const INITIAL_FAQS = [
  {
    question: 'What types of fire systems does Audrin Fire Engineers work on?',
    answer: 'We specialise exclusively in commercial and non-domestic fire-detection and alarm systems aligned with SANS 10139 recommendations. This includes conventional, addressable, and networked fire alarm panels, optical smoke, thermal, and multi-sensor detectors, manual call points, sounder beacons, cause-and-effect programming, and approved auxiliary interfaces.'
  },
  {
    question: 'Do you service fire extinguishers, hose reels, or water sprinklers?',
    answer: 'No. Audrin Fire Engineers focuses strictly on electronic fire-detection and alarm engineering. We do not supply or service fire extinguishers, hose reels, fire hydrants, water sprinklers, gas suppression systems, or general CCTV/security systems.'
  },
  {
    question: 'How often must our commercial fire alarm system be serviced under SANS 10139?',
    answer: 'SANS 10139 recommends quarterly periodic inspections (at intervals not exceeding 3 months) conducted by a competent fire alarm engineer, in addition to weekly user tests of a manual call point by the facility manager.'
  },
  {
    question: 'What is a fire alarm cause-and-effect matrix?',
    answer: 'A cause-and-effect matrix is an engineered logic table defining the exact building responses triggered by specific fire detection zones. This includes staged evacuation alerts, air handling unit (AHU) shutdowns, fire damper releases, and emergency magnetic door unlocks.'
  },
  {
    question: 'How do you handle persistent false alarms?',
    answer: 'We conduct methodical false-alarm investigations by downloading control panel historical event logs, assessing ambient dust, air velocity, and steam patterns, and replacing vulnerable sensors with multi-criteria optical-thermal devices or adjusting alarm verification delays.'
  },
  {
    question: 'What happens when I report a fire alarm fault?',
    answer: 'Your fault report enters our immediate triage queue. An automated tailored response confirms receipt and safe initial steps, while our operations desk reviews panel error codes and dispatches a senior engineer with appropriate diagnostic equipment.'
  }
];

export const FAQS = INITIAL_FAQS;

export const INDUSTRIES_SERVED = [
  {
    name: 'Corporate & Commercial Offices',
    description: 'Multi-storey office towers, corporate headquarters, and business parks requiring non-disruptive quarterly maintenance and staged evacuation controls.',
    icon: 'Building2'
  },
  {
    name: 'Logistics & Warehousing Hubs',
    description: 'High-bay storage facilities and distribution centres requiring high-level optical beam detection, aspiration systems, and robust zone identification.',
    icon: 'Warehouse'
  },
  {
    name: 'Industrial & Manufacturing',
    description: 'Processing plants and industrial facilities where ambient dust, heat, and vibration require multi-sensor detection and hardened containment.',
    icon: 'Factory'
  },
  {
    name: 'Healthcare & Medical Suites',
    description: 'Hospitals, clinics, and care homes requiring silent staff alarm alerts, zoned phased evacuation, and stringent false-alarm prevention.',
    icon: 'Hospital'
  },
  {
    name: 'Education & Institutional Campuses',
    description: 'Schools, university lecture halls, and student accommodation with tamper-resistant manual call points and networked control panels.',
    icon: 'GraduationCap'
  },
  {
    name: 'Retail Malls & Shopping Centres',
    description: 'High-footfall commercial retail environments requiring compliant visual alarm devices (VADs) and coordinated HVAC smoke extract integration.',
    icon: 'ShoppingBag'
  }
];

// =========================================================================
// SANS 10139 & SAQCC COMMISSIONER OFFICIAL BENCHMARK RULES & CRITERIA
// Derived directly from Summative POE Module SANS 10139 (Commissioner Exam)
// =========================================================================

export interface SansRuleDefinition {
  ruleNumber: string;
  category: 'objectives' | 'fault_times' | 'cabling' | 'audibility' | 'spacing_siting' | 'detector_types' | 'battery_power' | 'legend_symbols';
  title: string;
  requirementStatement: string;
  exactStandardValue: string;
  sourceQuestionId: string;
  isMandatory: boolean;
}

export const SANS_10139_RULES_BENCHMARK: SansRuleDefinition[] = [
  {
    ruleNumber: 'SANS-01A',
    category: 'objectives',
    title: 'Primary Fire Alarm Objectives',
    requirementStatement: 'Fire alarm systems may be installed in buildings to satisfy one, or both, of two principal objectives: Protection of Life and Protection of Property.',
    exactStandardValue: 'Life Safety (Category L) and Property Protection (Category P)',
    sourceQuestionId: '1a / 1c',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01B',
    category: 'objectives',
    title: 'Sleeping Risk Detection Mandate',
    requirementStatement: 'Manual fire alarm systems (Category M) are NOT sufficient to satisfy legislation in workplaces or facilities in which people sleep. Automatic fire detection is mandatory.',
    exactStandardValue: 'Automatic Detection Required (Category L1, L2, L3)',
    sourceQuestionId: '1b / 19b',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01G',
    category: 'fault_times',
    title: 'Circuit Fault Indication Maximum Time',
    requirementStatement: 'A fault indication should register at the control equipment within 200 seconds of a short or open circuit of a fire detector or manual call point.',
    exactStandardValue: '≤ 200 seconds',
    sourceQuestionId: '1g',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01H',
    category: 'fault_times',
    title: 'Mains Electrical Disconnection Fault Time',
    requirementStatement: 'The electrical disconnection fault indication time for Mains Failure must register at the panel within 30 minutes of occurrence.',
    exactStandardValue: '≤ 30 minutes (1800 seconds)',
    sourceQuestionId: '1h',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01I',
    category: 'fault_times',
    title: 'Single Fault Disablement Floor Area Limit',
    requirementStatement: 'A single short or open circuit fault shall not disable fire detection protection of more than 1,000 square meters.',
    exactStandardValue: '≤ 1,000 m² floor area',
    sourceQuestionId: '1i',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01J',
    category: 'cabling',
    title: 'Dual Sounder Circuit Sheath Segregation',
    requirementStatement: 'Where two (or more) sounder circuits are necessary, the circuits should not be contained within a common cable sheath.',
    exactStandardValue: 'Separate cable sheaths required',
    sourceQuestionId: '1j',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01K',
    category: 'cabling',
    title: 'Fire Resistance Cable Specification',
    requirementStatement: 'PH 30: The use of cables with "Enhanced" fire resistance is recommended for general fire detection use.',
    exactStandardValue: 'PH 30 Enhanced Fire Resistant',
    sourceQuestionId: '1k',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01L',
    category: 'cabling',
    title: 'Fire Alarm Circuit Cable Colour Coding',
    requirementStatement: 'In order to facilitate rapid identification of fire alarm circuits, cables should preferably be RED in colour.',
    exactStandardValue: 'Preferably RED colour',
    sourceQuestionId: '1l',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01M',
    category: 'cabling',
    title: 'Minimum Conductor Cross-Sectional Area',
    requirementStatement: 'All conductors used in fire detection circuits should have a cross-sectional area of at least 1.0 mm².',
    exactStandardValue: '≥ 1.0 mm²',
    sourceQuestionId: '1m',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01N',
    category: 'cabling',
    title: 'Conduit Segregation from Other Services',
    requirementStatement: 'To avoid the risk of mechanical damage and electromagnetic interference, fire alarm cables must NOT be installed within the same conduit as the cables of other services.',
    exactStandardValue: 'Strict conduit segregation (separate containment)',
    sourceQuestionId: '1n',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01O',
    category: 'cabling',
    title: 'Addressable System Class A Physical Circuitry',
    requirementStatement: 'All cables installed for an addressable fire detection system including detector lines and network connections shall be run as Class A circuits using physical conductors.',
    exactStandardValue: 'Class A loop topology with physical conductors',
    sourceQuestionId: '1o',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01R',
    category: 'audibility',
    title: 'Bedhead and Maximum Acoustic Sound Pressure',
    requirementStatement: 'Typical sound levels in buildings are not less than 65 dB(A) at the bedhead within rooms in which the system is intended to rouse people from sleep, and not greater than 130 dB(A) at any normally accessible point.',
    exactStandardValue: '≥ 65 dB(A) at bedhead | ≤ 130 dB(A) max',
    sourceQuestionId: '1r',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-01S',
    category: 'audibility',
    title: 'Minimum Sounder Count per Installation',
    requirementStatement: 'The system should incorporate at least two (2) fire alarm sounders, even if the recommended sound pressure levels could be achieved with one sounder.',
    exactStandardValue: '≥ 2 sounders minimum',
    sourceQuestionId: '1s',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-11',
    category: 'spacing_siting',
    title: 'Detector Spacing Under Flat Ceilings',
    requirementStatement: 'In open areas under flat horizontal ceilings, every point should lie within a horizontal distance of: 7.5 m to a Smoke Detector and 5.3 m to a Heat Detector.',
    exactStandardValue: 'Smoke: ≤ 7.5 m radius | Heat: ≤ 5.3 m radius',
    sourceQuestionId: '11 (43, 44)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-09',
    category: 'spacing_siting',
    title: 'Pitched Roof Spacing Slope Increase Formula',
    requirementStatement: 'If the protected area has a pitched ceiling, for detectors at or near the apex, the horizontal distances may be increased by 1% for each degree of slope, up to a maximum increase of 25%.',
    exactStandardValue: '+1% per degree of slope (Cap: max +25%)',
    sourceQuestionId: '9 (39, 40)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-10',
    category: 'spacing_siting',
    title: 'Apex Roof Height Difference Flat Ceiling Thresholds',
    requirementStatement: 'In apex roofs, fire detectors should be sited at or near each apex, except that if height difference between bottom and apex is < 600 mm (smoke) or < 150 mm (heat), the roof may be treated as flat.',
    exactStandardValue: 'Smoke: < 600 mm | Heat: < 150 mm',
    sourceQuestionId: '10 (41, 42) & 12 (45, 46)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-13',
    category: 'spacing_siting',
    title: 'Aspirating Smoke Sampling Points Apex Siting',
    requirementStatement: 'The siting of aspirating sampling points should comply with that of a point type smoke detector, i.e. within 600 mm of the apex of the roof.',
    exactStandardValue: '≤ 600 mm from roof apex',
    sourceQuestionId: '13 (47)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-14',
    category: 'spacing_siting',
    title: 'Optical Beam Smoke Detector Boundary Distance',
    requirementStatement: 'For the maximum mounting height of beam detectors, no part of the protected space must be more than 7.5 m from the nearest part of the beam.',
    exactStandardValue: '≤ 7.5 m from optical beam path',
    sourceQuestionId: '14 (48)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-20',
    category: 'spacing_siting',
    title: 'Wall and Ceiling Clearances for Detectors',
    requirementStatement: 'Detectors must maintain minimum 500 mm distance from walls. For wall mounting: minimum 25 mm and maximum 600 mm from the ceiling.',
    exactStandardValue: 'Min 25 mm to Max 600 mm from ceiling | Min 500 mm from wall',
    sourceQuestionId: '20 (a, b, c, d, e)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-21',
    category: 'spacing_siting',
    title: 'Manual Call Point (MCP) Mounting Height',
    requirementStatement: 'Manual call points must be mounted at a height of 1.4 m from the floor (permissible range 1.4 m ± 0.2 m, i.e., 1.2 m to 1.4 m).',
    exactStandardValue: '1.4 m from floor (±0.2 m)',
    sourceQuestionId: '21 (a, b)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-15',
    category: 'battery_power',
    title: 'Standby Battery Autonomy & Evacuation Signal Duration',
    requirementStatement: 'For Category M or Category L systems, battery capacity must maintain system in operation for at least 24 h, after which sufficient capacity remains to provide an "Evacuate" signal in all alarm zones for at least 30 min (unless automatic standby generator provided).',
    exactStandardValue: '≥ 24 Hours Standby + ≥ 30 Minutes Alarm',
    sourceQuestionId: '15 (49, 50)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-08',
    category: 'detector_types',
    title: 'Heat Detector Location Restrictions',
    requirementStatement: 'Heat detectors MUST NOT be used in: 1) Areas of Category P systems where a smouldering fire has potential to cause unacceptable damage; 2) Escape routes in Category L systems.',
    exactStandardValue: 'Prohibited in Cat P smouldering zones & Cat L escape corridors',
    sourceQuestionId: '8 (37, 38)',
    isMandatory: true
  },
  {
    ruleNumber: 'SANS-22',
    category: 'legend_symbols',
    title: 'SANS 10139 Floorplan Colour Coded Device Legend',
    requirementStatement: 'Standardized drawing device identifiers: Blue Dot = Smoke Detector, Black Dot = Heat Detector, Red Dot = Fire Alarms / Sirens, Green Dot = Manual Call Point.',
    exactStandardValue: 'Blue: Smoke | Black: Heat | Red: Sirens | Green: MCP',
    sourceQuestionId: '22 (a, b, c, d)',
    isMandatory: true
  }
];

// Initial SANS 10139 Seed Logbook Entries
export const INITIAL_SANS_LOGBOOK: SansLogbookEntry[] = [
  {
    id: 'log-01',
    siteId: 'site-menlyn-01',
    siteName: 'Menlyn Central Corporate Tower',
    entryType: 'daily',
    timestamp: '2026-09-02T07:30:00Z',
    date: '2026-09-02',
    time: '07:30',
    inspectedBy: 'Kagiso Molefe (Facility Supervisor)',
    inspectorIdOrSaqcc: 'FAC-MEN-004',
    notes: 'Daily routine inspection completed. Panel in quiescent normal state. Power ON LED illuminated green, no fault or disablement indicators active.',
    systemCategory: 'L1',
    quiescentStateOk: true,
    mainsFailTested: false,
    soundersAudibleOk: true,
    signatureHash: 'SIG-DLY-99420A'
  },
  {
    id: 'log-02',
    siteId: 'site-menlyn-01',
    siteName: 'Menlyn Central Corporate Tower',
    entryType: 'weekly',
    timestamp: '2026-08-31T09:00:00Z',
    date: '2026-08-31',
    time: '09:00',
    inspectedBy: 'Bethuel Moukangwe (Lead Fire Engineer)',
    inspectorIdOrSaqcc: 'SAQCC-9109170791081',
    notes: 'Weekly rotational Manual Call Point actuation test. MCP-GF-04 (Green Dot) tested using test key. Panel registered fire alarm within 2.1 seconds. Sounders in all zones active.',
    systemCategory: 'L1',
    quiescentStateOk: true,
    mcpTestedRef: 'MCP-GF-04 (Ground Floor East Escape Door)',
    soundersAudibleOk: true,
    dbMeasured: 78.5,
    sounderCountChecked: 8,
    signatureHash: 'SIG-WKL-88210B'
  },
  {
    id: 'log-03',
    siteId: 'site-menlyn-01',
    siteName: 'Menlyn Central Corporate Tower',
    entryType: 'fault',
    timestamp: '2026-08-28T14:15:00Z',
    date: '2026-08-28',
    time: '14:15',
    inspectedBy: 'Bethuel Moukangwe',
    inspectorIdOrSaqcc: 'SAQCC-9109170791081',
    notes: 'Open circuit fault registered on Loop 2 at address L2-D088 within 145 seconds (compliant with ≤ 200s SANS 10139 rule). Terminal screw retightened in base.',
    systemCategory: 'L1',
    faultType: 'open_circuit',
    deviceAddress: 'L2-D088 (Optical Smoke Detector - Level 4)',
    zone: 'Zone 4 - Level 4 Commercial Suites',
    faultCleared: true,
    clearedTimestamp: '2026-08-28T15:20:00Z',
    shortCircuitFaultTested: true,
    correctiveAction: 'Terminal reseated and class A return loop verified with multimeter (12.4 ohms continuity).',
    signatureHash: 'SIG-FLT-77140C'
  },
  {
    id: 'log-04',
    siteId: 'site-centurion-02',
    siteName: 'Centurion Logistics & Cold Storage Hub',
    entryType: 'quarterly',
    timestamp: '2026-08-15T11:00:00Z',
    date: '2026-08-15',
    time: '11:00',
    inspectedBy: 'Noko Dina Ramphela (SAQCC Commissioner)',
    inspectorIdOrSaqcc: 'SAQCC-9109170791081',
    notes: 'Quarterly periodic SANS 10139 inspection. 25% detector testing completed (32 optical smoke detectors & 8 optical beams). Standby battery autonomy calculated: 24h quiescent + 30m full alarm confirmed.',
    systemCategory: 'P1',
    quiescentStateOk: true,
    batteryVoltage: 27.4,
    batteryAutonomyVerified: true,
    mainsFailTested: true,
    classACircuitsVerified: true,
    cableIntegrityVerified: true,
    signatureHash: 'SIG-QTR-55420D'
  }
];

// Initial SANS 10139 Seed Certificates of Compliance (COC)
export const INITIAL_SANS_COCS: SansCocCertificate[] = [
  {
    id: 'coc-01',
    cocNumber: 'COC-SANS10139-2026-0842',
    issueDate: '2026-08-20',
    siteId: 'site-menlyn-01',
    siteName: 'Menlyn Central Corporate Tower',
    siteAddress: '125 Dallas Avenue, Menlyn, Pretoria, 0181',
    clientName: 'Bethuel Moukangwe',
    organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
    commissionerName: 'Noko Dina Ramphela',
    commissionerIdNumber: '9109170791081',
    commissionerEmail: 'rampheledina@gmail.com',
    commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2022/03/23',
    companyRegistrationNumber: 'K2026089596',
    systemCategory: 'L1',
    systemObjective: 'Dual Protection (Life & Property)',
    isSleepingRisk: false,
    buildingOccupancyType: 'Commercial Multi-Storey Office & Parking Structure',
    powerSupplyAutonomy: {
      mainsVoltage: 230,
      batteryType: 'VRLA Sealed Lead Acid (2x 12V 17Ah in series)',
      batteryCapacityAh: 17,
      standbyAutonomyHours: 24.5,
      evacuateAlarmDurationMinutes: 35,
      standbyGeneratorPresent: true,
      mainsFailIndicationTimeMinutes: 12,
      passed: true
    },
    cablingAndCircuits: {
      cableSpecification: 'PH 30 Enhanced Fire Resistant (Halogen Free)',
      conductorCrossSectionMm2: 1.5,
      cableColour: 'RED',
      conduitSegregationVerified: true,
      classACircuitsPhysicalConductors: true,
      singleFaultDisableLimitM2: 780,
      sounderCircuitsIsolatedInSeparateSheaths: true,
      passed: true
    },
    detectorSitingAndSpacing: {
      smokeDetectorSpacingRadiusM: 7.2,
      heatDetectorSpacingRadiusM: 4.8,
      pitchedRoofSlopeDegrees: 0,
      pitchedRoofSpacingAdjustmentPercent: 0,
      smokeApexRoofHeightThresholdMm: 0,
      heatApexRoofHeightThresholdMm: 0,
      beamDetectorMaxMountingRadiusM: 6.5,
      aspiratingSamplingPointsApexMm: 450,
      wallClearanceMm: 650,
      ceilingClearanceRangeMm: '25 mm to 150 mm',
      mcpMountingHeightM: 1.4,
      heatDetectorPlacementRulesCompliant: true,
      passed: true
    },
    audibilityAndSounders: {
      soundLevelBedheadDba: 75.2,
      maxSoundPressureAccessibleDba: 94.0,
      sounderCount: 16,
      passed: true
    },
    faultResponseTimes: {
      detectorShortOrOpenCircuitFaultSeconds: 165,
      mainsDisconnectionFaultMinutes: 18,
      passed: true
    },
    deviceSchedule: {
      blueDotSmokeDetectors: 124,
      blackDotHeatDetectors: 18,
      redDotSoundersSirens: 16,
      greenDotManualCallPoints: 14,
      flameDetectorsIrUv: 0,
      multiSensorDetectors: 22,
      aspiratingSamplingPoints: 8,
      opticalBeamDetectors: 4
    },
    variationsAndExclusions: 'None. SANS 10139 total L1 coverage installed in all areas including toilets, plant rooms, lift motor rooms, and service risers.',
    overallComplianceStatus: 'Fully Compliant',
    commissionerDeclaration: 'I hereby certify that the fire detection and alarm installation has been thoroughly inspected, tested point-to-point, and verified by me in accordance with SANS 10139 recommendations, manufacturer instructions, and SAQCC Commissioner standards.',
    isSigned: true,
    signatureHash: 'AFE-COC-9109170791081-2026-A19F',
    certificateStatus: 'Issued'
  },
  {
    id: 'coc-02',
    cocNumber: 'COC-SANS10139-2026-0914',
    issueDate: '2026-09-02',
    siteId: 'site-centurion-02',
    siteName: 'Tshivhase Logistics Hub & Cold Storage',
    siteAddress: '45 Industrial Ring Road, Centurion, Gauteng, 0157',
    clientName: 'Kagiso Lekota',
    organisationName: 'Apex Industrial Logistics Ltd',
    commissionerName: 'Noko Dina Ramphela',
    commissionerIdNumber: '9109170791081',
    commissionerEmail: 'rampheledina@gmail.com',
    commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2022/03/23',
    companyRegistrationNumber: 'K2026089596',
    systemCategory: 'P1',
    systemObjective: 'Property Protection',
    isSleepingRisk: false,
    buildingOccupancyType: 'High-Bay Warehousing & Cold Chain Facility',
    powerSupplyAutonomy: {
      mainsVoltage: 230,
      batteryType: 'VRLA Sealed Lead Acid (2x 12V 24Ah)',
      batteryCapacityAh: 24,
      standbyAutonomyHours: 24.0,
      evacuateAlarmDurationMinutes: 30,
      standbyGeneratorPresent: false,
      mainsFailIndicationTimeMinutes: 15,
      passed: true
    },
    cablingAndCircuits: {
      cableSpecification: 'PH 120 Fire Rated Cabling',
      conductorCrossSectionMm2: 1.5,
      cableColour: 'RED',
      conduitSegregationVerified: true,
      classACircuitsPhysicalConductors: true,
      singleFaultDisableLimitM2: 950,
      sounderCircuitsIsolatedInSeparateSheaths: true,
      passed: true
    },
    detectorSitingAndSpacing: {
      smokeDetectorSpacingRadiusM: 7.4,
      heatDetectorSpacingRadiusM: 5.1,
      pitchedRoofSlopeDegrees: 8,
      pitchedRoofSpacingAdjustmentPercent: 8,
      smokeApexRoofHeightThresholdMm: 550,
      heatApexRoofHeightThresholdMm: 120,
      beamDetectorMaxMountingRadiusM: 7.2,
      aspiratingSamplingPointsApexMm: 500,
      wallClearanceMm: 700,
      ceilingClearanceRangeMm: '50 mm to 200 mm',
      mcpMountingHeightM: 1.4,
      heatDetectorPlacementRulesCompliant: true,
      passed: true
    },
    audibilityAndSounders: {
      soundLevelBedheadDba: 68.0,
      maxSoundPressureAccessibleDba: 96.0,
      sounderCount: 12,
      passed: true
    },
    faultResponseTimes: {
      detectorShortOrOpenCircuitFaultSeconds: 180,
      mainsDisconnectionFaultMinutes: 20,
      passed: true
    },
    deviceSchedule: {
      blueDotSmokeDetectors: 64,
      blackDotHeatDetectors: 12,
      redDotSoundersSirens: 12,
      greenDotManualCallPoints: 8,
      flameDetectorsIrUv: 2,
      multiSensorDetectors: 10,
      aspiratingSamplingPoints: 4,
      opticalBeamDetectors: 6
    },
    variationsAndExclusions: 'Beam detectors installed in high bay loading portal with thermal stratification compensation.',
    overallComplianceStatus: 'Non-Compliant - Action Required',
    commissionerDeclaration: 'Draft submission awaiting secondary battery discharge test completion and municipal water pressure verification.',
    isSigned: false,
    signatureHash: '',
    certificateStatus: 'Draft',
    revisionNumber: 'Rev 0.2-Draft'
  },
  {
    id: 'coc-03',
    cocNumber: 'COC-SANS10139-2026-1022',
    issueDate: '2026-09-03',
    siteId: 'site-sandton-03',
    siteName: 'Sandton Gateway Medical Pavilion',
    siteAddress: '88 Rivonia Road, Sandton, Johannesburg, 2196',
    clientName: 'Dr. Sarah Van Der Merwe',
    organisationName: 'Life Healthcare Property Group',
    commissionerName: 'Mpho Sithole',
    commissionerIdNumber: '8804155123089',
    commissionerEmail: 'm.sithole@audrinfire.co.za',
    commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2024/07/11',
    companyRegistrationNumber: 'K2026089596',
    systemCategory: 'L2',
    systemObjective: 'Life Protection',
    isSleepingRisk: true,
    buildingOccupancyType: 'Healthcare & Day Surgery Clinic',
    powerSupplyAutonomy: {
      mainsVoltage: 230,
      batteryType: 'VRLA Sealed Lead Acid (4x 12V 17Ah in series-parallel)',
      batteryCapacityAh: 34,
      standbyAutonomyHours: 48.0,
      evacuateAlarmDurationMinutes: 60,
      standbyGeneratorPresent: true,
      mainsFailIndicationTimeMinutes: 10,
      passed: true
    },
    cablingAndCircuits: {
      cableSpecification: 'PH 120 Enhanced Halogen Free',
      conductorCrossSectionMm2: 2.5,
      cableColour: 'RED',
      conduitSegregationVerified: true,
      classACircuitsPhysicalConductors: true,
      singleFaultDisableLimitM2: 600,
      sounderCircuitsIsolatedInSeparateSheaths: true,
      passed: true
    },
    detectorSitingAndSpacing: {
      smokeDetectorSpacingRadiusM: 7.0,
      heatDetectorSpacingRadiusM: 4.5,
      pitchedRoofSlopeDegrees: 0,
      pitchedRoofSpacingAdjustmentPercent: 0,
      smokeApexRoofHeightThresholdMm: 0,
      heatApexRoofHeightThresholdMm: 0,
      beamDetectorMaxMountingRadiusM: 6.0,
      aspiratingSamplingPointsApexMm: 400,
      wallClearanceMm: 600,
      ceilingClearanceRangeMm: '30 mm to 100 mm',
      mcpMountingHeightM: 1.35,
      heatDetectorPlacementRulesCompliant: true,
      passed: true
    },
    audibilityAndSounders: {
      soundLevelBedheadDba: 76.5,
      maxSoundPressureAccessibleDba: 92.0,
      sounderCount: 18,
      passed: true
    },
    faultResponseTimes: {
      detectorShortOrOpenCircuitFaultSeconds: 150,
      mainsDisconnectionFaultMinutes: 15,
      passed: true
    },
    deviceSchedule: {
      blueDotSmokeDetectors: 88,
      blackDotHeatDetectors: 14,
      redDotSoundersSirens: 18,
      greenDotManualCallPoints: 12,
      flameDetectorsIrUv: 0,
      multiSensorDetectors: 16,
      aspiratingSamplingPoints: 6,
      opticalBeamDetectors: 2
    },
    variationsAndExclusions: 'Surgical recovery suites equipped with low-frequency 520Hz sounders to prevent acute panic.',
    overallComplianceStatus: 'Non-Compliant - Action Required',
    commissionerDeclaration: 'Provisional draft pending surgical theatre acoustic sounder dB(A) verification and final client signature.',
    isSigned: false,
    signatureHash: '',
    certificateStatus: 'Draft',
    revisionNumber: 'Rev 0.1-Provisional'
  }
];
