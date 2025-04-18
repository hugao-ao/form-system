import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Usuário administrador padrão
const DEFAULT_ADMIN = {
  id: '1',
  name: 'Administrador',
  email: 'admin@exemplo.com',
  password: 'admin123'
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuário", type: "text", placeholder: "admin" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // Verificação simples sem banco de dados
        if (
          (credentials.username === DEFAULT_ADMIN.email || 
           credentials.username === 'admin') && 
          credentials.password === DEFAULT_ADMIN.password
        ) {
          return {
            id: DEFAULT_ADMIN.id,
            name: DEFAULT_ADMIN.name,
            email: DEFAULT_ADMIN.email
          };
        }
        
        // Se não corresponder, retorna null (login falha)
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async session({ session }) {
      session.user.id = DEFAULT_ADMIN.id;
      return session;
    },
    async jwt({ token }) {
      token.id = DEFAULT_ADMIN.id;
      return token;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'sua-chave-secreta-aqui',
});
