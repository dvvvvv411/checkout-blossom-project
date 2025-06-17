
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Checkout System Demo</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Shopify-Style Single-Page Checkout für Heizöl-Bestellungen
        </p>
        
        <div className="space-y-4">
          <div>
            <Link to="/checkout?token=demo-token-123">
              <Button size="lg" className="px-8">
                Demo Checkout öffnen
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-600">
            Testet das Checkout-System mit Beispieldaten
          </p>
        </div>
        
        <div className="mt-12 text-left max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-semibold">Features:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Token-basierte API-Integration</li>
            <li>✅ Responsive Shopify-Style Design</li>
            <li>✅ Dynamische Shop-Konfiguration</li>
            <li>✅ Mehrsprachige Unterstützung (DE/EN/FR)</li>
            <li>✅ Flexible Zahlungsmethoden</li>
            <li>✅ MwSt-Aufschlüsselung</li>
            <li>✅ Separate Rechnungsadresse</li>
            <li>✅ Loading States & Error Handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
