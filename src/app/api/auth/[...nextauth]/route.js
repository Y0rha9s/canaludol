import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data, error } = await supabaseAdmin
          .from('admins')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !data) return null;

        const valid = await bcrypt.compare(credentials.password, data.password);
        if (!valid) return null;

        return {
          id: data.id,
          email: data.email,
          name: data.nombre
        };
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };