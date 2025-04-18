import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const { uniqueId } = router.query;
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    rendaMensal: '',
    gastosMensais: '',
    objetivoFinanceiro: '',
    prazoObjetivo: '',
    investimentos: '',
    dividas: '',
    observacoes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulando envio do formulário
    console.log('Formulário enviado:', formData);
    
    // Em uma implementação real, enviaríamos para a API
    // const response = await fetch('/api/submissions/create', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     uniqueId,
    //     ...formData
    //   }),
    // });
    
    // Mostrar mensagem de sucesso
    setSubmitted(true);
  };

  if (!uniqueId) {
    return <div>Carregando...</div>;
  }

  if (submitted) {
    return (
      <div style={{ 
        backgroundColor: '#002d26', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#014034', 
          padding: '30px', 
          borderRadius: '8px',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ffd700', marginBottom: '20px' }}>Formulário Enviado com Sucesso!</h1>
          <p>Obrigado por preencher o formulário. Suas informações foram recebidas.</p>
          <p>Entraremos em contato em breve para agendar sua reunião de diagnóstico financeiro.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#002d26', 
      minHeight: '100vh', 
      color: 'white',
      padding: '20px'
    }}>
      <Head>
        <title>Formulário de Diagnóstico Financeiro</title>
      </Head>
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        backgroundColor: '#014034', 
        padding: '30px', 
        borderRadius: '8px'
      }}>
        <h1 style={{ color: '#ffd700', marginBottom: '20px', textAlign: 'center' }}>
          Formulário de Diagnóstico Financeiro
        </h1>
        <p style={{ marginBottom: '30px', textAlign: 'center' }}>
          Por favor, preencha as informações abaixo para nos ajudar a preparar seu diagnóstico financeiro.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="nome" style={{ display: 'block', marginBottom: '8px' }}>
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="telefone" style={{ display: 'block', marginBottom: '8px' }}>
              Telefone *
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rendaMensal" style={{ display: 'block', marginBottom: '8px' }}>
              Renda Mensal Aproximada *
            </label>
            <input
              type="text"
              id="rendaMensal"
              name="rendaMensal"
              value={formData.rendaMensal}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="gastosMensais" style={{ display: 'block', marginBottom: '8px' }}>
              Gastos Mensais Aproximados *
            </label>
            <input
              type="text"
              id="gastosMensais"
              name="gastosMensais"
              value={formData.gastosMensais}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="objetivoFinanceiro" style={{ display: 'block', marginBottom: '8px' }}>
              Principal Objetivo Financeiro *
            </label>
            <input
              type="text"
              id="objetivoFinanceiro"
              name="objetivoFinanceiro"
              value={formData.objetivoFinanceiro}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="prazoObjetivo" style={{ display: 'block', marginBottom: '8px' }}>
              Prazo para Atingir o Objetivo *
            </label>
            <input
              type="text"
              id="prazoObjetivo"
              name="prazoObjetivo"
              value={formData.prazoObjetivo}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="investimentos" style={{ display: 'block', marginBottom: '8px' }}>
              Investimentos Atuais (se houver)
            </label>
            <textarea
              id="investimentos"
              name="investimentos"
              value={formData.investimentos}
              onChange={handleChange}
              rows="3"
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="dividas" style={{ display: 'block', marginBottom: '8px' }}>
              Dívidas Atuais (se houver)
            </label>
            <textarea
              id="dividas"
              name="dividas"
              value={formData.dividas}
              onChange={handleChange}
              rows="3"
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="observacoes" style={{ display: 'block', marginBottom: '8px' }}>
              Observações Adicionais
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="4"
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '5px', 
                border: 'none',
                backgroundColor: '#f5f5f5',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{ 
              backgroundColor: '#ffd700', 
              color: '#002d26', 
              padding: '15px', 
              borderRadius: '5px', 
              border: 'none',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Enviar Formulário
          </button>
        </form>
      </div>
    </div>
  );
}
