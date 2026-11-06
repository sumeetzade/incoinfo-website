// Content for the 12 solution pages (source: "Incoinfo Website Structure Proposal").
// Edit here, then run: node scripts/gen-solutions.mjs
export const segments = [
  { id: 'investors', name: 'Investors', long: 'Capital providers and investors', icon: 'chart-line' },
  { id: 'lenders', name: 'Lenders', long: 'Lenders and credit institutions', icon: 'landmark' },
  { id: 'enterprise', name: 'Enterprise', long: 'Enterprise strategy, procurement and sales', icon: 'building-2' },
  { id: 'professional', name: 'Professional services', long: 'Professional services and ecosystem', icon: 'scale' },
]

export const solutions = [
  // ---------------- Investors ----------------
  {
    slug: 'venture-capital-private-equity',
    segment: 'investors',
    name: 'Venture capital & private equity',
    icon: 'rocket',
    audience: 'Investment directors, deal sourcing partners, associates and due diligence leads',
    title: 'Private equity and VC company intelligence',
    subtitle: 'Evaluate unlisted growth targets, verify promoter shareholding and track portfolio compliance with regulatory-backed corporate disclosures.',
    summary: 'Screen unlisted targets on filed financials and verify cap tables before you sign an NDA.',
    pains: [
      ['Opaque unlisted financials', 'High-growth private companies have no public reporting obligations, so verifying their numbers before an NDA is difficult.'],
      ['Cap table uncertainty', 'Pitch deck equity figures often differ from official share allotment filings, hiding dilution or undisclosed preference shares.'],
      ['High platform overhead', 'Per-seat licences for huge company databases are expensive when you only need deep diligence on 10 to 20 deals a year.'],
    ],
    steps: [
      ['Source and filter', 'Filter companies by turnover, region, incorporation age and industry code to build a shortlist of investment candidates.'],
      ['Order the shortlist', 'Unlock full profiles with your package credits to review audited filings, shareholding and open bank charges.'],
      ['Monitor through the deal', 'Every unlock includes 12 months of updates. If the target files new annual returns during negotiations, your report refreshes automatically.'],
    ],
    deliverables: [
      ['Multi-year financial trends', 'Audited balance sheets, P&L statements and cash-flow metrics for 3 to 5 years.'],
      ['Capital and shareholding breakdown', 'Authorised vs paid-up capital, equity class splits and share allotment filings.'],
      ['Director and sister-company mapping', 'Current board members and their directorships across other companies.'],
    ],
    example: {
      who: 'Associate, growth-stage PE fund',
      text: 'Needed 3-year financials and shareholding patterns for 12 D2C logistics companies. Searched by industry and revenue band, ordered all 12 with package credits, and received one structured Excel and PDF package.',
    },
    compare: {
      head: ['', 'Generic market directories', 'incoinfo'],
      rows: [
        ['Financial statements', 'Basic summary metrics', 'Standardised multi-year balance sheet and P&L'],
        ['Shareholding', 'Static news snippets', 'Official share allotment and equity filings'],
        ['Access model', 'Single static PDF or seat licence', 'Pay per company, with 12 months of updates'],
      ],
    },
  },
  {
    slug: 'investment-banking',
    segment: 'investors',
    name: 'Investment banking & M&A advisory',
    icon: 'handshake',
    audience: 'Managing directors, M&A dealmakers and corporate advisory consultants',
    title: 'Data for M&A and advisory mandates',
    subtitle: 'Build pitch decks, run peer valuation benchmarks and verify client debt using standardised regulatory data.',
    summary: 'Get peer financials in a standard Excel format and check liabilities before a mandate goes live.',
    pains: [
      ['Manual data normalisation', 'Advisory teams spend hours turning unstandardised PDF disclosures into structured Excel models for valuation.'],
      ['Delayed mandate preparation', 'Sourcing verified financial histories for mid-market buy-side or sell-side targets stalls proposal work.'],
      ['Undisclosed liabilities', 'Finding inter-corporate guarantees or bank charges just before execution puts the transaction at risk.'],
    ],
    steps: [
      ['Pick the peer group', 'Select direct competitors from the search and generate side-by-side financial comparison tables.'],
      ['Export to Excel', 'Download pre-formatted financial statements, ready for DCF and market-multiple models.'],
      ['Stay covered through the mandate', 'Keep 12 months of access to target profiles through pitch, negotiation and closing.'],
    ],
    deliverables: [
      ['Peer comparison matrices', 'Side-by-side revenue, EBITDA margin and working-capital metrics across selected competitors.'],
      ['Borrowing and encumbrance index', 'All open bank charges, hypothecations and trustee creations.'],
      ['Ownership structure', 'Ultimate parent, subsidiary networks and joint-venture disclosures.'],
    ],
    example: {
      who: 'M&A advisor, industrial packaging mandate',
      text: 'Needed side-by-side financial histories of 5 regional competitors for a valuation deck. Selected the 5 companies, placed one order, and built the model from a unified Excel comparison.',
    },
  },
  {
    slug: 'family-offices',
    segment: 'investors',
    name: 'Family offices & HNIs',
    icon: 'briefcase-business',
    audience: 'Chief investment officers, family office principals and private wealth managers',
    title: 'Direct investment checks for family offices',
    subtitle: 'Protect family capital by independently checking unlisted co-investments, promoter track records and pledged assets.',
    summary: 'Check promoters and pledged assets yourself, without a large in-house diligence team.',
    pains: [
      ['Limited in-house diligence', 'Family offices often lack a dedicated research team to verify direct startup or real-estate co-investments.'],
      ['Promoter background risk', 'It is hard to find out whether founders have failed ventures, disputes or hidden corporate liabilities.'],
      ['Pledged asset exposure', 'You may invest in a company whose promoter shares or main assets are already pledged to lenders.'],
    ],
    steps: [
      ['Check the promoters', 'Search founders’ director IDs to map their active directorships, past resignations and group company holdings.'],
      ['Check the assets', 'Review registered charges to confirm property and company assets are free of undisclosed mortgages.'],
      ['Keep watching', 'Unlocked reports stay active for 12 months, so you see annual filings and structural changes as they happen.'],
    ],
    deliverables: [
      ['Promoter directorship network', 'Full history of current and past board seats held by key founders.'],
      ['Asset encumbrance summary', 'Secured lenders, loan amounts and charge creation dates.'],
      ['Compliance track record', 'Timeliness of annual financial statements and annual returns over a 5-year window.'],
    ],
  },

  // ---------------- Lenders ----------------
  {
    slug: 'commercial-banks',
    segment: 'lenders',
    name: 'Commercial banks & underwriters',
    icon: 'landmark',
    audience: 'Credit risk officers, commercial underwriters, relationship managers and risk heads',
    title: 'Commercial credit underwriting and risk assessment',
    subtitle: 'Speed up loan origination, verify existing charges and monitor borrower filing regularity with official regulatory records.',
    summary: 'See every registered charge against a borrower and check filing discipline before sanction.',
    pains: [
      ['Undisclosed debt', 'Borrowers submit audited statements that leave out recent charge creations or secondary bank loans.'],
      ['Slow underwriting', 'Checking charge registers across government portals by hand delays credit committee approval.'],
      ['No view after disbursement', 'It is hard to track whether a borrower stays compliant once the loan is sanctioned.'],
    ],
    steps: [
      ['Search by registration number', 'Enter the borrowing company’s registration number or name and add it to your basket.'],
      ['Review charges and ratios', 'See every open charge with the lender, plus 3 to 5 years of trade payables, debt-to-equity and interest cover.'],
      ['Use it for the annual review', 'The 12-month subscription adds new filings and charge changes automatically, ready for the annual credit review.'],
    ],
    deliverables: [
      ['Consolidated charge registry', 'Lender, charge amount, creation date, modifications and status (open or satisfied).'],
      ['Filing compliance summary', 'Active tax registration and annual filing completion dates.'],
      ['Financial performance ratios', 'Operating revenue, net margin, total assets vs total liabilities across several years.'],
    ],
    example: {
      who: 'Senior credit officer, commercial bank',
      text: 'Evaluating a working capital loan application. Searched the applicant’s registration number, used 1 credit, and reviewed the full charge history alongside three years of receivables and payables to finish the credit note.',
    },
    compare: {
      head: ['', 'Manual diligence', 'incoinfo report'],
      rows: [
        ['Charge verification', 'Manual registry search per lender', 'Full charge history: lender, amount, date, status'],
        ['Tax compliance', 'Collecting tax returns from the borrower', 'Tax registration status and filing track record'],
        ['Financial trends', 'Re-keying numbers from PDFs', 'Pre-formatted 3 to 5 year comparison'],
      ],
    },
  },
  {
    slug: 'nbfcs-private-credit',
    segment: 'lenders',
    name: 'Non-bank lenders & private credit',
    icon: 'banknote',
    audience: 'Risk managers, structured credit analysts and venture debt investors',
    title: 'Risk data for non-bank lenders and private credit funds',
    subtitle: 'Structure secured lending with clear visibility into asset backing, promoter guarantees and debt priority.',
    summary: 'Work out collateral cover and lender priority from filed schedules, not borrower claims.',
    pains: [
      ['Complex collateral structures', 'Asset cover is hard to judge when several lenders hold charges over different asset classes.'],
      ['Money moving to group companies', 'Borrowers move funds to sister companies through unsecured loans or related-party advances.'],
      ['Higher default exposure', 'Higher-yield lending needs closer watching after the money goes out.'],
    ],
    steps: [
      ['Check the asset base', 'Review fixed assets, capital work-in-progress and short-term investments from official filing schedules.'],
      ['Trace related-party flows', 'Examine loans, advances and guarantees extended to group companies.'],
      ['Map charge priority', 'Use charge creation dates to establish where you rank among existing creditors.'],
    ],
    deliverables: [
      ['Schedule of fixed assets', 'Tangible vs intangible assets, depreciation and net block values.'],
      ['Related-party disclosures', 'Inter-company loans, management remuneration and promoter guarantees.'],
      ['Debt structure', 'Long-term bank borrowings separated from short-term director loans.'],
    ],
  },
  {
    slug: 'distress-recovery',
    segment: 'lenders',
    name: 'Distress recovery & insolvency',
    icon: 'scan-search',
    audience: 'Insolvency professionals, recovery officers and stressed asset advisors',
    title: 'Data for debt recovery and stressed assets',
    subtitle: 'Trace company assets, verify charge priority and review related-party transfers for insolvency and recovery proceedings.',
    summary: 'Rebuild a debtor’s full charge history and find linked companies under tight deadlines.',
    pains: [
      ['Finding diverted assets', 'Tracing transfers of company assets to related parties before the default.'],
      ['Conflicting lender claims', 'Setting clear timelines for charge creation and satisfaction during liquidation or insolvency proceedings.'],
      ['Tight statutory deadlines', 'Insolvency professionals need company data compiled quickly to meet legal timelines.'],
    ],
    steps: [
      ['Rebuild the charge history', 'Get a full chronology of every charge created, modified or satisfied over the debtor’s life.'],
      ['Find linked companies', 'Identify every company sharing directors or promoters with the debtor.'],
      ['List the financial assets', 'Extract filed investments, trade receivables and bank balances.'],
    ],
    deliverables: [
      ['Lifetime charge chronology', 'Every secured borrowing, charge holder and satisfaction on record.'],
      ['Promoter directorship history', 'All businesses owned or governed by the debtor’s management.'],
      ['Historical filing archive', 'Past balance sheet filings and auditor notes.'],
    ],
  },

  // ---------------- Enterprise ----------------
  {
    slug: 'corporate-development',
    segment: 'enterprise',
    name: 'Corporate development & strategy',
    icon: 'chart-column',
    audience: 'Strategy heads, corporate development directors and M&A analysts',
    title: 'Corporate development and competitive intelligence',
    subtitle: 'Track market share, analyse competitor margins and identify acquisition targets across industries.',
    summary: 'Benchmark private competitors on filed numbers and size a market before you enter it.',
    pains: [
      ['Incomplete market sizing', 'Estimating a market is hard when the main competitors are private, unlisted companies.'],
      ['No view of competitor margins', 'Little insight into competitors’ operating costs, raw material spend and employee costs.'],
      ['Regional expansion risk', 'Entering a new region without knowing the financial scale of the local leaders.'],
    ],
    steps: [
      ['Filter the sector', 'Filter by industry code, region and revenue range to find every operating competitor.'],
      ['Benchmark side by side', 'Compare gross margin, profit after tax and debt against your own numbers.'],
      ['Shortlist targets', 'Pick mid-market companies that fit your criteria and follow their filings for 12 months.'],
    ],
    deliverables: [
      ['Competitor benchmarking tables', 'Standardised revenue, EBITDA, R&D spend and working capital.'],
      ['Market concentration', 'Company counts and revenue spread within an industry. See the corporate landscape.'],
      ['Corporate structure maps', 'Parent-subsidiary relationships and joint-venture disclosures.'],
    ],
    benchmark: true,
  },
  {
    slug: 'procurement-vendor-risk',
    segment: 'enterprise',
    name: 'Procurement & vendor risk',
    icon: 'shield-check',
    audience: 'Chief procurement officers, supply chain managers and vendor onboarding leads',
    title: 'Vendor risk and supply chain due diligence',
    subtitle: 'Reduce supply chain disruption by checking a vendor’s financial health, paid-up capital and compliance status.',
    summary: 'Check a supplier’s debt, cash flow and tax registration before the contract, and re-check during it.',
    pains: [
      ['Vendor insolvency risk', 'Onboarding critical suppliers who are in financial distress or close to insolvency.'],
      ['Regulatory non-compliance', 'Contracting with vendors whose tax registration is inactive or whose filings are overdue.'],
      ['Single-source dependency', 'No quick way to assess the financial capacity of backup suppliers.'],
    ],
    steps: [
      ['Look up the vendor', 'Search the prospective supplier by name or registration number.'],
      ['Check financial health', 'Review net worth, debt-to-equity, turnover and filing regularity before the award.'],
      ['Monitor the contract year', 'Re-check the vendor any time in the next 12 months at no extra credit cost.'],
    ],
    deliverables: [
      ['Vendor health scorecard', 'Paid-up capital, net worth, operating cash flow and total debt.'],
      ['Compliance status', 'Last annual return date, tax registration status and company status (active or in liquidation).'],
      ['Management and address check', 'Registered address, company email and current directors.'],
    ],
    example: {
      who: 'Procurement lead, manufacturer',
      text: 'Onboarding a strategic raw-material supplier. Used 1 credit, checked debt-to-equity and three years of cash reserves, and saved the report to the compliance file.',
    },
  },
  {
    slug: 'b2b-sales-growth',
    segment: 'enterprise',
    name: 'B2B sales & growth',
    icon: 'users',
    audience: 'Sales leaders, B2B growth marketers and enterprise account executives',
    title: 'Prospecting with real financial filters',
    subtitle: 'Target prospects by filed balance-sheet figures, active company status and region.',
    summary: 'Build prospect lists of active companies that meet your revenue and region criteria.',
    pains: [
      ['Wasted sales effort', 'Account executives chase companies that are too small or no longer operating.'],
      ['Unreliable lead lists', 'Bought contact lists carry outdated revenue numbers and defunct companies.'],
      ['Territory planning', 'No way to map prospects by verified revenue band within a state.'],
    ],
    steps: [
      ['Define your ideal customer', 'Filter by minimum turnover, active status, sector and region.'],
      ['Learn who decides', 'Review current board members and key appointments to reach the right people.'],
      ['Unlock only real targets', 'Use credits on the companies your team will actually pursue.'],
    ],
    deliverables: [
      ['Prospect directory', 'Legal name, registration number, incorporation date and registered address.'],
      ['Financial capacity', 'Turnover range, paid-up capital and profit status.'],
      ['Board directory', 'Active directors and their director IDs.'],
    ],
  },

  // ---------------- Professional services ----------------
  {
    slug: 'legal-compliance',
    segment: 'professional',
    name: 'Law firms & compliance',
    icon: 'gavel',
    audience: 'Corporate lawyers, compliance partners and regulatory auditors',
    title: 'Corporate legal due diligence and compliance',
    subtitle: 'Speed up due diligence, check cross-directorship conflicts and trace a company’s full history.',
    summary: 'Get a company’s full statutory history and every board link of its directors.',
    pains: [
      ['Manual history extraction', 'Name changes, capital increases and board changes are spread across fragmented filings.'],
      ['Hidden conflicts of interest', 'Shared directorships between opposing parties or deal partners are hard to spot.'],
      ['Turnaround pressure', 'Clients want faster due diligence without any loss of accuracy.'],
    ],
    steps: [
      ['Build the company timeline', 'Get every name change, registered office move and capital increase in one timeline.'],
      ['Map director links', 'Search director IDs to find past and present board overlaps across companies.'],
      ['Cover the whole matter', 'Keep client and counterparty profiles active for 12 months through the transaction or litigation.'],
    ],
    deliverables: [
      ['Corporate modification timeline', 'Legal name updates, registered office changes and capital increases.'],
      ['Cross-directorship index', 'Every board seat held by the people you are checking.'],
      ['Filing compliance record', 'How promptly annual returns and financial statements were filed.'],
    ],
  },
  {
    slug: 'auditors-ca-firms',
    segment: 'professional',
    name: 'Chartered accountants & auditors',
    icon: 'calculator',
    audience: 'Practising CAs, statutory auditors, tax consultants and valuation experts',
    title: 'Valuation data and audit analytics for CA firms',
    subtitle: 'Get standardised peer financials for statutory audits, transfer pricing documentation and business valuations.',
    summary: 'Export standardised peer financials straight into DCF and transfer pricing work.',
    pains: [
      ['Manual data entry', 'Hours spent re-keying PDF financial statements into valuation spreadsheets.'],
      ['Finding comparable peers', 'Verified peer financials for transfer pricing studies are hard to source.'],
      ['Verifying client records', 'Checking client-provided debt charges and filing records against the registry.'],
    ],
    steps: [
      ['Export for valuation', 'Download standardised multi-year statements formatted for DCF and market-multiple models.'],
      ['Select transfer pricing peers', 'Filter peers by turnover range, margin and industry code.'],
      ['Verify client files', 'Confirm open charges, capital allotments and filing compliance before sign-off.'],
    ],
    deliverables: [
      ['Standardised Excel financials', 'Balance sheet, P&L and cash flow tables for 3 to 5 years.'],
      ['Charge and loan verification', 'Every open and satisfied charge on record.'],
      ['Capital history', 'Authorised capital, paid-up capital and share allotment filings.'],
    ],
  },
  {
    slug: 'incubators-accelerators',
    segment: 'professional',
    name: 'Incubators & accelerators',
    icon: 'sparkles',
    audience: 'Incubator directors, ecosystem leads and university innovation officers',
    title: 'Startup cohort tracking for incubators',
    subtitle: 'Monitor portfolio compliance, confirm follow-on funding and measure how cohorts do after graduation.',
    summary: 'Track alumni companies’ filings and funding rounds without chasing founders for updates.',
    pains: [
      ['Chasing founders', 'Asking early-stage alumni for financial updates and filing proofs, one by one.'],
      ['Unverified funding claims', 'Relying on news announcements to confirm whether a startup actually raised a round.'],
      ['Sponsor reporting', 'Government and institutional sponsors want verified growth and survival figures.'],
    ],
    steps: [
      ['Add the cohort', 'Add alumni startups to your basket to track their official status.'],
      ['Confirm funding rounds', 'Follow share allotment filings and paid-up capital changes after each round.'],
      ['Watch all year', 'Track annual filing compliance and active status across the cohort for 12 months.'],
    ],
    deliverables: [
      ['Cohort compliance view', 'Active or inactive status and annual filing tracking for every portfolio company.'],
      ['Capital change records', 'Official paid-up capital and share allotment updates.'],
      ['Board and founder changes', 'Director appointments and resignations across alumni startups.'],
    ],
  },
]
