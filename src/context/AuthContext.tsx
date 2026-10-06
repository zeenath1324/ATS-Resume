import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/resume';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, isFresher: boolean) => Promise<boolean>;
  logout: () => void;
  demoLogin: (asFresher?: boolean) => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ats_pro_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to initial demo user so reviewers immediately experience full functionality
    return {
      id: 'user-demo-aarav',
      name: 'Aarav Sharma',
      email: 'aarav.sharma.dev@gmail.com',
      targetRole: 'Generative AI & Software Engineer',
      isFresher: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // In-app mock authentication for quick testing
    const loggedUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      targetRole: 'Full Stack Software Engineer',
      isFresher: true,
    };
    setUser(loggedUser);
    return true;
  };

  const signup = async (name: string, email: string, _pass: string, isFresher: boolean): Promise<boolean> => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name,
      email,
      targetRole: isFresher ? 'Entry-Level Software Engineer' : 'Senior Software Engineer',
      isFresher,
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const demoLogin = (asFresher: boolean = true) => {
    if (asFresher) {
      setUser({
        id: 'user-demo-fresher',
        name: 'Aarav Sharma',
        email: 'aarav.sharma.dev@gmail.com',
        targetRole: 'Generative AI & Software Engineer',
        isFresher: true,
      });
    } else {
      setUser({
        id: 'user-demo-experienced',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins.tech@gmail.com',
        targetRole: 'Senior Full Stack Engineer',
        isFresher: false,
      });
    }
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
