
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useSimpleAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth?mode=login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" 
          onClick={() => navigate("/")}
        >
          ExpenseSnap
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/analyzer")}
              >
                Analyzer
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/nudge")}
                className="text-purple-600 hover:text-purple-700"
              >
                💡 Budget Nudge
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/chatbot")}
              >
                AI Chatbot
              </Button>
              
              {/* User Info */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {user.fullName || user.email.split('@')[0]}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth?mode=login")}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/auth?mode=signup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
