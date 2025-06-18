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
    ssl_encrypted: "Mit 4.8 von 5 Sternen bewertet",
    
    // VerifiedShopCard translations
    loading: "Wird geladen...",
    title: "Verifizierter Shop",
    reviews: "12.500+ Bewertungen",
    subtitle: "Mit 4.8 von 5 Sternen bewertet",
    securePayment: "Sichere Zahlungsabwicklung",
    
    // Product translations
    standard_heizoel: "Standard Heizöl",
    
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
    
    // Neue Übersetzungen für Fehlerbehandlung
    verbindungsprobleme: "Verbindungsprobleme erkannt. Fallback-Modus wird geladen...",
    verbindungsproblem: "Verbindungsproblem",
    cors_error_title: "Verbindungsproblem",
    cors_error_message: "Es gibt ein Problem mit der Serververbindung. Dies kann an CORS-Einstellungen liegen. Versuchen Sie es erneut oder kontaktieren Sie den Support.",
    retry_button: "Erneut versuchen",
    home_button: "Zur Startseite",
    demo_mode_banner: "Demo-Modus: Verbindung zum Server nicht verfügbar. Alle Funktionen arbeiten mit Beispieldaten.",
    
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
    ssl_encrypted: "Rated 4.8 out of 5 stars",
    
    // VerifiedShopCard translations
    loading: "Loading...",
    title: "Verified Shop",
    reviews: "12,500+ Reviews",
    subtitle: "Rated 4.8 out of 5 stars",
    securePayment: "Secure Payment Processing",
    
    // Product translations
    standard_heizoel: "Standard Heating Oil",
    
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
    street_required: "Street and house number are required",
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
    
    // New translations for error handling
    verbindungsprobleme: "Connection problems detected. Fallback mode is loading...",
    verbindungsproblem: "Connection Problem",
    cors_error_title: "Connection Problem",
    cors_error_message: "There is a problem with the server connection. This may be due to CORS settings. Please try again or contact support.",
    retry_button: "Try Again",
    home_button: "Go to Homepage",
    demo_mode_banner: "Demo Mode: Connection to server not available. All functions work with sample data.",
    
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
    ssl_encrypted: "Noté 4,8 sur 5 étoiles",
    
    // VerifiedShopCard translations
    loading: "Chargement...",
    title: "Boutique Vérifiée",
    reviews: "12 500+ Avis",
    subtitle: "Noté 4,8 sur 5 étoiles",
    securePayment: "Traitement de Paiement Sécurisé",
    
    // Product translations
    standard_heizoel: "Fioul de Chauffage Standard",
    
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
    
    // Nouvelles traductions pour la gestion des erreurs
    verbindungsprobleme: "Problèmes de connexion détectés. Le mode de secours se charge...",
    verbindungsproblem: "Problème de Connexion",
    cors_error_title: "Problème de Connexion",
    cors_error_message: "Il y a un problème avec la connexion au serveur. Cela peut être dû aux paramètres CORS. Veuillez réessayer ou contacter le support.",
    retry_button: "Réessayer",
    home_button: "Aller à l'accueil",
    demo_mode_banner: "Mode Démo : Connexion au serveur non disponible. Toutes les fonctions fonctionnent avec des données d'exemple.",
    
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
  },

  IT: {
    // Generale
    checkout: "Checkout",
    back: "Indietro",
    cart: "Carrello",
    information: "Informazioni",
    shipping: "Spedizione",
    payment: "Pagamento",
    secure_payment: "Pagamento Sicuro",
    ssl_encrypted: "Valutato 4,8 su 5 stelle",
    
    // VerifiedShopCard translations
    loading: "Caricamento...",
    title: "Negozio Verificato",
    reviews: "12.500+ Recensioni",
    subtitle: "Valutato 4,8 su 5 stelle",
    securePayment: "Elaborazione Pagamento Sicuro",
    
    // Product translations
    standard_heizoel: "Olio da Riscaldamento Standard",
    
    // Email Card
    email_address: "Indirizzo Email",
    email_description: "Per la conferma dell'ordine e la comunicazione",
    email_placeholder: "tua.email@esempio.it",
    email_required: "L'indirizzo email è obbligatorio",
    email_invalid: "Inserisci un indirizzo email valido",
    
    // Contatto e Consegna
    contact_delivery: "Contatto e Indirizzo di Consegna",
    contact_description: "I tuoi dati di contatto e indirizzo di consegna",
    first_name: "Nome",
    last_name: "Cognome",
    phone: "Numero di Telefono",
    street: "Via e Numero Civico",
    postal_code: "Codice Postale",
    city: "Città",
    first_name_required: "Il nome è obbligatorio",
    last_name_required: "Il cognome è obbligatorio",
    phone_required: "Il numero di telefono è obbligatorio",
    phone_invalid: "Inserisci un numero di telefono valido",
    street_required: "Via e numero civico sono obbligatori",
    postal_code_required: "Il codice postale è obbligatorio",
    city_required: "La città è obbligatoria",
    
    // Indirizzo di Fatturazione
    billing_address: "Indirizzo di Fatturazione",
    billing_different: "Indirizzo di fatturazione diverso",
    billing_description: "Se il tuo indirizzo di fatturazione è diverso",
    
    // Metodi di Pagamento
    payment_method: "Metodo di Pagamento",
    payment_description: "Scegli il tuo metodo di pagamento preferito",
    vorkasse: "Bonifico Bancario",
    rechnung: "Fattura",
    vorkasse_description: "Bonifico prima della consegna",
    rechnung_description: "Paga con fattura",
    recommended: "Consigliato",
    existing_customers_only: "Solo clienti esistenti",
    
    // Termini e Condizioni
    terms_conditions: "Termini e Condizioni",
    terms_description: "Conferma legale richiesta",
    terms_text: "Accetto i Termini e Condizioni e la Politica di Cancellazione.",
    terms_required: "Conferma i termini e le condizioni",
    
    // Ordine
    your_order: "Il Tuo Ordine",
    subtotal: "Subtotale",
    delivery: "Consegna",
    free: "Gratuita",
    net_amount: "Importo Netto",
    vat: "IVA",
    total: "Totale",
    discount_code: "Inserisci codice sconto",
    apply: "Applica",
    discount_invalid: "Il codice inserito non è valido",
    cost_breakdown: "Riepilogo Costi",
    
    // Pulsante Invio
    submit_order: "Completa Ordine",
    processing_order: "Elaborazione ordine...",
    
    // Successo/Errore
    order_success: "Ordine Completato",
    order_success_message: "Il tuo ordine è stato inviato con successo.",
    order_error: "Errore",
    order_error_message: "Si è verificato un errore nell'invio del tuo ordine.",
    checkout_token_missing: "Token checkout mancante",
    invalid_checkout_link: "Link Checkout Non Valido",
    invalid_checkout_message: "Utilizza un link checkout valido con token.",
    loading_checkout: "Caricamento checkout...",
    error_loading_order: "Errore nel Caricamento Dati Ordine",
    error_loading_message: "Controlla il tuo link checkout o riprova più tardi.",
    
    // Nuove traduzioni per la gestione degli errori
    verbindungsprobleme: "Problemi di connessione rilevati. Modalità di riserva in caricamento...",
    verbindungsproblem: "Problema di Connessione",
    cors_error_title: "Problema di Connessione",
    cors_error_message: "C'è un problema con la connessione al server. Questo potrebbe essere dovuto alle impostazioni CORS. Riprova o contatta il supporto.",
    retry_button: "Riprova",
    home_button: "Vai alla Homepage",
    demo_mode_banner: "Modalità Demo: Connessione al server non disponibile. Tutte le funzioni lavorano con dati di esempio.",
    
    // Pagina di conferma
    order_confirmation: "Conferma Ordine",
    order_number: "Numero Ordine",
    order_confirmed: "Il tuo ordine è stato confermato!",
    order_confirmed_message: "Grazie per il tuo ordine. Tutti i dettagli si trovano qui sotto.",
    order_received: "Il tuo ordine è stato ricevuto!",
    order_received_message: "Ti contatteremo presto riguardo al tuo ordine.",
    order_details: "Dettagli Ordine",
    customer_information: "Informazioni Cliente",
    delivery_address: "Indirizzo di Consegna",
    payment_instructions: "Istruzioni di Pagamento",
    bank_transfer_details: "Dettagli Bancari per Bonifico",
    account_holder: "Titolare del Conto",
    reference: "Riferimento",
    print_confirmation: "Stampa Conferma",
    new_order: "Nuovo Ordine",
    product: "Prodotto",
    quantity: "Quantità",
    price_per_liter: "Prezzo per Litro",
    invoice_sent_email: "La fattura è stata inviata via email",
    confirmation_sent_email: "Una conferma è stata inviata via email",
    
    // Nuove traduzioni per pagina di conferma
    next_steps: "Prossimi Passi",
    bank_transfer: "Bonifico Bancario",
    bank_transfer_description: "Trasferisci l'importo di",
    bank_transfer_to_account: "sul nostro conto.",
    delivery_after_payment: "La consegna avverrà entro pochi giorni lavorativi dopo la ricezione del pagamento.",
    order_review: "Revisione Ordine",
    order_review_description: "Il tuo ordine è in fase di revisione. Ti contatteremo telefonicamente a breve per discutere i prossimi passi.",
    phone_contact: "Contatto Telefonico",
    phone_contact_description: "Ti chiameremo entro le prossime 24 ore per confermare il tuo ordine e discutere i dettagli del pagamento.",
    delivery_info: "Informazioni Consegna",
    delivery_notice_title: "Avviso Importante per la Consegna",
    delivery_notice_description: "Il nostro autista ti contatterà telefonicamente il giorno della consegna. Assicurati di essere raggiungibile al",
    delivery_notice_reachable: ".",
    important_notice: "Avviso Importante",
    manual_mode_notice: "Il tuo ordine è ora in fase di revisione. Ti contatteremo telefonicamente entro le prossime 24 ore per confermare il tuo ordine e discutere i prossimi passi riguardo al pagamento e alla consegna.",
    manual_mode_phone_notice: "Assicurati di essere raggiungibile al",
    delivery_timeframe: "La consegna avverrà entro 4-7 giorni lavorativi dopo la ricezione del pagamento.",
    copy_tooltip: "Copia",
  },

  ES: {
    // General
    checkout: "Checkout",
    back: "Atrás",
    cart: "Carrito",
    information: "Información",
    shipping: "Envío",
    payment: "Pago",
    secure_payment: "Pago Seguro",
    ssl_encrypted: "Calificado con 4,8 de 5 estrellas",
    
    // VerifiedShopCard translations
    loading: "Cargando...",
    title: "Tienda Verificada",
    reviews: "12,500+ Reseñas",
    subtitle: "Calificado con 4,8 de 5 estrellas",
    securePayment: "Procesamiento de Pago Seguro",
    
    // Product translations
    standard_heizoel: "Combustible de Calefacción Estándar",
    
    // Email Card
    email_address: "Dirección de Email",
    email_description: "Para confirmación de pedido y comunicación",
    email_placeholder: "tu.email@ejemplo.es",
    email_required: "La dirección de email es obligatoria",
    email_invalid: "Introduce una dirección de email válida",
    
    // Contacto y Entrega
    contact_delivery: "Contacto y Dirección de Entrega",
    contact_description: "Tus datos de contacto y dirección de entrega",
    first_name: "Nombre",
    last_name: "Apellido",
    phone: "Número de Teléfono",
    street: "Calle y Número",
    postal_code: "Código Postal",
    city: "Ciudad",
    first_name_required: "El nombre es obligatorio",
    last_name_required: "El apellido es obligatorio",
    phone_required: "El número de teléfono es obligatorio",
    phone_invalid: "Introduce un número de teléfono válido",
    street_required: "La calle y número son obligatorios",
    postal_code_required: "El código postal es obligatorio",
    city_required: "La ciudad es obligatoria",
    
    // Dirección de Facturación
    billing_address: "Dirección de Facturación",
    billing_different: "Dirección de facturación diferente",
    billing_description: "Si tu dirección de facturación es diferente",
    
    // Métodos de Pago
    payment_method: "Método de Pago",
    payment_description: "Elige tu método de pago preferido",
    vorkasse: "Transferencia Bancaria",
    rechnung: "Factura",
    vorkasse_description: "Transferencia antes de la entrega",
    rechnung_description: "Pagar con factura",
    recommended: "Recomendado",
    existing_customers_only: "Solo clientes existentes",
    
    // Términos y Condiciones
    terms_conditions: "Términos y Condiciones",
    terms_description: "Confirmación legal requerida",
    terms_text: "Acepto los Términos y Condiciones y la Política de Cancelación.",
    terms_required: "Confirma los términos y condiciones",
    
    // Pedido
    your_order: "Tu Pedido",
    subtotal: "Subtotal",
    delivery: "Entrega",
    free: "Gratis",
    net_amount: "Importe Neto",
    vat: "IVA",
    total: "Total",
    discount_code: "Introduce código de descuento",
    apply: "Aplicar",
    discount_invalid: "El código introducido no es válido",
    cost_breakdown: "Desglose de Costos",
    
    // Botón de Envío
    submit_order: "Completar Pedido",
    processing_order: "Procesando pedido...",
    
    // Éxito/Error
    order_success: "Pedido Exitoso",
    order_success_message: "Tu pedido ha sido enviado exitosamente.",
    order_error: "Error",
    order_error_message: "Ocurrió un error al enviar tu pedido.",
    checkout_token_missing: "Token de checkout faltante",
    invalid_checkout_link: "Enlace de Checkout Inválido",
    invalid_checkout_message: "Utiliza un enlace de checkout válido con token.",
    loading_checkout: "Cargando checkout...",
    error_loading_order: "Error Cargando Datos del Pedido",
    error_loading_message: "Verifica tu enlace de checkout o inténtalo más tarde.",
    
    // Nuevas traducciones para manejo de errores
    verbindungsprobleme: "Problemas de conexión detectados. Modo de respaldo cargando...",
    verbindungsproblem: "Problema de Conexión",
    cors_error_title: "Problema de Conexión",
    cors_error_message: "Hay un problema con la conexión al servidor. Esto puede deberse a configuraciones CORS. Inténtalo de nuevo o contacta soporte.",
    retry_button: "Intentar de Nuevo",
    home_button: "Ir al Inicio",
    demo_mode_banner: "Modo Demo: Conexión al servidor no disponible. Todas las funciones trabajan con datos de ejemplo.",
    
    // Página de confirmación
    order_confirmation: "Confirmación del Pedido",
    order_number: "Número de Pedido",
    order_confirmed: "¡Tu pedido ha sido confirmado!",
    order_confirmed_message: "Gracias por tu pedido. Todos los detalles se encuentran abajo.",
    order_received: "¡Tu pedido ha sido recibido!",
    order_received_message: "Te contactaremos pronto respecto a tu pedido.",
    order_details: "Detalles del Pedido",
    customer_information: "Información del Cliente",
    delivery_address: "Dirección de Entrega",
    payment_instructions: "Instrucciones de Pago",
    bank_transfer_details: "Detalles Bancarios para Transferencia",
    account_holder: "Titular de la Cuenta",
    reference: "Referencia",
    print_confirmation: "Imprimir Confirmación",
    new_order: "Nuevo Pedido",
    product: "Producto",
    quantity: "Cantidad",
    price_per_liter: "Precio por Litro",
    invoice_sent_email: "La factura ha sido enviada por email",
    confirmation_sent_email: "Una confirmación ha sido enviada por email",
    
    // Nuevas traducciones para página de confirmación
    next_steps: "Próximos Pasos",
    bank_transfer: "Transferencia Bancaria",
    bank_transfer_description: "Transfiere el importe de",
    bank_transfer_to_account: "a nuestra cuenta.",
    delivery_after_payment: "La entrega tendrá lugar dentro de pocos días laborables después de recibir el pago.",
    order_review: "Revisión del Pedido",
    order_review_description: "Tu pedido está siendo revisado. Te contactaremos por teléfono pronto para discutir los próximos pasos.",
    phone_contact: "Contacto Telefónico",
    phone_contact_description: "Te llamaremos dentro de las próximas 24 horas para confirmar tu pedido y discutir los detalles del pago.",
    delivery_info: "Información de Entrega",
    delivery_notice_title: "Aviso Importante para la Entrega",
    delivery_notice_description: "Nuestro conductor te contactará por teléfono el día de la entrega. Asegúrate de estar localizable en",
    delivery_notice_reachable: ".",
    important_notice: "Aviso Importante",
    manual_mode_notice: "Tu pedido está ahora siendo revisado. Te contactaremos por teléfono dentro de las próximas 24 horas para confirmar tu pedido y discutir los próximos pasos respecto al pago y entrega.",
    manual_mode_phone_notice: "Asegúrate de estar localizable en",
    delivery_timeframe: "La entrega tendrá lugar dentro de 4-7 días laborables después de recibir el pago.",
    copy_tooltip: "Copiar",
  },

  PL: {
    // Ogólne
    checkout: "Checkout",
    back: "Wstecz",
    cart: "Koszyk",
    information: "Informacje",
    shipping: "Dostawa",
    payment: "Płatność",
    secure_payment: "Bezpieczna Płatność",
    ssl_encrypted: "Ocenione na 4,8 z 5 gwiazdek",
    
    // VerifiedShopCard translations
    loading: "Ładowanie...",
    title: "Zweryfikowany Sklep",
    reviews: "12 500+ Opinii",
    subtitle: "Ocenione na 4,8 z 5 gwiazdek",
    securePayment: "Bezpieczne Przetwarzanie Płatności",
    
    // Product translations
    standard_heizoel: "Standardowy Olej Opałowy",
    
    // Email Card
    email_address: "Adres E-mail",
    email_description: "Do potwierdzenia zamówienia i komunikacji",
    email_placeholder: "twoj.email@przyklad.pl",
    email_required: "Adres e-mail jest wymagany",
    email_invalid: "Podaj prawidłowy adres e-mail",
    
    // Kontakt i Dostawa
    contact_delivery: "Kontakt i Adres Dostawy",
    contact_description: "Twoje dane kontaktowe i adres dostawy",
    first_name: "Imię",
    last_name: "Nazwisko",
    phone: "Numer Telefonu",
    street: "Ulica i Numer",
    postal_code: "Kod Pocztowy",
    city: "Miasto",
    first_name_required: "Imię jest wymagane",
    last_name_required: "Nazwisko jest wymagane",
    phone_required: "Numer telefonu jest wymagany",
    phone_invalid: "Podaj prawidłowy numer telefonu",
    street_required: "Ulica i numer są wymagane",
    postal_code_required: "Kod pocztowy jest wymagany",
    city_required: "Miasto jest wymagane",
    
    // Adres Rozliczeniowy
    billing_address: "Adres Rozliczeniowy",
    billing_different: "Inny adres rozliczeniowy",
    billing_description: "Jeśli Twój adres rozliczeniowy jest inny",
    
    // Metody Płatności
    payment_method: "Metoda Płatności",
    payment_description: "Wybierz preferowaną metodę płatności",
    vorkasse: "Przelew Bankowy",
    rechnung: "Faktura",
    vorkasse_description: "Przelew przed dostawą",
    rechnung_description: "Płatność na fakturę",
    recommended: "Zalecane",
    existing_customers_only: "Tylko dla stałych klientów",
    
    // Regulamin
    terms_conditions: "Regulamin",
    terms_description: "Wymagane potwierdzenie prawne",
    terms_text: "Akceptuję Regulamin i Politykę Anulowania.",
    terms_required: "Potwierdź regulamin",
    
    // Zamówienie
    your_order: "Twoje Zamówienie",
    subtotal: "Suma częściowa",
    delivery: "Dostawa",
    free: "Bezpłatna",
    net_amount: "Kwota Netto",
    vat: "VAT",
    total: "Razem",
    discount_code: "Wprowadź kod rabatowy",
    apply: "Zastosuj",
    discount_invalid: "Wprowadzony kod nie jest prawidłowy",
    cost_breakdown: "Rozliczenie Kosztów",
    
    // Przycisk Wysyłania
    submit_order: "Złóż Zamówienie",
    processing_order: "Przetwarzanie zamówienia...",
    
    // Sukces/Błąd
    order_success: "Zamówienie Złożone",
    order_success_message: "Twoje zamówienie zostało pomyślnie wysłane.",
    order_error: "Błąd",
    order_error_message: "Wystąpił błąd podczas wysyłania zamówienia.",
    checkout_token_missing: "Brak tokenu checkout",
    invalid_checkout_link: "Nieprawidłowy Link Checkout",
    invalid_checkout_message: "Użyj prawidłowego linku checkout z tokenem.",
    loading_checkout: "Ładowanie checkout...",
    error_loading_order: "Błąd Ładowania Danych Zamówienia",
    error_loading_message: "Sprawdź swój link checkout lub spróbuj ponownie później.",
    
    // Nowe tłumaczenia dla obsługi błędów
    verbindungsprobleme: "Wykryto problemy z połączeniem. Ładowanie trybu awaryjnego...",
    verbindungsproblem: "Problem z Połączeniem",
    cors_error_title: "Problem z Połączeniem",
    cors_error_message: "Wystąpił problem z połączeniem z serwerem. Może to być spowodowane ustawieniami CORS. Spróbuj ponownie lub skontaktuj się z pomocą techniczną.",
    retry_button: "Spróbuj Ponownie",
    home_button: "Przejdź do Strony Głównej",
    demo_mode_banner: "Tryb Demo: Połączenie z serwerem niedostępne. Wszystkie funkcje działają z przykładowymi danymi.",
    
    // Strona potwierdzenia
    order_confirmation: "Potwierdzenie Zamówienia",
    order_number: "Numer Zamówienia",
    order_confirmed: "Twoje zamówienie zostało potwierdzone!",
    order_confirmed_message: "Dziękujemy za zamówienie. Wszystkie szczegóły znajdziesz poniżej.",
    order_received: "Twoje zamówienie zostało otrzymane!",
    order_received_message: "Skontaktujemy się z Tobą wkrótce w sprawie zamówienia.",
    order_details: "Szczegóły Zamówienia",
    customer_information: "Informacje o Kliencie",
    delivery_address: "Adres Dostawy",
    payment_instructions: "Instrukcje Płatności",
    bank_transfer_details: "Dane Bankowe do Przelewu",
    account_holder: "Właściciel Konta",
    reference: "Referencja",
    print_confirmation: "Wydrukuj Potwierdzenie",
    new_order: "Nowe Zamówienie",
    product: "Produkt",
    quantity: "Ilość",
    price_per_liter: "Cena za Litr",
    invoice_sent_email: "Faktura została wysłana emailem",
    confirmation_sent_email: "Potwierdzenie zostało wysłane emailem",
    
    // Nowe tłumaczenia dla strony potwierdzenia
    next_steps: "Następne Kroki",
    bank_transfer: "Przelew Bankowy",
    bank_transfer_description: "Przelej kwotę",
    bank_transfer_to_account: "na nasze konto.",
    delivery_after_payment: "Dostawa nastąpi w ciągu kilku dni roboczych po otrzymaniu płatności.",
    order_review: "Przegląd Zamówienia",
    order_review_description: "Twoje zamówienie jest przeglądane. Skontaktujemy się z Tobą telefonicznie wkrótce, aby omówić następne kroki.",
    phone_contact: "Kontakt Telefoniczny",
    phone_contact_description: "Zadzwonimy do Ciebie w ciągu następnych 24 godzin, aby potwierdzić zamówienie i omówić szczegóły płatności.",
    delivery_info: "Informacje o Dostawie",
    delivery_notice_title: "Ważna Informacja o Dostawie",
    delivery_notice_description: "Nasz kierowca skontaktuje się z Tobą telefonicznie w dniu dostawy. Upewnij się, że jesteś dostępny pod numerem",
    delivery_notice_reachable: ".",
    important_notice: "Ważna Informacja",
    manual_mode_notice: "Twoje zamówienie jest teraz przeglądane. Skontaktujemy się z Tobą telefonicznie w ciągu następnych 24 godzin, aby potwierdzić zamówienie i omówić następne kroki dotyczące płatności i dostawy.",
    manual_mode_phone_notice: "Upewnij się, że jesteś dostępny pod numerem",
    delivery_timeframe: "Dostawa nastąpi w ciągu 4-7 dni roboczych po otrzymaniu płatności.",
    copy_tooltip: "Kopiuj",
  },

  NL: {
    // Algemeen
    checkout: "Checkout",
    back: "Terug",
    cart: "Winkelwagen",
    information: "Informatie",
    shipping: "Verzending",
    payment: "Betaling",
    secure_payment: "Veilige Betaling",
    ssl_encrypted: "Beoordeeld met 4,8 van 5 sterren",
    
    // VerifiedShopCard translations
    loading: "Laden...",
    title: "Geverifieerde Winkel",
    reviews: "12.500+ Beoordelingen",
    subtitle: "Beoordeeld met 4,8 van 5 sterren",
    securePayment: "Veilige Betalingsverwerking",
    
    // Product translations
    standard_heizoel: "Standaard Stookolie",
    
    // E-mail Card
    email_address: "E-mailadres",
    email_description: "Voor orderbevestiging en communicatie",
    email_placeholder: "jouw.email@voorbeeld.nl",
    email_required: "E-mailadres is verplicht",
    email_invalid: "Voer een geldig e-mailadres in",
    
    // Contact & Levering
    contact_delivery: "Contact & Leveringsadres",
    contact_description: "Jouw contactgegevens en leveringsadres",
    first_name: "Voornaam",
    last_name: "Achternaam",
    phone: "Telefoonnummer",
    street: "Straat en Huisnummer",
    postal_code: "Postcode",
    city: "Stad",
    first_name_required: "Voornaam is verplicht",
    last_name_required: "Achternaam is verplicht",
    phone_required: "Telefoonnummer is verplicht",
    phone_invalid: "Voer een geldig telefoonnummer in",
    street_required: "Straat en huisnummer zijn verplicht",
    postal_code_required: "Postcode is verplicht",
    city_required: "Stad is verplicht",
    
    // Factuuradres
    billing_address: "Factuuradres",
    billing_different: "Ander factuuradres",
    billing_description: "Als jouw factuuradres verschilt",
    
    // Betaalmethoden
    payment_method: "Betaalmethode",
    payment_description: "Kies jouw voorkeurs betaalmethode",
    vorkasse: "Bankoverschrijving",
    rechnung: "Factuur",
    vorkasse_description: "Overschrijving voor levering",
    rechnung_description: "Betaal op factuur",
    recommended: "Aanbevolen",
    existing_customers_only: "Alleen bestaande klanten",
    
    // Algemene Voorwaarden
    terms_conditions: "Algemene Voorwaarden",
    terms_description: "Juridische bevestiging vereist",
    terms_text: "Ik ga akkoord met de Algemene Voorwaarden en het Annuleringsbeleid.",
    terms_required: "Bevestig de algemene voorwaarden",
    
    // Bestelling
    your_order: "Jouw Bestelling",
    subtotal: "Subtotaal",
    delivery: "Levering",
    free: "Gratis",
    net_amount: "Netto Bedrag",
    vat: "BTW",
    total: "Totaal",
    discount_code: "Kortingscode invoeren",
    apply: "Toepassen",
    discount_invalid: "De ingevoerde code is niet geldig",
    cost_breakdown: "Kostenopbouw",
    
    // Verzendknop
    submit_order: "Bestelling Voltooien",
    processing_order: "Bestelling verwerken...",
    
    // Succes/Fout
    order_success: "Bestelling Geslaagd",
    order_success_message: "Jouw bestelling is succesvol verzonden.",
    order_error: "Fout",
    order_error_message: "Er is een fout opgetreden bij het verzenden van jouw bestelling.",
    checkout_token_missing: "Checkout token ontbreekt",
    invalid_checkout_link: "Ongeldige Checkout Link",
    invalid_checkout_message: "Gebruik een geldige checkout link met token.",
    loading_checkout: "Checkout laden...",
    error_loading_order: "Fout bij Laden Bestellingsgegevens",
    error_loading_message: "Controleer jouw checkout link of probeer het later opnieuw.",
    
    // Nieuwe vertalingen voor foutafhandeling
    verbindungsprobleme: "Verbindingsproblemen gedetecteerd. Fallback-modus wordt geladen...",
    verbindungsproblem: "Verbindingsprobleem",
    cors_error_title: "Verbindingsprobleem",
    cors_error_message: "Er is een probleem met de serververbinding. Dit kan te wijten zijn aan CORS-instellingen. Probeer het opnieuw of neem contact op met de ondersteuning.",
    retry_button: "Opnieuw Proberen",
    home_button: "Naar Homepage",
    demo_mode_banner: "Demo Modus: Verbinding met server niet beschikbaar. Alle functies werken met voorbeeldgegevens.",
    
    // Bevestigingspagina
    order_confirmation: "Bestellingsbevestiging",
    order_number: "Bestelnummer",
    order_confirmed: "Jouw bestelling is bevestigd!",
    order_confirmed_message: "Bedankt voor jouw bestelling. Alle details vind je hieronder.",
    order_received: "Jouw bestelling is ontvangen!",
    order_received_message: "We nemen binnenkort contact met je op betreffende jouw bestelling.",
    order_details: "Bestellingsdetails",
    customer_information: "Klantinformatie",
    delivery_address: "Leveringsadres",
    payment_instructions: "Betalingsinstructies",
    bank_transfer_details: "Bankgegevens voor Overschrijving",
    account_holder: "Rekeninghouder",
    reference: "Referentie",
    print_confirmation: "Bevestiging Afdrukken",
    new_order: "Nieuwe Bestelling",
    product: "Product",
    quantity: "Aantal",
    price_per_liter: "Prijs per Liter",
    invoice_sent_email: "De factuur is per e-mail verzonden",
    confirmation_sent_email: "Een bevestiging is per e-mail verzonden",
    
    // Nieuwe vertalingen voor bevestigingspagina
    next_steps: "Volgende Stappen",
    bank_transfer: "Bankoverschrijving",
    bank_transfer_description: "Je schrijft het bedrag van",
    bank_transfer_to_account: "over naar onze rekening.",
    delivery_after_payment: "Levering vindt plaats binnen enkele werkdagen na ontvangst van betaling.",
    order_review: "Bestellingsbeoordeling",
    order_review_description: "Jouw bestelling wordt beoordeeld. We nemen binnenkort telefonisch contact met je op om de volgende stappen te bespreken.",
    phone_contact: "Telefonisch Contact",
    phone_contact_description: "We bellen je binnen de komende 24 uur om jouw bestelling te bevestigen en betalingsdetails te bespreken.",
    delivery_info: "Leveringsinformatie",
    delivery_notice_title: "Belangrijke Mededeling voor Levering",
    delivery_notice_description: "Onze chauffeur neemt telefonisch contact met je op op de leveringsdag. Zorg ervoor dat je bereikbaar bent op",
    delivery_notice_reachable: ".",
    important_notice: "Belangrijke Mededeling",
    manual_mode_notice: "Jouw bestelling wordt nu beoordeeld. We nemen binnen de komende 24 uur telefonisch contact met je op om jouw bestelling te bevestigen en de volgende stappen betreffende betaling en levering te bespreken.",
    manual_mode_phone_notice: "Zorg ervoor dat je bereikbaar bent op",
    delivery_timeframe: "Levering vindt plaats binnen 4-7 werkdagen na ontvangst van betaling.",
    copy_tooltip: "Kopiëren",
  }
};

export const getTranslation = (key: string, language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"): string => {
  console.log("getTranslation called with:", { key, language, type: typeof language });
  
  // Defensive programming: handle invalid/undefined language values
  let validLanguage: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE";
  
  if (language && typeof language === 'string' && translations[language]) {
    validLanguage = language as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
  } else {
    console.warn("Invalid language provided to getTranslation:", language, "falling back to DE");
    validLanguage = "DE";
  }
  
  console.log("Using language:", validLanguage);
  
  // Try to get translation for the requested language
  const translation = translations[validLanguage]?.[key];
  if (translation) {
    console.log("Found translation:", translation);
    return translation;
  }
  
  // Fallback to German if key not found in requested language
  const fallbackTranslation = translations.DE[key];
  if (fallbackTranslation) {
    console.log("Using DE fallback for key:", key);
    return fallbackTranslation;
  }
  
  // Final fallback: return the key itself
  console.warn("No translation found for key:", key, "in any language");
  return key;
};
