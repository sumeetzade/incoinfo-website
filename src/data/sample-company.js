// Sample (fictional) company used in the hero and the sample-report showcase.
// TODO: replace with a real sample report once the portal can export one.
export const sampleCompany = {
  name: 'Apex Logistics & Freight Limited',
  cin: 'U60200DL2012PLC654321',
  status: 'Active',
  incorporated: '14 Mar 2012',
  roc: 'RoC Delhi',
  category: 'Public limited (unlisted)',
  nic: '49231 · Freight transport by road',
  office: 'New Delhi, Delhi',
  paidUp: 12.0, // ₹ Cr
  authorised: 15.0, // ₹ Cr
  years: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25'],
  financials: {
    revenue: [142.6, 168.3, 204.9, 231.4, 262.8],
    ebitda: [15.1, 19.2, 25.0, 29.4, 34.7],
    pat: [4.2, 6.1, 9.3, 11.0, 13.6],
    totalAssets: [118.4, 131.9, 152.6, 171.2, 190.5],
    netWorth: [48.7, 54.8, 64.1, 75.1, 88.7],
    borrowings: [41.2, 44.9, 52.3, 58.0, 72.6],
  },
  shareholding: [
    { label: 'Promoters', value: 68.4 },
    { label: 'Institutional investors', value: 18.2 },
    { label: 'Other shareholders', value: 13.4 },
  ],
}
