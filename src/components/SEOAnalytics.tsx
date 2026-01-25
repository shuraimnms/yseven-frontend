import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface SEOAnalyticsProps {
  trackingId?: string;
  enableGoogleAnalytics?: boolean;
  enableGoogleTagManager?: boolean;
  enableFacebookPixel?: boolean;
  enableLinkedInInsight?: boolean;
}

const SEOAnalytics = ({
  trackingId = 'G-XXXXXXXXXX', // Replace with actual GA4 tracking ID
  enableGoogleAnalytics = true,
  enableGoogleTagManager = true,
  enableFacebookPixel = false,
  enableLinkedInInsight = false
}: SEOAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics 4
    if (enableGoogleAnalytics && trackingId) {
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    }

    // Initialize Google Tag Manager
    if (enableGoogleTagManager) {
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-XXXXXXX');
      `;
      document.head.appendChild(gtmScript);

      // Add GTM noscript fallback
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.appendChild(noscript);
    }

    // Initialize Facebook Pixel
    if (enableFacebookPixel) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
    }

    // Initialize LinkedIn Insight Tag
    if (enableLinkedInInsight) {
      const linkedInScript = document.createElement('script');
      linkedInScript.innerHTML = `
        _linkedin_partner_id = "YOUR_PARTNER_ID";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
      `;
      document.head.appendChild(linkedInScript);

      const linkedInPixel = document.createElement('script');
      linkedInPixel.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      linkedInPixel.async = true;
      document.head.appendChild(linkedInPixel);
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (enableGoogleAnalytics && window.gtag) {
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search
      });
    }

    // Track page view in GTM
    if (enableGoogleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search
      });
    }

    // Track Facebook Pixel page view
    if (enableFacebookPixel && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location, trackingId, enableGoogleAnalytics, enableGoogleTagManager, enableFacebookPixel]);

  return null; // This component doesn't render anything
};

// Custom event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  }
};

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, currency: string = 'INR', items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items
  });
};

export const trackAddToCart = (currency: string = 'INR', value: number, items: any[]) => {
  trackEvent('add_to_cart', {
    currency: currency,
    value: value,
    items: items
  });
};

export const trackViewItem = (currency: string = 'INR', value: number, items: any[]) => {
  trackEvent('view_item', {
    currency: currency,
    value: value,
    items: items
  });
};

// Content engagement tracking
export const trackBlogRead = (articleTitle: string, category: string, author: string) => {
  trackEvent('blog_read', {
    article_title: articleTitle,
    category: category,
    author: author
  });
};

export const trackRecipeView = (recipeName: string, difficulty: string, cookTime: string) => {
  trackEvent('recipe_view', {
    recipe_name: recipeName,
    difficulty: difficulty,
    cook_time: cookTime
  });
};

export const trackNewsletterSignup = (source: string) => {
  trackEvent('newsletter_signup', {
    source: source
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

// Social sharing tracking
export const trackShare = (platform: string, contentType: string, contentId: string) => {
  trackEvent('share', {
    method: platform,
    content_type: contentType,
    content_id: contentId
  });
};

export default SEOAnalytics;