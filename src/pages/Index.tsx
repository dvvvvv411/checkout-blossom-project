
import { Button } from "@/components/ui/button";
import { Shield, Zap, Globe, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        
        {/* Main Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Secure Payment
            <span className="text-blue-600 block">Gateway Service</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Process payments with confidence. Fast, secure, and reliable payment processing 
            for businesses of all sizes.
          </p>
          
          <div className="pt-4">
            <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700">
              Get Started Today
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Secure</h3>
            <p className="text-slate-600 text-center">
              Bank-level security with end-to-end encryption
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Fast</h3>
            <p className="text-slate-600 text-center">
              Lightning-fast transaction processing
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Global</h3>
            <p className="text-slate-600 text-center">
              Accept payments from customers worldwide
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
