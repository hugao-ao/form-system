import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [formData, setFormData] = useState({ pendentes: [], preenchidos: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchFormData();
    }
  }, [status, router]);

  const fetchFormData = async () => {
    try {
      const response = await fetch('/api/forms');
      if (response.ok) {
        const data = await response.json();
        
        // Separar formulários pendentes e preenchidos
        const pendentes = data.filter(form => !form.isUsed);
        const preenchidos = data.filter(form => form.isUsed);
        
        setFormData({ pendentes, preenchidos });
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const handleGerarLink = async () => {
    const clientName = prompt('Nome do cliente:');
    if (!clientName) return;
    
    const clientEmail = prompt('Email do cliente (opcional):');
    
    try {
      const response = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          clientName, 
          clientEmail: clientEmail || '' 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Link gerado com sucesso!\n\n${window.location.origin}/form/${data.uniqueId}`);
        fetchFormData(); // Atualiza a lista
      } else {
        alert('Erro ao gerar link. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar link. Tente novamente.');
    }
  };

  const handleVerDetalhes = (id) => {
    router.push(`/admin/forms/${id}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ 
        backgroundColor: '#002d26', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <p>Carregando...</p>
      </div>
    );
  }

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
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formData.pendentes.length}</p>
          </div>
          <div style={{ 
            backgroundColor: '#015c4a', 
            padding: '15px', 
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center'
          }}>
            <h3>Formulários Preenchidos</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formData.preenchidos.length}</p>
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
            {formData[activeTab].map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid #015c4a' }}>
                <td style={{ padding: '10px' }}>{item.clientName}</td>
                <td style={{ padding: '10px' }}>{item.clientEmail || '-'}</td>
                <td style={{ padding: '10px' }}>
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleVerDetalhes(item._id)}
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
        
        {formData[activeTab].length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Nenhum formulário {activeTab === 'pendentes' ? 'pendente' : 'preenchido'} encontrado.
          </p>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}
