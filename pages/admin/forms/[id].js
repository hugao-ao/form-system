import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FormDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumoInteligente, setResumoInteligente] = useState('');
  const [documentosSugeridos, setDocumentosSugeridos] = useState([]);

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
          
          // Se o formulário estiver preenchido, buscar os dados da submissão
          if (data.data.status === 'completed') {
            await fetchSubmissionData(id);
          }
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

    async function fetchSubmissionData(formId) {
      try {
        const response = await fetch(`/api/submissions/${formId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`Erro ao carregar submissão: ${response.status}`);
          return;
        }

        const data = await response.json();
        if (data.success && data.data) {
          setSubmission(data.data);
          
          // Gerar resumo inteligente e documentos sugeridos
          gerarResumoInteligente(data.data.formData);
          gerarDocumentosSugeridos(data.data.formData);
        }
      } catch (error) {
        console.error('Erro ao carregar submissão:', error);
      }
    }

    fetchFormDetails();
  }, [id]);

  const gerarResumoInteligente = (formData) => {
    if (!formData) return;
    
    // Aqui você pode implementar uma lógica mais sofisticada para gerar o resumo
    // Este é apenas um exemplo simples
    
    let resumo = `Resumo do atendimento para ${formData.dadosPessoais.nome}:\n\n`;
    
    resumo += `Cliente ${formData.dadosPessoais.nome}, ${formData.dadosPessoais.profissao}, `;
    resumo += `com renda mensal de ${formData.dadosPessoais.rendaMensal}.\n\n`;
    
    if (formData.pessoasRenda && formData.pessoasRenda.length > 0) {
      resumo += `Família com ${formData.pessoasRenda.length} pessoa(s) adicional(is) com renda.\n`;
    }
    
    if (formData.dependentes && formData.dependentes.length > 0) {
      resumo += `Possui ${formData.dependentes.length} dependente(s).\n`;
    }
    
    if (formData.patrimonios && formData.patrimonios.length > 0) {
      resumo += `\nPatrimônios principais:\n`;
      formData.patrimonios.forEach(patrimonio => {
        resumo += `- ${patrimonio.descricao}: ${patrimonio.valor}\n`;
      });
    }
    
    if (formData.dividas && formData.dividas.length > 0) {
      resumo += `\nDívidas principais:\n`;
      formData.dividas.forEach(divida => {
        resumo += `- ${divida.descricao}: ${divida.valorTotal}\n`;
      });
    }
    
    resumo += `\nObjetivos financeiros:\n`;
    resumo += `- Curto prazo: ${formData.objetivos.curto || 'Não informado'}\n`;
    resumo += `- Médio prazo: ${formData.objetivos.medio || 'Não informado'}\n`;
    resumo += `- Longo prazo: ${formData.objetivos.longo || 'Não informado'}\n`;
    
    if (formData.observacoes) {
      resumo += `\nObservações adicionais: ${formData.observacoes}\n`;
    }
    
    setResumoInteligente(resumo);
  };

  const gerarDocumentosSugeridos = (formData) => {
    if (!formData) return;
    
    // Lista básica de documentos
    const documentos = [
      "Documento de identidade (RG e CPF)",
      "Comprovante de residência atualizado",
      "Comprovantes de renda dos últimos 3 meses",
      "Extratos bancários dos últimos 3 meses",
      "Declaração de Imposto de Renda mais recente"
    ];
    
    // Documentos adicionais baseados nas informações do formulário
    if (formData.patrimonios && formData.patrimonios.length > 0) {
      documentos.push("Documentos dos bens (escrituras, CRLVs, etc.)");
    }
    
    if (formData.dividas && formData.dividas.length > 0) {
      documentos.push("Contratos de financiamentos e empréstimos");
      documentos.push("Faturas de cartões de crédito dos últimos 3 meses");
    }
    
    if (formData.pessoasRenda && formData.pessoasRenda.length > 0) {
      documentos.push("Documentos de identidade e comprovantes de renda do cônjuge/dependentes");
    }
    
    // Documentos específicos baseados nos objetivos
    if (formData.objetivos) {
      if (formData.objetivos.curto && formData.objetivos.curto.includes("imóvel")) {
        documentos.push("Simulações de financiamento imobiliário");
      }
      
      if (formData.objetivos.medio && formData.objetivos.medio.includes("investimento")) {
        documentos.push("Extratos de investimentos atuais");
      }
      
      if (formData.objetivos.longo && formData.objetivos.longo.includes("aposentadoria")) {
        documentos.push("Extratos de previdência privada (se houver)");
      }
    }
    
    setDocumentosSugeridos(documentos);
  };

  const handleVoltar = () => {
    router.push('/admin/dashboard');
  };

  const handleExcluir = async () => {
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
          router.push('/admin/dashboard');
        } else {
          alert('Erro ao excluir formulário. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao excluir formulário:', error);
        alert('Erro ao excluir formulário. Tente novamente.');
      }
    }
  };

 const handleGerarPDF = async () => {
  alert('Funcionalidade de relatório em desenvolvimento. Por favor, tente novamente mais tarde.');
};


      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `formulario-${form.clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Erro ao gerar PDF. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleCopiarTexto = (texto) => {
    navigator.clipboard.writeText(texto)
      .then(() => alert('Texto copiado para a área de transferência!'))
      .catch(() => alert('Não foi possível copiar o texto. Por favor, copie manualmente.'));
  };

  const handleGerarNovoLink = () => {
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
        borderRadius: '8px',
        marginBottom: '20px'
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
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Copiar Link
        </button>
      </div>
      
      {form.status === 'completed' && submission && (
        <>
          <div style={{ 
            backgroundColor: '#014034', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginBottom: '15px', color: '#ffd700' }}>Resumo Inteligente</h2>
            <div style={{ 
              backgroundColor: '#015c4a', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px',
              whiteSpace: 'pre-line'
            }}>
              {resumoInteligente || 'Gerando resumo...'}
            </div>
            <button 
              onClick={() => handleCopiarTexto(resumoInteligente)}
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
              Copiar Resumo
            </button>
          </div>
          
          <div style={{ 
            backgroundColor: '#014034', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginBottom: '15px', color: '#ffd700' }}>Documentos Sugeridos para a Reunião</h2>
            <ul style={{ 
              backgroundColor: '#015c4a', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '15px',
              listStylePosition: 'inside'
            }}>
              {documentosSugeridos.length > 0 ? (
                documentosSugeridos.map((doc, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>{doc}</li>
                ))
              ) : (
                <li>Gerando sugestões de documentos...</li>
              )}
            </ul>
            <button 
              onClick={() => handleCopiarTexto(documentosSugeridos.join('\n'))}
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
              Copiar Lista de Documentos
            </button>
          </div>
        </>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '30px'
      }}>
        <button 
          onClick={handleExcluir}
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
          Excluir Formulário
        </button>
        
        <div>
          <button 
            onClick={handleGerarPDF}
            style={{ 
              backgroundColor: '#28a745', 
              color: 'white', 
              padding: '10px 15px', 
              borderRadius: '5px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            Gerar PDF
          </button>
          
          <button 
            onClick={handleGerarNovoLink}
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
      </div>
    </div>
  );
}
