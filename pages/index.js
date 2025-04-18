import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <main>
        <h1>Sistema de Formulários Personalizados</h1>
        <p>Bem-vindo ao sistema de gerenciamento de formulários financeiros.</p>
        
        <div className="grid">
          <Link href="/admin/login">
            <div className="card">
              <h2>Área Administrativa &rarr;</h2>
              <p>Acesse o painel administrativo para gerenciar formulários.</p>
            </div>
          </Link>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #002d26;
          color: #ffffff;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          color: #ffd700;
          text-align: center;
        }

        p {
          line-height: 1.5;
          font-size: 1.5rem;
          text-align: center;
          margin: 2rem 0;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 300px;
          background-color: #014034;
          cursor: pointer;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #ffd700;
          border-color: #ffd700;
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #ffd700;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
