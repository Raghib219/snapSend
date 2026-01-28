
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import { categoryTotals, formatCurrency, monthlySpending } from "@/lib/demo-data";

const Insights = () => {
  // Calculate month-over-month changes
  const currentMonth = monthlySpending[monthlySpending.length - 1];
  const previousMonth = monthlySpending[monthlySpending.length - 2];
  
  const calculateChange = (current: number, previous: number) => {
    const percentage = ((current - previous) / previous) * 100;
    return {
      value: percentage.toFixed(1),
      increase: percentage > 0
    };
  };
  
  const insights = [
    {
      category: "Food",
      change: calculateChange(currentMonth.Food, previousMonth.Food),
      message: "Your food expenses have changed compared to last month."
    },
    {
      category: "Travel",
      change: calculateChange(currentMonth.Travel, previousMonth.Travel),
      message: "Your travel spending is different from the previous month."
    },
    {
      category: "Bills",
      change: calculateChange(currentMonth.Bills, previousMonth.Bills),
      message: "Your bill payments have changed since last month."
    }
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Spending Insights</h1>
      
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{insight.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{Math.abs(Number(insight.change.value))}%</div>
                <div 
                  className={`flex items-center ${
                    insight.change.increase ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {insight.change.increase ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {insight.change.increase ? 'More' : 'Less'}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{insight.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Spending Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>See how your spending has changed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="weekly" className="h-[400px]">
              <BarChart data={monthlySpending.slice(-4)} />
            </TabsContent>
            
            <TabsContent value="monthly" className="h-[400px]">
              <BarChart data={monthlySpending} />
            </TabsContent>
            
            <TabsContent value="yearly" className="h-[400px]">
              <BarChart data={monthlySpending} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown Analysis</CardTitle>
          <CardDescription>Detailed analysis of your spending categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryTotals.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">{category.category}</h4>
                  <span>{formatCurrency(category.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {category.percentage}% of your total expenses
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Savings Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="expense-card">
              <h3 className="text-lg font-medium mb-2">Reduce Food Expenses</h3>
              <p className="text-gray-600">
                Your food spending is {insights[0].change.increase ? 'up' : 'down'} {Math.abs(Number(insights[0].change.value))}% from last month. 
                Consider meal planning to reduce costs.
              </p>
            </div>
            
            <div className="expense-card">
              <h3 className="text-lg font-medium mb-2">Transportation Savings</h3>
              <p className="text-gray-600">
                Look for opportunities to use public transportation or carpooling to reduce travel expenses.
              </p>
            </div>
            
            <div className="expense-card">
              <h3 className="text-lg font-medium mb-2">Subscription Audit</h3>
              <p className="text-gray-600">
                Review your entertainment subscriptions to identify services you may not be using frequently.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;
