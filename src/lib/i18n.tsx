import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'bn';

export const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_generate: 'Generate',
    nav_gallery: 'Gallery',
    nav_pricing: 'Pricing',
    nav_dashboard: 'Dashboard',
    nav_sign_in: 'Sign In',
    nav_sign_up: 'Sign Up',
    
    // Hero
    hero_title: 'AI Interior Design Inspiration',
    hero_subtitle: 'Design smarter spaces with artificial intelligence',
    hero_cta_primary: 'Generate Your Dream Room',
    hero_cta_secondary: 'Explore Gallery',
    
    // Generator
    gen_title: 'Create Your Perfect Space',
    gen_style_label: 'Select Style',
    gen_room_label: 'Room Type',
    gen_colors_label: 'Color Palette',
    gen_prompt_label: 'Describe your vision',
    gen_prompt_placeholder: 'A cozy modern living room with warm lighting...',
    gen_generate_btn: 'Generate Design',
    gen_generating: 'Creating magic...',
    gen_credits_remaining: 'Credits remaining',
    gen_no_credits: 'Out of credits',
    gen_buy_credits: 'Buy Credits',
    gen_unlimited: 'Unlimited',
    
    // Gallery
    gallery_title: 'AI-Generated Interiors',
    gallery_filter_all: 'All Styles',
    gallery_filter_featured: 'Featured',
    gallery_filter_popular: 'Popular',
    gallery_load_more: 'Load More',
    
    // Pricing
    pricing_title: 'Choose Your Plan',
    pricing_subtitle: 'Start free, upgrade anytime',
    pricing_monthly: 'Monthly',
    pricing_yearly: 'Yearly',
    pricing_save: 'Save 20%',
    pricing_current_plan: 'Current Plan',
    pricing_upgrade: 'Upgrade',
    pricing_select: 'Select Plan',
    pricing_credits: 'credits',
    pricing_unlimited: 'Unlimited',
    pricing_per_month: '/month',
    pricing_per_year: '/year',
    pricing_credit_packs: 'Or Buy Credit Packs',
    pricing_credits_never_expire: 'One-time purchase, credits never expire',
    
    // Dashboard
    dash_welcome: 'Welcome back',
    dash_credits: 'Available Credits',
    dash_generations: 'Your Generations',
    dash_collections: 'Collections',
    dash_subscription: 'Subscription',
    dash_manage_subscription: 'Manage Subscription',
    dash_total_generations: 'Total Generations',
    dash_this_week: 'This Week',
    dash_today: 'Today',
    dash_favorite_style: 'Favorite Style',
    
    // Footer
    footer_tagline: 'Exploring the future of interior design through AI',
    footer_copyright: '© 2025 Interior of AI. All rights reserved.',
    
    // Common
    loading: 'Loading...',
    error_generic: 'Something went wrong',
    error_auth: 'Authentication failed',
    error_credits: 'Insufficient credits',
    error_generation: 'Generation failed',
    success_generation: 'Design created successfully!',
    success_payment: 'Payment successful!',
    success_saved: 'Saved successfully',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    download: 'Download',
    share: 'Share',
  },
  
  bn: {
    // Navigation
    nav_home: 'হোম',
    nav_generate: 'তৈরি করুন',
    nav_gallery: 'গ্যালারি',
    nav_pricing: 'মূল্য',
    nav_dashboard: 'ড্যাশবোর্ড',
    nav_sign_in: 'সাইন ইন',
    nav_sign_up: 'সাইন আপ',
    
    // Hero
    hero_title: 'এআই ইন্টেরিয়র ডিজাইন অনুপ্রেরণা',
    hero_subtitle: 'কৃত্রিম বুদ্ধিমত্তার সাহায্যে স্মার্ট স্পেস ডিজাইন করুন',
    hero_cta_primary: 'আপনার স্বপ্নের রুম তৈরি করুন',
    hero_cta_secondary: 'গ্যালারি দেখুন',
    
    // Generator
    gen_title: 'আপনার নিখুঁত স্পেস তৈরি করুন',
    gen_style_label: 'স্টাইল নির্বাচন করুন',
    gen_room_label: 'রুমের ধরন',
    gen_colors_label: 'রঙের প্যালেট',
    gen_prompt_label: 'আপনার ভিশন বর্ণনা করুন',
    gen_prompt_placeholder: 'উষ্ণ আলো সহ একটি আরামদায়ক আধুনিক লিভিং রুম...',
    gen_generate_btn: 'ডিজাইন তৈরি করুন',
    gen_generating: 'জাদু তৈরি হচ্ছে...',
    gen_credits_remaining: 'অবশিষ্ট ক্রেডিট',
    gen_no_credits: 'ক্রেডিট শেষ',
    gen_buy_credits: 'ক্রেডিট কিনুন',
    gen_unlimited: 'আনলিমিটেড',
    
    // Gallery
    gallery_title: 'এআই-জেনারেটেড ইন্টেরিয়র',
    gallery_filter_all: 'সব স্টাইল',
    gallery_filter_featured: 'বৈশিষ্ট্যযুক্ত',
    gallery_filter_popular: 'জনপ্রিয়',
    gallery_load_more: 'আরো লোড করুন',
    
    // Pricing
    pricing_title: 'আপনার প্ল্যান বেছে নিন',
    pricing_subtitle: 'বিনামূল্যে শুরু করুন, যেকোনো সময় আপগ্রেড করুন',
    pricing_monthly: 'মাসিক',
    pricing_yearly: 'বার্ষিক',
    pricing_save: '২০% সাশ্রয়',
    pricing_current_plan: 'বর্তমান প্ল্যান',
    pricing_upgrade: 'আপগ্রেড করুন',
    pricing_select: 'প্ল্যান নির্বাচন করুন',
    pricing_credits: 'ক্রেডিট',
    pricing_unlimited: 'আনলিমিটেড',
    pricing_per_month: '/মাস',
    pricing_per_year: '/বছর',
    pricing_credit_packs: 'অথবা ক্রেডিট প্যাক কিনুন',
    pricing_credits_never_expire: 'এক-বারের কেনাকাটা, ক্রেডিট কখনো মেয়াদ শেষ হয় না',
    
    // Dashboard
    dash_welcome: 'স্বাগতম',
    dash_credits: 'উপলব্ধ ক্রেডিট',
    dash_generations: 'আপনার জেনারেশন',
    dash_collections: 'কালেকশন',
    dash_subscription: 'সাবস্ক্রিপশন',
    dash_manage_subscription: 'সাবস্ক্রিপশন পরিচালনা করুন',
    dash_total_generations: 'মোট জেনারেশন',
    dash_this_week: 'এই সপ্তাহে',
    dash_today: 'আজ',
    dash_favorite_style: 'প্রিয় স্টাইল',
    
    // Footer
    footer_tagline: 'এআই এর মাধ্যমে ইন্টেরিয়র ডিজাইনের ভবিষ্যৎ অন্বেষণ',
    footer_copyright: '© ২০২৫ Interior of AI। সর্বস্বত্ব সংরক্ষিত।',
    
    // Common
    loading: 'লোড হচ্ছে...',
    error_generic: 'কিছু ভুল হয়েছে',
    error_auth: 'প্রমাণীকরণ ব্যর্থ হয়েছে',
    error_credits: 'অপর্যাপ্ত ক্রেডিট',
    error_generation: 'জেনারেশন ব্যর্থ হয়েছে',
    success_generation: 'ডিজাইন সফলভাবে তৈরি হয়েছে!',
    success_payment: 'পেমেন্ট সফল!',
    success_saved: 'সফলভাবে সংরক্ষিত',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    view: 'দেখুন',
    download: 'ডাউনলোড',
    share: 'শেয়ার',
  }
};

export type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred_language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}
