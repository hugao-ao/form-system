import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const { uniqueId } = router.query;
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // Refs para os containers dinâmicos
  const pessoasRendaContainerRef = useRef(null);
  const dependentesContainerRef = useRef(null);
  const listaPatrimoniosRef = useRef(null);
  const listaDividasRef = useRef(null);
  
  // Estado para controlar a visibilidade das seções
  const [showPessoasRenda, setShowPessoasRenda] = useState(false);
  const [showDependentes, setShowDependentes] = useState(false);
  const [showDeclaracaoIR, setShowDeclaracaoIR] = useState(false);
  const [showTipoFluxoCaixa, setShowTipoFluxoCaixa] = useState(false);
  const [fluxoCaixaTipo, setFluxoCaixaTipo] = useState('somado');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Coletar todos os dados do formulário
    const form = e.target;
    const formElements = form.elements;
    const formData = {};
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name && element.name !== '') {
        formData[element.name] = element.value;
      }
    }
    
    // Em uma implementação real, enviaríamos para a API
    console.log('Formulário enviado:', formData);
    
    // Mostrar mensagem de sucesso
    setSubmitted(true);
  };
  
  // Função para formatar campos de moeda
  const formatarMoeda = (input) => {
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
    if (!pessoasRendaContainerRef.current) return;
    
    const id = Date.now();
    const container = document.createElement('div');
    container.className = 'pessoa-item';
    container.dataset.id = id;
    container.innerHTML = 
      <div class="patrimonio-row">
        <label for="nomePessoaRenda_${id}">Nome completo:</label>
        <input type="text" id="nomePessoaRenda_${id}" name="nomePessoaRenda_${id}" placeholder="Nome completo">
      </div>
      
      <div class="option-group">
        <label id="label-precisa-concordar-${id}">Você precisa que essa pessoa concorde com suas decisões financeiras?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-precisa-concordar-${id}">
          <div class="option-option">
            <input type="radio" id="precisaConcordarSim_${id}" name="precisaConcordar${id}" value="Sim">
            <label for="precisaConcordarSim_${id}">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="precisaConcordarNao_${id}" name="precisaConcordar${id}" value="Não">
            <label for="precisaConcordarNao_${id}">Não</label>
          </div>
        </div>
      </div>
      
      <button type="button" class="delete-btn" data-id="${id}" aria-label="Excluir pessoa">Excluir</button>
    ;
    
    pessoasRendaContainerRef.current.appendChild(container);
    
    // Adicionar evento ao botão de excluir
    const deleteBtn = container.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => removerItem(deleteBtn));
    
    // Mostrar opção de tipo de fluxo de caixa quando houver mais de uma pessoa
    setShowTipoFluxoCaixa(true);
  };
  
  // Função para adicionar dependente
  const adicionarDependente = () => {
    if (!dependentesContainerRef.current) return;
    
    const id = Date.now();
    const container = document.createElement('div');
    container.className = 'dependente-item';
    container.dataset.id = id;
    container.innerHTML = 
      <div class="patrimonio-row">
        <label for="nomeDependente_${id}">Nome completo:</label>
        <input type="text" id="nomeDependente_${id}" name="nomeDependente_${id}" placeholder="Nome completo">
      </div>
      
      <div class="patrimonio-row">
        <label for="idadeDependente_${id}">Idade:</label>
        <input type="number" id="idadeDependente_${id}" name="idadeDependente_${id}" min="0" max="120">
      </div>
      
      <button type="button" class="delete-btn" data-id="${id}" aria-label="Excluir dependente">Excluir</button>
    ;
    
    dependentesContainerRef.current.appendChild(container);
    
    // Adicionar evento ao botão de excluir
    const deleteBtn = container.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => removerItem(deleteBtn));
  };
  
  // Função para adicionar patrimônio
  const adicionarPatrimonio = () => {
    if (!listaPatrimoniosRef.current) return;
    
    const id = Date.now();
    const container = document.createElement('div');
    container.className = 'patrimonio-item';
    container.dataset.id = id;
    container.innerHTML = 
      <div class="patrimonio-row">
        <label for="descricaoPatrimonio_${id}">Descrição do patrimônio:</label>
        <input type="text" id="descricaoPatrimonio_${id}" name="descricaoPatrimonio_${id}" placeholder="Ex: Imóvel, Veículo, etc.">
      </div>
      
      <div class="patrimonio-row">
        <label for="valorPatrimonio_${id}">Valor estimado:</label>
        <input type="text" id="valorPatrimonio_${id}" name="valorPatrimonio_${id}" class="moeda" placeholder="R$ 0,00">
      </div>
      
      <button type="button" class="delete-btn" data-id="${id}" aria-label="Excluir patrimônio">Excluir</button>
    ;
    
    listaPatrimoniosRef.current.appendChild(container);
    
    // Adicionar evento ao botão de excluir
    const deleteBtn = container.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => removerItem(deleteBtn));
    
    // Adicionar formatação de moeda ao novo campo
    const input = container.querySelector('.moeda');
    input.addEventListener('input', (e) => formatarMoeda(e.target));
  };
  
  // Função para adicionar dívida
  const adicionarDivida = () => {
    if (!listaDividasRef.current) return;
    
    const id = Date.now();
    const container = document.createElement('div');
    container.className = 'divida-item';
    container.dataset.id = id;
    container.innerHTML = 
      <div class="patrimonio-row">
        <label for="descricaoDivida_${id}">Descrição da dívida:</label>
        <input type="text" id="descricaoDivida_${id}" name="descricaoDivida_${id}" placeholder="Ex: Financiamento, Empréstimo, etc.">
      </div>
      
      <div class="patrimonio-row">
        <label for="valorDivida_${id}">Valor total:</label>
        <input type="text" id="valorDivida_${id}" name="valorDivida_${id}" class="moeda" placeholder="R$ 0,00">
      </div>
      
      <div class="patrimonio-row">
        <label for="parcelasDivida_${id}">Número de parcelas restantes:</label>
        <input type="number" id="parcelasDivida_${id}" name="parcelasDivida_${id}" min="0">
      </div>
      
      <div class="patrimonio-row">
        <label for="valorParcelaDivida_${id}">Valor da parcela:</label>
        <input type="text" id="valorParcelaDivida_${id}" name="valorParcelaDivida_${id}" class="moeda" placeholder="R$ 0,00">
      </div>
      
      <button type="button" class="delete-btn" data-id="${id}" aria-label="Excluir dívida">Excluir</button>
    ;
    
    listaDividasRef.current.appendChild(container);
    
    // Adicionar evento ao botão de excluir
    const deleteBtn = container.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => removerItem(deleteBtn));
    
    // Adicionar formatação de moeda aos novos campos
    container.querySelectorAll('.moeda').forEach(input => {
      input.addEventListener('input', (e) => formatarMoeda(e.target));
    });
  };
  
  // Função para remover itens
  const removerItem = (botao) => {
    const item = botao.closest('.pessoa-item, .dependente-item, .patrimonio-item, .divida-item');
    if (item) {
      item.remove();
      
      // Verificar se ainda há pessoas com renda
      if (pessoasRendaContainerRef.current && 
          pessoasRendaContainerRef.current.querySelectorAll('.pessoa-item').length === 0) {
        setShowTipoFluxoCaixa(false);
      }
    }
  };
  
  // Configurar eventos e inicializar componentes após a renderização
  useEffect(() => {
    if (!uniqueId) return;
    
    // Configurar formatação de moeda para campos existentes
    document.querySelectorAll('.moeda').forEach(input => {
      input.addEventListener('input', (e) => formatarMoeda(e.target));
    });
    
    // Configurar eventos para radio buttons
    const unicaRendaSim = document.getElementById('unicaRendaSim');
    const unicaRendaNao = document.getElementById('unicaRendaNao');
    const temDependentesSim = document.getElementById('temDependentesSim');
    const temDependentesNao = document.getElementById('temDependentesNao');
    const declaraIRSim = document.getElementById('declaraIRSim');
    const declaraIRNao = document.getElementById('declaraIRNao');
    const fluxoCaixaSomado = document.getElementById('fluxoCaixaSomado');
    const fluxoCaixaIndividual = document.getElementById('fluxoCaixaIndividual');
    
    if (unicaRendaSim) {
      unicaRendaSim.addEventListener('change', () => setShowPessoasRenda(false));
    }
    
    if (unicaRendaNao) {
      unicaRendaNao.addEventListener('change', () => setShowPessoasRenda(true));
    }
    
    if (temDependentesSim) {
      temDependentesSim.addEventListener('change', () => setShowDependentes(true));
    }
    
    if (temDependentesNao) {
      temDependentesNao.addEventListener('change', () => setShowDependentes(false));
    }
    
    if (declaraIRSim) {
      declaraIRSim.addEventListener('change', () => setShowDeclaracaoIR(true));
    }
    
    if (declaraIRNao) {
      declaraIRNao.addEventListener('change', () => setShowDeclaracaoIR(false));
    }
    
    if (fluxoCaixaSomado) {
      fluxoCaixaSomado.addEventListener('change', () => setFluxoCaixaTipo('somado'));
    }
    
    if (fluxoCaixaIndividual) {
      fluxoCaixaIndividual.addEventListener('change', () => setFluxoCaixaTipo('individual'));
    }
    
    // Configurar botões para adicionar itens
    const btnAdicionarPessoaRenda = document.getElementById('btnAdicionarPessoaRenda');
    const btnAdicionarDependente = document.getElementById('btnAdicionarDependente');
    const btnAdicionarPatrimonio = document.getElementById('btnAdicionarPatrimonio');
    const btnAdicionarDivida = document.getElementById('btnAdicionarDivida');
    
    if (btnAdicionarPessoaRenda) {
      btnAdicionarPessoaRenda.addEventListener('click', adicionarPessoaRenda);
    }
    
    if (btnAdicionarDependente) {
      btnAdicionarDependente.addEventListener('click', adicionarDependente);
    }
    
    if (btnAdicionarPatrimonio) {
      btnAdicionarPatrimonio.addEventListener('click', adicionarPatrimonio);
    }
    
    if (btnAdicionarDivida) {
      btnAdicionarDivida.addEventListener('click', adicionarDivida);
    }
    
  }, [uniqueId]);

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
      
      <style jsx global>{
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

        /* Melhorias de acessibilidade */
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

        /* Melhorias de responsividade */
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

        /* Animações */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pessoa-item, .dependente-item, .patrimonio-item, .divida-item {
          animation: fadeIn 0.3s ease-out;
        }

        /* Tooltip para ajuda */
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
        
        /* Estilo para pessoa fluxo de caixa */
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
        
        /* Estilo para campo de informações adicionais */
        textarea.info-adicional {
          min-height: 120px;
          resize: vertical;
        }
      }</style>
      
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
                <input type="radio" id="unicaRendaSim" name="unicaRenda" value="Sim" />
                <label htmlFor="unicaRendaSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="unicaRendaNao" name="unicaRenda" value="Não" />
                <label htmlFor="unicaRendaNao">Não</label>
              </div>
            </div>
          </div>
          
          <div id="listaPessoasRenda" style={{ display: showPessoasRenda ? 'block' : 'none' }}>
            <label>Adicione as outras pessoas que têm renda na sua casa:</label>
            <div id="pessoasRendaContainer" ref={pessoasRendaContainerRef}></div>
            <button type="button" className="btn btn-adicionar" id="btnAdicionarPessoaRenda">
              <span className="sr-only">Adicionar</span> Adicionar Pessoa
            </button>
          </div>
        </div>

        {/* Restante do formulário continua igual... */}
      </form>
    </>
  );
}
