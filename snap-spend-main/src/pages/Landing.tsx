
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import FloatingIllustration from "@/components/FloatingIllustration";
import { ArrowRight, BarChart3, Upload, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight reveal">
                Simplify Your <span className="text-gray-400">Financial Life</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl reveal reveal-delay-1">
                Upload your transaction data and get instant insights. ExpenseSnap categorizes your spending patterns automatically so you can make smarter financial decisions.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 reveal reveal-delay-2">
                {user ? (
                  <Button 
                    size="lg" 
                    className="bg-black hover:bg-gray-800 text-white rounded-md"
                    onClick={() => navigate("/")}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-black hover:bg-gray-800 text-white rounded-md"
                      onClick={() => navigate("/auth?mode=login")}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => navigate("/auth?mode=signup")}
                    >
                      Create Account
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 reveal reveal-delay-3">
              <FloatingIllustration />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-16 reveal">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center reveal reveal-delay-1">
              <div className="w-16 h-16 mb-6 bg-black rounded-full flex items-center justify-center text-white">
                <Upload size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Data</h3>
              <p className="text-gray-600">Simply upload your transaction CSV from any bank or financial institution.</p>
            </div>
            <div className="flex flex-col items-center text-center reveal reveal-delay-2">
              <div className="w-16 h-16 mb-6 bg-black rounded-full flex items-center justify-center text-white">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Categorization</h3>
              <p className="text-gray-600">Our system automatically categorizes your transactions for accurate insights.</p>
            </div>
            <div className="flex flex-col items-center text-center reveal reveal-delay-3">
              <div className="w-16 h-16 mb-6 bg-black rounded-full flex items-center justify-center text-white">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Insights</h3>
              <p className="text-gray-600">Get meaningful charts and actionable insights to improve your finances.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial/Call to Action */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6 reveal">Start Managing Your Finances Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto reveal reveal-delay-1 text-gray-300">
            Join thousands of users who have already simplified their financial tracking with ExpenseSnap.
          </p>
          {!user && (
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-black hover:bg-gray-100 reveal reveal-delay-2 rounded-md"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
