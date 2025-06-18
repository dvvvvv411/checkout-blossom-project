
const translations = {
  // Email section
  email_address: {
    DE: "E-Mail-Adresse",
    EN: "Email Address", 
    FR: "Adresse e-mail",
    IT: "Indirizzo email",
    ES: "Dirección de correo",
    PL: "Adres e-mail",
    NL: "E-mailadres"
  },
  email_description: {
    DE: "Für Bestätigung und Updates",
    EN: "For confirmation and updates",
    FR: "Pour confirmation et mises à jour", 
    IT: "Per conferma e aggiornamenti",
    ES: "Para confirmación y actualizaciones",
    PL: "Do potwierdzenia i aktualizacji",
    NL: "Voor bevestiging en updates"
  },
  email_placeholder: {
    DE: "ihre@email.de",
    EN: "your@email.com",
    FR: "votre@email.fr",
    IT: "tua@email.it", 
    ES: "tu@email.es",
    PL: "twoj@email.pl",
    NL: "jouw@email.nl"
  },

  // Contact and delivery section
  personal_contact_data: {
    DE: "Persönliche Daten & Lieferadresse",
    EN: "Personal Data & Delivery Address",
    FR: "Données personnelles et adresse de livraison",
    IT: "Dati personali e indirizzo di consegna", 
    ES: "Datos personales y dirección de entrega",
    PL: "Dane osobowe i adres dostawy",
    NL: "Persoonlijke gegevens en bezorgadres"
  },
  delivery_address: {
    DE: "Lieferadresse",
    EN: "Delivery Address",
    FR: "Adresse de livraison",
    IT: "Indirizzo di consegna",
    ES: "Dirección de entrega", 
    PL: "Adres dostawy",
    NL: "Bezorgadres"
  },
  delivery_description: {
    DE: "Wohin soll das Heizöl geliefert werden?",
    EN: "Where should the heating oil be delivered?",
    FR: "Où le mazout doit-il être livré?",
    IT: "Dove deve essere consegnato l'olio combustibile?",
    ES: "¿Dónde debe entregarse el combustible?",
    PL: "Gdzie ma zostać dostarczone paliwo?", 
    NL: "Waar moet de stookolie worden geleverd?"
  },
  first_name: {
    DE: "Vorname",
    EN: "First Name",
    FR: "Prénom",
    IT: "Nome",
    ES: "Nombre",
    PL: "Imię",
    NL: "Voornaam"
  },
  last_name: {
    DE: "Nachname", 
    EN: "Last Name",
    FR: "Nom de famille",
    IT: "Cognome",
    ES: "Apellido",
    PL: "Nazwisko", 
    NL: "Achternaam"
  },
  phone_number: {
    DE: "Telefonnummer",
    EN: "Phone Number",
    FR: "Numéro de téléphone",
    IT: "Numero di telefono",
    ES: "Número de teléfono",
    PL: "Numer telefonu",
    NL: "Telefoonnummer"
  },
  street_house_number: {
    DE: "Straße und Hausnummer",
    EN: "Street and House Number", 
    FR: "Rue et numéro",
    IT: "Via e numero civico",
    ES: "Calle y número",
    PL: "Ulica i numer domu",
    NL: "Straat en huisnummer"
  },
  postal_code: {
    DE: "PLZ",
    EN: "Postal Code",
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
  
  // Billing address section
  billing_address: {
    DE: "Rechnungsadresse",
    EN: "Billing Address",
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
    ES: "¿Dónde debe enviarse la factura?",
    PL: "Gdzie ma zostać wysłana faktura?",
    NL: "Waar moet de factuur worden verzonden?"
  },
  billing_same_as_delivery: {
    DE: "Rechnungsadresse ist identisch mit Lieferadresse",
    EN: "Billing address is the same as delivery address",
    FR: "L'adresse de facturation est identique à l'adresse de livraison",
    IT: "L'indirizzo di fatturazione è uguale all'indirizzo di consegna", 
    ES: "La dirección de facturación es la misma que la de entrega",
    PL: "Adres rozliczeniowy jest taki sam jak adres dostawy",
    NL: "Factuuradres is hetzelfde als bezorgadres"
  },

  // Terms and conditions
  terms_conditions: {
    DE: "AGB & Datenschutz",
    EN: "Terms & Privacy", 
    FR: "CGV et confidentialité",
    IT: "Termini e privacy",
    ES: "Términos y privacidad",
    PL: "Regulamin i prywatność",
    NL: "Voorwaarden en privacy"
  },
  terms_description: {
    DE: "Zustimmung zu unseren Bedingungen",
    EN: "Agreement to our terms",
    FR: "Acceptation de nos conditions",
    IT: "Accettazione dei nostri termini",
    ES: "Aceptación de nuestros términos",
    PL: "Zgoda na nasze warunki", 
    NL: "Instemming met onze voorwaarden"
  },
  terms_text: {
    DE: "Ich stimme den Allgemeinen Geschäftsbedingungen und der Datenschutzerklärung zu und bestätige, dass ich diese gelesen und verstanden habe.",
    EN: "I agree to the Terms and Conditions and Privacy Policy and confirm that I have read and understood them.",
    FR: "J'accepte les Conditions Générales et la Politique de Confidentialité et confirme que je les ai lues et comprises.",
    IT: "Accetto i Termini e Condizioni e l'Informativa sulla Privacy e confermo di averli letti e compresi.",
    ES: "Acepto los Términos y Condiciones y la Política de Privacidad y confirmo que los he leído y entendido.",
    PL: "Zgadzam się z Regulaminem i Polityką Prywatności i potwierdzam, że je przeczytałem i zrozumiałem.",
    NL: "Ik ga akkoord met de Algemene Voorwaarden en het Privacybeleid en bevestig dat ik deze heb gelezen en begrepen."
  },

  // Placeholders
  first_name_placeholder: {
    DE: "Vorname",
    EN: "First name", 
    FR: "Prénom",
    IT: "Nome",
    ES: "Nombre",
    PL: "Imię",
    NL: "Voornaam"
  },
  last_name_placeholder: {
    DE: "Nachname",
    EN: "Last name",
    FR: "Nom de famille", 
    IT: "Cognome",
    ES: "Apellido",
    PL: "Nazwisko",
    NL: "Achternaam"
  },
  phone_placeholder: {
    DE: "Telefonnummer",
    EN: "Phone number",
    FR: "Numéro de téléphone",
    IT: "Numero di telefono",
    ES: "Número de teléfono", 
    PL: "Numer telefonu",
    NL: "Telefoonnummer"
  },
  street_placeholder: {
    DE: "Straße und Hausnummer",
    EN: "Street and house number",
    FR: "Rue et numéro",
    IT: "Via e numero civico", 
    ES: "Calle y número",
    PL: "Ulica i numer domu", 
    NL: "Straat en huisnummer"
  },
  postal_code_placeholder: {
    DE: "PLZ",
    EN: "Postal code",
    FR: "Code postal",
    IT: "Codice postale",
    ES: "Código postal",
    PL: "Kod pocztowy",
    NL: "Postcode"
  },
  city_placeholder: {
    DE: "Stadt", 
    EN: "City",
    FR: "Ville",
    IT: "Città",
    ES: "Ciudad",
    PL: "Miasto",
    NL: "Stad"
  },
  email: {
    DE: "E-Mail",
    EN: "Email",
    FR: "E-mail",
    IT: "Email",
    ES: "Correo electrónico",
    PL: "E-mail",
    NL: "E-mail"
  },
  password: {
    DE: "Passwort",
    EN: "Password",
    FR: "Mot de passe",
    IT: "Password",
    ES: "Contraseña",
    PL: "Hasło",
    NL: "Wachtwoord"
  },
  confirm_password: {
    DE: "Passwort bestätigen",
    EN: "Confirm password",
    FR: "Confirmer le mot de passe",
    IT: "Conferma password",
    ES: "Confirmar contraseña",
    PL: "Potwierdź hasło",
    NL: "Wachtwoord bevestigen"
  },
  address: {
    DE: "Adresse",
    EN: "Address",
    FR: "Adresse",
    IT: "Indirizzo",
    ES: "Dirección",
    PL: "Adres",
    NL: "Adres"
  },
  company: {
    DE: "Firma",
    EN: "Company",
    FR: "Entreprise",
    IT: "Azienda",
    ES: "Empresa",
    PL: "Firma",
    NL: "Bedrijf"
  },
  country: {
    DE: "Land",
    EN: "Country",
    FR: "Pays",
    IT: "Paese",
    ES: "País",
    PL: "Kraj",
    NL: "Land"
  },
  state: {
    DE: "Bundesland",
    EN: "State",
    FR: "État",
    IT: "Stato",
    ES: "Estado",
    PL: "Stan",
    NL: "Staat"
  },
  create_account: {
    DE: "Konto erstellen",
    EN: "Create account",
    FR: "Créer un compte",
    IT: "Crea account",
    ES: "Crear cuenta",
    PL: "Utwórz konto",
    NL: "Account aanmaken"
  },
  login: {
    DE: "Anmelden",
    EN: "Login",
    FR: "Se connecter",
    IT: "Accedi",
    ES: "Iniciar sesión",
    PL: "Zaloguj się",
    NL: "Inloggen"
  },
  forgot_password: {
    DE: "Passwort vergessen?",
    EN: "Forgot password?",
    FR: "Mot de passe oublié?",
    IT: "Password dimenticata?",
    ES: "¿Olvidaste la contraseña?",
    PL: "Zapomniałeś hasła?",
    NL: "Wachtwoord vergeten?"
  },
  reset_password: {
    DE: "Passwort zurücksetzen",
    EN: "Reset password",
    FR: "Réinitialiser le mot de passe",
    IT: "Resetta password",
    ES: "Restablecer la contraseña",
    PL: "Zresetuj hasło",
    NL: "Wachtwoord resetten"
  },
  send_reset_link: {
    DE: "Link zum Zurücksetzen senden",
    EN: "Send reset link",
    FR: "Envoyer le lien de réinitialisation",
    IT: "Invia link di reset",
    ES: "Enviar enlace de restablecimiento",
    PL: "Wyślij link resetujący",
    NL: "Verzend resetlink"
  },
  new_password: {
    DE: "Neues Passwort",
    EN: "New password",
    FR: "Nouveau mot de passe",
    IT: "Nuova password",
    ES: "Nueva contraseña",
    PL: "Nowe hasło",
    NL: "Nieuw wachtwoord"
  },
  update_password: {
    DE: "Passwort aktualisieren",
    EN: "Update password",
    FR: "Mettre à jour le mot de passe",
    IT: "Aggiorna password",
    ES: "Actualizar contraseña",
    PL: "Zaktualizuj hasło",
    NL: "Wachtwoord bijwerken"
  },
  confirm_new_password: {
    DE: "Neues Passwort bestätigen",
    EN: "Confirm new password",
    FR: "Confirmer le nouveau mot de passe",
    IT: "Conferma nuova password",
    ES: "Confirmar nueva contraseña",
    PL: "Potwierdź nowe hasło",
    NL: "Nieuw wachtwoord bevestigen"
  },
  save_changes: {
    DE: "Änderungen speichern",
    EN: "Save changes",
    FR: "Enregistrer les modifications",
    IT: "Salva modifiche",
    ES: "Guardar cambios",
    PL: "Zapisz zmiany",
    NL: "Wijzigingen opslaan"
  },
  cancel: {
    DE: "Abbrechen",
    EN: "Cancel",
    FR: "Annuler",
    IT: "Annulla",
    ES: "Cancelar",
    PL: "Anuluj",
    NL: "Annuleren"
  },
  address_line1: {
    DE: "Adresszeile 1",
    EN: "Address line 1",
    FR: "Adresse ligne 1",
    IT: "Indirizzo riga 1",
    ES: "Línea de dirección 1",
    PL: "Wiersz adresu 1",
    NL: "Adresregel 1"
  },
  address_line2: {
    DE: "Adresszeile 2",
    EN: "Address line 2",
    FR: "Adresse ligne 2",
    IT: "Indirizzo riga 2",
    ES: "Línea de dirección 2",
    PL: "Wiersz adresu 2",
    NL: "Adresregel 2"
  },
  state_placeholder: {
    DE: "Bundesland",
    EN: "State",
    FR: "État",
    IT: "Stato",
    ES: "Estado",
    PL: "Stan",
    NL: "Staat"
  },
  country_placeholder: {
    DE: "Land",
    EN: "Country",
    FR: "Pays",
    IT: "Paese",
    ES: "País",
    PL: "Kraj",
    NL: "Land"
  },
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
  payment: {
    DE: "Zahlung",
    EN: "Payment",
    FR: "Paiement", 
    IT: "Pagamento",
    ES: "Pago",
    PL: "Płatność",
    NL: "Betaling"
  },
  submit_order: {
    DE: "Bestellung abschicken",
    EN: "Submit Order",
    FR: "Soumettre la commande",
    IT: "Invia ordine",
    ES: "Enviar pedido",
    PL: "Złóż zamówienie",
    NL: "Bestelling verzenden"
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
    DE: "Ihre Bestellung wurde erfolgreich übermittelt.",
    EN: "Your order has been successfully submitted.",
    FR: "Votre commande a été soumise avec succès.",
    IT: "Il tuo ordine è stato inviato con successo.",
    ES: "Su pedido ha sido enviado exitosamente.",
    PL: "Twoje zamówienie zostało pomyślnie złożone.",
    NL: "Uw bestelling is succesvol verzonden."
  },
  order_error: {
    DE: "Bestellfehler",
    EN: "Order Error",
    FR: "Erreur de commande",
    IT: "Errore ordine",
    ES: "Error de pedido",
    PL: "Błąd zamówienia",
    NL: "Bestelfout"
  },
  order_error_message: {
    DE: "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    EN: "Please check your input and try again.",
    FR: "Veuillez vérifier votre saisie et réessayer.",
    IT: "Controlla i tuoi dati e riprova.",
    ES: "Por favor verifique su entrada e intente nuevamente.",
    PL: "Sprawdź swoje dane i spróbuj ponownie.",
    NL: "Controleer uw invoer en probeer opnieuw."
  },
  terms_required: {
    DE: "Bitte stimmen Sie den Geschäftsbedingungen zu.",
    EN: "Please agree to the terms and conditions.",
    FR: "Veuillez accepter les conditions générales.",
    IT: "Si prega di accettare i termini e le condizioni.",
    ES: "Por favor acepte los términos y condiciones.",
    PL: "Proszę zaakceptować regulamin.",
    NL: "Gelieve akkoord te gaan met de voorwaarden."
  },
  checkout_token_missing: {
    DE: "Checkout-Token fehlt.",
    EN: "Checkout token missing.",
    FR: "Token de caisse manquant.",
    IT: "Token checkout mancante.",
    ES: "Token de checkout faltante.",
    PL: "Brak tokenu checkout.",
    NL: "Checkout token ontbreekt."
  },
  invalid_checkout_link: {
    DE: "Ungültiger Checkout-Link",
    EN: "Invalid Checkout Link",
    FR: "Lien de caisse invalide",
    IT: "Link checkout non valido",
    ES: "Enlace de checkout inválido",
    PL: "Nieprawidłowy link checkout",
    NL: "Ongeldige checkout link"
  },
  invalid_checkout_message: {
    DE: "Der Checkout-Link ist ungültig oder abgelaufen.",
    EN: "The checkout link is invalid or expired.",
    FR: "Le lien de caisse est invalide ou expiré.",
    IT: "Il link di checkout non è valido o è scaduto.",
    ES: "El enlace de checkout es inválido o ha expirado.",
    PL: "Link checkout jest nieprawidłowy lub wygasł.",
    NL: "De checkout link is ongeldig of verlopen."
  },
  home_button: {
    DE: "Zur Startseite",
    EN: "Go to Homepage",
    FR: "Aller à l'accueil",
    IT: "Vai alla homepage",
    ES: "Ir a la página de inicio",
    PL: "Idź do strony głównej",
    NL: "Ga naar homepage"
  },
  loading_checkout: {
    DE: "Checkout wird geladen...",
    EN: "Loading checkout...",
    FR: "Chargement de la caisse...",
    IT: "Caricamento checkout...",
    ES: "Cargando checkout...",
    PL: "Ładowanie checkout...",
    NL: "Checkout laden..."
  },
  cors_error_title: {
    DE: "Verbindungsproblem",
    EN: "Connection Problem",
    FR: "Problème de connexion",
    IT: "Problema di connessione",
    ES: "Problema de conexión",
    PL: "Problem z połączeniem",
    NL: "Verbindingsprobleem"
  },
  cors_error_message: {
    DE: "Es gibt ein Problem mit der Serververbindung.",
    EN: "There is a problem with the server connection.",
    FR: "Il y a un problème avec la connexion au serveur.",
    IT: "C'è un problema con la connessione al server.",
    ES: "Hay un problema con la conexión al servidor.",
    PL: "Jest problem z połączeniem z serwerem.",
    NL: "Er is een probleem met de serververbinding."
  },
  retry_button: {
    DE: "Erneut versuchen",
    EN: "Try Again",
    FR: "Réessayer",
    IT: "Riprova",
    ES: "Intentar de nuevo",
    PL: "Spróbuj ponownie",
    NL: "Probeer opnieuw"
  },
  error_loading_order: {
    DE: "Fehler beim Laden der Bestellung",
    EN: "Error Loading Order",
    FR: "Erreur lors du chargement de la commande",
    IT: "Errore nel caricamento dell'ordine",
    ES: "Error al cargar el pedido",
    PL: "Błąd ładowania zamówienia",
    NL: "Fout bij het laden van bestelling"
  },
  error_loading_message: {
    DE: "Die Bestellung konnte nicht geladen werden.",
    EN: "The order could not be loaded.",
    FR: "La commande n'a pas pu être chargée.",
    IT: "L'ordine non può essere caricato.",
    ES: "El pedido no pudo ser cargado.",
    PL: "Zamówienie nie mogło zostać załadowane.",
    NL: "De bestelling kon niet worden geladen."
  },
  verbindungsprobleme: {
    DE: "Verbindungsprobleme erkannt",
    EN: "Connection problems detected",
    FR: "Problèmes de connexion détectés",
    IT: "Problemi di connessione rilevati",
    ES: "Problemas de conexión detectados",
    PL: "Wykryto problemy z połączeniem",
    NL: "Verbindingsproblemen gedetecteerd"
  },
  demo_mode_banner: {
    DE: "Demo-Modus: Begrenzte Funktionalität",
    EN: "Demo Mode: Limited functionality",
    FR: "Mode démo: Fonctionnalité limitée",
    IT: "Modalità demo: Funzionalità limitata",
    ES: "Modo demo: Funcionalidad limitada",
    PL: "Tryb demo: Ograniczona funkcjonalność",
    NL: "Demo-modus: Beperkte functionaliteit"
  },
  secure_payment: {
    DE: "Sichere Zahlung",
    EN: "Secure Payment",
    FR: "Paiement sécurisé",
    IT: "Pagamento sicuro",
    ES: "Pago seguro",
    PL: "Bezpieczna płatność",
    NL: "Veilige betaling"
  },
  ssl_encrypted: {
    DE: "SSL-verschlüsselt",
    EN: "SSL Encrypted",
    FR: "Crypté SSL",
    IT: "Crittografato SSL",
    ES: "Encriptado SSL",
    PL: "Szyfrowanie SSL",
    NL: "SSL-versleuteld"
  }
};

export const getTranslation = (key: string, language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  return translation[language] || translation.DE || key;
};
