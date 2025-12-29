
import { Product, Category } from './types';

const LUXURY_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  'https://images.unsplash.com/photo-1497366216548-37526070297c',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
  'https://images.unsplash.com/photo-1552664730-d307ca884978',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
  'https://images.unsplash.com/photo-1551434678-e076c223a692',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
];

const getImg = (i: number) => `${LUXURY_IMAGES[i % LUXURY_IMAGES.length]}?auto=format&fit=crop&w=800&q=80`;

export const PRODUCTS: Product[] = [
  {
    id: 'elite-legacy-bundle',
    name: 'Elite Legacy Suite (All 45+ Solutions)',
    description: 'The complete White-Label ecosystem. Own every AI agent, automation, and chatbot.',
    longDescription: 'The definitive white-label enterprise package. Own your brand with 45+ high-conversion AI solutions. Includes Free Marketing & Business Consultancy. Purchase once for your brand, earn a flat 50% commission on every subsequent sale from 9999/- to 99999/-.',
    price: 19999,
    category: Category.BUNDLE,
    image: getImg(0),
    features: [
      'Access to All 45+ AI Agents',
      'Free Marketing & Business Consultancy',
      'Flat 50% Reseller Commission Setup',
      'Lifetime White-Label License',
      'Guaranteed 48-Hour Setup'
    ],
    techStack: ['Full Ecosystem', 'Cloud CRM', 'WhatsApp API', 'Consultancy'],
    videoUrl: 'https://vimeo.com/1085542761'
  }
];

// Content requested: Artificial Intelligence
const AI_SYSTEMS = [
  { name: "AI Telecalling", desc: "Cinematic voice agents that handle inbound/outbound calls with human warmth." },
  { name: "AI Sales Manager", desc: "Automate your entire sales floor with intelligent lead scoring and closing logic." },
  { name: "AI CRM", desc: "Predictive customer relationship management that learns from your data." },
  { name: "AI For Customer Support", desc: "Instant, 24/7 intelligent resolution that feels like a human expert." },
  { name: "AI For Technical Support", desc: "Deep technical troubleshooting bots for complex product ecosystems." },
  { name: "AI Advertisement", desc: "Self-optimizing ad creatives and placement logic for maximum ROI." },
  { name: "AI For Marketing Executive", desc: "An intelligent agent that drafts strategies, content, and schedules campaigns." },
  { name: "AI For Manage Staff", desc: "Automate task delegation and performance tracking with zero bias." },
  { name: "AI For Mobile App", desc: "Embed high-level intelligence directly into your branded mobile applications." },
  { name: "AI For Grow Marketing", desc: "Advanced viral growth loops and automated referral management." },
  { name: "AI For Growth Forcasting", desc: "Quantum-level data analysis to predict your next 12 months of revenue." },
  { name: "AI E-Commerce", desc: "Personalized shopping assistants that increase cart value by 40%." },
  { name: "AI For HR", desc: "Automate hiring, onboarding, and payroll with intelligent sentiment analysis." }
];

