import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || 'quickpitch-auth-secret-key-32chars',
  trustHost: true,
  providers: [
    Credentials({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn('[AUTH] Intento de login sin email o contraseña');
          return null;
        }

        const normalizedEmail = (credentials.email as string).trim().toLowerCase();
        const inputPassword = credentials.password as string;

        console.log(`[AUTH] Verificando login para: ${normalizedEmail}`);

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user) {
          console.warn(`[AUTH] Usuario no encontrado en la base de datos: ${normalizedEmail}`);
          return null;
        }

        const isValid = await bcrypt.compare(inputPassword, user.passwordHash);

        if (!isValid) {
          console.warn(`[AUTH] Contraseña incorrecta para: ${normalizedEmail}`);
          return null;
        }

        console.log(`[AUTH] Login exitoso para: ${normalizedEmail} (${user.role})`);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});
