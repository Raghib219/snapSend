
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import TransactionList from "@/components/TransactionList";
import { categoryTotals, recentTransactions, monthlySpending, formatCurrency } from "@/lib/demo-data";
import { useAuth } from "@/contexts/AuthContext";

const Results = () => {
  const [view, setView] = useState("transactions");
  const { profile } = useAuth();
  
  const totalSpent = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        {profile ? `Welcome back, ${profile.username}` : 'Your Expense Analysis'}
      </h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Largest Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryTotals[0].category}</div>
            <p className="text-sm text-gray-500">{formatCurrency(categoryTotals[0].total)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTransactions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent / recentTransactions.length)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={categoryTotals} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trends</CardTitle>
            <CardDescription>How your spending has changed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlySpending} />
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs and Transaction List */}
      <Card>
        <CardHeader>
          <Tabs defaultValue="transactions" onValueChange={setView} value={view}>
            <div className="flex justify-between items-center">
              <CardTitle>Expense Details</CardTitle>
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="transactions" className={view === "transactions" ? "block" : "hidden"}>
            <TransactionList transactions={recentTransactions} />
          </TabsContent>
          <TabsContent value="categories" className={view === "categories" ? "block" : "hidden"}>
            <div className="space-y-4">
              {categoryTotals.map((category) => (
                <div key={category.category} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-black">{category.category}</span>
                      <span className="text-black">{formatCurrency(category.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
