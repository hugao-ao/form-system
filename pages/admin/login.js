import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result.error) {
        setError('Credenciais inválidas. Tente novamente.');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#002d26', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white'
    }}>
      <Head>
        <title>Login Administrativo</title>
      </Head>
      <div style={{ 
        backgroundColor: '#014034', 
        padding: '30px', 
        borderRadius: '8px', 
        width: '100%', 
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          color: '#ffd700', 
          textAlign: 'center', 
          marginBottom: '20px' 
        }}>Login Administrativo</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Acesse o painel para gerenciar formulários
        </p>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px' }}>
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none' 
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none' 
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{ 
              backgroundColor: '#ffd700', 
              color: '#002d26', 
              padding: '12px', 
              borderRadius: '5px', 
              border: 'none', 
              width: '100%', 
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processando...' : 'Entrar'}
          </button>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            <p>Usuário padrão: <strong>admin</strong></p>
            <p>Senha padrão: <strong>admin123</strong></p>
          </div>
        </form>
      </div>
    </div>
  );
}
