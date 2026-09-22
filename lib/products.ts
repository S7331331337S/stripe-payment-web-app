export function stripeCatalogLookupKey(productId: string): string {
  return `catalog_${productId}`
}

export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  stock: number
  benefits: string
  infoLink?: string
  image?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'bpc157',
    name: 'BPC157 10mg',
    description: 'A healing peptide for tendons, joints, gut issues, and injury recovery.',
    priceInCents: 2000,
    stock: 16,
    benefits: 'Healing, Tendons, Joints, Gut Health, Injury Recovery',
    infoLink: 'https://thepeptidecatalog.com/peptides/bpc-157',
  },
  {
    id: 'glow',
    name: 'Glow 70mg',
    description: 'A combination of 3 healing peptides great for muscle, hair, skin, and nails.',
    priceInCents: 4500,
    stock: 9,
    benefits: 'Muscle, Hair, Skin, Nails, Beauty',
    infoLink: 'https://thepeptidecatalog.com/articles/glow-blend-benefits',
  },
  {
    id: 'reta',
    name: 'Reta 24mg',
    description: 'A next-generation triple-action weight loss peptide.',
    priceInCents: 5000,
    stock: 5,
    benefits: 'Weight Loss, Metabolism, Fat Loss',
    infoLink: 'https://thepeptidecatalog.com/peptides/retatrutide',
  },
  {
    id: 'tirz',
    name: 'Tirz 30mg',
    description: 'The most powerful FDA-approved weight loss injection.',
    priceInCents: 3000,
    stock: 5,
    benefits: 'Weight Loss, FDA Approved, Appetite Control',
    infoLink: 'https://thepeptidecatalog.com/peptides/tirzepatide',
  },
  {
    id: 'motsc',
    name: 'Mots C 10mg',
    description: 'A mitochondrial peptide that mimics exercise — boosts metabolism and endurance.',
    priceInCents: 3500,
    stock: 15,
    benefits: 'Metabolism, Endurance, Energy, Exercise Mimetic',
    infoLink: 'https://thepeptidecatalog.com/peptides/mots-c',
  },
  {
    id: 'mt2',
    name: 'MT2 10mg',
    description: 'A fast-acting peptide for tanning, libido enhancement, and appetite control.',
    priceInCents: 2500,
    stock: 2,
    benefits: 'Tanning, Libido, Appetite Control',
    infoLink: 'https://thepeptidecatalog.com/peptides/melanotantan-2',
  },
  {
    id: 'nad',
    name: 'NAD+ 500mg',
    description: 'A cellular energy molecule for DNA repair, metabolism, and anti-aging.',
    priceInCents: 3000,
    stock: 10,
    benefits: 'DNA Repair, Metabolism, Anti-Aging, Energy',
    infoLink: 'https://thepeptidecatalog.com/peptides/nad',
  },
  {
    id: 'cjc-ipa',
    name: 'CJC/IPA 10mg',
    description:
      'A combination of two GH peptides that impact almost everything from muscle gain, fat loss, energy, skin, and etc. This is the fountain of youth.',
    priceInCents: 4000,
    stock: 10,
    benefits: 'Muscle Gain, Fat Loss, Energy, Skin, Youth, Growth Hormone',
    infoLink: 'https://thepeptidecatalog.com/articles/cjc-1295-ipamorelin-dosing-guide',
  },
  {
    id: 'tb500',
    name: 'TB500 10mg',
    description: 'A tissue repair peptide for flexibility, injury recovery, and systemic healing.',
    priceInCents: 3000,
    stock: 4,
    benefits: 'Tissue Repair, Flexibility, Injury Recovery',
    infoLink: 'https://thepeptidecatalog.com/peptides/tb-500',
  },
  {
    id: 'ta1',
    name: 'TA-1 10mg',
    description: 'An immune-boosting peptide used in 30+ countries for viral defense.',
    priceInCents: 4500,
    stock: 5,
    benefits: 'Immune Boost, Viral Defense, International Use',
    infoLink: 'https://thepeptidecatalog.com/peptides/thymosin-alpha-1',
  },
]
