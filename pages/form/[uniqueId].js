import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const { uniqueId } = router.query;
  const [submitted, setSubmitted] = useState(false);
  
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
    setSubmitted(true);
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
            <input type="text" id="nome" name="nome" required aria-required="true" aria-describedby="nome-error" />
            <div className="error-message" id="nome-error" role="alert">Por favor, preencha seu nome completo</div>
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
                  onChange={() => setShowPessoasRenda(false)}
                />
                <label htmlFor="unicaRendaSim">Sim</label>
              </div>
              <div className="option-option">
                <input 
                  type="radio" 
                  id="unicaRendaNao" 
                  name="unicaRenda" 
                  value="Não" 
                  onChange={() => setShowPessoasRenda(true)}
                />
                <label htmlFor="unicaRendaNao">Não</label>
              </div>
            </div>
          </div>
          
          {showPessoasRenda && (
            <div id="listaPessoasRenda">
              <label>Adicione as outras pessoas que têm renda na sua casa:</label>
              <div id="pessoasRendaContainer">
                {pessoasRenda.map(pessoa => (
                  <div key={pessoa.id} className="pessoa-item">
                    <div className="patrimonio-row">
                      <label htmlFor={`nomePessoaRenda_${pessoa.id}`}>Nome completo:</label>
                      <input 
                        type="text" 
                        id={`nomePessoaRenda_${pessoa.id}`} 
                        name={`nomePessoaRenda_${pessoa.id}`} 
                        placeholder="Nome completo"
                        onChange={(e) => atualizarPessoaRenda(pessoa.id, 'nome', e.target.value)}
                      />
                    </div>
                    
                    <div className="option-group">
                      <label id={`label-precisa-concordar-${pessoa.id}`}>
                        Você precisa que essa pessoa concorde com suas decisões financeiras?
                      </label>
                      <div className="option-options" role="radiogroup" aria-labelledby={`label-precisa-concordar-${pessoa.id}`}>
                        <div className="option-option">
                          <input 
                            type="radio" 
                            id={`precisaConcordarSim_${pessoa.id}`} 
                            name={`precisaConcordar${pessoa.id}`} 
                            value="Sim"
                            onChange={() => atualizarPessoaRenda(pessoa.id, 'precisaConcordar', 'Sim')}
                          />
                          <label htmlFor={`precisaConcordarSim_${pessoa.id}`}>Sim</label>
                        </div>
                        <div className="option-option">
                          <input 
                            type="radio" 
                            id={`precisaConcordarNao_${pessoa.id}`} 
                            name={`precisaConcordar${pessoa.id}`} 
                            value="Não"
                            onChange={() => atualizarPessoaRenda(pessoa.id, 'precisaConcordar', 'Não')}
                          />
                          <label htmlFor={`precisaConcordarNao_${pessoa.id}`}>Não</label>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      className="delete-btn" 
                      onClick={() => removerPessoaRenda(pessoa.id)} 
                      aria-label="Excluir pessoa"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                className="btn btn-adicionar" 
                onClick={adicionarPessoaRenda}
              >
                <span className="sr-only">Adicionar</span> Adicionar Pessoa
              </button>
            </div>
          )}
        </div>

        {/* Seção de dependentes */}
        <div className="form-section" id="secaoDependentes">
          <h2>Dependentes</h2>
          <div className="option-group">
            <label id="label-tem-dependentes">Você possui dependentes?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-tem-dependentes">
              <div className="option-option">
                <input 
                  type="radio" 
                  id="temDependentesSim" 
                  name="temDependentes" 
                  value="Sim" 
                  onChange={() => setShowDependentes(true)}
                />
                <label htmlFor="temDependentesSim">Sim</label>
              </div>
              <div className="option-option">
                <input 
                  type="radio" 
                  id="temDependentesNao" 
                  name="temDependentes" 
                  value="Não" 
                  onChange={() => setShowDependentes(false)}
                />
                <label htmlFor="temDependentesNao">Não</label>
              </div>
            </div>
          </div>
          
          {showDependentes && (
            <div id="listaDependentes">
              <label>Adicione seus dependentes:</label>
              <div id="dependentesContainer">
                {dependentes.map(dependente => (
                  <div key={dependente.id} className="dependente-item">
                    <div className="patrimonio-row">
                      <label htmlFor={`nomeDependente_${dependente.id}`}>Nome completo:</label>
                      <input 
                        type="text" 
                        id={`nomeDependente_${dependente.id}`} 
                        name={`nomeDependente_${dependente.id}`} 
                        placeholder="Nome completo"
                        onChange={(e) => atualizarDependente(dependente.id, 'nome', e.target.value)}
                      />
                    </div>
                    
                    <div className="patrimonio-row">
                      <label htmlFor={`idadeDependente_${dependente.id}`}>Idade:</label>
                      <input 
                        type="number" 
                        id={`idadeDependente_${dependente.id}`} 
                        name={`idadeDependente_${dependente.id}`} 
                        min="0" 
                        max="120"
                        onChange={(e) => atualizarDependente(dependente.id, 'idade', e.target.value)}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="delete-btn" 
                      onClick={() => removerDependente(dependente.id)} 
                      aria-label="Excluir dependente"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                className="btn btn-adicionar" 
                onClick={adicionarDependente}
              >
                <span className="sr-only">Adicionar</span> Adicionar Dependente
              </button>
            </div>
          )}
        </div>

        {/* Seção de patrimônios físicos */}
        <div className="form-section">
          <h2>Patrimônios Físicos</h2>
          <label>Adicione seus patrimônios físicos:</label>
          <div id="listaPatrimonios">
            {patrimonios.map(patrimonio => (
              <div key={patrimonio.id} className="patrimonio-item">
                <div className="patrimonio-row">
                  <label htmlFor={`descricaoPatrimonio_${patrimonio.id}`}>Descrição do patrimônio:</label>
                  <input 
                    type="text" 
                    id={`descricaoPatrimonio_${patrimonio.id}`} 
                    name={`descricaoPatrimonio_${patrimonio.id}`} 
                    placeholder="Ex: Imóvel, Veículo, etc."
                    onChange={(e) => atualizarPatrimonio(patrimonio.id, 'descricao', e.target.value)}
                  />
                </div>
                
                <div className="patrimonio-row">
                  <label htmlFor={`valorPatrimonio_${patrimonio.id}`}>Valor estimado:</label>
                  <input 
                    type="text" 
                    id={`valorPatrimonio_${patrimonio.id}`} 
                    name={`valorPatrimonio_${patrimonio.id}`} 
                    className="moeda" 
                    placeholder="R$ 0,00"
                    onChange={handleMoedaChange}
                    onBlur={(e) => atualizarPatrimonio(patrimonio.id, 'valor', e.target.value)}
                  />
                </div>
                
                {/* Campo para informar se o patrimônio tem seguro */}
                <div className="option-group">
                  <label id={`label-tem-seguro-patrimonio-${patrimonio.id}`}>
                    Este patrimônio possui seguro?
                  </label>
                  <div className="option-options" role="radiogroup" aria-labelledby={`label-tem-seguro-patrimonio-${patrimonio.id}`}>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`temSeguroPatrimonioSim_${patrimonio.id}`} 
                        name={`temSeguroPatrimonio_${patrimonio.id}`} 
                        value="Sim"
                        onChange={() => atualizarPatrimonio(patrimonio.id, 'temSeguro', 'Sim')}
                      />
                      <label htmlFor={`temSeguroPatrimonioSim_${patrimonio.id}`}>Sim</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`temSeguroPatrimonioNao_${patrimonio.id}`} 
                        name={`temSeguroPatrimonio_${patrimonio.id}`} 
                        value="Não"
                        onChange={() => atualizarPatrimonio(patrimonio.id, 'temSeguro', 'Não')}
                      />
                      <label htmlFor={`temSeguroPatrimonioNao_${patrimonio.id}`}>Não</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`temSeguroPatrimonioNaoSei_${patrimonio.id}`} 
                        name={`temSeguroPatrimonio_${patrimonio.id}`} 
                        value="Não sei"
                        onChange={() => atualizarPatrimonio(patrimonio.id, 'temSeguro', 'Não sei')}
                      />
                      <label htmlFor={`temSeguroPatrimonioNaoSei_${patrimonio.id}`}>Não sei</label>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="delete-btn" 
                  onClick={() => removerPatrimonio(patrimonio.id)} 
                  aria-label="Excluir patrimônio"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className="btn btn-adicionar" 
            onClick={adicionarPatrimonio}
          >
            <span className="sr-only">Adicionar</span> Adicionar Patrimônio
          </button>
        </div>

        {/* Seção de seguros e planos */}
        <div className="form-section">
          <h2>Seguros e Planos</h2>
          
          {/* Plano de saúde do cliente principal */}
          <div className="option-group">
            <label id="label-plano-saude">Você possui plano de saúde?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-plano-saude">
              <div className="option-option">
                <input type="radio" id="planoSaudeSim" name="planoSaude" value="Sim" />
                <label htmlFor="planoSaudeSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="planoSaudeNao" name="planoSaude" value="Não" />
                <label htmlFor="planoSaudeNao">Não</label>
              </div>
              <div className="option-option">
                <input type="radio" id="planoSaudeNaoSei" name="planoSaude" value="Não sei" />
                <label htmlFor="planoSaudeNaoSei">Não sei</label>
              </div>
            </div>
          </div>

          {/* Planos de saúde das outras pessoas com renda */}
          {pessoasRenda.length > 0 && (
            <div className="option-group">
              {pessoasRenda.map(pessoa => (
                <div key={`plano-saude-${pessoa.id}`}>
                  <label id={`label-plano-saude-pessoa-${pessoa.id}`}>
                    {pessoa.nome || 'Esta pessoa'} possui plano de saúde?
                  </label>
                  <div className="option-options" role="radiogroup" aria-labelledby={`label-plano-saude-pessoa-${pessoa.id}`}>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`planoSaudePessoaSim_${pessoa.id}`} 
                        name={`planoSaudePessoa_${pessoa.id}`} 
                        value="Sim"
                        onChange={() => atualizarPessoaRenda(pessoa.id, 'planoSaude', 'Sim')}
                      />
                      <label htmlFor={`planoSaudePessoaSim_${pessoa.id}`}>Sim</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`planoSaudePessoaNao_${pessoa.id}`} 
                        name={`planoSaudePessoa_${pessoa.id}`} 
                        value="Não"
                        onChange={() => atualizarPessoaRenda(pessoa.id, 'planoSaude', 'Não')}
                      />
                      <label htmlFor={`planoSaudePessoaNao_${pessoa.id}`}>Não</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`planoSaudePessoaNaoSei_${pessoa.id}`} 
                        name={`planoSaudePessoa_${pessoa.id}`} 
                        value="Não sei"
                        onChange={() => atualizarPessoaRenda(pessoa.id, 'planoSaude', 'Não sei')}
                      />
                      <label htmlFor={`planoSaudePessoaNaoSei_${pessoa.id}`}>Não sei</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Planos de saúde dos dependentes */}
          {dependentes.length > 0 && (
            <div className="option-group">
              {dependentes.map(dependente => (
                <div key={`plano-saude-dependente-${dependente.id}`}>
                  <label id={`label-plano-saude-dependente-${dependente.id}`}>
                    {dependente.nome || 'Este dependente'} possui plano de saúde?
                  </label>
                  <div className="option-options" role="radiogroup" aria-labelledby={`label-plano-saude-dependente-${dependente.id}`}>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`planoSaudeDependenteSim_${dependente.id}`} 
                        name={`planoSaudeDependente_${dependente.id}`} 
                        value="Sim"
                        onChange={() => atualizarDependente(dependente.id, 'planoSaude', 'Sim')}
                      />
                      <label htmlFor={`planoSaudeDependenteSim_${dependente.id}`}>Sim</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`planoSaudeDependenteNao_${dependente.id}`} 
                        name={`planoSaudeDependente_${dependente.id}`} 
                        value="Não"
                        onChange={() => atualizarDependente(dependente.id, 'planoSaude', 'Não')}
                      />
                      <label htmlFor={`planoSaudeDependenteNao_${dependente.id}`}>Não</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`planoSaudeDependenteNaoSei_${dependente.id}`} 
                        name={`planoSaudeDependente_${dependente.id}`} 
                        value="Não sei"
                        onChange={() => atualizarDependente(dependente.id, 'planoSaude', 'Não sei')}
                      />
                      <label htmlFor={`planoSaudeDependenteNaoSei_${dependente.id}`}>Não sei</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Seguro de vida do cliente principal */}
          <div className="option-group">
            <label id="label-seguro-vida">Você possui seguro de vida?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-seguro-vida">
              <div className="option-option">
                <input type="radio" id="seguroVidaSim" name="seguroVida" value="Sim" />
                <label htmlFor="seguroVidaSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="seguroVidaNao" name="seguroVida" value="Não" />
                <label htmlFor="seguroVidaNao">Não</label>
              </div>
              <div className="option-option">
                <input type="radio" id="seguroVidaNaoSei" name="seguroVida" value="Não sei" />
                <label htmlFor="seguroVidaNaoSei">Não sei</label>
              </div>
            </div>
          </div>

          {/* Seguros de vida das outras pessoas com renda */}
          {pessoasRenda.length > 0 && (
            <div className="option-group">
              {pessoasRenda.map(pessoa => (
                <div key={`seguro-vida-${pessoa.id}`}>
                  <label id={`label-seguro-vida-pessoa-${pessoa.id}`}>
                    {pessoa.nome || 'Esta pessoa'} possui seguro de vida?
                  </label>
                  <div className="option-options" role="radiogroup" aria-labelledby={`label-seguro-vida-pessoa-${pessoa.id}`}>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`seguroVidaPessoaSim_${pessoa.id}`} 
                        name={`seguroVidaPessoa_${pessoa.id}`} 
                        value="Sim"
                        onChange={() => atualizarPessoaRenda(pessoa.id, 'seguroVida', 'Sim')}
                      />
                      <label htmlFor={`seguroVidaPessoaSim_${pessoa.id}`}>Sim</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`seguroVidaPessoaNao_${pessoa.id}`} 
                        name={`seguroVidaPessoa_${pessoa.id}`} 
                        value="Não"
                        onChange={() => atualizarPessoaRenda(pessoa.id, 'seguroVida', 'Não')}
                      />
                      <label htmlFor={`seguroVidaPessoaNao_${pessoa.id}`}>Não</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id={`seguroVidaPessoaNaoSei_${pessoa.id}`} 
                        name={`seguroVidaPessoa_${pessoa.id}`} 
                        value="Não sei"
                        onChange={() => atualizarPessoaRenda(pessoa.id, 'seguroVida', 'Não sei')}
                      />
                      <label htmlFor={`seguroVidaPessoaNaoSei_${pessoa.id}`}>Não sei</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de patrimônio líquido */}
        <div className="form-section">
          <h2>Patrimônio Líquido</h2>
          
          {/* Patrimônio líquido do cliente principal */}
          <div className="form-group">
            <label htmlFor="patrimonioLiquido">
              Seu patrimônio líquido:
              <div className="tooltip">
                <span className="tooltip-icon">?</span>
                <span className="tooltip-text">Soma de todos os seus bens menos suas dívidas</span>
              </div>
            </label>
            <input 
              type="text" 
              id="patrimonioLiquido" 
              name="patrimonioLiquido" 
              className="moeda" 
              placeholder="R$ 0,00" 
              onChange={handleMoedaChange}
            />
          </div>
          
          {/* Patrimônio líquido das outras pessoas com renda */}
          {pessoasRenda.map(pessoa => (
            <div key={`patrimonio-liquido-${pessoa.id}`} className="form-group">
              <label htmlFor={`patrimonioLiquidoPessoa_${pessoa.id}`}>
                Patrimônio líquido de {pessoa.nome || 'esta pessoa'}:
                <div className="tooltip">
                  <span className="tooltip-icon">?</span>
                  <span className="tooltip-text">Soma de todos os bens menos as dívidas</span>
                </div>
              </label>
              <input 
                type="text" 
                id={`patrimonioLiquidoPessoa_${pessoa.id}`} 
                name={`patrimonioLiquidoPessoa_${pessoa.id}`} 
                className="moeda" 
                placeholder="R$ 0,00" 
                onChange={handleMoedaChange}
                onBlur={(e) => atualizarPessoaRenda(pessoa.id, 'patrimonioLiquido', e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Seção de imposto de renda */}
        <div className="form-section">
          <h2>Imposto de Renda</h2>
          
          {/* Perguntas do cliente principal */}
          <div className="option-group">
            <label id="label-declara-ir">Você declara imposto de renda?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-declara-ir">
              <div className="option-option">
                <input 
                  type="radio" 
                  id="declaraIRSim" 
                  name="declaraIR" 
                  value="Sim" 
                  onChange={() => setShowDeclaracaoIR(true)}
                />
                <label htmlFor="declaraIRSim">Sim</label>
              </div>
              <div className="option-option">
                <input 
                  type="radio" 
                  id="declaraIRNao" 
                  name="declaraIR" 
                  value="Não" 
                  onChange={() => setShowDeclaracaoIR(false)}
                />
                <label htmlFor="declaraIRNao">Não</label>
              </div>
            </div>
          </div>

          {showDeclaracaoIR && (
            <div id="declaracaoIRCliente">
              <div className="option-group">
                <label id="label-tipo-declaracao">Se sim, qual o tipo da sua declaração?</label>
                <div className="option-options" role="radiogroup" aria-labelledby="label-tipo-declaracao">
                  <div className="option-option">
                    <input type="radio" id="tipoCompleta" name="tipoDeclaracao" value="Completa" />
                    <label htmlFor="tipoCompleta">Completa</label>
                  </div>
                  <div className="option-option">
                    <input type="radio" id="tipoSimplificada" name="tipoDeclaracao" value="Simplificada" />
                    <label htmlFor="tipoSimplificada">Simplificada</label>
                  </div>
                  <div className="option-option">
                    <input type="radio" id="tipoNaoSei" name="tipoDeclaracao" value="Não sei" />
                    <label htmlFor="tipoNaoSei">Não sei</label>
                  </div>
                </div>
              </div>

              <div className="option-group">
                <label id="label-resultado-ir">Resultado do seu IR:</label>
                <div className="option-options" role="radiogroup" aria-labelledby="label-resultado-ir">
                  <div className="option-option">
                    <input type="radio" id="resultadoIRRestitui" name="resultadoIR" value="Restitui" />
                    <label htmlFor="resultadoIRRestitui">Restitui</label>
                  </div>
                  <div className="option-option">
                    <input type="radio" id="resultadoIRPaga" name="resultadoIR" value="Paga" />
                    <label htmlFor="resultadoIRPaga">Paga</label>
                  </div>
                  <div className="option-option">
                    <input type="radio" id="resultadoIRIsento" name="resultadoIR" value="Isento" />
                    <label htmlFor="resultadoIRIsento">Isento</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Perguntas de IR para as outras pessoas com renda */}
          {pessoasRenda.map(pessoa => (
            <div key={`ir-pessoa-${pessoa.id}`}>
              <div className="option-group">
                <label id={`label-declara-ir-pessoa-${pessoa.id}`}>
                  {pessoa.nome || 'Esta pessoa'} declara imposto de renda?
                </label>
                <div className="option-options" role="radiogroup" aria-labelledby={`label-declara-ir-pessoa-${pessoa.id}`}>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`declaraIRPessoaSim_${pessoa.id}`} 
                      name={`declaraIRPessoa_${pessoa.id}`} 
                      value="Sim"
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'declaraIR', 'Sim')}
                    />
                    <label htmlFor={`declaraIRPessoaSim_${pessoa.id}`}>Sim</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id={`declaraIRPessoaNao_${pessoa.id}`} 
                      name={`declaraIRPessoa_${pessoa.id}`} 
                      value="Não"
                      onChange={() => atualizarPessoaRenda(pessoa.id, 'declaraIR', 'Não')}
                    />
                    <label htmlFor={`declaraIRPessoaNao_${pessoa.id}`}>Não</label>
                  </div>
                </div>
              </div>
              
              {pessoa.declaraIR === 'Sim' && (
                <>
                  <div className="option-group">
                    <label id={`label-tipo-declaracao-pessoa-${pessoa.id}`}>
                      Qual o tipo da declaração de {pessoa.nome || 'esta pessoa'}?
                    </label>
                    <div className="option-options" role="radiogroup" aria-labelledby={`label-tipo-declaracao-pessoa-${pessoa.id}`}>
                      <div className="option-option">
                        <input 
                          type="radio" 
                          id={`tipoCompletaPessoa_${pessoa.id}`} 
                          name={`tipoDeclaracaoPessoa_${pessoa.id}`} 
                          value="Completa"
                          onChange={() => atualizarPessoaRenda(pessoa.id, 'tipoDeclaracao', 'Completa')}
                        />
                        <label htmlFor={`tipoCompletaPessoa_${pessoa.id}`}>Completa</label>
                      </div>
                      <div className="option-option">
                        <input 
                          type="radio" 
                          id={`tipoSimplificadaPessoa_${pessoa.id}`} 
                          name={`tipoDeclaracaoPessoa_${pessoa.id}`} 
                          value="Simplificada"
                          onChange={() => atualizarPessoaRenda(pessoa.id, 'tipoDeclaracao', 'Simplificada')}
                        />
                        <label htmlFor={`tipoSimplificadaPessoa_${pessoa.id}`}>Simplificada</label>
                      </div>
                      <div className="option-option">
                        <input 
                          type="radio" 
                          id={`tipoNaoSeiPessoa_${pessoa.id}`} 
                          name={`tipoDeclaracaoPessoa_${pessoa.id}`} 
                          value="Não sei"
                          onChange={() => atualizarPessoaRenda(pessoa.id, 'tipoDeclaracao', 'Não sei')}
                        />
                        <label htmlFor={`tipoNaoSeiPessoa_${pessoa.id}`}>Não sei</label>
                      </div>
                    </div>
                  </div>

                  <div className="option-group">
                    <label id={`label-resultado-ir-pessoa-${pessoa.id}`}>
                      Resultado do IR de {pessoa.nome || 'esta pessoa'}:
                    </label>
                    <div className="option-options" role="radiogroup" aria-labelledby={`label-resultado-ir-pessoa-${pessoa.id}`}>
                      <div className="option-option">
                        <input 
                          type="radio" 
                          id={`resultadoIRRestituiPessoa_${pessoa.id}`} 
                          name={`resultadoIRPessoa_${pessoa.id}`} 
                          value="Restitui"
                          onChange={() => atualizarPessoaRenda(pessoa.id, 'resultadoIR', 'Restitui')}
                        />
                        <label htmlFor={`resultadoIRRestituiPessoa_${pessoa.id}`}>Restitui</label>
                      </div>
                      <div className="option-option">
                        <input 
                          type="radio" 
                          id={`resultadoIRPagaPessoa_${pessoa.id}`} 
                          name={`resultadoIRPessoa_${pessoa.id}`} 
                          value="Paga"
                          onChange={() => atualizarPessoaRenda(pessoa.id, 'resultadoIR', 'Paga')}
                        />
                        <label htmlFor={`resultadoIRPagaPessoa_${pessoa.id}`}>Paga</label>
                      </div>
                      <div className="option-option">
                        <input 
                          type="radio" 
                          id={`resultadoIRIsentoPessoa_${pessoa.id}`} 
                          name={`resultadoIRPessoa_${pessoa.id}`} 
                          value="Isento"
                          onChange={() => atualizarPessoaRenda(pessoa.id, 'resultadoIR', 'Isento')}
                        />
                        <label htmlFor={`resultadoIRIsentoPessoa_${pessoa.id}`}>Isento</label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Seção de fluxo de caixa */}
        <div className="form-section" id="secaoFluxoCaixa">
          <h2>Fluxo de Caixa</h2>
          
          {/* Opção para escolher entre orçamento individual ou somado (apenas se houver mais de uma pessoa com renda) */}
          {multiplasRendas && (
            <div id="opcaoTipoFluxoCaixa">
              <div className="option-group">
                <label id="label-tipo-fluxo-caixa">Como você deseja informar o orçamento?</label>
                <div className="option-options" role="radiogroup" aria-labelledby="label-tipo-fluxo-caixa">
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id="fluxoCaixaSomado" 
                      name="tipoFluxoCaixa" 
                      value="Somado"
                      onChange={() => setFluxoCaixaTipo('somado')}
                      checked={fluxoCaixaTipo === 'somado'}
                    />
                    <label htmlFor="fluxoCaixaSomado">Valores somados de todos os integrantes</label>
                  </div>
                  <div className="option-option">
                    <input 
                      type="radio" 
                      id="fluxoCaixaIndividual" 
                      name="tipoFluxoCaixa" 
                      value="Individual"
                      onChange={() => setFluxoCaixaTipo('individual')}
                      checked={fluxoCaixaTipo === 'individual'}
                    />
                    <label htmlFor="fluxoCaixaIndividual">Valores individuais para cada pessoa</label>
                  </div>
                </div>
              </div>
              
              {/* Opção para informar se sabe os dados dos outros (apenas se escolher individual) */}
              {fluxoCaixaTipo === 'individual' && (
                <div className="option-group">
                  <label id="label-sabe-dados-outros">Você sabe as informações financeiras das outras pessoas?</label>
                  <div className="option-options" role="radiogroup" aria-labelledby="label-sabe-dados-outros">
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id="sabeDadosOutrosSim" 
                        name="sabeDadosOutros" 
                        value="Sim"
                        onChange={() => setSabeDadosOutros(true)}
                        checked={sabeDadosOutros}
                      />
                      <label htmlFor="sabeDadosOutrosSim">Sim</label>
                    </div>
                    <div className="option-option">
                      <input 
                        type="radio" 
                        id="sabeDadosOutrosNao" 
                        name="sabeDadosOutros" 
                        value="Não"
                        onChange={() => setSabeDadosOutros(false)}
                        checked={!sabeDadosOutros}
                      />
                      <label htmlFor="sabeDadosOutrosNao">Não</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Fluxo de caixa somado (padrão ou se escolhido) */}
          {(fluxoCaixaTipo === 'somado' || !multiplasRendas) && (
            <div id="fluxoCaixaSomadoContainer">
              <div className="form-group">
                <label id="labelRenda" htmlFor="renda">
                  {multiplasRendas ? 'Renda mensal total (somando todas as pessoas):' : 'Renda mensal:'}
                </label>
                <input 
                  type="text" 
                  id="renda" 
                  name="renda" 
                  className="moeda" 
                  placeholder="R$ 0,00" 
                  onChange={handleMoedaChange}
                />
              </div>
              <div className="form-group">
                <label id="labelCustosFixos" htmlFor="custosFixos">
                  {multiplasRendas ? 'Custos fixos mensais totais:' : 'Custos fixos mensais:'}
                  <div className="tooltip">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
                  </div>
                </label>
                <input 
                  type="text" 
                  id="custosFixos" 
                  name="custosFixos" 
                  className="moeda" 
                  placeholder="R$ 0,00" 
                  onChange={handleMoedaChange}
                />
              </div>
              <div className="form-group">
                <label id="labelCustosVariaveis" htmlFor="custosVariaveis">
                  {multiplasRendas ? 'Custos variáveis mensais totais:' : 'Custos variáveis mensais:'}
                  <div className="tooltip">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
                  </div>
                </label>
                <input 
                  type="text" 
                  id="custosVariaveis" 
                  name="custosVariaveis" 
                  className="moeda" 
                  placeholder="R$ 0,00" 
                  onChange={handleMoedaChange}
                />
              </div>
              <div className="form-group">
                <label id="labelPoupanca" htmlFor="poupancaMensal">
                  {multiplasRendas ? 'Quanto vocês conseguem poupar todo mês (total):' : 'Quanto você consegue poupar todo mês:'}
                </label>
                <input 
                  type="text" 
                  id="poupancaMensal" 
                  name="poupancaMensal" 
                  className="moeda" 
                  placeholder="R$ 0,00" 
                  onChange={handleMoedaChange}
                />
              </div>
            </div>
          )}
          
          {/* Fluxo de caixa individual (se escolhido) */}
          {fluxoCaixaTipo === 'individual' && multiplasRendas && (
            <div id="fluxoCaixaIndividualContainer">
              {/* Container para o cliente principal */}
              <div className="pessoa-fluxo-caixa">
                <h3>Seu orçamento</h3>
                <div className="form-group">
                  <label htmlFor="rendaCliente">Sua renda mensal:</label>
                  <input 
                    type="text" 
                    id="rendaCliente" 
                    name="rendaCliente" 
                    className="moeda" 
                    placeholder="R$ 0,00" 
                    onChange={handleMoedaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="custosFixosCliente">
                    Seus custos fixos mensais:
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <span className="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
                    </div>
                  </label>
                  <input 
                    type="text" 
                    id="custosFixosCliente" 
                    name="custosFixosCliente" 
                    className="moeda" 
                    placeholder="R$ 0,00" 
                    onChange={handleMoedaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="custosVariaveisCliente">
                    Seus custos variáveis mensais:
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <span className="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
                    </div>
                  </label>
                  <input 
                    type="text" 
                    id="custosVariaveisCliente" 
                    name="custosVariaveisCliente" 
                    className="moeda" 
                    placeholder="R$ 0,00" 
                    onChange={handleMoedaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="poupancaMensalCliente">Quanto você consegue poupar todo mês:</label>
                  <input 
                    type="text" 
                    id="poupancaMensalCliente" 
                    name="poupancaMensalCliente" 
                    className="moeda" 
                    placeholder="R$ 0,00" 
                    onChange={handleMoedaChange}
                  />
                </div>
              </div>
              
              {/* Container para as outras pessoas com renda (apenas se sabe os dados) */}
              {sabeDadosOutros && pessoasRenda.map(pessoa => (
                <div key={`fluxo-caixa-${pessoa.id}`} className="pessoa-fluxo-caixa">
                  <h3>Orçamento de {pessoa.nome || 'outra pessoa'}</h3>
                  <div className="form-group">
                    <label htmlFor={`rendaPessoa_${pessoa.id}`}>Renda mensal:</label>
                    <input 
                      type="text" 
                      id={`rendaPessoa_${pessoa.id}`} 
                      name={`rendaPessoa_${pessoa.id}`} 
                      className="moeda" 
                      placeholder="R$ 0,00" 
                      onChange={handleMoedaChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`custosFixosPessoa_${pessoa.id}`}>
                      Custos fixos mensais:
                      <div className="tooltip">
                        <span className="tooltip-icon">?</span>
                        <span className="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
                      </div>
                    </label>
                    <input 
                      type="text" 
                      id={`custosFixosPessoa_${pessoa.id}`} 
                      name={`custosFixosPessoa_${pessoa.id}`} 
                      className="moeda" 
                      placeholder="R$ 0,00" 
                      onChange={handleMoedaChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`custosVariaveisPessoa_${pessoa.id}`}>
                      Custos variáveis mensais:
                      <div className="tooltip">
                        <span className="tooltip-icon">?</span>
                        <span className="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
                      </div>
                    </label>
                    <input 
                      type="text" 
                      id={`custosVariaveisPessoa_${pessoa.id}`} 
                      name={`custosVariaveisPessoa_${pessoa.id}`} 
                      className="moeda" 
                      placeholder="R$ 0,00" 
                      onChange={handleMoedaChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`poupancaMensalPessoa_${pessoa.id}`}>Quanto consegue poupar todo mês:</label>
                    <input 
                      type="text" 
                      id={`poupancaMensalPessoa_${pessoa.id}`} 
                      name={`poupancaMensalPessoa_${pessoa.id}`} 
                      className="moeda" 
                      placeholder="R$ 0,00" 
                      onChange={handleMoedaChange}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de cartões e contas */}
        <div className="form-section" id="secaoCartoesContas">
          <h2>Cartões e Contas</h2>
          
          <div className="option-group">
            <label id="labelMilhas" htmlFor="usaMilhas">Você reduz custos de viagens utilizando milhas com frequência?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="labelMilhas">
              <div className="option-option">
                <input type="radio" id="usaMilhasSim" name="usaMilhas" value="Sim" />
                <label htmlFor="usaMilhasSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="usaMilhasNao" name="usaMilhas" value="Não" />
                <label htmlFor="usaMilhasNao">Não</label>
              </div>
            </div>
          </div>

          <div className="option-group">
            <label id="label-sem-tarifas">
              {multiplasRendas ? 'Os cartões e contas de vocês são livres de tarifas?' : 'Seus cartões e contas são livres de tarifas?'}
            </label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-sem-tarifas">
              <div className="option-option">
                <input type="radio" id="semTarifasSim" name="semTarifas" value="Sim" />
                <label htmlFor="semTarifasSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="semTarifasNao" name="semTarifas" value="Não" />
                <label htmlFor="semTarifasNao">Não</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de dívidas */}
        <div className="form-section" id="secaoDividas">
          <h2>Dívidas</h2>
          <label>Adicione suas dívidas:</label>
          <div id="listaDividas">
            {dividas.map(divida => (
              <div key={divida.id} className="divida-item">
                <div className="patrimonio-row">
                  <label htmlFor={`descricaoDivida_${divida.id}`}>Descrição da dívida:</label>
                  <input 
                    type="text" 
                    id={`descricaoDivida_${divida.id}`} 
                    name={`descricaoDivida_${divida.id}`} 
                    placeholder="Ex: Financiamento, Empréstimo, etc."
                    onChange={(e) => atualizarDivida(divida.id, 'descricao', e.target.value)}
                  />
                </div>
                
                <div className="patrimonio-row">
                  <label htmlFor={`valorDivida_${divida.id}`}>Valor total:</label>
                  <input 
                    type="text" 
                    id={`valorDivida_${divida.id}`} 
                    name={`valorDivida_${divida.id}`} 
                    className="moeda" 
                    placeholder="R$ 0,00"
                    onChange={handleMoedaChange}
                    onBlur={(e) => atualizarDivida(divida.id, 'valorTotal', e.target.value)}
                  />
                </div>
                
                {/* Campo para selecionar de quem é a dívida */}
                <div className="patrimonio-row">
                  <label htmlFor={`proprietarioDivida_${divida.id}`}>De quem é esta dívida:</label>
                  <select 
                    id={`proprietarioDivida_${divida.id}`} 
                    name={`proprietarioDivida_${divida.id}`}
                    onChange={(e) => atualizarDivida(divida.id, 'proprietario', e.target.value)}
                    value={divida.proprietario}
                  >
                    <option value="principal">Sua (cliente principal)</option>
                    {pessoasRenda.map(pessoa => (
                      <option key={`option-divida-${pessoa.id}`} value={pessoa.id}>
                        {pessoa.nome || 'Outra pessoa com renda'}
                      </option>
                    ))}
                    <option value="conjunto">Conjunta (mais de uma pessoa)</option>
                  </select>
                </div>
                
                <button 
                  type="button" 
                  className="delete-btn" 
                  onClick={() => removerDivida(divida.id)} 
                  aria-label="Excluir dívida"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className="btn btn-adicionar" 
            onClick={adicionarDivida}
          >
            <span className="sr-only">Adicionar</span> Adicionar Dívida
          </button>
        </div>

        {/* Seção de informações adicionais */}
        <div className="form-section" id="secaoInfoAdicional">
          <h2>Informações Adicionais</h2>
          <div className="form-group">
            <label htmlFor="infoAdicional">Existe alguma informação que você julgue relevante informar?</label>
            <textarea id="infoAdicional" name="infoAdicional" className="info-adicional" placeholder="Digite aqui qualquer informação adicional que você considere importante..."></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-enviar" id="btnEnviar">Enviar Formulário</button>
      </form>
    </>
  );
}
