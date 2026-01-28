
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Results from '@/pages/Results';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Insights from '@/pages/Insights';
import TransactionAnalyzer from '@/pages/TransactionAnalyzer';
import FinancialChatbot from '@/pages/FinancialChatbot';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/results" element={<Results />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/analyzer" element={<TransactionAnalyzer />} />
                <Route path="/chatbot" element={<FinancialChatbot />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
