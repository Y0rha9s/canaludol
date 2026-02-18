import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { data: admin } = await supabaseAdmin
          .from('admins')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (!admin) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.password);
        
        if (isValid) {
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name
          };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    }
  }
});

export { handler as GET, handler as POST };