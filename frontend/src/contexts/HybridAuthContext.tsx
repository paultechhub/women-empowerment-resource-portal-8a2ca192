import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { api, setAuthToken, clearAuthToken } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HybridAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isMentor: boolean;
  expressToken: string | null;
}

const HybridAuthContext = createContext<HybridAuthContextType | undefined>(undefined);

export const HybridAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [expressToken, setExpressToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          await checkUserRoles(session.user.id);
          await getExpressToken(session.user.email!, session.user.user_metadata?.full_name);
        } else {
          setIsAdmin(false);
          setIsMentor(false);
          setExpressToken(null);
          clearAuthToken();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkUserRoles(session.user.id);
        getExpressToken(session.user.email!, session.user.user_metadata?.full_name);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (data) {
      const roles = data.map(r => r.role);
      setIsAdmin(roles.includes('admin'));
      setIsMentor(roles.includes('mentor'));
    }
  };

  const getExpressToken = async (email: string, fullName: string) => {
    try {
      // Try to login to Express backend
      const response = await api.login({ email, password: 'supabase_user' });
      const token = response.data.token;
      setExpressToken(token);
      setAuthToken(token);
    } catch (error) {
      // If login fails, register user in Express backend
      try {
        const response = await api.register({
          full_name: fullName || 'User',
          email,
          password: 'supabase_user'
        });
        const token = response.data.token;
        setExpressToken(token);
        setAuthToken(token);
      } catch (regError) {
        console.error('Failed to sync with Express backend:', regError);
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;
      
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearAuthToken();
      setExpressToken(null);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <HybridAuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin,
        isMentor,
        expressToken
      }}
    >
      {children}
    </HybridAuthContext.Provider>
  );
};

export const useHybridAuth = () => {
  const context = useContext(HybridAuthContext);
  if (context === undefined) {
    throw new Error('useHybridAuth must be used within a HybridAuthProvider');
  }
  return context;
};