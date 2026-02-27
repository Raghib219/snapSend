
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, BarChart3, ArrowRight, Sparkles, Target, TrendingUp, Shield, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { recentTransactions } from "@/lib/demo-data";
import TransactionList from "@/components/TransactionList";
import PieChart from "@/components/charts/PieChart";
import { categoryTotals } from "@/lib/demo-data";

const Index = () => {
  const { user } = useSimpleAuth();
  const navigate = useNavigate();

  // If user is not logged in, show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Budget Nudge Agent
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Real-time spending insights powered by AI. Get personalized nudges, smart alternatives, and funny reminders when you're overspending on food delivery.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/auth?mode=login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ExpenseSnap?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Real-Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload your bank CSV and get instant insights with Python, Pandas, and AI-powered categorization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Smart Nudges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get funny, personalized nudges when overspending on Swiggy, Zomato, and food delivery apps.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>AI Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chat with our AI advisor powered by Google Gemini for personalized financial guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Spending?</h2>
              <p className="text-lg mb-6 text-blue-50">
                Join thousands of users who are making smarter financial decisions with ExpenseSnap.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  // If user is logged in, show dashboard
  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <section className="expense-card text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Welcome back, <span className="text-expense-blue">{user.fullName || user.email.split('@')[0]}!</span> 👋
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Ready to analyze your spending? Upload your CSV or explore your financial insights.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-expense-blue hover:bg-blue-700">
            <Link to="/analyzer" className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload CSV
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link to="/nudge" className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Budget Nudge
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/chatbot" className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              AI Advisor
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryTotals.slice(0, 4).map((category) => (
          <Card key={category.category} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{category.total.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">{category.percentage}% of total spending</p>
              <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Transactions and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/results" className="text-expense-blue hover:text-blue-700 text-sm flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={recentTransactions} />
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={categoryTotals} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
