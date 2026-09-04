import { 
  VacancyRecord, 
  TechnicianAccount, 
  TechnicianJobApplication, 
  EmailDispatchLog 
} from '../types';

export const INITIAL_VACANCIES: VacancyRecord[] = [
  {
    id: 'vac-001',
    referenceNumber: 'AFE-VAC-2026-001',
    jobTitle: 'SAQCC Registered Fire Detection Commissioner',
    location: 'Pretoria & Johannesburg Central, Gauteng',
    province: 'Gauteng',
    employmentType: 'Permanent Full-time',
    department: 'Commissioning & Statutory Compliance',
    duties: [
      'Conduct point-to-point wiring and addressable device commissioning per SANS 10139:2012 Clause 21.',
      'Perform cause-and-effect matrix testing across fire control panels (Ziton, Kentec, Advanced, Edwards EST3).',
      'Execute secondary power supply autonomy discharge tests (≥ 24h standby + 30 min evacuation alarm load).',
      'Conduct calibrated sound pressure level measurements (≥ 65 dB(A) escape routes / ≥ 75 dB(A) bedhead).',
      'Issue and sign statutory SANS 10139 Certificates of Compliance (COC) under registered SAQCC authority.',
      'Supervise installation teams and verify installation cable integrity and loop resistance before sign-off.'
    ],
    minimumRequirements: [
      'Valid Registered SAQCC Fire Commissioner Certification (Level 4/5).',
      'Minimum 5+ years commercial/industrial fire detection and life-safety engineering experience.',
      'In-depth mastery of SANS 10139, SANS 10400-T, SANS 246 (electronic equipment rooms), and OHS Act.',
      'Valid unendorsed Code 8 (B) or Code 10 (C1) South African Driver’s Licence.',
      'Demonstrated experience with addressable loop programming software and diagnostic tools.'
    ],
    requiredCertifications: [
      'SAQCC Fire 1475 / Detection Commissioner Registration',
      'SANS 10139 Certificate of Competence',
      'Working at Heights / Fall Protection Certificate'
    ],
    closingDate: '2026-10-31',
    isPublished: true,
    isClosed: false,
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    screeningQuestions: [
      {
        id: 'sq-1',
        question: 'Are you currently registered with SAQCC Fire as a Certified Commissioner?',
        type: 'yes_no',
        required: true,
        idealAnswerNote: 'Yes - Required for statutory sign-off'
      },
      {
        id: 'sq-2',
        question: 'How many years of direct hands-on experience do you have with SANS 10139 commissioning?',
        type: 'years_number',
        required: true,
        idealAnswerNote: '5+ years preferred'
      },
      {
        id: 'sq-3',
        question: 'Which fire alarm panel architectures have you actively programmed and commissioned (e.g. Ziton, Kentec, Advanced, Morley)?',
        type: 'text',
        required: true,
        idealAnswerNote: 'Ziton ZP3/ZP2, Kentec Taktis, Advanced Axis AX'
      },
      {
        id: 'sq-4',
        question: 'Do you hold a valid South African Driver’s Licence with clean driving record?',
        type: 'yes_no',
        required: true
      }
    ]
  },
  {
    id: 'vac-002',
    referenceNumber: 'AFE-VAC-2026-002',
    jobTitle: 'Senior Fire Alarm Installation & Cabling Technician',
    location: 'Centurion & Midrand Corridor, Gauteng',
    province: 'Gauteng',
    employmentType: 'Permanent Full-time',
    department: 'Field Installations',
    duties: [
      'Install PH30 / PH120 fire-resistant rated cabling, galvanised conduits, and heavy-duty wire-mesh tray.',
      'Mount and terminate optical smoke detectors, rate-of-rise heat sensors, manual call points (at 1.4m AFF), and sounder beacons.',
      'Terminate main CIE panels, repeater panels, and loop interface input/output modules.',
      'Perform loop continuity, insulation resistance (Megger), and loop impedance verification before power-up.',
      'Maintain site daily progress logs, as-built markup drawings, and photographic quality evidence.'
    ],
    minimumRequirements: [
      'Valid SAQCC Fire Cabler or Installer Registration.',
      'Minimum 3+ years commercial fire alarm installation experience.',
      'Sound knowledge of SANS 10139 cabling standards and detector spacing rules (7.5m smoke / 5.3m heat radius).',
      'Valid Code 8 Driver’s Licence.',
      'Clean safety record and ability to work on commercial construction and corporate fit-out sites.'
    ],
    requiredCertifications: [
      'SAQCC Fire Installer / Cabler Registration',
      'Basic Fire Awareness & OHS Induction'
    ],
    closingDate: '2026-11-15',
    isPublished: true,
    isClosed: false,
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
    screeningQuestions: [
      {
        id: 'sq-201',
        question: 'Do you have valid SAQCC Cabler or Installer registration?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'sq-202',
        question: 'How many years of experience do you have with fire-rated cable installation and containment?',
        type: 'years_number',
        required: true
      },
      {
        id: 'sq-203',
        question: 'Are you comfortable working on step ladders, mobile scaffolds, or high-bay cherry pickers?',
        type: 'yes_no',
        required: true
      }
    ]
  },
  {
    id: 'vac-003',
    referenceNumber: 'AFE-VAC-2026-003',
    jobTitle: 'Fire Detection Maintenance & Servicing Specialist',
    location: 'Pretoria East & Silverton Industrial, Gauteng',
    province: 'Gauteng',
    employmentType: 'Permanent Full-time',
    department: 'Preventative Maintenance & SLA',
    duties: [
      'Perform quarterly preventative maintenance inspections per SANS 10139 Clause 22.',
      'Execute aerosol smoke chamber sensitivity tests and thermal probe activation checks.',
      'Conduct standby lead-acid / VRLA battery internal resistance and conductance tests.',
      'Diagnose and clear open-circuit, short-circuit, and loop device missing faults.',
      'Update on-site digital and physical fire logbooks with exact test records and commissioner signatures.'
    ],
    minimumRequirements: [
      'Valid SAQCC Fire Servicing Technician Registration.',
      'Minimum 2+ years field maintenance and servicing experience in commercial properties.',
      'Proficiency in diagnostic multimeters, acoustic decibel meters, and solo detector test poles.',
      'Valid Code 8 Driver’s Licence.'
    ],
    requiredCertifications: [
      'SAQCC Fire Servicing Registration',
      'First Aid Level 1 (Advantageous)'
    ],
    closingDate: '2026-11-30',
    isPublished: true,
    isClosed: false,
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-09-01T14:00:00Z',
    screeningQuestions: [
      {
        id: 'sq-301',
        question: 'Are you registered with SAQCC Fire as a Servicing Technician?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'sq-302',
        question: 'Do you have experience with digital logbook entries and battery load testing?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'sq-303',
        question: 'What is your notice period with your current employer?',
        type: 'text',
        required: true,
        idealAnswerNote: 'Immediate or 2 Weeks'
      }
    ]
  },
  {
    id: 'vac-004',
    referenceNumber: 'AFE-VAC-2026-004',
    jobTitle: 'Junior Fire Systems Field Assistant (Trainee / Apprentice)',
    location: 'Pretoria Central, Gauteng',
    province: 'Gauteng',
    employmentType: 'Fixed-Term Contract',
    department: 'Engineering Training Academy',
    duties: [
      'Assist certified technicians with site setup, tool staging, and safety demarcations.',
      'Support routine testing by activating manual call points with test keys during scheduled rotations.',
      'Assist with cable pulling, containment bracket installation, and labeling of loop cables.',
      'Learn SANS 10139 standards and prepare for SAQCC Cabler certification.'
    ],
    minimumRequirements: [
      'Grade 12 / Matric with Mathematics and Physical Science or Electrical N2/N3.',
      'Passion for electrical life-safety and fire-detection engineering.',
      'Good physical fitness and attention to detail.',
      'Valid South African ID.'
    ],
    requiredCertifications: [
      'Matric / NQF Level 4 Certificate'
    ],
    closingDate: '2026-09-30',
    isPublished: true,
    isClosed: false,
    createdAt: '2026-08-28T14:00:00Z',
    updatedAt: '2026-09-01T16:00:00Z',
    screeningQuestions: [
      {
        id: 'sq-401',
        question: 'Do you hold a Grade 12 (Matric) certificate or Electrical N2/N3 qualification?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'sq-402',
        question: 'Are you interested in pursuing a full career as a registered SAQCC Fire Detection Commissioner?',
        type: 'yes_no',
        required: true
      }
    ]
  }
];

