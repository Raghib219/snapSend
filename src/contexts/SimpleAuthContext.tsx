import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  fullName: string;
}

interface AuthContextProps {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('snapspend_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    try {
      // Get users from localStorage
      const usersData = localStorage.getItem('snapspend_users');
      const users = usersData ? JSON.parse(usersData) : {};

      // Check if user exists and password matches
      if (users[email] && users[email].password === password) {
        const userData = {
          email: users[email].email,
          fullName: users[email].fullName
        };
        
        setUser(userData);
        localStorage.setItem('snapspend_user', JSON.stringify(userData));
        return { error: null };
      } else {
        return { error: { message: 'Invalid email or password' } };
      }
    } catch (error) {
      return { error: { message: 'Login failed' } };
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      // Get existing users
      const usersData = localStorage.getItem('snapspend_users');
      const users = usersData ? JSON.parse(usersData) : {};

      // Check if user already exists
      if (users[email]) {
        return { error: { message: 'Email already registered' } };
      }

      // Save new user
      users[email] = {
        email,
        password,
        fullName
      };
      
      localStorage.setItem('snapspend_users', JSON.stringify(users));

      // Auto login after signup
      const userData = { email, fullName };
      setUser(userData);
      localStorage.setItem('snapspend_user', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      return { error: { message: 'Signup failed' } };
    }
  }

  async function signOut() {
    setUser(null);
    localStorage.removeItem('snapspend_user');
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
