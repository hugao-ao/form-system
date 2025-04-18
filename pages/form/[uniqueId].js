import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FormPage() {
  const router = useRouter();
  const { uniqueId } = router.query;
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!uniqueId) return;

    const validateForm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/validate?uniqueId=${uniqueId}`);
        const data = await response.json();

        if (data.success) {
          setFormData(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erro ao validar o formulário. Por favor, tente novamente.');
        console.error('Erro ao validar formulário:', err);
      } finally {
        setLoading(false);
      }
    };

    validateForm();
  }, [uniqueId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      // Marcar o formulário como usado
      const markResponse = await fetch('/api/forms/mark-used', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueId }),
      });
      
      const markData = await markResponse.json();
      
      if (!markData.success) {
        throw new Error(markData.message);
      }
      
      // Enviar os dados do formulário
      const submitResponse = await fetch('/api/submissions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formData.formId,
          data: formValues,
        }),
      });
      
      const submitData = await submitResponse.json();
      
      if (submitData.success) {
        setSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        throw new Error(submitData.message);
      }
    } catch (err) {
      setError('Erro ao enviar o formulário. Por favor, tente novamente.');
      console.error('Erro ao submeter formulário:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando formulário...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Erro ao acessar formulário</h1>
        <p>{error}</p>
        <p>Se você acredita que isso é um erro, entre em contato com o administrador.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="success-container">
        <h1>Formulário Enviado com Sucesso!</h1>
        <p>Obrigado por preencher o formulário, {formData.clientName}.</p>
        <p>Suas informações foram registradas e serão analisadas em breve.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Formulário de Atendimento Financeiro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <h1>Formulário de Atendimento Financeiro</h1>
      <p className="welcome-message">Olá, {formData.clientName}! Por favor, preencha o formulário abaixo.</p>
      
      <form id="formularioAtendimento" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <h2>Informações Pessoais</h2>
          <div className="form-group">
            <label htmlFor="nome">Nome completo: <span aria-hidden="true">*</span></label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              required 
              aria-required="true"
              value={formValues.nome || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Seção de pessoas com renda */}
        <div className="form-section" id="secaoPessoasRenda">
          <h2>Pessoas com Renda</h2>
          <div className="option-group">
            <label id="label-unica-renda">Você é a única pessoa que tem renda na sua casa?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-unica-renda">
              <div className="option-option">
                <input 
                  type="radio" 
                  id="unicaRendaSim" 
                  name="unicaRenda" 
                  value="Sim" 
                  checked={formValues.unicaRenda === 'Sim'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="unicaRendaSim">Sim</label>
              </div>
              <div className="option-option">
                <input 
                  type="radio" 
                  id="unicaRendaNao" 
                  name="unicaRenda" 
                  value="Não" 
                  checked={formValues.unicaRenda === 'Não'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="unicaRendaNao">Não</label>
              </div>
            </div>
          </div>
        </div>

        {/* Adicione aqui as outras seções do formulário original */}
        
        {/* Seção de informações adicionais */}
        <div className="form-section" id="secaoInfoAdicional">
          <h2>Informações Adicionais</h2>
          <div className="form-group">
            <label htmlFor="infoAdicional">Existe alguma informação que você julgue relevante informar?</label>
            <textarea 
              id="infoAdicional" 
              name="infoAdicional" 
              className="info-adicional" 
              placeholder="Digite aqui qualquer informação adicional que você considere importante..."
              value={formValues.infoAdicional || ''}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-enviar" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar Formulário'}
        </button>
      </form>

      <style jsx global>{`
        :root {
          --cor-primaria: #002d26;
          --cor-secundaria: #014034;
          --cor-terciaria: #015c4a;
          --cor-quaternaria: #016857;
          --cor-destaque: #ffd700;
          --cor-destaque-hover: #ffc400;
          --cor-texto: #ffffff;
          --cor-texto-secundario: #f5f5f5;
          --cor-erro: #ff6b6b;
          --cor-erro-hover: #ff5252;
          --cor-sucesso: #28a745;
          --cor-input: #f5f5f5;
          --cor-desabilitado: #cccccc;
          --espacamento-padrao: 20px;
          --borda-raio: 8px;
          --transicao: all 0.3s ease;
          --sombra: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--cor-primaria);
          color: var(--cor-texto);
          font-family: 'Arial', sans-serif;
          padding: var(--espacamento-padrao);
          line-height: 1.6;
          min-height: 100vh;
        }

        h1 {
          color: var(--cor-destaque);
          text-align: center;
          margin-bottom: 10px;
          font-size: 2rem;
        }

        .welcome-message {
          text-align: center;
          margin-bottom: 30px;
          color: var(--cor-texto-secundario);
        }

        form {
          background-color: var(--cor-secundaria);
          padding: 30px;
          border-radius: var(--borda-raio);
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          gap: 25px;
          box-shadow: var(--sombra);
        }

        .form-section {
          background-color: var(--cor-terciaria);
          padding: var(--espacamento-padrao);
          border-radius: var(--borda-raio);
          transition: var(--transicao);
        }

        .form-section:focus-within {
          box-shadow: 0 0 0 2px var(--cor-destaque);
        }

        .form-section h2 {
          color: var(--cor-destaque);
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        label {
          font-weight: bold;
          display: block;
          margin-bottom: 8px;
        }

        input, textarea, select {
          width: 100%;
          padding: 12px;
          border-radius: 5px;
          border: 1px solid transparent;
          font-size: 14px;
          text-align: left;
          background-color: var(--cor-input);
          margin-bottom: 15px;
          transition: var(--transicao);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--cor-destaque);
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
        }

        .btn {
          background-color: var(--cor-destaque);
          color: var(--cor-primaria);
          font-weight: bold;
          border: none;
          padding: 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: var(--transicao);
          width: 100%;
          font-size: 16px;
          margin-top: 10px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }

        .btn-enviar:hover {
          background-color: var(--cor-destaque-hover);
          transform: translateY(-2px);
        }

        .btn-enviar:disabled {
          background-color: var(--cor-desabilitado);
          cursor: not-allowed;
          transform: none;
        }

        .option-group {
          margin: 15px 0;
        }

        .option-group label {
          margin-bottom: 10px;
          display: block;
        }

        .option-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 10px;
        }

        .option-option {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        input[type="radio"] {
          accent-color: var(--cor-destaque);
          width: auto;
          margin: 0;
          cursor: pointer;
          transform: scale(1.2);
        }

        .option-option label {
          font-weight: normal;
          margin: 0;
          cursor: pointer;
        }

        textarea.info-adicional {
          min-height: 120px;
          resize: vertical;
        }

        .loading-container, .error-container, .success-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          text-align: center;
          padding: 20px;
        }

        .loading-spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid var(--cor-destaque);
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container h1, .success-container h1 {
          color: var(--cor-destaque);
          margin-bottom: 20px;
        }

        .error-container p {
          margin-bottom: 10px;
          max-width: 600px;
        }

        .success-container {
          background-color: var(--cor-secundaria);
          border-radius: var(--borda-raio);
          padding: 40px;
          max-width: 800px;
          margin: 50px auto;
          box-shadow: var(--sombra);
        }

        .success-container p {
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          form {
            padding: 20px;
          }

          h1 {
            font-size: 1.5rem;
          }

          .option-options {
            flex-direction: column;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          body {
            padding: 10px;
          }

          .form-section {
            padding: 15px;
          }

          input, textarea, select {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
}