export const INITIAL_TECHNICIANS: TechnicianAccount[] = [
  {
    id: 'tech-001',
    fullName: 'Kagiso Tebogo Mokoena',
    email: 'kagiso.mokoena@firetechnicians.co.za',
    cellphone: '+27 82 459 1190',
    passwordHash: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isEmailVerified: true,
    emailVerifiedAt: '2026-08-20T10:15:00Z',
    popiaConsentAccepted: true,
    popiaConsentTimestamp: '2026-08-20T10:14:00Z',
    privacyPolicyAccepted: true,
    createdAt: '2026-08-20T10:14:00Z',
    updatedAt: '2026-09-01T09:00:00Z',
    residentialAddress: '48 Pretorius Street, Hatfield, Pretoria',
    province: 'Gauteng',
    postalCode: '0083',
    saqccNumber: 'SAQCC-FD-2024-8841',
    saqccExpiryDate: '2027-11-30',
    saqccCategories: ['commissioner', 'installer', 'servicing_technician'],
    qualifications: [
      'National Diploma in Electrical Engineering (Tshwane University of Technology)',
      'SAQCC Fire Detection Commissioner Certificate (Level 4)',
      'SANS 10139 Master Certification (Fire Protection Association of SA)',
      'Ziton ZP3 & Kentec Taktis Factory Certified Programmer'
    ],
    sans10139ExperienceSummary: 'Over 6 years of dedicated commercial fire alarm commissioning, addressable network programming, sound pressure decibel testing, and issuing statutory SANS 10139 Certificates of Compliance for high-rise commercial buildings in Pretoria and Sandton.',
    yearsOfExperience: 6,
    driverLicense: 'Code 8 (B)',
    availability: '2 Weeks Notice',
    preferredLocations: ['Gauteng (Pretoria & Johannesburg)', 'North West (Brits/Rustenburg)'],
    documents: [
      {
        id: 'doc-km-01',
        name: 'Kagiso_Mokoena_CV_2026.pdf',
        type: 'cv',
        fileSizeBytes: 1450000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-08-20T10:16:00Z',
        malwareScanStatus: 'clean',
        contentHashSha256: 'sha256-km-cv-78a9c1f2',
        downloadUrl: '#'
      },
      {
        id: 'doc-km-02',
        name: 'SAQCC_Commissioner_Card_2026.pdf',
        type: 'saqcc_certificate',
        fileSizeBytes: 890000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-08-20T10:17:00Z',
        malwareScanStatus: 'clean',
        contentHashSha256: 'sha256-km-saqcc-9182bb',
        downloadUrl: '#'
      },
      {
        id: 'doc-km-03',
        name: 'ID_Document_Certified.pdf',
        type: 'id_document',
        fileSizeBytes: 720000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-08-20T10:18:00Z',
        malwareScanStatus: 'clean',
        contentHashSha256: 'sha256-km-id-1849a',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'tech-002',
    fullName: 'Jaco Van Der Merwe',
    email: 'jaco.vdm@alarmsystems.co.za',
    cellphone: '+27 71 884 9021',
    passwordHash: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isEmailVerified: true,
    emailVerifiedAt: '2026-08-22T14:30:00Z',
    popiaConsentAccepted: true,
    popiaConsentTimestamp: '2026-08-22T14:28:00Z',
    privacyPolicyAccepted: true,
    createdAt: '2026-08-22T14:28:00Z',
    updatedAt: '2026-08-22T15:00:00Z',
    residentialAddress: '12 Rooihuiskraal Road, Centurion',
    province: 'Gauteng',
    postalCode: '0157',
    saqccNumber: 'SAQCC-FD-2025-4190',
    saqccExpiryDate: '2027-04-15',
    saqccCategories: ['installer', 'cabler'],
    qualifications: [
      'N3 Certificate in Electrical Engineering',
      'SAQCC Fire Installer Card',
      'Advanced Mineral Insulated Cable Routing Certification'
    ],
    sans10139ExperienceSummary: '4 years of experience specializing in containment conduit, PH120 fire-resistant cable installation, loop termination, detector base mounting, and zone chart verification.',
    yearsOfExperience: 4,
    driverLicense: 'Code 10 (C1)',
    availability: 'Immediate',
    preferredLocations: ['Gauteng (Centurion, Midrand, Pretoria)'],
    documents: [
      {
        id: 'doc-jaco-01',
        name: 'Jaco_VDM_Resume.pdf',
        type: 'cv',
        fileSizeBytes: 1200000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-08-22T14:32:00Z',
        malwareScanStatus: 'clean',
        contentHashSha256: 'sha256-jvdm-cv-8914',
        downloadUrl: '#'
      }
    ]
  }
];

export const INITIAL_APPLICATIONS: TechnicianJobApplication[] = [
  {
    id: 'app-001',
    referenceNumber: 'APP-2026-9814',
    vacancyId: 'vac-001',
    vacancyRef: 'AFE-VAC-2026-001',
    jobTitle: 'SAQCC Registered Fire Detection Commissioner',
    applicantId: 'tech-001',
    applicantName: 'Kagiso Tebogo Mokoena',
    applicantEmail: 'kagiso.mokoena@firetechnicians.co.za',
    applicantPhone: '+27 82 459 1190',
    submittedAt: '2026-08-20T11:00:00Z',
    status: 'Interview Scheduled',
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: '2026-08-20T11:00:00Z',
        changedBy: 'Kagiso Tebogo Mokoena'
      },
      {
        status: 'Under Review',
        timestamp: '2026-08-21T09:30:00Z',
        changedBy: 'Russia Bethuel Moukangwe (Lead Commissioner)',
        notes: 'SAQCC Commissioner registration verified on SAQCC central register. Valid until Nov 2027.'
      },
      {
        status: 'Shortlisted',
        timestamp: '2026-08-23T14:00:00Z',
        changedBy: 'Audrin Recruitment Team',
        notes: 'Strong alignment with SANS 10139 high-rise commissioning portfolio. Ziton & Kentec certified.'
      },
      {
        status: 'Interview Scheduled',
        timestamp: '2026-08-26T10:00:00Z',
        changedBy: 'Russia Bethuel Moukangwe',
        notes: 'Technical panel interview scheduled at Pretoria Head Office.'
      }
    ],
    profileSnapshot: {
      residentialAddress: '48 Pretorius Street, Hatfield, Pretoria',
      province: 'Gauteng',
      saqccNumber: 'SAQCC-FD-2024-8841',
      saqccExpiryDate: '2027-11-30',
      saqccCategories: ['commissioner', 'installer', 'servicing_technician'],
      yearsOfExperience: 6,
      driverLicense: 'Code 8 (B)',
      availability: '2 Weeks Notice',
      preferredLocations: ['Gauteng (Pretoria & Johannesburg)'],
      sans10139ExperienceSummary: 'Over 6 years of commercial fire alarm commissioning, addressable network programming, sound pressure decibel testing, and issuing statutory SANS 10139 COCs.',
      documentsCount: 3,
      cvDocumentId: 'doc-km-01',
      saqccDocumentId: 'doc-km-02'
    },
    answers: [
      {
        questionId: 'sq-1',
        questionText: 'Are you currently registered with SAQCC Fire as a Certified Commissioner?',
        answer: 'Yes - Registered Commissioner SAQCC-FD-2024-8841 (Level 4)'
      },
      {
        questionId: 'sq-2',
        questionText: 'How many years of direct hands-on experience do you have with SANS 10139 commissioning?',
        answer: '6 years of hands-on commissioning and sound level verification'
      },
      {
        questionId: 'sq-3',
        questionText: 'Which fire alarm panel architectures have you actively programmed and commissioned?',
        answer: 'Ziton ZP3, Kentec Taktis, Advanced MX-5000, Edwards EST3'
      },
      {
        questionId: 'sq-4',
        questionText: 'Do you hold a valid South African Driver’s Licence with clean driving record?',
        answer: 'Yes, unendorsed Code 8 (B)'
      }
    ],
    additionalDocuments: [],
    internalNotes: [
      {
        id: 'note-01',
        author: 'Russia Bethuel Moukangwe',
        createdAt: '2026-08-21T09:35:00Z',
        text: 'Candidate has excellent portfolio in high-rise Category L1 installations. Verified his SAQCC card validity with SAQCC registry.'
      },
      {
        id: 'note-02',
        author: 'Audrin Recruitment HR',
        createdAt: '2026-08-26T10:05:00Z',
        text: 'Confirmed interview availability for 8 September 2026 at 10:00 AM. Sent preparation brief covering SANS 10139 standby battery calculations.'
      }
    ],
    interviewDetails: {
      scheduledDateTime: '2026-09-08T10:00:00Z',
      locationOrMeetingUrl: 'Audrin Fire Engineers HQ, 125 Dallas Avenue, Menlyn, Pretoria (Boardroom A)',
      interviewType: 'in_person',
      interviewers: [
        'Russia Bethuel Moukangwe (Managing Director / SAQCC Commissioner)',
        'Sipho Ndlovu (Lead Field Engineer)'
      ],
      instructions: 'Please bring original SAQCC card, certified ID copy, and recent commissioning portfolio examples.',
      notes: 'Technical practical assessment on Kentec Taktis cause/effect matrix will be conducted.'
    },
    accuracyDeclarationConfirmed: true,
    receiptHashSha256: 'sha256-a1b2c3d4e5f6g7h89814-audrin-app-2026'
  },
  {
    id: 'app-002',
    referenceNumber: 'APP-2026-4190',
    vacancyId: 'vac-002',
    vacancyRef: 'AFE-VAC-2026-002',
    jobTitle: 'Senior Fire Alarm Installation & Cabling Technician',
    applicantId: 'tech-002',
    applicantName: 'Jaco Van Der Merwe',
    applicantEmail: 'jaco.vdm@alarmsystems.co.za',
    applicantPhone: '+27 71 884 9021',
    submittedAt: '2026-08-22T15:30:00Z',
    status: 'Shortlisted',
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: '2026-08-22T15:30:00Z',
        changedBy: 'Jaco Van Der Merwe'
      },
      {
        status: 'Under Review',
        timestamp: '2026-08-24T08:30:00Z',
        changedBy: 'Russia Bethuel Moukangwe'
      },
      {
        status: 'Shortlisted',
        timestamp: '2026-08-28T11:00:00Z',
        changedBy: 'Audrin Recruitment Team',
        notes: 'Good candidate for Centurion & Midrand commercial fit-out projects.'
      }
    ],
    profileSnapshot: {
      residentialAddress: '12 Rooihuiskraal Road, Centurion',
      province: 'Gauteng',
      saqccNumber: 'SAQCC-FD-2025-4190',
      saqccExpiryDate: '2027-04-15',
      saqccCategories: ['installer', 'cabler'],
      yearsOfExperience: 4,
      driverLicense: 'Code 10 (C1)',
      availability: 'Immediate',
      preferredLocations: ['Gauteng (Centurion, Midrand, Pretoria)'],
      sans10139ExperienceSummary: '4 years experience with containment conduit, PH120 fire-rated cables, loop wiring and terminations.',
      documentsCount: 1,
      cvDocumentId: 'doc-jaco-01'
    },
    answers: [
      {
        questionId: 'sq-201',
        questionText: 'Do you have valid SAQCC Cabler or Installer registration?',
        answer: 'Yes, SAQCC Installer valid until April 2027'
      },
      {
        questionId: 'sq-202',
        questionText: 'How many years of experience do you have with fire-rated cable installation and containment?',
        answer: '4 years full-time commercial installation'
      },
      {
        questionId: 'sq-203',
        questionText: 'Are you comfortable working on step ladders, mobile scaffolds, or high-bay cherry pickers?',
        answer: 'Yes, certified for working at heights'
      }
    ],
    additionalDocuments: [],
    internalNotes: [
      {
        id: 'note-03',
        author: 'Sipho Ndlovu',
        createdAt: '2026-08-28T11:05:00Z',
        text: 'Immediate availability is ideal for our upcoming Menlyn Tower Level 4 loop expansion.'
      }
    ],
    accuracyDeclarationConfirmed: true,
    receiptHashSha256: 'sha256-x9y8z7w6v5u4-4190-audrin-app-2026'
  }
];

