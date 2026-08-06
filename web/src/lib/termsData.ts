export interface TermArticle {
  id: string;
  chapter: string;
  chapterTitle: string;
  articleNumber: string;
  title: string;
  content: string[];
}

export const TERMS_DATA = {
  KO: {
    title: '온라인 채용 및 일자리 매칭 플랫폼 서비스 이용약관',
    subtitle: '본 약관은 2026년 개정 전자상거래법, 약관규제법, 개인정보 보호법 및 공정거래위원회 약관 심사 가이드라인을 철저히 반영하여 설계되었습니다.',
    chapters: [
      {
        id: 'ch1',
        title: '제1장 공통 일반 조항 (플랫폼의 지위, 회원가입, 해지, AI 자동화 처리 등)',
        articles: [
          {
            id: 'art-1',
            number: '제1조',
            title: '목적',
            content: [
              '본 약관은 "주식회사 KHIRE" (이하 "회사")이 운영하는 온라인 채용 및 일자리 매칭 사이트(이하 "플랫폼")에서 제공하는 모든 서비스(이하 "서비스")를 이용함에 있어, "회사"와 "회원" 간의 권리, 의무, 책임사항 및 서비스 이용 절차를 규정함을 목적으로 합니다.',
            ],
          },
          {
            id: 'art-2',
            number: '제2조',
            title: '회사의 지위 및 단순 중개 고지',
            content: [
              '"회사"는 통신판매중개업자로서, 채용을 원하는 기업(이하 "채용기업")과 일자리를 찾는 개인(이하 "지원자") 간의 거래 및 일자리 매칭을 위한 온라인 시스템과 툴을 제공할 뿐이며, 채용 계약 또는 용역 계약의 당사자가 아닙니다.',
              '"회사"는 채용기업과 지원자 간에 발생하는 채용 여부, 근로 계약 조건의 적법성, 임금 및 용역비 지급 등 일체의 거래 행위에 대해 직접적인 책임을 부담하지 않습니다. 각 회원은 자기 책임 하에 계약을 체결하고 이행하여야 합니다.',
              '단, "회사"의 고의 또는 중과실로 인하여 플랫폼 시스템의 결함이 발생하거나 개인정보가 유출되는 등 "회사"의 귀책사유가 입증된 경우에는 관계 법령에 따른 책임을 부담합니다.',
            ],
          },
          {
            id: 'art-3',
            number: '제3조',
            title: '약관의 명시, 효력 및 변경',
            content: [
              '"회사"는 본 약관의 내용을 "회원"이 쉽게 확인할 수 있도록 플랫폼의 초기 화면 또는 연결 화면에 게시합니다.',
              '"회사"가 약관을 변경할 경우, 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 개정 약관 적용일 7일 전(회원에게 불리하거나 중대한 사항의 변경은 30일 전)부터 플랫폼 내에 공지하고 회원에게 개별 통지(이메일, 문자 등)합니다.',
              '"회사"는 "회원"에게 불리한 약관 개정 시, 회원의 일방적인 동의를 강제하거나 묵시적 동의를 유도하는 방식을 배제하며, 회원이 개정 약관에 동의하지 않을 경우 자유롭게 회원 탈퇴(계약 해지)를 할 수 있는 권리를 보장합니다.',
            ],
          },
          {
            id: 'art-4',
            number: '제4조',
            title: '회원가입 및 동의 UI 준수',
            content: [
              '플랫폼 서비스 이용을 위한 회원가입 시, "회사"는 필수 동의 항목과 선택 동의 항목(마케팅 수신 등)을 명확히 구분하여 시각적으로 인지하기 쉽게 UI를 제공합니다.',
              '"회사"는 선택 동의 항목에 대해 "미리 체크된 상자(Pre-ticked box)"를 제공하는 등 소비자의 착오를 유발하는 다크패턴(눈속임 설계) 행위를 엄격히 금지합니다.',
              '"회원"이 마케팅 정보 수신 등 선택 사항에 동의하지 않는다는 이유로 필수적인 플랫폼 서비스 이용을 거부하거나 가입을 거절하지 않습니다.',
            ],
          },
          {
            id: 'art-5',
            number: '제5조',
            title: 'AI 자동화 처리 및 맞춤형 매칭 정보 고지',
            content: [
              '"회사"는 알고리즘 및 인공지능(AI) 기술을 활용하여 지원자에게는 맞춤형 일자리를 추천하고, 채용기업에게는 적합한 인재 정보를 추천할 수 있습니다.',
              'AI 매칭 등 완전히 자동화된 결정이 "회원"의 권리나 의무에 중대한 영향(예: 특정 채용 제한, 회원 자격의 자동 제한 등)을 미치는 경우, "회사"는 해당 자동화 결정의 기준, 사용되는 주요 데이터 항목 및 처리 절차를 플랫폼 내에 투명하게 공개합니다.',
              '"회원"은 자동화된 매칭 및 결정에 대해 설명 요구권 및 거부권을 행사할 수 있으며, 이 경우 "회사"는 정당한 사유가 없는 한 사람이 직접 재검토하는 등의 조치를 취합니다.',
            ],
          },
          {
            id: 'art-6',
            number: '제6조',
            title: '정기결제 및 유료 서비스 전환',
            content: [
              '채용기업 등이 유료 채용 광고나 멤버십 등 정기결제 서비스를 이용할 경우, "회사"는 대금 증액 또는 유료 서비스로의 전환 시 사전에 해당 회원으로부터 명확하고 구체적인 동의를 받아야 합니다.',
              '"회사"는 정기결제 해지 또는 유료 서비스 취소 절차를 가입 단계보다 복잡하게 설계하거나 정당한 사유 없이 방해하지 않으며, 온라인상에서 간편하게 취소할 수 있는 시스템을 제공합니다.',
            ],
          },
        ],
      },
      {
        id: 'ch2',
        title: '제2장 채용기업 회원(B2B) 특별약관',
        articles: [
          {
            id: 'art-7',
            number: '제7조',
            title: '채용기업의 정보 고지 및 신원 확인 의무',
            content: [
              '채용기업은 사업자 회원가입 시, 전자상거래법 제20조 제2항에 따라 상호, 대표자 성명, 주소, 전화번호, 이메일 주소, 사업자등록번호 등 신원정보를 명확히 입력해야 하며, "회사"는 해당 정보의 진위 여부를 확인할 수 있는 시스템을 구축하여 준수합니다.',
              '채용기업이 허위 정보를 등록하거나 타인의 사업자 정보를 도용하는 경우, "회사"는 즉시 해당 채용공고를 삭제하고 서비스 이용을 제한할 수 있으며, 이로 인해 지원자 등 제3자에게 발생한 손해에 대한 모든 책임은 해당 채용기업이 집행합니다.',
            ],
          },
          {
            id: 'art-8',
            number: '제8조',
            title: '채용공고의 적법성 준수',
            content: [
              '채용기업은 관계 법령(근로기준법, 남녀고용평등법, 채용절차법 등)을 준수하여 합법적인 범위 내에서 채용공고를 작성하여야 합니다.',
              '성별, 연령, 신체조건, 출신지역 등에 대한 차별적 표현이나 허위 채용조건(예: 공고된 급여와 실제 면접 시 제시 급여의 현저한 불일치)의 게재는 엄격히 금지됩니다. 위반 시 즉시 공고가 중단되며 과태료 등의 법적 책임은 채용기업에 귀속됩니다.',
            ],
          },
          {
            id: 'art-9',
            number: '제9조',
            title: '채용기업 평판 및 이용후기 관리의 투명성',
            content: [
              '"회사"는 플랫폼 내에서 일자리 지원자 등이 작성한 채용기업에 대한 면접 후기, 근무 경험 리뷰 등 이용후기(평판) 시스템을 운영할 수 있습니다.',
              '"회사"는 이용후기의 신뢰도를 확보하고 소비자를 기만하지 않기 위해, 후기의 게시 기간, 등급평가 및 삭제 기준, 그리고 허위/명예훼손성 후기에 대한 이의제기 절차와 처리 기준을 플랫폼 상에 명확히 공개합니다.',
              '채용기업은 자신에 대한 부정적 후기가 게재되었다는 이유로 합리적 사유나 공식 이의제기 절차 없이 무단 삭제를 요구할 수 없으며, "회사"는 공개된 처리 기준에 따라 중립적이고 객관적으로 이의제기를 처리합니다.',
            ],
          },
        ],
      },
      {
        id: 'ch3',
        title: '제3장 일자리 지원자 회원(B2C) 특별약관',
        articles: [
          {
            id: 'art-10',
            number: '제10조',
            title: '이력서 및 프로필 정보의 책임',
            content: [
              '지원자는 플랫폼에 등록하는 이력서, 자기소개서, 포트폴리오 등 프로필 정보에 대하여 진실하고 최신의 정보를 유지해야 합니다.',
              '고의적으로 학력, 경력, 자격사항 등을 위조하거나 허위 사실을 기재하여 채용기업에 손해를 끼친 경우, 해당 지원자는 민·형사상의 책임을 부담할 수 있으며 플랫폼 이용이 영구 제한됩니다.',
            ],
          },
          {
            id: 'art-11',
            number: '제11조',
            title: '구직 활동 및 계약 체결의 독립성',
            content: [
              '지원자는 채용기업과의 채용 면접, 근로계약 체결 과정에서 스스로의 판단 하에 독립적으로 의사결정을 내려야 합니다.',
              '특히 지원자가 근로기준법상 \'근로자\'가 아닌 프리랜서, 1인 자영업자, 또는 독립 크리에이터 등의 형태로 업무 위탁/용역 계약을 체결하는 경우, 계약서상에 다음 각 호의 자율성이 보장됨을 사전에 채용기업과 명확히 확인하는 것을 권장합니다:',
              '1. 근무 시간 및 장소 수행의 자율성\n2. 성과 중심의 수수료/용역비 지급 방식\n3. 업무 수행 방식의 완전한 독자성\n4. 다른 고객사와의 자유로운 동시 계약 체결 가능성',
              '"회사"는 프리랜서 매칭 과정에서 플랫폼 내 UI 및 계약 구조가 사용종속관계(근로자성)로 오인되어 향후 법적 분쟁이 발생하지 않도록 자율적 계약 체결 가이드를 제공하며, 계약 체결 당사자가 아닌 단순 중개자로서의 한계를 명확히 인지하도록 안내합니다.',
            ],
          },
          {
            id: 'art-12',
            number: '제12조',
            title: '개인정보 보호 및 수집 목적 준수',
            content: [
              '"회사"는 지원자의 개인정보(이름, 연락처, 이력서 내용 등)를 구인·구직 활동 지원이라는 명확한 수집 및 이용 목적을 위해서만 처리하며, 목적 외의 용도로 제3자에게 무단 제공하지 않습니다.',
              '지원자가 채용기업에 입사지원을 하는 경우, 이는 채용 절차 진행을 위한 지원자의 명시적인 \'개인정보 제공 동의\'에 기반하여 안전하게 해당 기업에만 전달됩니다.',
              '"회사"는 개인정보 보호 위반 시 발생하는 법적 과징금 리스크를 사전에 방지하기 위해 엄격한 데이터 보안 및 컴플라이언스 관리 시스템을 운영합니다.',
            ],
          },
        ],
      },
      {
        id: 'ch4',
        title: '제4장 법적 보장 및 분쟁 해결',
        articles: [
          {
            id: 'art-13',
            number: '제13조',
            title: '회사의 면책 및 예외',
            content: [
              '"회사"는 천재지변, 전쟁, 기간통신사업자의 서비스 중단, 디도스(DDoS) 공격 등 불가항력적인 사유로 인하여 플랫폼 서비스를 제공할 수 없는 경우에는 서비스 제공 지연 또는 중단에 대한 책임이 면제됩니다.',
              '"회사"는 채용기업과 지원자 상호 간의 소통 과정, 면접 과정, 혹은 계약 불이행으로 인해 발생한 분쟁에 대해 책임을 지지 않습니다. 단, 플랫폼 자체의 결함으로 인한 오류나 전자상거래법 등 강행규정 위반 사항에 대해서는 책임을 면하지 않습니다.',
            ],
          },
          {
            id: 'art-14',
            number: '제14조',
            title: '분쟁 해결 및 협조 의무',
            content: [
              '"회사"는 채용기업과 지원자 간에 분쟁이 발생한 경우, 플랫폼 내에 전담 고객센터를 운영하여 신속하고 성실하게 불만 처리를 조력합니다.',
              '거래 과정에서 분쟁이 발생하고, 법원이나 공인된 소비자피해분쟁조정기구 등의 적법한 신원 제공 요청이 있는 경우, "회사"는 관계 법령에 따라 분쟁 해결을 위해 필요한 범위 내에서 거래 당사자의 신원정보 및 거래 내역을 제공하여 분쟁 해결에 적극 협조합니다.',
            ],
          },
          {
            id: 'art-15',
            number: '제15조',
            title: '준거법 및 관할법원',
            content: [
              '본 약관의 해석 및 "회사"와 "회원" 간의 분쟁에 대해서는 대한민국 법률을 준거법으로 적용합니다.',
              '본 서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기될 경우, 제소 당시의 회원의 주소 또는 거소를 관할하는 지방법원을 전속관할로 하며, 주소나 거소가 없는 경우에는 민사소송법에 따른 관할 법원을 통하여 해결합니다.',
            ],
          },
        ],
      },
    ],
  },
  EN: {
    title: 'Terms of Service for Online Recruitment & Job Matching Platform',
    subtitle: 'These Terms have been designed in strict compliance with the 2026 Revised E-Commerce Act, Personal Information Protection Act, and Fair Trade Commission Guidelines.',
    chapters: [
      {
        id: 'ch1',
        title: 'Chapter 1: General Provisions (Platform Status, Registration, Termination, AI Automated Processing)',
        articles: [
          {
            id: 'art-1',
            number: 'Article 1',
            title: 'Purpose',
            content: [
              'The purpose of these Terms of Service (the "Terms") is to define the rights, obligations, responsibilities, and service procedures between "KHIRE Co., Ltd." (the "Company") and its members ("Members") regarding the online job recruitment and matching services (the "Service") operated on the website (the "Platform").',
            ],
          },
          {
            id: 'art-2',
            number: 'Article 2',
            title: 'Company Status & Intermediary Disclosure',
            content: [
              'The Company acts solely as a mail-order broker providing an online platform and matching tools between employers seeking candidates ("Employers") and individuals seeking employment ("Applicants"), and is not a direct party to employment or service contracts.',
              'The Company assumes no direct legal liability for transactions between Employers and Applicants, including employment decisions, legality of employment contract terms, wage payments, or service fees. Each Member enters into contracts at their own risk.',
              'However, if loss occurs due to proven willful misconduct or gross negligence of the Company (such as system defects or data leaks), liability shall be borne in accordance with applicable laws.',
            ],
          },
          {
            id: 'art-3',
            number: 'Article 3',
            title: 'Disclosure, Effect, and Amendment of Terms',
            content: [
              'The Company posts these Terms on the initial screen of the Platform for easy access by Members.',
              'When amending these Terms, the Company shall specify the effective date and reasons for revision and announce them at least 7 days (30 days for significant or adverse changes) prior to the effective date via Platform notice and individual notification (email, SMS, etc.).',
              'The Company does not force unilateral or implicit consent for adverse changes, and guarantees the right of Members to freely withdraw (cancel membership) if they do not agree to revised terms.',
            ],
          },
          {
            id: 'art-4',
            number: 'Article 4',
            title: 'Registration & Anti-Dark Pattern UI Compliance',
            content: [
              'During registration, the Company provides a clear visual UI distinguishing mandatory consent items from optional consent items (such as marketing notifications).',
              'The Company strictly prohibits deceptive UI design ("dark patterns"), including pre-ticked check boxes for optional items.',
              'Refusal of optional items (e.g. marketing) shall not result in denial of essential platform registration or service access.',
            ],
          },
          {
            id: 'art-5',
            number: 'Article 5',
            title: 'AI Automated Processing & Recommendation Disclosure',
            content: [
              'The Company utilizes algorithms and Artificial Intelligence (AI) technology to recommend customized jobs to Applicants and qualified candidates to Employers.',
              'If fully automated decisions significantly impact a Member\'s rights or obligations (e.g. employment restriction or membership suspension), the Company transparently discloses decision criteria, main data items used, and processing procedures.',
              'Members hold the right to request explanations or object to automated decisions, upon which human re-evaluation will be conducted unless justified otherwise.',
            ],
          },
          {
            id: 'art-6',
            number: 'Article 6',
            title: 'Recurring Payments & Conversion to Paid Services',
            content: [
              'When Employers use recurring billing services (such as paid job ads or memberships), explicit consent must be obtained prior to price increases or conversion to paid tiers.',
              'The Company provides a simple online cancellation system and shall not complicate or hinder cancellation procedures.',
            ],
          },
        ],
      },
      {
        id: 'ch2',
        title: 'Chapter 2: Special Terms for Employer Members (B2B)',
        articles: [
          {
            id: 'art-7',
            number: 'Article 7',
            title: 'Business Information Disclosure & Identity Verification',
            content: [
              'Employers must accurately disclose identity details (company name, representative name, address, phone number, email, business registration number) pursuant to Article 20(2) of the E-Commerce Act.',
              'If an Employer submits false data or steals another business entity\'s information, the Company may immediately delete job postings and restrict access. The Employer bears full legal liability for damages caused to third parties.',
            ],
          },
          {
            id: 'art-8',
            number: 'Article 8',
            title: 'Legality of Job Postings',
            content: [
              'Employers must draft job postings in compliance with labor laws (Labor Standards Act, Equal Employment Opportunity Act, Recruitment Procedures Act).',
              'Discriminatory expressions regarding gender, age, origin, or false wage conditions are strictly prohibited. Postings violating this will be immediately suspended.',
            ],
          },
          {
            id: 'art-9',
            number: 'Article 9',
            title: 'Transparency in Employer Reviews & Reputation',
            content: [
              'The Company operates an employer review and rating system where Applicants post workplace reviews and interview feedback.',
              'To ensure authenticity, posting periods, rating criteria, deletion standards, and objection procedures are transparently disclosed.',
              'Employers cannot demand arbitrary deletion of negative reviews without formal objection procedures, which the Company processes neutrally.',
            ],
          },
        ],
      },
      {
        id: 'ch3',
        title: 'Chapter 3: Special Terms for Job Applicants (B2C)',
        articles: [
          {
            id: 'art-10',
            number: 'Article 10',
            title: 'Responsibility for Resumes and Profile Data',
            content: [
              'Applicants must maintain truthful and updated profile information including resumes, portfolios, and self-introductions.',
              'Intentionally falsifying education, work history, or certifications causing damages to Employers may incur civil and criminal liability and permanent platform ban.',
            ],
          },
          {
            id: 'art-11',
            number: 'Article 11',
            title: 'Independence in Job Seeking and Contracting',
            content: [
              'Applicants make independent decisions during interview and employment contract processes.',
              'In case of freelance or independent contractor agreements, contract autonomy (work schedule freedom, performance-based fee structure, non-exclusivity) should be verified independently.',
              'The Company acts as a pure intermediary and provides guidelines to prevent worker-status misunderstandings.',
            ],
          },
          {
            id: 'art-12',
            number: 'Article 12',
            title: 'Privacy Protection & Purpose Limitation',
            content: [
              'Personal data (name, contact info, resume) is processed strictly for job matching purposes and is never disclosed to third parties without consent.',
              'Applying to a job constitutes explicit consent to transfer resume data securely to the target employer.',
              'The Company maintains strict data compliance systems to prevent privacy violations.',
            ],
          },
        ],
      },
      {
        id: 'ch4',
        title: 'Chapter 4: Legal Guarantees & Dispute Resolution',
        articles: [
          {
            id: 'art-13',
            number: 'Article 13',
            title: 'Exemption of Company Liability',
            content: [
              'The Company is exempt from liability for service interruptions caused by force majeure events such as natural disasters, war, network outages, or DDoS attacks.',
              'The Company is not liable for disputes arising between Employers and Applicants during communication or contract performance.',
            ],
          },
          {
            id: 'art-14',
            number: 'Article 14',
            title: 'Dispute Resolution and Cooperation',
            content: [
              'The Company operates a dedicated customer center to assist in resolving grievances promptly.',
              'Upon lawful requests from courts or consumer dispute resolution bodies, the Company provides relevant transaction history to facilitate dispute resolution.',
            ],
          },
          {
            id: 'art-15',
            number: 'Article 15',
            title: 'Governing Law and Jurisdiction',
            content: [
              'These Terms are governed by and construed in accordance with the laws of the Republic of Korea.',
              'Any lawsuit arising from service disputes shall be submitted to the exclusive jurisdiction of the court having jurisdiction over the Member\'s domicile.',
            ],
          },
        ],
      },
    ],
  },
};
