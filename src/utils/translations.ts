export type SupportedLanguage = "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";

export const translations: Record<string, Record<SupportedLanguage, string>> = {
  // Existing translations
  email: {
    DE: "E-Mail",
    EN: "Email",
    FR: "E-mail",
    IT: "Email",
    ES: "Correo electrónico",
    PL: "E-mail",
    NL: "E-mail"
  },
  email_address: {
    DE: "E-Mail-Adresse",
    EN: "Email address",
    FR: "Adresse e-mail",
    IT: "Indirizzo email",
    ES: "Dirección de correo electrónico",
    PL: "Adres e-mail",
    NL: "E-mailadres"
  },
  email_description: {
    DE: "Wo sollen wir Ihre Bestätigung hinschicken?",
    EN: "Where should we send your confirmation?",
    FR: "Où devons-nous envoyer votre confirmation?",
    IT: "Dove dovremmo inviare la tua conferma?",
    ES: "¿Dónde debemos enviar su confirmación?",
    PL: "Gdzie mamy wysłać potwierdzenie?",
    NL: "Waar moeten we uw bevestiging naartoe sturen?"
  },
  
  // New billing address translations
  billing_address: {
    DE: "Rechnungsadresse",
    EN: "Billing address",
    FR: "Adresse de facturation",
    IT: "Indirizzo di fatturazione",
    ES: "Dirección de facturación",
    PL: "Adres rozliczeniowy",
    NL: "Factuuradres"
  },
  billing_description: {
    DE: "Wohin soll die Rechnung gesendet werden?",
    EN: "Where should the invoice be sent?",
    FR: "Où la facture doit-elle être envoyée?",
    IT: "Dove deve essere inviata la fattura?",
    ES: "¿Dónde se debe enviar la factura?",
    PL: "Gdzie ma zostać wysłana faktura?",
    NL: "Waar moet de factuur naartoe worden gestuurd?"
  },
  same_as_delivery: {
    DE: "Rechnungsadresse ist identisch mit Lieferadresse",
    EN: "Billing address is the same as delivery address",
    FR: "L'adresse de facturation est identique à l'adresse de livraison",
    IT: "L'indirizzo di fatturazione è lo stesso dell'indirizzo di consegna",
    ES: "La dirección de facturación es la misma que la dirección de entrega",
    PL: "Adres rozliczeniowy jest taki sam jak adres dostawy",
    NL: "Factuuradres is hetzelfde als bezorgadres"
  },
  
  // Delivery address translations
  delivery_address: {
    DE: "Lieferadresse",
    EN: "Delivery address",
    FR: "Adresse de livraison",
    IT: "Indirizzo di consegna",
    ES: "Dirección de entrega",
    PL: "Adres dostawy",
    NL: "Bezorgadres"
  },
  delivery_description: {
    DE: "Wohin soll das Heizöl geliefert werden?",
    EN: "Where should the heating oil be delivered?",
    FR: "Où le fioul de chauffage doit-il être livré?",
    IT: "Dove deve essere consegnato l'olio da riscaldamento?",
    ES: "¿Dónde se debe entregar el gasóleo de calefacción?",
    PL: "Gdzie ma być dostarczony olej opałowy?",
    NL: "Waar moet de stookolie worden bezorgd?"
  },
  
  // Address field translations
  street_number: {
    DE: "Straße und Hausnummer",
    EN: "Street and house number",
    FR: "Rue et numéro de maison",
    IT: "Via e numero civico",
    ES: "Calle y número de casa",
    PL: "Ulica i numer domu",
    NL: "Straat en huisnummer"
  },
  postal_code: {
    DE: "Postleitzahl",
    EN: "Postal code",
    FR: "Code postal",
    IT: "Codice postale",
    ES: "Código postal",
    PL: "Kod pocztowy",
    NL: "Postcode"
  },
  city: {
    DE: "Stadt",
    EN: "City",
    FR: "Ville",
    IT: "Città",
    ES: "Ciudad",
    PL: "Miasto",
    NL: "Stad"
  },
  first_name: {
    DE: "Vorname",
    EN: "First name",
    FR: "Prénom",
    IT: "Nome",
    ES: "Nombre",
    PL: "Imię",
    NL: "Voornaam"
  },
  last_name: {
    DE: "Nachname",
    EN: "Last name",
    FR: "Nom de famille",
    IT: "Cognome",
    ES: "Apellido",
    PL: "Nazwisko",
    NL: "Achternaam"
  },
  phone_number: {
    DE: "Telefonnummer",
    EN: "Phone number",
    FR: "Numéro de téléphone",
    IT: "Numero di telefono",
    ES: "Número de teléfono",
    PL: "Numer telefonu",
    NL: "Telefoonnummer"
  },

  // Payment method translations
  payment_method: {
    DE: "Zahlungsart",
    EN: "Payment method",
    FR: "Mode de paiement",
    IT: "Metodo di pagamento",
    ES: "Método de pago",
    PL: "Metoda płatności",
    NL: "Betaalmethode"
  },
  payment_description: {
    DE: "Wie möchten Sie bezahlen?",
    EN: "How would you like to pay?",
    FR: "Comment souhaitez-vous payer?",
    IT: "Come vorresti pagare?",
    ES: "¿Cómo le gustaría pagar?",
    PL: "Jak chcesz zapłacić?",
    NL: "Hoe wilt u betalen?"
  },
  vorkasse: {
    DE: "Vorkasse/Überweisung",
    EN: "Prepayment/Bank transfer",
    FR: "Paiement anticipé/Virement bancaire",
    IT: "Pagamento anticipato/Bonifico bancario",
    ES: "Pago anticipado/Transferencia bancaria",
    PL: "Przedpłata/Przelew bankowy",
    NL: "Vooruitbetaling/Bankoverschrijving"
  },
  vorkasse_description: {
    DE: "Zahlung per Überweisung vor Lieferung",
    EN: "Payment by bank transfer before delivery",
    FR: "Paiement par virement bancaire avant livraison",
    IT: "Pagamento tramite bonifico bancario prima della consegna",
    ES: "Pago por transferencia bancaria antes de la entrega",
    PL: "Płatność przelewem przed dostawą",
    NL: "Betaling via bankoverschrijving vóór levering"
  },
  rechnung: {
    DE: "Kauf auf Rechnung",
    EN: "Purchase on account",
    FR: "Achat sur facture",
    IT: "Acquisto su fattura",
    ES: "Compra a cuenta",
    PL: "Zakup na rachunek",
    NL: "Koop op rekening"
  },
  rechnung_description: {
    DE: "Zahlung nach Erhalt der Rechnung",
    EN: "Payment after receiving the invoice",
    FR: "Paiement après réception de la facture",
    IT: "Pagamento dopo aver ricevuto la fattura",
    ES: "Pago después de recibir la factura",
    PL: "Płatność po otrzymaniu faktury",
    NL: "Betaling na ontvangst van de factuur"
  },
  recommended: {
    DE: "Empfohlen",
    EN: "Recommended",
    FR: "Recommandé",
    IT: "Raccomandato",
    ES: "Recomendado",
    PL: "Zalecane",
    NL: "Aanbevolen"
  },
  existing_customers_only: {
    DE: "Nur für Bestandskunden",
    EN: "Existing customers only",
    FR: "Clients existants uniquement",
    IT: "Solo clienti esistenti",
    ES: "Solo para clientes existentes",
    PL: "Tylko dla istniejących klientów",
    NL: "Alleen voor bestaande klanten"
  },

  // Order summary translations
  your_order: {
    DE: "Ihre Bestellung",
    EN: "Your order",
    FR: "Votre commande",
    IT: "Il tuo ordine",
    ES: "Su pedido",
    PL: "Twoje zamówienie",
    NL: "Uw bestelling"
  },
  discount_code: {
    DE: "Rabattcode",
    EN: "Discount code",
    FR: "Code de réduction",
    IT: "Codice sconto",
    ES: "Código de descuento",
    PL: "Kod rabatowy",
    NL: "Kortingscode"
  },
  apply: {
    DE: "Anwenden",
    EN: "Apply",
    FR: "Appliquer",
    IT: "Applica",
    ES: "Aplicar",
    PL: "Zastosuj",
    NL: "Toepassen"
  },
  discount_invalid: {
    DE: "Ungültiger Rabattcode",
    EN: "Invalid discount code",
    FR: "Code de réduction invalide",
    IT: "Codice sconto non valido",
    ES: "Código de descuento inválido",
    PL: "Nieprawidłowy kod rabatowy",
    NL: "Ongeldige kortingscode"
  },
  cost_breakdown: {
    DE: "Kostenaufschlüsselung",
    EN: "Cost breakdown",
    FR: "Répartition des coûts",
    IT: "Ripartizione dei costi",
    ES: "Desglose de costos",
    PL: "Podział kosztów",
    NL: "Kostenverdeling"
  },
  subtotal: {
    DE: "Zwischensumme",
    EN: "Subtotal",
    FR: "Sous-total",
    IT: "Subtotale",
    ES: "Subtotal",
    PL: "Suma częściowa",
    NL: "Subtotaal"
  },
  delivery: {
    DE: "Lieferung",
    EN: "Delivery",
    FR: "Livraison",
    IT: "Consegna",
    ES: "Entrega",
    PL: "Dostawa",
    NL: "Bezorging"
  },
  free: {
    DE: "Kostenlos",
    EN: "Free",
    FR: "Gratuit",
    IT: "Gratuito",
    ES: "Gratis",
    PL: "Za darmo",
    NL: "Gratis"
  },
  net_amount: {
    DE: "Nettobetrag",
    EN: "Net amount",
    FR: "Montant net",
    IT: "Importo netto",
    ES: "Cantidad neta",
    PL: "Kwota netto",
    NL: "Nettobedrag"
  },
  vat: {
    DE: "MwSt.",
    EN: "VAT",
    FR: "TVA",
    IT: "IVA",
    ES: "IVA",
    PL: "VAT",
    NL: "BTW"
  },
  total: {
    DE: "Gesamt",
    EN: "Total",
    FR: "Total",
    IT: "Totale",
    ES: "Total",
    PL: "Suma",
    NL: "Totaal"
  },

  // Navigation translations  
  back: {
    DE: "Zurück",
    EN: "Back",
    FR: "Retour",
    IT: "Indietro",
    ES: "Atrás",
    PL: "Wstecz",
    NL: "Terug"
  },
  cart: {
    DE: "Warenkorb",
    EN: "Cart",
    FR: "Panier",
    IT: "Carrello",
    ES: "Carrito",
    PL: "Koszyk",
    NL: "Winkelwagen"
  },
  information: {
    DE: "Informationen",
    EN: "Information",
    FR: "Informations",
    IT: "Informazioni",
    ES: "Información",
    PL: "Informacje",
    NL: "Informatie"
  },
  shipping: {
    DE: "Versand",
    EN: "Shipping",
    FR: "Expédition",
    IT: "Spedizione",
    ES: "Envío",
    PL: "Wysyłka",
    NL: "Verzending"
  },

  // Terms and conditions translations
  terms_conditions: {
    DE: "Allgemeine Geschäftsbedingungen",
    EN: "Terms and Conditions",
    FR: "Conditions Générales",
    IT: "Termini e Condizioni",
    ES: "Términos y Condiciones",
    PL: "Warunki i Postanowienia",
    NL: "Algemene Voorwaarden"
  },
  terms_description: {
    DE: "Bestätigen Sie die Bedingungen",
    EN: "Confirm the conditions",
    FR: "Confirmez les conditions",
    IT: "Conferma le condizioni",
    ES: "Confirmar las condiciones",
    PL: "Potwierdź warunki",
    NL: "Bevestig de voorwaarden"
  },
  terms_text: {
    DE: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen und stimme der Verarbeitung meiner Daten zu.",
    EN: "I accept the Terms and Conditions and agree to the processing of my data.",
    FR: "J'accepte les Conditions Générales et consens au traitement de mes données.",
    IT: "Accetto i Termini e le Condizioni e acconsento al trattamento dei miei dati.",
    ES: "Acepto los Términos y Condiciones y consiento el procesamiento de mis datos.",
    PL: "Akceptuję Warunki i Postanowienia oraz wyrażam zgodę na przetwarzanie moich danych.",
    NL: "Ik accepteer de Algemene Voorwaarden en stem in met de verwerking van mijn gegevens."
  },
  processing_order: {
    DE: "Bestellung wird verarbeitet...",
    EN: "Processing order...",
    FR: "Traitement de la commande...",
    IT: "Elaborazione ordine...",
    ES: "Procesando pedido...",
    PL: "Przetwarzanie zamówienia...",
    NL: "Bestelling verwerken..."
  },
  submit_order: {
    DE: "Bestellung abschicken",
    EN: "Submit order",
    FR: "Soumettre la commande",
    IT: "Invia ordine",
    ES: "Enviar pedido",
    PL: "Złóż zamówienie",
    NL: "Bestelling verzenden"
  },

  // Error and success messages
  order_error: {
    DE: "Bestellfehler",
    EN: "Order error",
    FR: "Erreur de commande",
    IT: "Errore dell'ordine",
    ES: "Error de pedido",
    PL: "Błąd zamówienia",
    NL: "Bestelfout"
  },
  checkout_token_missing: {
    DE: "Checkout-Token fehlt",
    EN: "Checkout token missing",
    FR: "Jeton de commande manquant",
    IT: "Token di checkout mancante",
    ES: "Token de checkout faltante",
    PL: "Brak tokena płatności",
    NL: "Checkout-token ontbreekt"
  },
  terms_required: {
    DE: "AGB müssen akzeptiert werden",
    EN: "Terms must be accepted",
    FR: "Les conditions doivent être acceptées",
    IT: "I termini devono essere accettati",
    ES: "Se deben aceptar los términos",
    PL: "Warunki muszą zostać zaakceptowane",
    NL: "Voorwaarden moeten worden geaccepteerd"
  },
  order_error_message: {
    DE: "Bitte überprüfen Sie Ihre Eingaben",
    EN: "Please check your input",
    FR: "Veuillez vérifier votre saisie",
    IT: "Si prega di controllare il proprio input",
    ES: "Por favor revise su entrada",
    PL: "Sprawdź swoje dane wejściowe",
    NL: "Controleer uw invoer"
  },
  order_success: {
    DE: "Bestellung erfolgreich",
    EN: "Order successful",
    FR: "Commande réussie",
    IT: "Ordine riuscito",
    ES: "Pedido exitoso",
    PL: "Zamówienie pomyślne",
    NL: "Bestelling succesvol"
  },
  order_success_message: {
    DE: "Ihre Bestellung wurde erfolgreich übermittelt",
    EN: "Your order has been successfully submitted",
    FR: "Votre commande a été soumise avec succès",
    IT: "Il tuo ordine è stato inviato con successo",
    ES: "Su pedido ha sido enviado exitosamente",
    PL: "Twoje zamówienie zostało pomyślnie złożone",
    NL: "Uw bestelling is succesvol verzonden"
  }
};

export const getTranslation = (key: string, language: SupportedLanguage = "DE"): string => {
  if (!translations[key]) {
    console.warn(`Translation key '${key}' not found`);
    return key;
  }
  
  if (!translations[key][language]) {
    console.warn(`Translation for key '${key}' not found for language '${language}', falling back to German`);
    return translations[key]["DE"] || key;
  }
  
  return translations[key][language];
};
