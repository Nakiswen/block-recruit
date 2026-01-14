import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { Session, User, NextAuthResult } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

interface ExtendedToken extends JWT {
  googleId?: string;
}

interface ExtendedUser extends User {
  googleId?: string;
  id?: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const nextAuth: NextAuthResult = NextAuth({
  providers: [
    Google({
      clientId: googleClientId!,
      clientSecret: googleClientSecret!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const extendedToken = token as ExtendedToken;
      if (account && profile) {
        extendedToken.googleId = profile.sub ?? undefined;
        extendedToken.email = profile.email;
        extendedToken.name = profile.name;
        extendedToken.picture = (profile as { picture?: string }).picture;
      }
      return extendedToken;
    },
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;

      if (extendedSession.user) {
        extendedSession.user.googleId = extendedToken.googleId;
        extendedSession.user.id = extendedToken.sub;
      }
      return extendedSession;
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
});

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth = nextAuth.auth;
