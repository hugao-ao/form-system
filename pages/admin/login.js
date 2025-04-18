import React, { useState } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login({ csrfToken }) {
  const [email, setEmail] = useState('');
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
        setError('Email ou senha inválidos');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Login Administrativo</h1>
        <p>Acesse o painel para gerenciar formulários</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          
          <div className="form-group">
  <label htmlFor="username">Nome de usuário</label>
  <input
    type="text"
    id="username"
    name="username"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</div>


          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #002d26;
          padding: 20px;
        }

        .login-form-container {
          background-color: #014034;
          padding: 40px;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #ffd700;
          margin-bottom: 10px;
          text-align: center;
        }

        p {
          color: #ffffff;
          margin-bottom: 30px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #ffffff;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 12px;
          border-radius: 5px;
          border: 1px solid transparent;
          background-color: #f5f5f5;
          font-size: 16px;
        }

        input:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
        }

        .login-button {
          background-color: #ffd700;
          color: #002d26;
          border: none;
          padding: 15px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .login-button:hover {
          background-color: #ffc400;
          transform: translateY(-2px);
        }

        .login-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          background-color: #ff6b6b;
          color: white;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
