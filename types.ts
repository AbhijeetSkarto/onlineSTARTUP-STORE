
export enum PricingTier {
  SOLO = 'Solo Creator',
  AGENCY = 'Agency Reseller',
  DFY = 'Done-For-You'
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  revenue: string;
}
