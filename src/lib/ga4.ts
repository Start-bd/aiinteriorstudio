/**
 * GA4 Tracking Configuration
 * InteriorOfAI.com - Consent-aware analytics implementation
 *
 * Measurement ID: G-T9Z5W6Y8GL
 * Campaign 30100: Social traffic, 22.5% initial commission
 * Pinterest Tag: NOT INSTALLED (waiting for actual Tag ID)
 *
 * Events tracked:
 * - sign_up: New account registrations
 * - generate_design: AI design generation
 * - purchase: Successful subscription/credit purchase
 * - view_pricing: Pricing page engagement
 * - coohom_cta_click: Affiliate outbound click
 * - affiliate_product_click: Furniture/decor affiliate click
 * - view_inspiration: Design gallery engagement
 */

// GA4 Measurement ID (provided in audit)
export const GA4_MEASUREMENT_ID = "G-T9Z5W6Y8GL";

// Campaign tracking (approved MaxBounty partner)
export const CAMPAIGN = {
  id: "30100",
  name: "social_traffic",
  initial_commission: 22.5,
  source: "social",
};

// Event names
export const EVENTS = {
  sign_up: "sign_up",
  generate_design: "generate_design",
  purchase: "purchase",
  view_pricing: "view_pricing",
  coohom_cta_click: "coohom_cta_click",
  affiliate_product_click: "affiliate_product_click",
  view_inspiration: "view_inspiration",
};

// Export for use in tracking utilities
export const GA4_CONFIG = {
  measurementId: GA4_MEASUREMENT_ID,
  gtagScriptUrl: `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`,
};

interface TrackEventParams {
  event: string;
  params?: Record<string, unknown>;
  log?: boolean;
}

/**
 * Initialize GA4 when consent is granted
 * Should be called after user accepts analytics cookies
 */
export const initGA4 = (): void => {
  if (typeof window === "undefined") return;

  // Check if GA4 is already initialized
  if (typeof window.gtag !== "undefined") return;

  // Load GA4 script
  const script = document.createElement("script");
  script.async = true;
  script.src = GA4_CONFIG.gtagScriptUrl;
  document.head.appendChild(script);

  // Initialize gtag after script loads
  script.onload = () => {
    if (typeof window.gtag === "function") {
      window.gtag("js", new Date());
      window.gtag("config", GA4_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_expires: 30 * 24 * 60 * 60, // 30 days
      });
    }
  };

  script.onerror = () => {
    console.warn("GA4 script failed to load");
  };
};

/**
 * Track a GA4 event
 * @param params.event - The event name
 * @param params.params - Event parameters
 * @param params.log - Log to console (default: true)
 */
export const trackEvent = ({
  event,
  params = {},
  log = true,
}: TrackEventParams): void => {
  if (typeof window === "undefined") return;

  // Only track if gtag is available
  if (typeof window.gtag !== "function") {
    if (log) console.debug("[GA4] gtag not initialized yet");
    return;
  }

  // Build gtag event call
  const gtagParams = {
    ...params,
    // Add user ID if available (for authenticated users)
    // user_id: window.user?.id,
  };

  try {
    window.gtag("event", event, gtagParams);
    if (log) console.debug(`[GA4] ${event}`, params);
  } catch (err) {
    console.warn("[GA4] Event tracking failed:", err);
  }
};

/**
 * Track sign_up event
 * @param method - Sign up method (email, google, etc.)
 * @param is_premium - Whether the account is premium
 */
export const trackSignUp = (method: string, is_premium?: boolean): void => {
  trackEvent({
    event: EVENTS.sign_up,
    params: {
      method,
      is_premium: is_premium ?? false,
      source: "homepage",
    },
  });
};

/**
 * Track AI design generation
 * @param style - Design style used
 * @param duration - Generation time in seconds
 */
export const trackDesignGeneration = (
  style: string,
  duration: number,
): void => {
  trackEvent({
    event: EVENTS.generate_design,
    params: {
      style,
      generation_duration: duration,
      source: "homepage",
    },
  });
};

/**
 * Track purchase event
 * @param value - Purchase value in USD
 * @param currency - Currency (default: USD)
 * @param items - Purchased items
 */
export const trackPurchase = (
  value: number,
  currency: string = "USD",
  items: Array<{ id: string; name: string; category: string }> = [],
): void => {
  trackEvent({
    event: EVENTS.purchase,
    params: {
      value,
      currency,
      items: items.length ? items : undefined,
      source: "homepage",
    },
  });
};

/**
 * Track view_pricing event
 * @param plan - Pricing plan viewed (free, basic, pro, business)
 */
export const trackViewPricing = (plan?: string): void => {
  trackEvent({
    event: EVENTS.view_pricing,
    params: {
      plan,
      source: "homepage",
    },
  });
};

/**
 * Track coohom CTA click
 * Used for affiliate outbound tracking
 */
export const trackCoohomCtaClick = (): void => {
  trackEvent({
    event: EVENTS.coohom_cta_click,
    params: {
      source: "homepage",
      campaign: CAMPAIGN.id,
      source_medium: "social_traffic",
    },
  });
};

/**
 * Track affiliate product click
 * @param product_id - Product identifier
 * @param product_name - Product name
 * @param category - Product category
 */
export const trackAffiliateProductClick = (
  product_id: string,
  product_name: string,
  category: string,
): void => {
  trackEvent({
    event: EVENTS.affiliate_product_click,
    params: {
      product_id,
      product_name,
      category,
    },
  });
};

/**
 * Track view_inspiration event
 * @param category - Inspiration category (living_room, kitchen, bedroom, etc.)
 */
export const trackViewInspiration = (category: string): void => {
  trackEvent({
    event: EVENTS.view_inspiration,
    params: {
      category,
      source: "homepage",
    },
  });
};
