
import { PricingTier, Feature, Testimonial } from './types';

export const COLORS = {
  primary: '#6366f1',
  accent: '#10b981',
  dark: '#0f172a',
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ravi K.",
    location: "Mumbai Agency Owner",
    quote: "Launched my branded chatbot in 1 afternoon. Already hit ₹45k MRR in just 30 days!",
    revenue: "₹45k MRR"
  },
  {
    name: "Anjali S.",
    location: "SaaS Consultant, Bangalore",
    quote: "Finally, a way to sell AI tools without managing a developer team. The CRM integration is a game changer.",
    revenue: "₹1.2L Total Revenue"
  },
  {
    name: "Vikram P.",
    location: "Local Marketer, Delhi",
    quote: "My clients love the WhatsApp automation. White-labeling let me triple my retainer prices.",
    revenue: "₹30k/mo Retainers"
  },
  {
    name: "Sneha M.",
    location: "Coach, Pune",
    quote: "Setting up my own AI coach was seamless. I'm scaling my presence without extra hours.",
    revenue: "50+ Active Accounts"
  }
];

export const FAQS = [
  {
    q: "Can I use my own domain?",
    a: "Absolutely! You can point your custom domain (e.g., app.yourbrand.com) to our servers in under 15 minutes."
  },
  {
    q: "Does it support INR billing?",
    a: "Yes, we are pre-integrated with Instamojo and Razorpay. You get paid directly in your Indian bank account."
  },
  {
    q: "Do I need coding skills?",
    a: "Zero coding. Everything is drag-and-drop, from branding the dashboard to setting up AI workflows."
  },
  {
    q: "What kind of support do you offer?",
    a: "We provide 24/7 WhatsApp priority support for Agency and DFY plans, plus a full knowledge base."
  },
  {
    q: "Are there any hidden costs?",
    a: "No. You pay the one-time launch fee, and that's it. We handle all hosting and maintenance costs."
  },
  {
    q: "Can I cancel anytime?",
    a: "Our launch offer is a one-time payment for lifetime access. No subscriptions, just pure profit for you."
  }
];
