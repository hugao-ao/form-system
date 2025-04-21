import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pendentes');
  const [formData, setFormData] = useState({
    pendentes: [],
    preenchidos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gerandoLink, setGerandoLink] = useState(false);

  // Buscar dados dos formulários
  const fetchForms = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime(); // Adiciona timestamp para evitar cache
      const response = await fetch(`/api/forms?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar formulários: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Separar formulários pendentes e preenchidos
        const pendentes = data.data.filter(form => form.status === 'pending');
        const preenchidos = data.data.filter(form => form.status === 'completed');
        
        setFormData({
          pendentes,
          preenchidos
        });
      } else {
        setError(data.message || 'Erro ao buscar formulários');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao buscar formulários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Gerar novo link de formulário
  const handleGerarLink = async () => {
    try {
      setGerandoLink(true);
      
      const clientName = prompt('Nome do cliente:');
      if (!clientName) {
        setGerandoLink(false);
        return;
      }
      
      const clientEmail = prompt('Email do cliente (opcional):');
      
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
        if (data.success) {
          alert(`Link gerado com sucesso!\nID: ${data.data.uniqueId}`);
          fetchForms(); // Atualizar a lista de formulários
        } else {
          alert('Erro ao gerar link: ' + (data.message || 'Erro desconhecido'));
        }
      } else {
        alert('Erro ao gerar link. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar link. Tente novamente.');
    } finally {
      setGerandoLink(false);
    }
  };

  // Excluir formulário
  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este formulário?')) {
      try {
        const response = await fetch(`/api/forms/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          alert('Formulário excluído com sucesso!');
          fetchForms(); // Atualizar a lista de formulários
        } else {
          alert('Erro ao excluir formulário. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir formulário. Tente novamente.');
      }
    }
  };

  // Ver detalhes do formulário
  const handleVerDetalhes = (id) => {
    router.push(`/admin/forms/${id}`);
  };

  // Sair do dashboard
  const handleSair = () => {
    // Aqui você pode adicionar lógica de logout se necessário
    router.push('/');
  };

  // Buscar formulários ao carregar a página
  useEffect(() => {
    fetchForms();
    
    // Configurar atualização periódica
    const interval = setInterval(fetchForms, 30000); // Atualizar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#002d26', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <Head>
        <title>Dashboard Administrativo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#ffd700' }}>Dashboard Administrativo</h1>
        <button 
          onClick={handleSair}
          style={{ 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            padding: '10px 15px', 
            borderRadius: '5px', 
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sair
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#014034', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>Resumo</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#015c4a', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#ffd700' }}>Formulários Pendentes</h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold'
            }}>{formData.pendentes.length}</p>
          </div>
          <div style={{ 
            backgroundColor: '#015c4a', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#ffd700' }}>Formulários Preenchidos</h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold'
            }}>{formData.preenchidos.length}</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => setActiveTab('pendentes')}
          style={{ 
            backgroundColor: activeTab === 'pendentes' ? '#ffd700' : '#015c4a', 
            color: activeTab === 'pendentes' ? '#002d26' : 'white', 
            padding: '10px 15px', 
            borderRadius: '5px 0 0 5px', 
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            flex: '0 0 auto'
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
            borderRadius: '0 5px 5px 0', 
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            flex: '0 0 auto'
          }}
        >
          Preenchidos
        </button>
        <div style={{ flex: '1 1 auto' }}></div>
        <button 
          onClick={handleGerarLink}
          disabled={gerandoLink}
          style={{ 
            backgroundColor: '#ffd700', 
            color: '#002d26', 
            padding: '10px 15px', 
            borderRadius: '5px', 
            border: 'none',
            cursor: gerandoLink ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: gerandoLink ? 0.7 : 1
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
        <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>Formulários {activeTab === 'pendentes' ? 'Pendentes' : 'Preenchidos'}</h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Carregando...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>{error}</p>
        ) : (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ 
                borderBottom: '1px solid #015c4a',
                textAlign: 'left'
              }}>
                <th style={{ padding: '10px' }}>Nome</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Data</th>
                <th style={{ padding: '10px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {formData[activeTab].map(form => (
                <tr key={form._id} style={{ 
                  borderBottom: '1px solid #015c4a'
                }}>
                  <td style={{ padding: '10px' }}>{form.clientName}</td>
                  <td style={{ padding: '10px' }}>{form.clientEmail || '-'}</td>
                  <td style={{ padding: '10px' }}>{new Date(form.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px'
                    }}>
                      <button 
                        onClick={() => handleVerDetalhes(form._id)}
                        style={{ 
                          backgroundColor: '#015c4a', 
                          color: 'white', 
                          padding: '8px 12px', 
                          borderRadius: '5px', 
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Ver Detalhes
                      </button>
                      <button 
                        onClick={() => handleExcluir(form._id)}
                        style={{ 
                          backgroundColor: '#ff6b6b', 
                          color: 'white', 
                          padding: '8px 12px', 
                          borderRadius: '5px', 
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {formData[activeTab].length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Nenhum formulário {activeTab === 'pendentes' ? 'pendente' : 'preenchido'} encontrado.
          </p>
        )}
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#aaa' }}>
        <p>Sistema de Formulários Personalizados - Versão 1.0</p>
        <p>Desenvolvido para atender às suas necessidades específicas.</p>
      </div>
    </div>
  );
}
