
export interface Translations {
  [key: string]: string;
}

export const translations = {
  DE: {
    // Allgemein
    checkout: "Checkout",
    back: "Zurück",
    cart: "Warenkorb",
    information: "Informationen",
    shipping: "Versand",
    payment: "Zahlung",
    secure_payment: "Sichere Zahlung",
    ssl_encrypted: "SSL verschlüsselt",
    
    // E-Mail Card
    email_address: "E-Mail-Adresse",
    email_description: "Für Bestellbestätigung und Kommunikation",
    email_placeholder: "ihre.email@beispiel.de",
    email_required: "E-Mail-Adresse ist erforderlich",
    email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    
    // Kontakt & Lieferung
    contact_delivery: "Kontakt & Lieferadresse",
    contact_description: "Ihre Kontaktdaten und Lieferanschrift",
    first_name: "Vorname",
    last_name: "Nachname",
    phone: "Telefonnummer",
    street: "Straße und Hausnummer",
    postal_code: "Postleitzahl",
    city: "Stadt",
    first_name_required: "Vorname ist erforderlich",
    last_name_required: "Nachname ist erforderlich",
    phone_required: "Telefonnummer ist erforderlich",
    phone_invalid: "Bitte geben Sie eine gültige Telefonnummer ein",
    street_required: "Straße und Hausnummer ist erforderlich",
    postal_code_required: "Postleitzahl ist erforderlich",
    city_required: "Stadt ist erforderlich",
    
    // Rechnungsadresse
    billing_address: "Rechnungsadresse",
    billing_different: "Rechnungsadresse abweichend",
    billing_description: "Falls Ihre Rechnungsadresse abweicht",
    
    // Zahlungsmethoden
    payment_method: "Zahlungsart",
    payment_description: "Wählen Sie Ihre bevorzugte Zahlungsart",
    vorkasse: "Vorkasse",
    rechnung: "Rechnung",
    vorkasse_description: "Überweisung vor Lieferung",
    rechnung_description: "Kauf auf Rechnung",
    recommended: "Empfohlen",
    existing_customers_only: "Nur für Bestandskunden",
    
    // Geschäftsbedingungen
    terms_conditions: "Geschäftsbedingungen",
    terms_description: "Rechtliche Bestätigung erforderlich",
    terms_text: "Ich stimme den Allgemeinen Geschäftsbedingungen und der Widerrufsbelehrung zu.",
    terms_required: "Bitte bestätigen Sie die Geschäftsbedingungen",
    
    // Bestellung
    your_order: "Ihre Bestellung",
    subtotal: "Zwischensumme",
    delivery: "Lieferung",
    free: "Kostenlos",
    net_amount: "Netto-Betrag",
    vat: "MwSt",
    total: "Gesamtpreis",
    discount_code: "Rabattcode eingeben",
    apply: "Anwenden",
    discount_invalid: "Der eingegebene Code ist nicht gültig",
    cost_breakdown: "Kostenaufstellung",
    
    // Submit Button
    submit_order: "Bestellung abschließen",
    processing_order: "Bestellung wird verarbeitet...",
    
    // Erfolg/Fehler
    order_success: "Bestellung erfolgreich",
    order_success_message: "Ihre Bestellung wurde erfolgreich übermittelt.",
    order_error: "Fehler",
    order_error_message: "Bei der Bestellübermittlung ist ein Fehler aufgetreten.",
    checkout_token_missing: "Checkout-Token fehlt",
    invalid_checkout_link: "Ungültiger Checkout-Link",
    invalid_checkout_message: "Bitte verwenden Sie einen gültigen Checkout-Link mit Token.",
    loading_checkout: "Checkout wird geladen...",
    error_loading_order: "Fehler beim Laden der Bestelldaten",
    error_loading_message: "Bitte überprüfen Sie Ihren Checkout-Link oder versuchen Sie es später erneut.",
    
    // Bestätigungsseite
    order_confirmation: "Bestellbestätigung",
    order_number: "Bestellnummer",
    order_confirmed: "Ihre Bestellung wurde bestätigt!",
    order_confirmed_message: "Vielen Dank für Ihre Bestellung. Alle Details finden Sie unten.",
    order_received: "Ihre Bestellung ist eingegangen!",
    order_received_message: "Wir kontaktieren Sie in Kürze bezüglich Ihrer Bestellung.",
    order_details: "Bestelldetails",
    customer_information: "Kundendaten",
    delivery_address: "Lieferadresse",
    payment_instructions: "Zahlungshinweise",
    bank_transfer_details: "Bankverbindung für Überweisung",
    account_holder: "Kontoinhaber",
    reference: "Verwendungszweck",
    print_confirmation: "Bestätigung drucken",
    new_order: "Neue Bestellung",
    product: "Produkt",
    quantity: "Menge",
    price_per_liter: "Preis pro Liter",
    invoice_sent_email: "Die Rechnung wurde per E-Mail versendet",
    confirmation_sent_email: "Eine Bestätigung wurde per E-Mail versendet",
    
    // Neue Übersetzungen für Bestätigungsseite
    next_steps: "Nächste Schritte",
    bank_transfer: "Überweisung",
    bank_transfer_description: "Sie überweisen den Betrag von",
    bank_transfer_to_account: "auf unser Konto.",
    delivery_after_payment: "Nach Zahlungseingang erfolgt die Lieferung innerhalb weniger Werktage.",
    order_review: "Bestellungsüberprüfung",
    order_review_description: "Ihre Bestellung wird überprüft. Wir werden Sie in Kürze telefonisch kontaktieren um die weiteren Schritte zu besprechen.",
    phone_contact: "Telefonischer Kontakt",
    phone_contact_description: "Wir rufen Sie in den nächsten 24 Stunden an, um Ihre Bestellung zu bestätigen und die Zahlungsdetails zu besprechen.",
    delivery_info: "Lieferinformationen",
    delivery_notice_title: "Wichtiger Hinweis zur Lieferung",
    delivery_notice_description: "Unser Fahrer wird Sie am Liefertag telefonisch kontaktieren. Bitte stellen Sie sicher, dass Sie unter",
    delivery_notice_reachable: "erreichbar sind.",
    important_notice: "Wichtiger Hinweis",
    manual_mode_notice: "Ihre Bestellung wird nun überprüft. Wir werden Sie in den nächsten 24 Stunden telefonisch kontaktieren, um Ihre Bestellung zu bestätigen und die weiteren Schritte bezüglich der Zahlung und Lieferung zu besprechen.",
    manual_mode_phone_notice: "Bitte stellen Sie sicher, dass Sie unter",
    delivery_timeframe: "Nach Zahlungseingang erfolgt die Lieferung in 4-7 Werktagen.",
    copy_tooltip: "Kopieren",
  },
  
  EN: {
    // General
    checkout: "Checkout",
    back: "Back",
    cart: "Cart",
    information: "Information",
    shipping: "Shipping",
    payment: "Payment",
    secure_payment: "Secure Payment",
    ssl_encrypted: "SSL Encrypted",
    
    // Email Card
    email_address: "Email Address",
    email_description: "For order confirmation and communication",
    email_placeholder: "your.email@example.com",
    email_required: "Email address is required",
    email_invalid: "Please enter a valid email address",
    
    // Contact & Delivery
    contact_delivery: "Contact & Delivery Address",
    contact_description: "Your contact details and delivery address",
    first_name: "First Name",
    last_name: "Last Name",
    phone: "Phone Number",
    street: "Street and House Number",
    postal_code: "Postal Code",
    city: "City",
    first_name_required: "First name is required",
    last_name_required: "Last name is required",
    phone_required: "Phone number is required",
    phone_invalid: "Please enter a valid phone number",
    street_required: "Street and house number is required",
    postal_code_required: "Postal code is required",
    city_required: "City is required",
    
    // Billing Address
    billing_address: "Billing Address",
    billing_different: "Different billing address",
    billing_description: "If your billing address differs",
    
    // Payment Methods
    payment_method: "Payment Method",
    payment_description: "Choose your preferred payment method",
    vorkasse: "Bank Transfer",
    rechnung: "Invoice",
    vorkasse_description: "Transfer before delivery",
    rechnung_description: "Pay on invoice",
    recommended: "Recommended",
    existing_customers_only: "Existing customers only",
    
    // Terms & Conditions
    terms_conditions: "Terms & Conditions",
    terms_description: "Legal confirmation required",
    terms_text: "I agree to the Terms and Conditions and Cancellation Policy.",
    terms_required: "Please confirm the terms and conditions",
    
    // Order
    your_order: "Your Order",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "Free",
    net_amount: "Net Amount",
    vat: "VAT",
    total: "Total",
    discount_code: "Enter discount code",
    apply: "Apply",
    discount_invalid: "The entered code is not valid",
    cost_breakdown: "Cost Breakdown",
    
    // Submit Button
    submit_order: "Complete Order",
    processing_order: "Processing order...",
    
    // Success/Error
    order_success: "Order Successful",
    order_success_message: "Your order has been successfully submitted.",
    order_error: "Error",
    order_error_message: "An error occurred while submitting your order.",
    checkout_token_missing: "Checkout token missing",
    invalid_checkout_link: "Invalid Checkout Link",
    invalid_checkout_message: "Please use a valid checkout link with token.",
    loading_checkout: "Loading checkout...",
    error_loading_order: "Error Loading Order Data",
    error_loading_message: "Please check your checkout link or try again later.",
    
    // Confirmation page
    order_confirmation: "Order Confirmation",
    order_number: "Order Number",
    order_confirmed: "Your order has been confirmed!",
    order_confirmed_message: "Thank you for your order. All details can be found below.",
    order_received: "Your order has been received!",
    order_received_message: "We will contact you shortly regarding your order.",
    order_details: "Order Details",
    customer_information: "Customer Information",
    delivery_address: "Delivery Address",
    payment_instructions: "Payment Instructions",
    bank_transfer_details: "Bank Details for Transfer",
    account_holder: "Account Holder",
    reference: "Reference",
    print_confirmation: "Print Confirmation",
    new_order: "New Order",
    product: "Product",
    quantity: "Quantity",
    price_per_liter: "Price per Liter",
    invoice_sent_email: "The invoice has been sent by email",
    confirmation_sent_email: "A confirmation has been sent by email",
    
    // New translations for confirmation page
    next_steps: "Next Steps",
    bank_transfer: "Bank Transfer",
    bank_transfer_description: "You transfer the amount of",
    bank_transfer_to_account: "to our account.",
    delivery_after_payment: "Delivery will take place within a few working days after payment is received.",
    order_review: "Order Review",
    order_review_description: "Your order is being reviewed. We will contact you by phone shortly to discuss the next steps.",
    phone_contact: "Phone Contact",
    phone_contact_description: "We will call you within the next 24 hours to confirm your order and discuss payment details.",
    delivery_info: "Delivery Information",
    delivery_notice_title: "Important Notice for Delivery",
    delivery_notice_description: "Our driver will contact you by phone on the delivery day. Please ensure you are reachable at",
    delivery_notice_reachable: ".",
    important_notice: "Important Notice",
    manual_mode_notice: "Your order is now being reviewed. We will contact you by phone within the next 24 hours to confirm your order and discuss the next steps regarding payment and delivery.",
    manual_mode_phone_notice: "Please ensure you are reachable at",
    delivery_timeframe: "Delivery will take place within 4-7 working days after payment is received.",
    copy_tooltip: "Copy",
  },
  
  FR: {
    // Général
    checkout: "Commande",
    back: "Retour",
    cart: "Panier",
    information: "Informations",
    shipping: "Livraison",
    payment: "Paiement",
    secure_payment: "Paiement Sécurisé",
    ssl_encrypted: "SSL Crypté",
    
    // Email Card
    email_address: "Adresse E-mail",
    email_description: "Pour la confirmation de commande et la communication",
    email_placeholder: "votre.email@exemple.fr",
    email_required: "L'adresse e-mail est requise",
    email_invalid: "Veuillez saisir une adresse e-mail valide",
    
    // Contact & Livraison
    contact_delivery: "Contact & Adresse de Livraison",
    contact_description: "Vos coordonnées et adresse de livraison",
    first_name: "Prénom",
    last_name: "Nom",
    phone: "Numéro de Téléphone",
    street: "Rue et Numéro",
    postal_code: "Code Postal",
    city: "Ville",
    first_name_required: "Le prénom est requis",
    last_name_required: "Le nom est requis",
    phone_required: "Le numéro de téléphone est requis",
    phone_invalid: "Veuillez saisir un numéro de téléphone valide",
    street_required: "La rue et le numéro sont requis",
    postal_code_required: "Le code postal est requis",
    city_required: "La ville est requise",
    
    // Adresse de Facturation
    billing_address: "Adresse de Facturation",
    billing_different: "Adresse de facturation différente",
    billing_description: "Si votre adresse de facturation diffère",
    
    // Méthodes de Paiement
    payment_method: "Mode de Paiement",
    payment_description: "Choisissez votre mode de paiement préféré",
    vorkasse: "Virement Bancaire",
    rechnung: "Facture",
    vorkasse_description: "Virement avant livraison",
    rechnung_description: "Paiement sur facture",
    recommended: "Recommandé",
    existing_customers_only: "Clients existants uniquement",
    
    // Conditions Générales
    terms_conditions: "Conditions Générales",
    terms_description: "Confirmation légale requise",
    terms_text: "J'accepte les Conditions Générales et la Politique d'Annulation.",
    terms_required: "Veuillez confirmer les conditions générales",
    
    // Commande
    your_order: "Votre Commande",
    subtotal: "Sous-total",
    delivery: "Livraison",
    free: "Gratuit",
    net_amount: "Montant Net",
    vat: "TVA",
    total: "Total",
    discount_code: "Saisir le code de réduction",
    apply: "Appliquer",
    discount_invalid: "Le code saisi n'est pas valide",
    cost_breakdown: "Détail des Coûts",
    
    // Bouton Soumission
    submit_order: "Finaliser la Commande",
    processing_order: "Traitement de la commande...",
    
    // Succès/Erreur
    order_success: "Commande Réussie",
    order_success_message: "Votre commande a été soumise avec succès.",
    order_error: "Erreur",
    order_error_message: "Une erreur s'est produite lors de la soumission de votre commande.",
    checkout_token_missing: "Token de commande manquant",
    invalid_checkout_link: "Lien de Commande Invalide",
    invalid_checkout_message: "Veuillez utiliser un lien de commande valide avec token.",
    loading_checkout: "Chargement de la commande...",
    error_loading_order: "Erreur de Chargement des Données de Commande",
    error_loading_message: "Veuillez vérifier votre lien de commande ou réessayer plus tard.",
    
    // Page de confirmation
    order_confirmation: "Confirmation de Commande",
    order_number: "Numéro de Commande",
    order_confirmed: "Votre commande a été confirmée!",
    order_confirmed_message: "Merci pour votre commande. Tous les détails se trouvent ci-dessous.",
    order_received: "Votre commande a été reçue!",
    order_received_message: "Nous vous contacterons bientôt concernant votre commande.",
    order_details: "Détails de la Commande",
    customer_information: "Informations Client",
    delivery_address: "Adresse de Livraison",
    payment_instructions: "Instructions de Paiement",
    bank_transfer_details: "Coordonnées Bancaires pour Virement",
    account_holder: "Titulaire du Compte",
    reference: "Référence",
    print_confirmation: "Imprimer la Confirmation",
    new_order: "Nouvelle Commande",
    product: "Produit",
    quantity: "Quantité",
    price_per_liter: "Prix par Litre",
    invoice_sent_email: "La facture a été envoyée par email",
    confirmation_sent_email: "Une confirmation a été envoyée par email",
    
    // Nouvelles traductions pour la page de confirmation
    next_steps: "Étapes Suivantes",
    bank_transfer: "Virement Bancaire",
    bank_transfer_description: "Vous transférez le montant de",
    bank_transfer_to_account: "sur notre compte.",
    delivery_after_payment: "La livraison aura lieu dans quelques jours ouvrés après réception du paiement.",
    order_review: "Révision de Commande",
    order_review_description: "Votre commande est en cours de révision. Nous vous contacterons par téléphone sous peu pour discuter des prochaines étapes.",
    phone_contact: "Contact Téléphonique",
    phone_contact_description: "Nous vous appellerons dans les prochaines 24 heures pour confirmer votre commande et discuter des détails de paiement.",
    delivery_info: "Informations de Livraison",
    delivery_notice_title: "Avis Important pour la Livraison",
    delivery_notice_description: "Notre chauffeur vous contactera par téléphone le jour de la livraison. Veuillez vous assurer d'être joignable au",
    delivery_notice_reachable: ".",
    important_notice: "Avis Important",
    manual_mode_notice: "Votre commande est maintenant en cours de révision. Nous vous contacterons par téléphone dans les prochaines 24 heures pour confirmer votre commande et discuter des prochaines étapes concernant le paiement et la livraison.",
    manual_mode_phone_notice: "Veuillez vous assurer d'être joignable au",
    delivery_timeframe: "La livraison aura lieu dans 4-7 jours ouvrés après réception du paiement.",
    copy_tooltip: "Copier",
  }
};

export const getTranslation = (key: string, language: "DE" | "EN" | "FR" = "DE"): string => {
  return translations[language][key] || translations.DE[key] || key;
};