export const INITIAL_EMAIL_LOGS: EmailDispatchLog[] = [
  {
    id: 'em-001',
    recipientEmail: 'kagiso.mokoena@firetechnicians.co.za',
    recipientName: 'Kagiso Tebogo Mokoena',
    subject: 'Application Received – SAQCC Registered Fire Detection Commissioner – AFE-VAC-2026-001',
    body: `Dear Kagiso Tebogo Mokoena,\n\nThank you for applying for the position of SAQCC Registered Fire Detection Commissioner at Audrin Fire Engineers. Your application was successfully received on 2026-08-20 11:00.\n\nApplication reference: APP-2026-9814\n\nWe will contact you if you are shortlisted. You can log in to your account to monitor the application status.\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
    sentAt: '2026-08-20T11:00:02Z',
    type: 'application_confirmation',
    applicationRef: 'APP-2026-9814',
    deliveryStatus: 'delivered'
  },
  {
    id: 'em-002',
    recipientEmail: 'careers@audrinfire.co.za',
    recipientName: 'Audrin Recruitment Administrator',
    subject: 'New Application Alert: Kagiso Tebogo Mokoena (AFE-VAC-2026-001)',
    body: `Notification: New candidate application received.\n\nPosition: SAQCC Registered Fire Detection Commissioner\nReference: APP-2026-9814\nApplicant: Kagiso Tebogo Mokoena\nSAQCC Number: SAQCC-FD-2024-8841 (Commissioner)\nExperience: 6 Years\n\nReview this application in the Executive Recruitment Dashboard.`,
    sentAt: '2026-08-20T11:00:03Z',
    type: 'admin_notification',
    applicationRef: 'APP-2026-9814',
    deliveryStatus: 'delivered'
  },
  {
    id: 'em-003',
    recipientEmail: 'kagiso.mokoena@firetechnicians.co.za',
    recipientName: 'Kagiso Tebogo Mokoena',
    subject: 'Interview Invitation – SAQCC Registered Fire Detection Commissioner (APP-2026-9814)',
    body: `Dear Kagiso Tebogo Mokoena,\n\nWe are pleased to invite you for a technical panel interview for the SAQCC Registered Fire Detection Commissioner position.\n\nDate & Time: 8 September 2026 at 10:00 AM\nLocation: Audrin Fire Engineers HQ, 125 Dallas Avenue, Menlyn, Pretoria (Boardroom A)\nInterviewers: Russia Bethuel Moukangwe (Managing Director / SAQCC Commissioner), Sipho Ndlovu\n\nPlease bring your original SAQCC card and certified ID.\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
    sentAt: '2026-08-26T10:05:00Z',
    type: 'interview_invitation',
    applicationRef: 'APP-2026-9814',
    deliveryStatus: 'delivered'
  }
];