// Content requested: Business Automation
const AUTOMATIONS = [
  { name: "Sales Automation", desc: "Streamline the journey from lead to close with automated workflows." },
  { name: "Customer Support Automation", desc: "Resolve 80% of queries without human intervention." },
  { name: "Social Media Automation", desc: "Omni-channel presence managed by intelligent scheduling." },
  { name: "Task Automation", desc: "Connect your apps and let AI handle the repetitive logic." },
  { name: "Mobile Calling Automation", desc: "Scale your outreach with high-volume automated telephony." },
  { name: "Marketing Automation", desc: "Personalized drip campaigns that adapt to user behavior." },
  { name: "Follow-Up Automation", desc: "Never lose a lead again with persistent, smart follow-up logic." },
  { name: "Whatsapp Automation", desc: "The world's most popular messaging app, now fully automated." },
  { name: "Reminder Automation", desc: "Boost appointment attendance with multi-channel smart alerts." },
  { name: "Survey Automation", desc: "Collect and analyze feedback instantly with sentiment scoring." },
  { name: "Ads Automation", desc: "Budget optimization and creative testing on autopilot." },
  { name: "Knowledge Base Automation", desc: "Turn your documents into an interactive, smart library." },
  { name: "Sales Funnel Automation", desc: "Self-optimizing landing pages and conversion paths." },
  { name: "Google Sheet Automation", desc: "Sync data across your ecosystem directly to spreadsheets." },
  { name: "Lead Automation", desc: "Intelligent lead capture and routing in real-time." },
  { name: "Missedcall Automation", desc: "Turn missed calls into immediate automated text interactions." },
  { name: "Email Automation", desc: "Smart inbox management and response generation." },
  { name: "Meeting Automation", desc: "Frictionless scheduling and automated brief preparation." },
  { name: "Due Collection Automation", desc: "Dignified, persistent payment recovery via AI agents." },
  { name: "Payment Automation", desc: "Invisible billing and subscription management." },
  { name: "Renew Automation", desc: "Automated retention cycles for subscription-based models." },
  { name: "Billing Automation", desc: "Error-free invoice generation and reconciliation." },
  { name: "Appointment Automation", desc: "End-to-end booking logic for service-based brands." }
];

// Content from AI Chatbot
const CHATBOTS = [
  "WhatsApp Chatbot India", "AI Chatbot", "Website Chatbot", "Facebook Chatbot",
  "Instagram Chatbot", "Telegram Chatbot", "International Chatbot",
  "Animated Chatbot", "SMS Chatbot", "Mail Chatbot", "Voice Chatbot", "Video Chatbot"
];

const addAIItems = () => {
  AI_SYSTEMS.forEach((item, i) => {
    PRODUCTS.push({
      id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: item.name,
      description: item.desc,
      longDescription: `Luxury white-label ${item.name} system. Deploy under your own brand in 48 hours. Enterprise-grade security and proprietary AI models. Resell to your clients and keep 50% profit.`,
      price: 9999,
      category: Category.AI_SYSTEM,
      image: getImg(i + 1),
      features: ['White-Label Deployment', '48H Setup', '50% Profit Share'],
      techStack: ['Deep Neural Net', 'Cloud CRM Integration'],
      demoType: 'chat'
    });
  });
};

const addAutomationItems = () => {
  AUTOMATIONS.forEach((item, i) => {
    PRODUCTS.push({
      id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: item.name,
      description: item.desc,
      longDescription: `Enterprise-grade ${item.name} solution. Fully white-labeled for your brand. Setup within 48 hours. Purchase once, resell infinitely for 50% commission.`,
      price: 9999,
      category: Category.AUTOMATION,
      image: getImg(i + 20),
      features: ['Full Automation', 'Custom Branding', 'API Ready'],
      techStack: ['Workflow Core', 'Webhook Logic'],
      demoType: 'search'
    });
  });
};

const addChatbotItems = (list: string[], cat: Category, offset: number) => {
  list.forEach((name, i) => {
    PRODUCTS.push({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      description: `Premium ${cat.toLowerCase()} solution for global enterprises.`,
      longDescription: `Full white-label solution for ${name}. Deployed under your label within 48 hours. Includes flat 50% reseller commission structure for your client base.`,
      price: 9999,
      category: cat,
      image: getImg(i + offset),
      features: ['Luxury Branding', '48H Setup', 'Partner Support'],
      techStack: ['AI Core', 'Global CDN'],
      demoType: 'chat'
    });
  });
};

addAIItems();
addAutomationItems();
addChatbotItems(CHATBOTS, Category.CHATBOT, 45);

export const FAQS = [
  {
    q: "How fast is setup?",
    a: "We guarantee your brand setup within 48 hours. Start your legacy today with ONLINE STARTUP STORE."
  },
  {
    q: "How does the reseller program work?",
    a: "Purchase any solution one-time for your brand. For every subsequent sale you make, you keep a flat 50% commission."
  }
];
