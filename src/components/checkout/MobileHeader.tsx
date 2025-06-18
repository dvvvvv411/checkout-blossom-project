
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MobileHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3">
      <button
        onClick={handleBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Zurück</span>
      </button>
      
      <div className="flex items-center text-sm">
        <span className="text-gray-500">Warenkorb</span>
        <span className="mx-2 text-gray-400">{'>'}</span>
        <span className="font-semibold text-gray-900">Informationen</span>
        <span className="mx-2 text-gray-400">{'>'}</span>
        <span className="text-gray-500">Versand</span>
        <span className="mx-2 text-gray-400">{'>'}</span>
        <span className="text-gray-500">Zahlung</span>
      </div>
    </div>
  );
};
