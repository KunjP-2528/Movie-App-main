import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyUser } from '@/lib/userStore';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth — works once you add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    // Demo credentials — replace with real DB lookup in production
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@pkflix.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();

        // Built-in demo account always works, plus any account created via /api/signup.
        const isDemo = email === 'demo@pkflix.com' && credentials.password === 'demo123';

        if (isDemo || verifyUser(email, credentials.password)) {
          return {
            id: email,
            email,
            name: email.split('@')[0],
          };
        }
        return null;
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },

  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET ?? 'fallback-secret',
};
