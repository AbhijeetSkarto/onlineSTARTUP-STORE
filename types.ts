
export enum Category {
  AI_SYSTEM = 'Artificial Intelligence',
  AUTOMATION = 'Business Automation',
  CHATBOT = 'AI Chatbot',
  BUNDLE = 'Elite Bundle'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: Category;
  image: string;
  features: string[];
  techStack: string[];
  demoType?: 'chat' | 'image' | 'voice' | 'search';
  videoUrl?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
