
import { useEffect } from 'react';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  language?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export const useMetaTags = (config: MetaTagsConfig) => {
  useEffect(() => {
    // Update HTML lang attribute
    if (config.language) {
      document.documentElement.lang = config.language.toLowerCase();
    }

    // Update meta description
    if (config.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.description);
      }
    }

    // Update Open Graph tags
    if (config.ogTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', config.ogTitle);
      }
    }

    if (config.ogDescription) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', config.ogDescription);
      }
    }

    // Update Twitter tags
    if (config.twitterTitle) {
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', config.twitterTitle);
      }
    }

    if (config.twitterDescription) {
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', config.twitterDescription);
      }
    }
  }, [config]);
};