export const SAQCC_CATEGORIES_LIST: { id: string; label: string; description: string; sansRef: string }[] = [
  {
    id: 'commissioner',
    label: 'Commissioning Technician / Commissioner',
    description: 'Statutory SANS 10139 point-to-point verification, cause-and-effect matrix testing, and issuing Certificates of Compliance (COC).',
    sansRef: 'SANS 10139 Clause 21 / SAQCC Fire Registration'
  },
  {
    id: 'installer',
    label: 'Installation Technician',
    description: 'Installation of fire detection control panels, field devices, call points, and fire-resistant cabling networks.',
    sansRef: 'SANS 10139 Clause 20 / SANS 10400-T'
  },
  {
    id: 'cabler',
    label: 'Cabling & Containment Specialist',
    description: 'Routing of PH30/PH120 fire-resistant cables, mineral insulated cable termination, and conduit containment.',
    sansRef: 'SANS 10139 Clause 19'
  },
  {
    id: 'designer',
    label: 'Fire System Designer',
    description: 'System category determination (M, L1–L5, P1–P2), detector spacing calculations, and sounder acoustic engineering.',
    sansRef: 'SANS 10139 Clause 6–18'
  },
  {
    id: 'servicing_technician',
    label: 'Servicing & Maintenance Technician',
    description: 'Quarterly and annual preventative maintenance, detector cleaning, battery discharge testing, and logbook entries.',
    sansRef: 'SANS 10139 Clause 22'
  }
];

export const PROVINCES_LIST = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
];
