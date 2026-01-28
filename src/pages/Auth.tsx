
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        // Login flow
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        // Sign up flow
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        
        toast.success('Account created! Please check your email for verification.');
        navigate('/auth?mode=login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Enter your details to create an account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe" 
                  required 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
              </div>
            )}
            
            <Button 
              className="w-full bg-expense-blue hover:bg-blue-700" 
              type="submit"
              disabled={loading}
            >
              {loading 
                ? 'Processing...' 
                : mode === 'login' 
                  ? 'Sign In' 
                  : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            {mode === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-expense-blue"
              onClick={() => navigate(`/auth?mode=${mode === 'login' ? 'signup' : 'login'}`)}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
