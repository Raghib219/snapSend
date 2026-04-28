// Supabase removed - app uses localStorage auth via SimpleAuthContext
// This stub prevents import errors in any files that still reference it
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ error: { message: 'Use SimpleAuth' } }),
    signUp: async () => ({ error: { message: 'Use SimpleAuth' } }),
    signOut: async () => {},
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: () => ({ execute: async () => ({ data: null, error: null }) }),
  }),
};
