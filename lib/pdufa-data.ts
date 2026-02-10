export const PDUFA_DATA = [
  {
    id: "1",
    company: "Vertex Pharmaceuticals",
    ticker: "VRTX",
    drug: "VX-548 (Suzetrigine)",
    pdufaDate: "2026-02-12",
    description: "Non-opioid acute pain treatment",
    category: "Neurology"
  },
  {
    id: "2",
    company: "Pfizer",
    ticker: "PFE",
    drug: "Hympavzi (marstacimab)",
    pdufaDate: "2026-02-18",
    description: "Hemophilia B gene therapy treatment",
    category: "Rare Disease"
  },
  {
    id: "3",
    company: "Moderna",
    ticker: "MRNA",
    drug: "mRNA-4157 (V940)",
    pdufaDate: "2026-02-25",
    description: "Cancer vaccine for melanoma (with Keytruda)",
    category: "Oncology"
  },
  {
    id: "4",
    company: "Merck & Co.",
    ticker: "MRK",
    drug: "Winrevair (sotatercept)",
    pdufaDate: "2026-03-05",
    description: "Pulmonary arterial hypertension treatment",
    category: "Cardiology"
  },
  {
    id: "5",
    company: "Novartis",
    ticker: "NVS",
    drug: "Briumvi (ublituximab)",
    pdufaDate: "2026-03-12",
    description: "Relapsing multiple sclerosis treatment",
    category: "Neurology"
  },
  {
    id: "6",
    company: "Eli Lilly",
    ticker: "LLY",
    drug: "Zepbound (tirzepatide)",
    pdufaDate: "2026-03-20",
    description: "Obesity management expansion",
    category: "Metabolic"
  },
  {
    id: "7",
    company: "Regeneron",
    ticker: "REGN",
    drug: "Linvoseltamab",
    pdufaDate: "2026-04-02",
    description: "Relapsed/refractory multiple myeloma treatment",
    category: "Oncology"
  },
  {
    id: "8",
    company: "Bristol Myers Squibb",
    ticker: "BMY",
    drug: "Opdualag (nivolumab/relatlimab)",
    pdufaDate: "2026-04-15",
    description: "Melanoma treatment expansion",
    category: "Oncology"
  },
  {
    id: "9",
    company: "Gilead Sciences",
    ticker: "GILD",
    drug: "Lenacapavir",
    pdufaDate: "2026-05-01",
    description: "Long-acting HIV prevention treatment",
    category: "Infectious Disease"
  },
  {
    id: "10",
    company: "Amgen",
    ticker: "AMGN",
    drug: "Tarlatamab",
    pdufaDate: "2026-05-20",
    description: "Small cell lung cancer treatment",
    category: "Oncology"
  }
];

export type PdufaItem = typeof PDUFA_DATA[0];