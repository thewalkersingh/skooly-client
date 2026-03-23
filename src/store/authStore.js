import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth store — mock admin user during development.
 * JWT deferred until all features are built.
 *
 * TODO (when implementing JWT):
 *  1. Replace mockUser with real login API call
 *  2. Store real JWT token
 *  3. Implement real logout
 */
const MOCK_ADMIN = {
  id: 1,
  username: 'admin',
  role: 'ADMIN',
  schoolId: 1,
  schoolName: 'Demo School',
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: MOCK_ADMIN,
      token: 'mock-token',
      isAuthenticated: true,

      login: async (/* credentials */) => {
        // TODO: replace with real API call
        set({ user: MOCK_ADMIN, token: 'mock-token', isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'skooly-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
