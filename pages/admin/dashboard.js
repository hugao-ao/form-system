import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [newLinkCreated, setNewLinkCreated] = useState(false);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // Carregar formulários
      fetchForms();
    }
  }, [status, router]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forms');
      const data = await response.json();
      
      if (data.success) {
        setForms(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar formulários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async (e) => {
    e.preventDefault();
    
    if (!clientName) {
      alert('Por favor, informe o nome do cliente');
      return;
    }
    
    try {
      const response = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewLinkCreated(true);
        setNewLink(data.data.link);
        setClientName('');
        setClientEmail('');
        // Atualizar lista de formulários
        fetchForms();
      } else {
        alert('Erro ao gerar link: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      alert('Ocorreu um erro ao gerar o link');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newLink);
    alert('Link copiado para a área de transferência!');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header>
        <h1>Painel Administrativo</h1>
        <div className="user-info">
          <span>Olá, {session?.user?.name || 'Administrador'}</span>
          <button onClick={() => router.push('/api/auth/signout')} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main>
        <section className="generate-link-section">
          <h2>Gerar Novo Link</h2>
          <form onSubmit={handleGenerateLink} className="generate-link-form">
            <div className="form-group">
              <label htmlFor="clientName">Nome do Cliente*</label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="clientEmail">Email do Cliente (opcional)</label>
              <input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            
            <button type="submit" className="generate-btn">
              Gerar Link Único
            </button>
          </form>
          
          {newLinkCreated && (
            <div className="new-link-container">
              <h3>Link Gerado com Sucesso!</h3>
              <div className="link-display">
                <input type="text" value={newLink} readOnly />
                <button onClick={copyToClipboard} className="copy-btn">
                  Copiar
                </button>
              </div>
              <p className="link-info">
                Este link é de uso único. Envie-o para o cliente preencher o formulário.
              </p>
            </div>
          )}
        </section>

        <section className="forms-list-section">
          <h2>Formulários</h2>
          
          <div className="forms-filter">
            <button className="filter-btn active">Todos</button>
            <button className="filter-btn">Pendentes</button>
            <button className="filter-btn">Preenchidos</button>
            <button className="filter-btn">Expirados</button>
          </div>
          
          {forms.length === 0 ? (
            <div className="no-forms">
              <p>Nenhum formulário encontrado. Gere seu primeiro link acima.</p>
            </div>
          ) : (
            <table className="forms-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Data de Criação</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form._id} className={`status-${form.status}`}>
                    <td>{form.clientName}</td>
                    <td>{form.clientEmail || '-'}</td>
                    <td>{new Date(form.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`status-badge ${form.status}`}>
                        {form.status === 'pending' && 'Pendente'}
                        {form.status === 'completed' && 'Preenchido'}
                        {form.status === 'expired' && 'Expirado'}
                      </span>
                    </td>
                    <td>
                      {form.status === 'pending' ? (
                        <div className="action-buttons">
                          <button 
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/form/${form.uniqueId}`)}
                            className="action-btn copy"
                          >
                            Copiar Link
                          </button>
                        </div>
                      ) : form.status === 'completed' ? (
                        <div className="action-buttons">
                          <Link href={`/admin/forms/${form._id}`}>
                            <button className="action-btn view">Ver Respostas</button>
                          </Link>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button className="action-btn disabled">Expirado</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #002d26;
          color: #ffffff;
        }

        header {
          background-color: #014034;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #ffd700;
          margin: 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logout-btn {
          background-color: transparent;
          border: 1px solid #ffffff;
          color: #ffffff;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        main {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .generate-link-section, .forms-list-section {
          background-color: #014034;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #ffd700;
          margin-top: 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #015c4a;
          padding-bottom: 10px;
        }

        .generate-link-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 20px;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 8px;
          font-weight: bold;
        }

        input {
          padding: 12px;
          border-radius: 5px;
          border: 1px solid transparent;
          font-size: 16px;
          background-color: #f5f5f5;
        }

        input:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
        }

        .generate-btn {
          background-color: #ffd700;
          color: #002d26;
          border: none;
          padding: 12px 20px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 48px;
        }

        .generate-btn:hover {
          background-color: #ffc400;
          transform: translateY(-2px);
        }

        .new-link-container {
          margin-top: 25px;
          padding: 20px;
          background-color: #015c4a;
          border-radius: 8px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h3 {
          color: #ffd700;
          margin-top: 0;
        }

        .link-display {
          display: flex;
          gap: 10px;
          margin: 15px 0;
        }

        .link-display input {
          flex: 1;
          background-color: rgba(255, 255, 255, 0.9);
        }

        .copy-btn {
          background-color: #ffd700;
          color: #002d26;
          border: none;
          padding: 0 15px;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .copy-btn:hover {
          background-color: #ffc400;
        }

        .link-info {
          margin: 10px 0 0;
          font-size: 14px;
          color: #f5f5f5;
        }

        .forms-filter {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .filter-btn {
          background-color: #015c4a;
          color: #ffffff;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover, .filter-btn.active {
          background-color: #016857;
        }

        .filter-btn.active {
          border-bottom: 2px solid #ffd700;
        }

        .no-forms {
          text-align: center;
          padding: 40px 0;
          color: #cccccc;
        }

        .forms-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .forms-table th, .forms-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #015c4a;
        }

        .forms-table th {
          font-weight: bold;
          color: #ffd700;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .status-badge.pending {
          background-color: #3498db;
          color: white;
        }

        .status-badge.completed {
          background-color: #2ecc71;
          color: white;
        }

        .status-badge.expired {
          background-color: #e74c3c;
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.copy {
          background-color: #3498db;
          color: white;
        }

        .action-btn.view {
          background-color: #2ecc71;
          color: white;
        }

        .action-btn.disabled {
          background-color: #95a5a6;
          color: white;
          cursor: not-allowed;
        }

        .action-btn:hover:not(.disabled) {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #002d26;
          color: #ffffff;
        }

        .loading-spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #ffd700;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .generate-link-form {
            grid-template-columns: 1fr;
          }
          
          .forms-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session }
  };
}
