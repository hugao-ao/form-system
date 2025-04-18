import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pendentes');
  const router = useRouter();

  // Dados de demonstração
  const dadosDemo = {
    pendentes: [
      { id: '1', nome: 'João Silva', email: 'joao@exemplo.com', data: '15/04/2025' },
      { id: '2', nome: 'Maria Oliveira', email: 'maria@exemplo.com', data: '16/04/2025' },
    ],
    preenchidos: [
      { id: '3', nome: 'Carlos Santos', email: 'carlos@exemplo.com', data: '10/04/2025' },
      { id: '4', nome: 'Ana Pereira', email: 'ana@exemplo.com', data: '12/04/2025' },
      { id: '5', nome: 'Roberto Lima', email: 'roberto@exemplo.com', data: '14/04/2025' },
    ]
  };

  const handleLogout = () => {
    router.push('/admin/login');
  };

  const handleGerarLink = () => {
    alert('Funcionalidade de geração de link será implementada em breve!');
  };

  const handleVerDetalhes = (id) => {
    alert(`Detalhes do formulário ${id} serão implementados em breve!`);
  };

  return (
    <div style={{ backgroundColor: '#002d26', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <Head>
        <title>Dashboard Administrativo</title>
      </Head>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#ffd700' }}>Dashboard Administrativo</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            padding: '10px 15px', 
            borderRadius: '5px', 
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#014034', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Resumo</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ 
            backgroundColor: '#015c4a', 
            padding: '15px', 
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center'
          }}>
            <h3>Formulários Pendentes</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dadosDemo.pendentes.length}</p>
          </div>
          <div style={{ 
            backgroundColor: '#015c4a', 
            padding: '15px', 
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center'
          }}>
            <h3>Formulários Preenchidos</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dadosDemo.preenchidos.length}</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('pendentes')}
            style={{ 
              backgroundColor: activeTab === 'pendentes' ? '#ffd700' : '#015c4a', 
              color: activeTab === 'pendentes' ? '#002d26' : 'white', 
              padding: '10px 15px', 
              borderRadius: '5px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'pendentes' ? 'bold' : 'normal'
            }}
          >
            Pendentes
          </button>
          <button 
            onClick={() => setActiveTab('preenchidos')}
            style={{ 
              backgroundColor: activeTab === 'preenchidos' ? '#ffd700' : '#015c4a', 
              color: activeTab === 'preenchidos' ? '#002d26' : 'white', 
              padding: '10px 15px', 
              borderRadius: '5px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'preenchidos' ? 'bold' : 'normal'
            }}
          >
            Preenchidos
          </button>
        </div>
        <button 
          onClick={handleGerarLink}
          style={{ 
            backgroundColor: '#ffd700', 
            color: '#002d26', 
            padding: '10px 15px', 
            borderRadius: '5px', 
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Gerar Novo Link
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#014034', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        <h2 style={{ marginBottom: '15px' }}>
          {activeTab === 'pendentes' ? 'Formulários Pendentes' : 'Formulários Preenchidos'}
        </h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #015c4a' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Nome</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Data</th>
              <th style={{ textAlign: 'center', padding: '10px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dadosDemo[activeTab].map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #015c4a' }}>
                <td style={{ padding: '10px' }}>{item.nome}</td>
                <td style={{ padding: '10px' }}>{item.email}</td>
                <td style={{ padding: '10px' }}>{item.data}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleVerDetalhes(item.id)}
                    style={{ 
                      backgroundColor: '#016857', 
                      color: 'white', 
                      padding: '8px 12px', 
                      borderRadius: '5px', 
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {dadosDemo[activeTab].length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Nenhum formulário {activeTab === 'pendentes' ? 'pendente' : 'preenchido'} encontrado.
          </p>
        )}
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#aaa' }}>
        <p>Sistema de Formulários Personalizados - Versão de Demonstração</p>
        <p>Esta é uma versão de demonstração com dados fictícios.</p>
      </div>
    </div>
  );
}
