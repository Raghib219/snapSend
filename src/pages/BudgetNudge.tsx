import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, TrendingUp, Target, Trophy, Zap, AlertTriangle, 
  ThumbsUp, Flame, Award, Star, DollarSign, ShoppingBag,
  Coffee, Utensils, Car, Home, Heart, Gift
} from "lucide-react";

interface BudgetLimit {
  category: string;
  limit: number;
  spent: number;
  icon: any;
  color: string;
}

interface Nudge {
  id: number;
  message: string;
  type: "warning" | "success" | "info" | "danger";
  emoji: string;
  timestamp: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
}

export default function BudgetNudge() {
  const [budgets, setBudgets] = useState<BudgetLimit[]>([
    { category: "Food", limit: 5000, spent: 3200, icon: Utensils, color: "bg-orange-500" },
    { category: "Shopping", limit: 10000, spent: 8500, icon: ShoppingBag, color: "bg-blue-500" },
    { category: "Travel", limit: 3000, spent: 1200, icon: Car, color: "bg-green-500" },
    { category: "Bills", limit: 4000, spent: 3800, icon: Home, color: "bg-purple-500" },
    { category: "Health", limit: 2000, spent: 500, icon: Heart, color: "bg-red-500" },
  ]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: 1,
      message: "Whoa there! 🛑 You've spent ₹3,200 on food this month. That's 64% of your budget!",
      type: "warning",
      emoji: "🍕",
      timestamp: new Date()
    },
    {
      id: 2,
      message: "🚨 ALERT: Shopping budget at 85%! Your wallet is sending SOS signals!",
      type: "danger",
      emoji: "🛍️",
      timestamp: new Date()
    },
    {
      id: 3,
      message: "🎉 Great job! You're only at 40% of your Travel budget. Keep it up!",
      type: "success",
      emoji: "🚗",
      timestamp: new Date()
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "saver",
      title: "Budget Saver",
      description: "Stay under budget for 7 days",
      icon: Trophy,
      unlocked: true,
      progress: 100
    },
    {
      id: "streak",
      title: "No-Delivery Streak",
      description: "7 days without food delivery",
      icon: Flame,
      unlocked: false,
      progress: 57
    },
    {
      id: "champion",
      title: "Savings Champion",
      description: "Save ₹5,000 in a month",
      icon: Award,
      unlocked: false,
      progress: 73
    },
    {
      id: "levelup",
      title: "Financial Level Up",
      description: "Improve score by 20 points",
      icon: Star,
      unlocked: true,
      progress: 100
    }
  ]);

  const [savingsStreak, setSavingsStreak] = useState(7);
  const [totalSaved, setTotalSaved] = useState(12500);
  const [financialScore, setFinancialScore] = useState(78);

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

  const generateHumorousNudge = (category: string, percentage: number) => {
    const nudges = {
      high: [
        `🚨 BREAKING: Your ${category} budget just called 911!`,
        `⚠️ Plot twist: Your wallet is filing for bankruptcy because of ${category}!`,
        `🎭 ${category} spending at ${percentage}%! Even your bank account is shocked!`,
        `🔥 Your ${category} expenses are on fire! And not in a good way!`
      ],
      medium: [
        `📊 ${category} at ${percentage}%. Time to pump the brakes a little!`,
        `💡 Fun fact: You're ${percentage}% through your ${category} budget!`,
        `⚡ ${category} spending is heating up. Cool it down a bit?`
      ],
      low: [
        `🎉 ${category} budget looking good! You're a financial ninja!`,
        `⭐ Crushing it! Only ${percentage}% of ${category} budget used!`,
        `🏆 ${category} spending is under control. You're a legend!`
      ]
    };

    if (percentage >= 80) return nudges.high[Math.floor(Math.random() * nudges.high.length)];
    if (percentage >= 50) return nudges.medium[Math.floor(Math.random() * nudges.medium.length)];
    return nudges.low[Math.floor(Math.random() * nudges.low.length)];
  };

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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Savings Streak</p>
                  <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                    {savingsStreak} days
                  </p>
                </div>
                <Trophy className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{totalSaved.toLocaleString()}
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
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Live Nudges & Alerts
            </CardTitle>
            <CardDescription>Your AI buddy keeping you on track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {nudges.map((nudge) => (
              <div
                key={nudge.id}
                className={`p-4 rounded-lg ${getNudgeStyle(nudge.type)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{nudge.emoji}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{nudge.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {nudge.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

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
                    value={percentage} 
                    className="h-3"
                  />
                  {percentage >= 75 && (
                    <p className="text-sm text-orange-600 italic">
                      {generateHumorousNudge(budget.category, Math.round(percentage))}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
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

        {/* Smart Alternatives */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              Smart Spending Alternatives
            </CardTitle>
            <CardDescription>Save money with these suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <Coffee className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Skip the Daily Starbucks</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Daily ₹300 coffee = ₹9,000/month. Home coffee = ₹900/month
                  </p>
                  <p className="text-lg font-bold text-green-600">Save ₹8,100/month! 💰</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Car className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Take Metro Instead of Uber</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Uber ₹250 vs Metro ₹40 per trip
                  </p>
                  <p className="text-lg font-bold text-blue-600">Save ₹210 per trip! 🚇</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Utensils className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Cook at Home vs Food Delivery</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Swiggy ₹800 vs Home cooking ₹200
                  </p>
                  <p className="text-lg font-bold text-orange-600">Save ₹600 per meal! 🍳</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
