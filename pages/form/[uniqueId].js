import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const { uniqueId } = router.query;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [formInfo, setFormInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formAlreadySubmitted, setFormAlreadySubmitted] = useState(false);
  
  // Estados para controlar a visibilidade das seções
  const [showPessoasRenda, setShowPessoasRenda] = useState(false);
  const [showDependentes, setShowDependentes] = useState(false);
  const [showDeclaracaoIR, setShowDeclaracaoIR] = useState(false);
  const [fluxoCaixaTipo, setFluxoCaixaTipo] = useState('somado');
  const [sabeDadosOutros, setSabeDadosOutros] = useState(false);
  
  // Estados para armazenar os itens dinâmicos
  const [pessoasRenda, setPessoasRenda] = useState([]);
  const [dependentes, setDependentes] = useState([]);
  const [patrimonios, setPatrimonios] = useState([]);
  const [dividas, setDividas] = useState([]);
  
  // Estado para controlar se há mais de uma pessoa com renda
  const [multiplasRendas, setMultiplasRendas] = useState(false);

  // Verificar se o formulário existe e se já foi preenchido
  useEffect(() => {
    if (!uniqueId) return;
    
    async function checkFormStatus() {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/validate?uniqueId=${uniqueId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Formulário não encontrado');
          } else {
            throw new Error(`Erro ao verificar formulário: ${response.status}`);
          }
          return;
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFormInfo(data.data);
          
          // Verificar se o formulário já foi preenchido
          if (data.data.status === 'completed' || data.data.used) {
            setFormAlreadySubmitted(true);
          }
        } else {
          setError(data.message || 'Erro ao verificar formulário');
        }
      } catch (error) {
        console.error('Erro:', error);
        setError('Erro ao verificar formulário. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    checkFormStatus();
  }, [uniqueId]);

  // Função para formatar moeda
  const formatarMoeda = (valor) => {
    if (!valor) return '';
    
    // Remove tudo que não é número
    valor = valor.replace(/\D/g, '');
    
    if (valor === '') return '';
    
    // Converte para número e formata
    valor = (parseFloat(valor) / 100).toFixed(2);
    return 'R$ ' + valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handler para campos de moeda
  const handleMoedaChange = (e) => {
    const input = e.target;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor === '') {
      input.value = '';
      return;
    }
    
    valor = (parseFloat(valor) / 100).toFixed(2);
    input.value = 'R$ ' + valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Função para adicionar pessoa com renda
  const adicionarPessoaRenda = () => {
    const novaPessoa = {
      id: Date.now(),
      nome: '',
      precisaConcordar: '',
      declaraIR: '',
      tipoDeclaracao: '',
      resultadoIR: '',
      planoSaude: '',
      seguroVida: '',
      patrimonioLiquido: ''
    };
    setPessoasRenda([...pessoasRenda, novaPessoa]);
    setMultiplasRendas(true);
  };
  
  // Função para remover pessoa com renda
  const removerPessoaRenda = (id) => {
    setPessoasRenda(pessoasRenda.filter(pessoa => pessoa.id !== id));
    if (pessoasRenda.length <= 1) {
      setMultiplasRendas(false);
    }
  };
  
  // Função para adicionar dependente
  const adicionarDependente = () => {
    const novoDependente = {
      id: Date.now(),
      nome: '',
      idade: '',
      planoSaude: ''
    };
    setDependentes([...dependentes, novoDependente]);
  };
  
  // Função para remover dependente
  const removerDependente = (id) => {
    setDependentes(dependentes.filter(dependente => dependente.id !== id));
  };
  
  // Função para adicionar patrimônio
  const adicionarPatrimonio = () => {
    const novoPatrimonio = {
      id: Date.now(),
      descricao: '',
      valor: '',
      temSeguro: ''
    };
    setPatrimonios([...patrimonios, novoPatrimonio]);
  };
  
  // Função para remover patrimônio
  const removerPatrimonio = (id) => {
    setPatrimonios(patrimonios.filter(patrimonio => patrimonio.id !== id));
  };
  
  // Função para adicionar dívida
  const adicionarDivida = () => {
    const novaDivida = {
      id: Date.now(),
      descricao: '',
      valorTotal: '',
      proprietario: 'principal' // Valor padrão: cliente principal
    };
    setDividas([...dividas, novaDivida]);
  };
  
  // Função para remover dívida
  const removerDivida = (id) => {
    setDividas(dividas.filter(divida => divida.id !== id));
  };
  
  // Função para atualizar o estado de uma pessoa com renda
  const atualizarPessoaRenda = (id, campo, valor) => {
    setPessoasRenda(pessoasRenda.map(pessoa => 
      pessoa.id === id ? { ...pessoa, [campo]: valor } : pessoa
    ));
  };
  
  // Função para atualizar o estado de um dependente
  const atualizarDependente = (id, campo, valor) => {
    setDependentes(dependentes.map(dependente => 
      dependente.id === id ? { ...dependente, [campo]: valor } : dependente
    ));
  };
  
  // Função para atualizar o estado de um patrimônio
  const atualizarPatrimonio = (id, campo, valor) => {
    setPatrimonios(patrimonios.map(patrimonio => 
      patrimonio.id === id ? { ...patrimonio, [campo]: valor } : patrimonio
    ));
  };
  
  // Função para atualizar o estado de uma dívida
  const atualizarDivida = (id, campo, valor) => {
    setDividas(dividas.map(divida => 
      divida.id === id ? { ...divida, [campo]: valor } : divida
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Coletar todos os dados do formulário
    const formElements = e.target.elements;
    const formData = {
      dadosPessoais: {
        nome: formElements.nome.value,
        email: formElements.email.value,
        telefone: formElements.telefone.value,
        estadoCivil: formElements.estadoCivil.value,
        profissao: formElements.profissao.value,
        rendaMensal: formElements.rendaMensal.value
      },
      pessoasRenda: pessoasRenda,
      dependentes: dependentes,
      patrimonios: patrimonios,
      dividas: dividas,
      objetivos: {
        curto: formElements.objetivoCurto.value,
        medio: formElements.objetivoMedio.value,
        longo: formElements.objetivoLongo.value
      },
      observacoes: formElements.observacoes.value
    };
    
    setFormData(formData);
    
    try {
      // Enviar dados para a API
      const response = await fetch('/api/submissions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formInfo._id,
          formData: formData
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubmitted(true);
        } else {
          alert('Erro ao enviar formulário: ' + (data.message || 'Erro desconhecido'));
        }
      } else {
        alert('Erro ao enviar formulário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  };

  // Configurar eventos para campos de moeda após a renderização
  useEffect(() => {
    if (!uniqueId) return;
    
    const moedaInputs = document.querySelectorAll('.moeda');
    moedaInputs.forEach(input => {
      input.addEventListener('input', handleMoedaChange);
    });
    
    return () => {
      moedaInputs.forEach(input => {
        input.removeEventListener('input', handleMoedaChange);
      });
    };
  }, [uniqueId]);
  
  // Atualizar o estado de múltiplas rendas quando as pessoas com renda mudam
  useEffect(() => {
    setMultiplasRendas(pessoasRenda.length > 0);
  }, [pessoasRenda]);

  if (loading) {
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
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#002d26', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        flexDirection: 'column'
      }}>
        <h1 style={{ color: '#ffd700', marginBottom: '20px' }}>Erro</h1>
        <p style={{ marginBottom: '20px' }}>{error}</p>
      </div>
    );
  }

  if (formAlreadySubmitted) {
    return (
      <div style={{ 
        backgroundColor: '#002d26', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        flexDirection: 'column'
      }}>
        <h1 style={{ color: '#ffd700', marginBottom: '20px' }}>Formulário já preenchido</h1>
        <p style={{ marginBottom: '20px' }}>Este formulário já foi preenchido anteriormente.</p>
        <p>Entre em contato com o administrador para mais informações.</p>
      </div>
    );
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
    <>
      <Head>
        <title>Formulário de Atendimento Financeiro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
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
          margin-bottom: 30px;
          font-size: 2rem;
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

        input[type="text"].moeda {
          text-align: right;
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

        .btn-enviar:hover, .btn-adicionar:hover {
          background-color: var(--cor-destaque-hover);
          transform: translateY(-2px);
        }

        .btn-enviar:disabled {
          background-color: var(--cor-desabilitado);
          cursor: not-allowed;
          transform: none;
        }

        .btn-adicionar {
          margin-top: 20px;
        }

        .pessoa-item, .dependente-item, .patrimonio-item, .divida-item {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 25px;
          background-color: var(--cor-quaternaria);
          padding: var(--espacamento-padrao);
          border-radius: var(--borda-raio);
          position: relative;
          transition: var(--transicao);
        }

        .patrimonio-row {
          display: grid;
          gap: 15px;
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

        .delete-btn {
          background-color: var(--cor-erro);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: var(--transicao);
          width: auto;
          margin-top: 10px;
          font-weight: bold;
          position: absolute;
          right: 20px;
          top: 20px;
        }

        .delete-btn:hover {
          background-color: var(--cor-erro-hover);
        }

        .error-message {
          color: var(--cor-erro);
          font-size: 13px;
          margin-top: -10px;
          margin-bottom: 15px;
          display: none;
        }

        input:invalid, textarea:invalid {
          border: 2px solid var(--cor-erro);
        }

        .form-group {
          margin-bottom: 15px;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
        }

        .success-message {
          background-color: var(--cor-sucesso);
          color: white;
          padding: 15px;
          border-radius: var(--borda-raio);
          margin-top: 20px;
          text-align: center;
          display: none;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pessoa-item, .dependente-item, .patrimonio-item, .divida-item {
          animation: fadeIn 0.3s ease-out;
        }

        .tooltip {
          position: relative;
          display: inline-block;
          margin-left: 8px;
          cursor: help;
        }

        .tooltip-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background-color: var(--cor-destaque);
          color: var(--cor-primaria);
          border-radius: 50%;
          font-size: 12px;
          font-weight: bold;
        }

        .tooltip-text {
          visibility: hidden;
          width: 200px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 10px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -100px;
          opacity: 0;
          transition: opacity 0.3s;
          font-weight: normal;
          font-size: 12px;
          line-height: 1.4;
        }

        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        
        .pessoa-fluxo-caixa {
          margin-top: 15px;
          padding: 15px;
          background-color: var(--cor-quaternaria);
          border-radius: var(--borda-raio);
        }
        
        .pessoa-fluxo-caixa h3 {
          color: var(--cor-destaque);
          margin-bottom: 10px;
          font-size: 1rem;
        }
        
        textarea.info-adicional {
          min-height: 120px;
          resize: vertical;
        }
        
        .pessoa-info {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid var(--cor-quaternaria);
        }
        
        .pessoa-info h3 {
          color: var(--cor-destaque);
          margin-bottom: 15px;
          font-size: 1.1rem;
        }
        
        select {
          background-color: var(--cor-input);
          color: #333;
          padding: 10px;
          border-radius: 5px;
          border: none;
          font-size: 14px;
          width: 100%;
          margin-bottom: 15px;
        }
        
        select:focus {
          outline: none;
          border-color: var(--cor-destaque);
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
        }
      `}</style>
      
      <h1>Formulário de Atendimento Financeiro</h1>
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
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Digite seu email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefone">Telefone: <span aria-hidden="true">*</span></label>
            <input 
              type="tel" 
              id="telefone" 
              name="telefone" 
              required 
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estadoCivil">Estado Civil: <span aria-hidden="true">*</span></label>
            <select id="estadoCivil" name="estadoCivil" required>
              <option value="">Selecione</option>
              <option value="solteiro">Solteiro(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="uniao_estavel">União Estável</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viuvo">Viúvo(a)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="profissao">Profissão: <span aria-hidden="true">*</span></label>
            <input 
              type="text" 
              id="profissao" 
              name="profissao" 
              required 
              placeholder="Digite sua profissão"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rendaMensal">Renda Mensal: <span aria-hidden="true">*</span></label>
            <input 
              type="text" 
              id="rendaMensal" 
              name="rendaMensal" 
              className="moeda" 
              required 
              placeholder="R$ 0,00"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Outras Pessoas com Renda</h2>
          <p>Adicione informações sobre outras pessoas que contribuem com a renda familiar.</p>
          
          {pessoasRenda.map((pessoa) => (
            <div key={pessoa.id} className="pessoa-item">
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => removerPessoaRenda(pessoa.id)}
              >
                Remover
              </button>
              
              <div className="form-group">
                <label htmlFor={`pessoa-nome-${pessoa.id}`}>Nome:</label>
                <input 
                  type="text" 
                  id={`pessoa-nome-${pessoa.id}`} 
                  value={pessoa.nome}
                  onChange={(e) => atualizarPessoaRenda(pessoa.id, 'nome', e.target.value)}
                  placeholder="Nome da pessoa"
                />
              </div>
              
              <div className="option-group">
                <label>Precisa concordar com o planejamento financeiro?</label>
                <div className="option-options">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-concordar-sim-${pessoa.id}`} 
                      name={`pessoa-concordar-${pessoa.id}`} 
                      value="sim"
                      checked={pessoa.precisaConcordar === 'sim'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'precisaConcordar', 'sim')}
                    />
                    <label htmlFor={`pessoa-concordar-sim-${pessoa.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-concordar-nao-${pessoa.id}`} 
                      name={`pessoa-concordar-${pessoa.id}`} 
                      value="nao"
                      checked={pessoa.precisaConcordar === 'nao'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'precisaConcordar', 'nao')}
                    />
                    <label htmlFor={`pessoa-concordar-nao-${pessoa.id}`}>Não</label>
                  </div>
                </div>
              </div>
              
              <div className="option-group">
                <label>Declara Imposto de Renda?</label>
                <div className="option-options">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-ir-sim-${pessoa.id}`} 
                      name={`pessoa-ir-${pessoa.id}`} 
                      value="sim"
                      checked={pessoa.declaraIR === 'sim'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'declaraIR', 'sim')}
                    />
                    <label htmlFor={`pessoa-ir-sim-${pessoa.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-ir-nao-${pessoa.id}`} 
                      name={`pessoa-ir-${pessoa.id}`} 
                      value="nao"
                      checked={pessoa.declaraIR === 'nao'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'declaraIR', 'nao')}
                    />
                    <label htmlFor={`pessoa-ir-nao-${pessoa.id}`}>Não</label>
                  </div>
                </div>
              </div>
              
              {pessoa.declaraIR === 'sim' && (
                <>
                  <div className="form-group">
                    <label htmlFor={`pessoa-tipo-declaracao-${pessoa.id}`}>Tipo de Declaração:</label>
                    <select 
                      id={`pessoa-tipo-declaracao-${pessoa.id}`}
                      value={pessoa.tipoDeclaracao}
                      onChange={(e) => atualizarPessoaRenda(pessoa.id, 'tipoDeclaracao', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="simplificada">Simplificada</option>
                      <option value="completa">Completa</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`pessoa-resultado-ir-${pessoa.id}`}>Resultado da última declaração:</label>
                    <select 
                      id={`pessoa-resultado-ir-${pessoa.id}`}
                      value={pessoa.resultadoIR}
                      onChange={(e) => atualizarPessoaRenda(pessoa.id, 'resultadoIR', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="imposto_pagar">Imposto a Pagar</option>
                      <option value="restituicao">Restituição</option>
                      <option value="zero">Zero (nem pagou, nem recebeu)</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="option-group">
                <label>Possui plano de saúde?</label>
                <div className="option-options">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-plano-saude-sim-${pessoa.id}`} 
                      name={`pessoa-plano-saude-${pessoa.id}`} 
                      value="sim"
                      checked={pessoa.planoSaude === 'sim'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'planoSaude', 'sim')}
                    />
                    <label htmlFor={`pessoa-plano-saude-sim-${pessoa.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-plano-saude-nao-${pessoa.id}`} 
                      name={`pessoa-plano-saude-${pessoa.id}`} 
                      value="nao"
                      checked={pessoa.planoSaude === 'nao'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'planoSaude', 'nao')}
                    />
                    <label htmlFor={`pessoa-plano-saude-nao-${pessoa.id}`}>Não</label>
                  </div>
                </div>
              </div>
              
              <div className="option-group">
                <label>Possui seguro de vida?</label>
                <div className="option-options">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-seguro-vida-sim-${pessoa.id}`} 
                      name={`pessoa-seguro-vida-${pessoa.id}`} 
                      value="sim"
                      checked={pessoa.seguroVida === 'sim'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'seguroVida', 'sim')}
                    />
                    <label htmlFor={`pessoa-seguro-vida-sim-${pessoa.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`pessoa-seguro-vida-nao-${pessoa.id}`} 
                      name={`pessoa-seguro-vida-${pessoa.id}`} 
                      value="nao"
                      checked={pessoa.seguroVida === 'nao'}
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'seguroVida', 'nao')}
                    />
                    <label htmlFor={`pessoa-seguro-vida-nao-${pessoa.id}`}>Não</label>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`pessoa-patrimonio-liquido-${pessoa.id}`}>Patrimônio Líquido Estimado:</label>
                <input 
                  type="text" 
                  id={`pessoa-patrimonio-liquido-${pessoa.id}`} 
                  className="moeda"
                  value={pessoa.patrimonioLiquido}
                  onChange={(e) => {
                    handleMoedaChange(e);
                    atualizarPessoaRenda(pessoa.id, 'patrimonioLiquido', e.target.value);
                  }}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn btn-adicionar" 
            onClick={adicionarPessoaRenda}
          >
            + Adicionar Pessoa com Renda
          </button>
        </div>
        
        <div className="form-section">
          <h2>Dependentes</h2>
          <p>Adicione informações sobre seus dependentes.</p>
          
          {dependentes.map((dependente) => (
            <div key={dependente.id} className="dependente-item">
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => removerDependente(dependente.id)}
              >
                Remover
              </button>
              
              <div className="form-group">
                <label htmlFor={`dependente-nome-${dependente.id}`}>Nome:</label>
                <input 
                  type="text" 
                  id={`dependente-nome-${dependente.id}`} 
                  value={dependente.nome}
                  onChange={(e) => atualizarDependente(dependente.id, 'nome', e.target.value)}
                  placeholder="Nome do dependente"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`dependente-idade-${dependente.id}`}>Idade:</label>
                <input 
                  type="number" 
                  id={`dependente-idade-${dependente.id}`} 
                  value={dependente.idade}
                  onChange={(e) => atualizarDependente(dependente.id, 'idade', e.target.value)}
                  placeholder="Idade"
                  min="0"
                  max="120"
                />
              </div>
              
              <div className="option-group">
                <label>Possui plano de saúde?</label>
                <div className="option-options">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`dependente-plano-saude-sim-${dependente.id}`} 
                      name={`dependente-plano-saude-${dependente.id}`} 
                      value="sim"
                      checked={dependente.planoSaude === 'sim'}
                      onChange={() => atualizarDependente(dependente.id, 'planoSaude', 'sim')}
                    />
                    <label htmlFor={`dependente-plano-saude-sim-${dependente.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`dependente-plano-saude-nao-${dependente.id}`} 
                      name={`dependente-plano-saude-${dependente.id}`} 
                      value="nao"
                      checked={dependente.planoSaude === 'nao'}
                      onChange={() => atualizarDependente(dependente.id, 'planoSaude', 'nao')}
                    />
                    <label htmlFor={`dependente-plano-saude-nao-${dependente.id}`}>Não</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn btn-adicionar" 
            onClick={adicionarDependente}
          >
            + Adicionar Dependente
          </button>
        </div>
        
        <div className="form-section">
          <h2>Patrimônios</h2>
          <p>Adicione informações sobre seus principais bens e patrimônios.</p>
          
          {patrimonios.map((patrimonio) => (
            <div key={patrimonio.id} className="patrimonio-item">
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => removerPatrimonio(patrimonio.id)}
              >
                Remover
              </button>
              
              <div className="form-group">
                <label htmlFor={`patrimonio-descricao-${patrimonio.id}`}>Descrição:</label>
                <input 
                  type="text" 
                  id={`patrimonio-descricao-${patrimonio.id}`} 
                  value={patrimonio.descricao}
                  onChange={(e) => atualizarPatrimonio(patrimonio.id, 'descricao', e.target.value)}
                  placeholder="Ex: Imóvel, Veículo, Investimentos"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`patrimonio-valor-${patrimonio.id}`}>Valor Estimado:</label>
                <input 
                  type="text" 
                  id={`patrimonio-valor-${patrimonio.id}`} 
                  className="moeda"
                  value={patrimonio.valor}
                  onChange={(e) => {
                    handleMoedaChange(e);
                    atualizarPatrimonio(patrimonio.id, 'valor', e.target.value);
                  }}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="option-group">
                <label>Possui seguro?</label>
                <div className="option-options">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`patrimonio-seguro-sim-${patrimonio.id}`} 
                      name={`patrimonio-seguro-${patrimonio.id}`} 
                      value="sim"
                      checked={patrimonio.temSeguro === 'sim'}
                      onChange={() => atualizarPatrimonio(patrimonio.id, 'temSeguro', 'sim')}
                    />
                    <label htmlFor={`patrimonio-seguro-sim-${patrimonio.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`patrimonio-seguro-nao-${patrimonio.id}`} 
                      name={`patrimonio-seguro-${patrimonio.id}`} 
                      value="nao"
                      checked={patrimonio.temSeguro === 'nao'}
                      onChange={() => atualizarPatrimonio(patrimonio.id, 'temSeguro', 'nao')}
                    />
                    <label htmlFor={`patrimonio-seguro-nao-${patrimonio.id}`}>Não</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn btn-adicionar" 
            onClick={adicionarPatrimonio}
          >
            + Adicionar Patrimônio
          </button>
        </div>
        
        <div className="form-section">
          <h2>Dívidas</h2>
          <p>Adicione informações sobre suas principais dívidas.</p>
          
          {dividas.map((divida) => (
            <div key={divida.id} className="divida-item">
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => removerDivida(divida.id)}
              >
                Remover
              </button>
              
              <div className="form-group">
                <label htmlFor={`divida-descricao-${divida.id}`}>Descrição:</label>
                <input 
                  type="text" 
                  id={`divida-descricao-${divida.id}`} 
                  value={divida.descricao}
                  onChange={(e) => atualizarDivida(divida.id, 'descricao', e.target.value)}
                  placeholder="Ex: Financiamento, Empréstimo, Cartão de Crédito"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`divida-valor-${divida.id}`}>Valor Total:</label>
                <input 
                  type="text" 
                  id={`divida-valor-${divida.id}`} 
                  className="moeda"
                  value={divida.valorTotal}
                  onChange={(e) => {
                    handleMoedaChange(e);
                    atualizarDivida(divida.id, 'valorTotal', e.target.value);
                  }}
                  placeholder="R$ 0,00"
                />
              </div>
              
              {multiplasRendas && (
                <div className="form-group">
                  <label htmlFor={`divida-proprietario-${divida.id}`}>Proprietário da Dívida:</label>
                  <select 
                    id={`divida-proprietario-${divida.id}`}
                    value={divida.proprietario}
                    onChange={(e) => atualizarDivida(divida.id, 'proprietario', e.target.value)}
                  >
                    <option value="principal">Cliente Principal</option>
                    {pessoasRenda.map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome || `Pessoa ${pessoa.id}`}
                      </option>
                    ))}
                    <option value="conjunto">Em Conjunto</option>
                  </select>
                </div>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn btn-adicionar" 
            onClick={adicionarDivida}
          >
            + Adicionar Dívida
          </button>
        </div>
        
        <div className="form-section">
          <h2>Objetivos Financeiros</h2>
          
          <div className="form-group">
            <label htmlFor="objetivoCurto">Objetivos de Curto Prazo (até 1 ano):</label>
            <textarea 
              id="objetivoCurto" 
              name="objetivoCurto" 
              placeholder="Descreva seus objetivos financeiros de curto prazo"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="objetivoMedio">Objetivos de Médio Prazo (1 a 5 anos):</label>
            <textarea 
              id="objetivoMedio" 
              name="objetivoMedio" 
              placeholder="Descreva seus objetivos financeiros de médio prazo"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="objetivoLongo">Objetivos de Longo Prazo (mais de 5 anos):</label>
            <textarea 
              id="objetivoLongo" 
              name="objetivoLongo" 
              placeholder="Descreva seus objetivos financeiros de longo prazo"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Informações Adicionais</h2>
          
          <div className="form-group">
            <label htmlFor="observacoes">Observações ou informações adicionais:</label>
            <textarea 
              id="observacoes" 
              name="observacoes" 
              className="info-adicional"
              placeholder="Compartilhe qualquer informação adicional que considere relevante para o seu planejamento financeiro"
            ></textarea>
          </div>
        </div>
        
        <button type="submit" className="btn btn-enviar">Enviar Formulário</button>
      </form>
    </>
  );
}
