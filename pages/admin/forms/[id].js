import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FormDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchFormDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar formulário: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setForm(data.data);
        } else {
          throw new Error(data.message || 'Erro ao carregar dados do formulário');
        }
      } catch (error) {
        console.error('Erro:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFormDetails();
  }, [id]);

  const handleVoltar = () => {
    router.push('/admin/dashboard');
  };

  if (loading) {
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

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#002d26', 
        minHeight: '100vh', 
        padding: '20px',
        color: 'white'
      }}>
        <h1 style={{ color: '#ffd700', textAlign: 'center', marginBottom: '30px' }}>Erro ao carregar formulário</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>{error}</p>
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleVoltar}
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
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ 
        backgroundColor: '#002d26', 
        minHeight: '100vh', 
        padding: '20px',
        color: 'white'
      }}>
        <h1 style={{ color: '#ffd700', textAlign: 'center', marginBottom: '30px' }}>Formulário não encontrado</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>O formulário solicitado não foi encontrado.</p>
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleVoltar}
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
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#002d26', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <Head>
        <title>Detalhes do Formulário</title>
      </Head>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#ffd700' }}>Detalhes do Formulário</h1>
        <button 
          onClick={handleVoltar}
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
          Voltar
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#014034', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#ffd700' }}>Informações do Cliente</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Nome:</p>
            <p style={{ 
              backgroundColor: '#015c4a', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>{form.clientName}</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Email:</p>
            <p style={{ 
              backgroundColor: '#015c4a', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>{form.clientEmail || '-'}</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>ID Único:</p>
            <p style={{ 
              backgroundColor: '#015c4a', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>{form.uniqueId}</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Status:</p>
            <p style={{ 
              backgroundColor: form.status === 'pending' ? '#ffc107' : '#28a745', 
              color: '#000',
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px',
              fontWeight: 'bold'
            }}>{form.status === 'pending' ? 'Pendente' : 'Preenchido'}</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Data de Criação:</p>
            <p style={{ 
              backgroundColor: '#015c4a', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>{new Date(form.createdAt).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Utilizado:</p>
            <p style={{ 
              backgroundColor: '#015c4a', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px'
            }}>{form.used ? 'Sim' : 'Não'}</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#014034', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#ffd700' }}>Link do Formulário</h2>
        <div style={{ 
          backgroundColor: '#015c4a', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '15px',
          wordBreak: 'break-all'
        }}>
          {`${typeof window !== 'undefined' ? window.location.origin : ''}/form/${form.uniqueId}`}
        </div>
        <button 
          onClick={() => {
            const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/form/${form.uniqueId}`;
            navigator.clipboard.writeText(link)
              .then(() => alert('Link copiado para a área de transferência!'))
              .catch(() => alert('Não foi possível copiar o link. Por favor, copie manualmente.'));
          }}
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
          Copiar Link
        </button>
      </div>
    </div>
  );
}
