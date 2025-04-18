import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongoose';
import User from '../../../models/User';
import { compare } from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Nome de usuário", type: "text", placeholder: "seu-usuario" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          
          // Busca o usuário pelo nome de usuário (pode ser qualquer formato)
          const user = await User.findOne({ 
            $or: [
              { email: credentials.username },
              { username: credentials.username },
              { name: credentials.username }
            ]
          });
          
          if (!user) {
            return null;
          }
          
          // Verifica a senha
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            return null;
          }
          
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
