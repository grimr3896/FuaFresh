import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCleaner: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User; pendingApproval?: boolean }>;
  signUp: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'admin' | 'customer' | 'cleaner';
    estate?: string;
    specialty?: string;
    yearsExperience?: number;
    neighborhoods?: string[];
    idNumber?: string;
    goodConductCertified?: boolean;
    availability?: string;
    bio?: string;
    passportPhoto?: string;
    ruiruArea?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    refereeName?: string;
    refereePhone?: string;
    yearsLivingInRuiru?: string;
  }) => Promise<{ success: boolean; error?: string; user?: User; pendingApproval?: boolean; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(profile: any): User {
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    phone: profile.phone || '',
    role: profile.role,
    avatar: profile.avatar || profile.passport_photo || undefined,
    joinedAt: profile.joined_at || profile.created_at,
    estate: profile.estate || undefined,
    title: profile.title || undefined,
    cleanerStatus: profile.cleaner_status || undefined,
    passportPhoto: profile.passport_photo || undefined,
    ruiruArea: profile.ruiru_area || undefined,
    emergencyContactName: profile.emergency_contact_name || undefined,
    emergencyContactPhone: profile.emergency_contact_phone || undefined,
    refereeName: profile.referee_name || undefined,
    refereePhone: profile.referee_phone || undefined,
    yearsLivingInRuiru: profile.years_living_in_ruiru || undefined,
    specialty: profile.specialty || undefined,
    yearsExperience: profile.years_experience ?? undefined,
    neighborhoods: profile.neighborhoods || [],
    idNumber: profile.id_number || undefined,
    goodConductCertified: Boolean(profile.good_conduct_certified),
    availability: profile.availability || undefined,
    bio: profile.bio || undefined,
    earningsTotal: Number(profile.earnings_total || 0),
    rating: Number(profile.rating || 5),
    jobsCompletedCount: Number(profile.jobs_completed_count || 0),
    reviewedAt: profile.reviewed_at || undefined,
    reviewedBy: profile.reviewed_by || undefined,
    rejectionReason: profile.rejection_reason || undefined,
  };
}

async function loadProfile(authUser: SupabaseAuthUser): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !data) {
    throw new Error('Your account profile could not be loaded. Please contact Fua Fresh support.');
  }

  return mapProfile(data);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const applySession = async (session: Session | null) => {
      if (!session?.user) {
        if (mounted) setCurrentUser(null);
        return;
      }

      try {
        const profile = await loadProfile(session.user);
        if (mounted) setCurrentUser(profile);
      } catch (error) {
        console.error('[Fua Fresh Auth] Profile load failed:', error);
        if (mounted) setCurrentUser(null);
      }
    };

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) console.error('[Fua Fresh Auth] Session restore failed:', error);
      await applySession(data.session);
      if (mounted) setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer profile fetching so the auth event callback does not block Supabase's lock.
      setTimeout(() => { void applySession(session); }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Unable to sign in.' };
    }

    try {
      const profile = await loadProfile(data.user);
      if (profile.role === 'cleaner' && profile.cleanerStatus === 'pending') {
        await supabase.auth.signOut();
        return {
          success: false,
          pendingApproval: true,
          error: 'Your cleaner application is awaiting Operations approval.',
        };
      }
      if (profile.role === 'cleaner' && profile.cleanerStatus === 'rejected') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: profile.rejectionReason || 'Your cleaner application was not approved.',
        };
      }
      setCurrentUser(profile);
      return { success: true, user: profile };
    } catch (profileError: any) {
      await supabase.auth.signOut();
      return { success: false, error: profileError.message || 'Could not load your account profile.' };
    }
  };

  const signUp: AuthContextType['signUp'] = async (userData) => {
    const role = userData.role === 'cleaner' ? 'cleaner' : 'customer';
    const { data, error } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      options: {
        data: {
          role,
          name: userData.name.trim(),
          phone: userData.phone.trim(),
          estate: userData.estate,
          specialty: userData.specialty,
          yearsExperience: userData.yearsExperience,
          neighborhoods: userData.neighborhoods,
          idNumber: userData.idNumber,
          goodConductCertified: userData.goodConductCertified,
          availability: userData.availability,
          bio: userData.bio,
          passportPhoto: userData.passportPhoto,
          ruiruArea: userData.ruiruArea,
          emergencyContactName: userData.emergencyContactName,
          emergencyContactPhone: userData.emergencyContactPhone,
          refereeName: userData.refereeName,
          refereePhone: userData.refereePhone,
          yearsLivingInRuiru: userData.yearsLivingInRuiru,
        },
      },
    });

    if (error) return { success: false, error: error.message };

    if (role === 'cleaner') {
      return {
        success: true,
        pendingApproval: true,
        message: 'Your cleaner application has been received and is awaiting Operations approval. Please verify your email if requested.',
      };
    }

    if (data.session && data.user) {
      try {
        const profile = await loadProfile(data.user);
        setCurrentUser(profile);
        return { success: true, user: profile, message: 'Your account has been created.' };
      } catch (profileError: any) {
        return { success: false, error: profileError.message || 'Account created, but profile setup is still completing. Please sign in shortly.' };
      }
    }

    return {
      success: true,
      message: 'Account created. Please check your email for a verification link, then sign in.',
    };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('[Fua Fresh Auth] Sign-out failed:', error);
    setCurrentUser(null);
  };

  const isAuthenticated = Boolean(currentUser) && authReady;
  const isAdmin = currentUser?.role === 'admin';
  const isCleaner = currentUser?.role === 'cleaner';

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isAdmin, isCleaner, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
