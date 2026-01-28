
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { recentTransactions } from "@/lib/demo-data";
import TransactionList from "@/components/TransactionList";
import PieChart from "@/components/charts/PieChart";
import { categoryTotals } from "@/lib/demo-data";

const Index = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="expense-card text-center py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to <span className="text-expense-blue">ExpenseSnap</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Categorize and visualize your expenses in seconds. Upload your CSV transaction data and get instant insights into your spending habits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-expense-blue hover:bg-blue-700">
            <Link to="/upload" className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload CSV
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/insights" className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Insights
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryTotals.slice(0, 4).map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${category.total.toFixed(2)}</div>
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
        <Card className="lg:col-span-2">
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
        <Card>
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
