
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth?mode=login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-xl font-bold cursor-pointer" 
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
                onClick={() => navigate("/results")}
              >
                Results
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
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
