import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Configuração básica para evitar erros durante o build
const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize()  {
        // Retorna um usuário fictício para evitar erros
        return { id: 1, name: 'Admin' };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'form-system-secret-key-123456',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
};

export default NextAuth(options);
