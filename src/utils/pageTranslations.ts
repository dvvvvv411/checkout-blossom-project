
interface PageTranslations {
  [key: string]: {
    [language: string]: string;
  };
}

export const pageTranslations: PageTranslations = {
  // Page titles
  checkout_title: {
    de: "Checkout",
    en: "Checkout",
    fr: "Commande",
    es: "Pago",
    it: "Checkout",
    nl: "Afrekenen",
    pl: "Kasa"
  },
  checkout_shop_title: {
    de: "Checkout - {shopName}",
    en: "Checkout - {shopName}",
    fr: "Commande - {shopName}",
    es: "Pago - {shopName}",
    it: "Checkout - {shopName}",
    nl: "Afrekenen - {shopName}",
    pl: "Kasa - {shopName}"
  },
  
  // Meta descriptions
  checkout_meta_description: {
    de: "Sichere und einfache Checkout-Seite für Ihre Bestellung. SSL-verschlüsselt und vertrauenswürdig.",
    en: "Secure and simple checkout page for your order. SSL encrypted and trustworthy.",
    fr: "Page de commande sécurisée et simple pour votre commande. Cryptée SSL et digne de confiance.",
    es: "Página de pago segura y simple para su pedido. Cifrada SSL y confiable.",
    it: "Pagina di checkout sicura e semplice per il tuo ordine. Crittografata SSL e affidabile.",
    nl: "Veilige en eenvoudige checkout pagina voor uw bestelling. SSL versleuteld en betrouwbaar.",
    pl: "Bezpieczna i prosta strona kasy dla Twojego zamówienia. Szyfrowana SSL i godna zaufania."
  }
};

export const getPageTranslation = (key: string, language: string = "de", replacements?: Record<string, string>): string => {
  let translation = pageTranslations[key]?.[language.toLowerCase()] || pageTranslations[key]?.["de"] || key;
  
  // Handle placeholder replacements
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      translation = translation.replace(`{${placeholder}}`, value);
    });
  }
  
  return translation;
};
