import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Bell, TrendingUp, Target, Trophy, Zap, AlertTriangle, 
  ThumbsUp, Flame, Award, Star, DollarSign, ShoppingBag,
  Coffee, Utensils, Car, Home, Heart, RefreshCw, Loader2
} from "lucide-react";

interface BudgetLimit {
  category: string;
  limit: number;
  spent: number;
  icon: any;
  color: string;
}

interface Nudge {
  category: string;
  message: string;
  type: string;
  percentage: number;
  remaining: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  reward: string;
}

interface Alternative {
  category: string;
  current: string;
  currentCost: number;
  alternative: string;
  alternativeCost: number;
  savings: number;
  monthlySavings: number;
  icon: string;
  tip: string;
}

interface Prediction {
  category: string;
  currentSpent: number;
  projectedSpend: number;
  dailyAverage: number;
}

export default function BudgetNudge() {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([
    { category: "Food", limit: 5000, spent: 0, icon: Utensils, color: "bg-orange-500" },
    { category: "Shopping", limit: 10000, spent: 0, icon: ShoppingBag, color: "bg-blue-500" },
    { category: "Travel", limit: 3000, spent: 0, icon: Car, color: "bg-green-500" },
    { category: "Bills", limit: 4000, spent: 0, icon: Home, color: "bg-purple-500" },
    { category: "Health", limit: 2000, spent: 0, icon: Heart, color: "bg-red-500" },
  ]);

  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [totalMonthlySavings, setTotalMonthlySavings] = useState(0);
  const [financialScore, setFinancialScore] = useState(0);
  const [projectedSpend, setProjectedSpend] = useState(0);

  const apiUrl = "";

  const iconMap: any = {
    '🏆': Trophy,
    '🔥': Flame,
    '💎': Award,
    '⭐': Star,
    '🧠': Target
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchNudges(),
        fetchAchievements(),
        fetchAlternatives(),
        fetchPredictions()
      ]);
      toast.success("Budget data loaded successfully!");
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Please upload your CSV first in the Analyzer page");
    } finally {
      setLoading(false);
    }
  };

  const fetchNudges = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/generate-nudges`, {
        budgets: budgets.map(b => ({
          category: b.category,
          limit: b.limit,
          spent: b.spent
        }))
      });
      setNudges(response.data.nudges || []);
    } catch (error) {
      console.error("Error fetching nudges:", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/check-achievements`);
      const data = response.data;
      
      const mappedAchievements = data.achievements.map((ach: any) => ({
        ...ach,
        icon: iconMap[ach.icon] || Trophy
      }));
      
      setAchievements(mappedAchievements);
      setFinancialScore(data.level * 20 + 50);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const fetchAlternatives = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/suggest-alternatives`);
      setAlternatives(response.data.alternatives || []);
      setTotalMonthlySavings(response.data.totalMonthlySavings || 0);
    } catch (error) {
      console.error("Error fetching alternatives:", error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/predict-overspending`);
      setPredictions(response.data.predictions || []);
      setProjectedSpend(response.data.projectedMonthlySpend || 0);
      
      // Update budgets with actual spending
      const updatedBudgets = budgets.map(budget => {
        const prediction = response.data.predictions.find(
          (p: Prediction) => p.category === budget.category
        );
        return {
          ...budget,
          spent: prediction ? prediction.currentSpent : budget.spent
        };
      });
      setBudgets(updatedBudgets);
      
      // Fetch nudges with updated budgets
      setTimeout(() => fetchNudges(), 500);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getNudgeStyle = (type: string) => {
    switch (type) {
      case "danger": return "border-l-4 border-red-500 bg-red-50";
      case "warning": return "border-l-4 border-orange-500 bg-orange-50";
      case "success": return "border-l-4 border-green-500 bg-green-50";
      default: return "border-l-4 border-blue-500 bg-blue-50";
    }
  };

  const getIconForCategory = (category: string) => {
    const icons: any = {
      'Food': Utensils,
      'Travel': Car,
      'Shopping': ShoppingBag,
      'Bills': Home,
      'Health': Heart
    };
    return icons[category] || DollarSign;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your budget insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-yellow-500" />
            Real-Time Budget Nudge
          </h1>
          <p className="text-lg text-gray-600">
            Your AI-powered financial guardian with personality!
          </p>
          <Button onClick={loadAllData} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Achievements Unlocked</p>
                  <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    {achievements.filter(a => a.unlocked).length}/{achievements.length}
                  </p>
                </div>
                <Flame className="h-12 w-12 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{totalMonthlySavings.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Financial Score</p>
                  <p className="text-3xl font-bold text-purple-600 flex items-center gap-2">
                    {financialScore}
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </p>
                </div>
                <Star className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Nudges */}
        {nudges.length > 0 && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Live Nudges & Alerts
              </CardTitle>
              <CardDescription>Your AI buddy keeping you on track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nudges.map((nudge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${getNudgeStyle(nudge.type)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {nudge.type === 'danger' ? '🚨' : nudge.type === 'warning' ? '⚠️' : '🎉'}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{nudge.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Remaining: ₹{nudge.remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Budget Trackers */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Budget Limits & Progress
            </CardTitle>
            <CardDescription>Track your spending across categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {budgets.map((budget, index) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const Icon = budget.icon;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${budget.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{budget.category}</p>
                        <p className="text-sm text-gray-600">
                          ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={percentage >= 90 ? "destructive" : percentage >= 75 ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-3"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Predictions */}
        {predictions.length > 0 && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Spending Predictions
              </CardTitle>
              <CardDescription>
                Projected monthly spend: ₹{projectedSpend.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((pred, index) => {
                  const Icon = getIconForCategory(pred.category);
                  return (
                    <div key={index} className="p-4 bg-white rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-orange-600" />
                        <p className="font-semibold text-gray-900">{pred.category}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Current: ₹{pred.currentSpent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Projected: ₹{pred.projectedSpend.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Daily avg: ₹{pred.dailyAverage.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Achievements & Milestones
              </CardTitle>
              <CardDescription>Level up your financial game!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.unlocked
                          ? "bg-white border-yellow-400 shadow-lg"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.unlocked ? "bg-yellow-400" : "bg-gray-300"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              achievement.unlocked ? "text-white" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{achievement.title}</p>
                            {achievement.unlocked && (
                              <Badge className="bg-yellow-400 text-yellow-900">Unlocked!</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {!achievement.unlocked && (
                            <div className="space-y-1">
                              <Progress value={achievement.progress} className="h-2" />
                              <p className="text-xs text-gray-500">{achievement.progress}% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Smart Alternatives */}
        {alternatives.length > 0 && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                Smart Spending Alternatives
              </CardTitle>
              <CardDescription>
                Save ₹{totalMonthlySavings.toLocaleString()}/month with these tips!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alternatives.map((alt, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-3xl">{alt.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {alt.current} → {alt.alternative}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">{alt.tip}</p>
                      <p className="text-lg font-bold text-green-600">
                        Save ₹{alt.monthlySavings.toLocaleString()}/month! 💰
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
