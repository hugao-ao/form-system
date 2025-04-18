import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const { uniqueId } = router.query;
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
                <input type="radio" id="unicaRendaSim" name="unicaRenda" value="Sim" />
                <label htmlFor="unicaRendaSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="unicaRendaNao" name="unicaRenda" value="Não" />
                <label htmlFor="unicaRendaNao">Não</label>
              </div>
            </div>
          </div>
          
          <div id="listaPessoasRenda" style={{ display: 'none' }}>
            <label>Adicione as outras pessoas que têm renda na sua casa:</label>
            <div id="pessoasRendaContainer"></div>
            <button type="button" className="btn btn-adicionar" id="btnAdicionarPessoaRenda">
              <span className="sr-only">Adicionar</span> Adicionar Pessoa
            </button>
          </div>
        </div>

        {/* Seção de dependentes */}
        <div className="form-section" id="secaoDependentes">
          <h2>Dependentes</h2>
          <div className="option-group">
            <label id="label-tem-dependentes">Você possui dependentes?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-tem-dependentes">
              <div className="option-option">
                <input type="radio" id="temDependentesSim" name="temDependentes" value="Sim" />
                <label htmlFor="temDependentesSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="temDependentesNao" name="temDependentes" value="Não" />
                <label htmlFor="temDependentesNao">Não</label>
              </div>
            </div>
          </div>
          
          <div id="listaDependentes" style={{ display: 'none' }}>
            <label>Adicione seus dependentes:</label>
            <div id="dependentesContainer"></div>
            <button type="button" className="btn btn-adicionar" id="btnAdicionarDependente">
              <span className="sr-only">Adicionar</span> Adicionar Dependente
            </button>
          </div>
        </div>

        {/* Seção de patrimônios físicos */}
        <div className="form-section">
          <h2>Patrimônios Físicos</h2>
          <label>Adicione seus patrimônios físicos:</label>
          <div id="listaPatrimonios"></div>
          <button type="button" className="btn btn-adicionar" id="btnAdicionarPatrimonio">
            <span className="sr-only">Adicionar</span> Adicionar Patrimônio
          </button>
        </div>

        {/* Seção de seguros e planos */}
        <div className="form-section">
          <h2>Seguros e Planos</h2>
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

          <div id="planosSaudePessoas"></div>
          <div id="planosSaudeDependentes"></div>

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

          <div id="segurosVidaPessoas"></div>
        </div>
        {/* Seção de patrimônio líquido */}
        <div className="form-section">
          <h2>Patrimônio Líquido</h2>
          <div className="form-group">
            <label htmlFor="patrimonioLiquido">
              Seu patrimônio líquido:
              <div className="tooltip">
                <span className="tooltip-icon">?</span>
                <span className="tooltip-text">Soma de todos os seus bens menos suas dívidas</span>
              </div>
            </label>
            <input type="text" id="patrimonioLiquido" name="patrimonioLiquido" className="moeda" placeholder="R$ 0,00" />
          </div>
          <div id="patrimoniosPessoas"></div>
        </div>

        {/* Seção de imposto de renda */}
        <div className="form-section">
          <h2>Imposto de Renda</h2>
          {/* Perguntas do cliente principal */}
          <div className="option-group">
            <label id="label-declara-ir">Você declara imposto de renda?</label>
            <div className="option-options" role="radiogroup" aria-labelledby="label-declara-ir">
              <div className="option-option">
                <input type="radio" id="declaraIRSim" name="declaraIR" value="Sim" />
                <label htmlFor="declaraIRSim">Sim</label>
              </div>
              <div className="option-option">
                <input type="radio" id="declaraIRNao" name="declaraIR" value="Não" />
                <label htmlFor="declaraIRNao">Não</label>
              </div>
            </div>
          </div>

          <div id="declaracaoIRCliente" style={{ display: 'none' }}>
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

          {/* Perguntas dos outros integrantes com renda */}
          <div id="declaracoesIRPessoas"></div>
        </div>

        {/* Seção de fluxo de caixa */}
        <div className="form-section" id="secaoFluxoCaixa">
          <h2>Fluxo de Caixa</h2>
          
          {/* Opção para escolher entre orçamento individual ou somado */}
          <div id="opcaoTipoFluxoCaixa" style={{ display: 'none' }}>
            <div className="option-group">
              <label id="label-tipo-fluxo-caixa">Como você deseja informar o orçamento?</label>
              <div className="option-options" role="radiogroup" aria-labelledby="label-tipo-fluxo-caixa">
                <div className="option-option">
                  <input type="radio" id="fluxoCaixaSomado" name="tipoFluxoCaixa" value="Somado" />
                  <label htmlFor="fluxoCaixaSomado">Valores somados de todos os integrantes</label>
                </div>
                <div className="option-option">
                  <input type="radio" id="fluxoCaixaIndividual" name="tipoFluxoCaixa" value="Individual" />
                  <label htmlFor="fluxoCaixaIndividual">Valores individuais para cada pessoa</label>
                </div>
              </div>
            </div>
          </div>
          {/* Fluxo de caixa somado (padrão) */}
          <div id="fluxoCaixaSomadoContainer">
            <div className="form-group">
              <label id="labelRenda" htmlFor="renda">Renda mensal:</label>
              <input type="text" id="renda" name="renda" className="moeda" placeholder="R$ 0,00" />
            </div>
            <div className="form-group">
              <label id="labelCustosFixos" htmlFor="custosFixos">
                Custos fixos mensais:
                <div className="tooltip">
                  <span className="tooltip-icon">?</span>
                  <span className="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
                </div>
              </label>
              <input type="text" id="custosFixos" name="custosFixos" className="moeda" placeholder="R$ 0,00" />
            </div>
            <div className="form-group">
              <label id="labelCustosVariaveis" htmlFor="custosVariaveis">
                Custos variáveis mensais:
                <div className="tooltip">
                  <span className="tooltip-icon">?</span>
                  <span className="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
                </div>
              </label>
              <input type="text" id="custosVariaveis" name="custosVariaveis" className="moeda" placeholder="R$ 0,00" />
            </div>
            <div className="form-group">
              <label id="labelPoupanca" htmlFor="poupancaMensal">Quanto você consegue poupar todo mês:</label>
              <input type="text" id="poupancaMensal" name="poupancaMensal" className="moeda" placeholder="R$ 0,00" />
            </div>
          </div>
          
          {/* Fluxo de caixa individual */}
          <div id="fluxoCaixaIndividualContainer" style={{ display: 'none' }}>
            {/* Container para o cliente principal */}
            <div className="pessoa-fluxo-caixa">
              <h3>Seu orçamento</h3>
              <div className="form-group">
                <label htmlFor="rendaCliente">Sua renda mensal:</label>
                <input type="text" id="rendaCliente" name="rendaCliente" className="moeda" placeholder="R$ 0,00" />
              </div>
              <div className="form-group">
                <label htmlFor="custosFixosCliente">
                  Seus custos fixos mensais:
                  <div className="tooltip">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
                  </div>
                </label>
                <input type="text" id="custosFixosCliente" name="custosFixosCliente" className="moeda" placeholder="R$ 0,00" />
              </div>
              <div className="form-group">
                <label htmlFor="custosVariaveisCliente">
                  Seus custos variáveis mensais:
                  <div className="tooltip">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
                  </div>
                </label>
                <input type="text" id="custosVariaveisCliente" name="custosVariaveisCliente" className="moeda" placeholder="R$ 0,00" />
              </div>
              <div className="form-group">
                <label htmlFor="poupancaMensalCliente">Quanto você consegue poupar todo mês:</label>
                <input type="text" id="poupancaMensalCliente" name="poupancaMensalCliente" className="moeda" placeholder="R$ 0,00" />
              </div>
            </div>
            
            {/* Container para as outras pessoas com renda */}
            <div id="fluxoCaixaPessoasContainer"></div>
          </div>
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
            <label id="label-sem-tarifas">Seus cartões e contas são livres de tarifas?</label>
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
          <div id="listaDividas"></div>
          <button type="button" className="btn btn-adicionar" id="btnAdicionarDivida">
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

      <div id="successMessage" className="success-message" role="alert">
        Formulário enviado com sucesso! O PDF foi gerado e está disponível para download.
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        // Inicialização quando o documento estiver pronto
        document.addEventListener('DOMContentLoaded', function() {
          // Configurar eventos para mostrar/esconder seções
          document.getElementById('unicaRendaSim').addEventListener('change', function() {
            document.getElementById('listaPessoasRenda').style.display = 'none';
          });
          
          document.getElementById('unicaRendaNao').addEventListener('change', function() {
            document.getElementById('listaPessoasRenda').style.display = 'block';
          });
          
          document.getElementById('temDependentesSim').addEventListener('change', function() {
            document.getElementById('listaDependentes').style.display = 'block';
          });
          
          document.getElementById('temDependentesNao').addEventListener('change', function() {
            document.getElementById('listaDependentes').style.display = 'none';
          });
          
          document.getElementById('declaraIRSim').addEventListener('change', function() {
            document.getElementById('declaracaoIRCliente').style.display = 'block';
          });
          
          document.getElementById('declaraIRNao').addEventListener('change', function() {
            document.getElementById('declaracaoIRCliente').style.display = 'none';
          });
          
          // Configurar botões para adicionar itens
          document.getElementById('btnAdicionarPessoaRenda').addEventListener('click', function() {
            adicionarPessoaRenda();
          });
          
          document.getElementById('btnAdicionarDependente').addEventListener('click', function() {
            adicionarDependente();
          });
          
          document.getElementById('btnAdicionarPatrimonio').addEventListener('click', function() {
            adicionarPatrimonio();
          });
          
          document.getElementById('btnAdicionarDivida').addEventListener('click', function() {
            adicionarDivida();
          });
          
          // Formatar campos de moeda
          document.querySelectorAll('.moeda').forEach(function(input) {
            input.addEventListener('input', function(e) {
              formatarMoeda(e.target);
            });
          });
        });
        
        // Funções para adicionar itens dinâmicos
        function adicionarPessoaRenda() {
          const id = Date.now();
          const container = document.createElement('div');
          container.className = 'pessoa-item';
          container.dataset.id = id;
          container.innerHTML = \`
            <div class="patrimonio-row">
              <label for="nomePessoaRenda_\${id}">Nome completo:</label>
              <input type="text" id="nomePessoaRenda_\${id}" name="nomePessoaRenda_\${id}" placeholder="Nome completo">
            </div>
            
            <div class="option-group">
              <label id="label-precisa-concordar-\${id}">Você precisa que essa pessoa concorde com suas decisões financeiras?</label>
              <div class="option-options" role="radiogroup" aria-labelledby="label-precisa-concordar-\${id}">
                <div class="option-option">
                  <input type="radio" id="precisaConcordarSim_\${id}" name="precisaConcordar\${id}" value="Sim">
                  <label for="precisaConcordarSim_\${id}">Sim</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="precisaConcordarNao_\${id}" name="precisaConcordar\${id}" value="Não">
                  <label for="precisaConcordarNao_\${id}">Não</label>
                </div>
              </div>
            </div>
            
            <button type="button" class="delete-btn" onclick="removerItem(this)" aria-label="Excluir pessoa">Excluir</button>
          \`;
          
          document.getElementById('pessoasRendaContainer').appendChild(container);
          
          // Mostrar opção de tipo de fluxo de caixa quando houver mais de uma pessoa
          if (document.querySelectorAll('#pessoasRendaContainer .pessoa-item').length > 0) {
            document.getElementById('opcaoTipoFluxoCaixa').style.display = 'block';
          }
        }
        
        function adicionarDependente() {
          const id = Date.now();
          const container = document.createElement('div');
          container.className = 'dependente-item';
          container.dataset.id = id;
          container.innerHTML = \`
            <div class="patrimonio-row">
              <label for="nomeDependente_\${id}">Nome completo:</label>
              <input type="text" id="nomeDependente_\${id}" name="nomeDependente_\${id}" placeholder="Nome completo">
            </div>
            
            <div class="patrimonio-row">
              <label for="idadeDependente_\${id}">Idade:</label>
              <input type="number" id="idadeDependente_\${id}" name="idadeDependente_\${id}" min="0" max="120">
            </div>
            
            <button type="button" class="delete-btn" onclick="removerItem(this)" aria-label="Excluir dependente">Excluir</button>
          \`;
          
          document.getElementById('dependentesContainer').appendChild(container);
        }
        
        function adicionarPatrimonio() {
          const id = Date.now();
          const container = document.createElement('div');
          container.className = 'patrimonio-item';
          container.dataset.id = id;
          container.innerHTML = \`
            <div class="patrimonio-row">
              <label for="descricaoPatrimonio_\${id}">Descrição do patrimônio:</label>
              <input type="text" id="descricaoPatrimonio_\${id}" name="descricaoPatrimonio_\${id}" placeholder="Ex: Imóvel, Veículo, etc.">
            </div>
            
            <div class="patrimonio-row">
              <label for="valorPatrimonio_\${id}">Valor estimado:</label>
              <input type="text" id="valorPatrimonio_\${id}" name="valorPatrimonio_\${id}" class="moeda" placeholder="R$ 0,00">
            </div>
            
            <button type="button" class="delete-btn" onclick="removerItem(this)" aria-label="Excluir patrimônio">Excluir</button>
          \`;
          
          document.getElementById('listaPatrimonios').appendChild(container);
          
          // Adicionar formatação de moeda ao novo campo
          const input = container.querySelector('.moeda');
          input.addEventListener('input', function(e) {
            formatarMoeda(e.target);
          });
        }
        
        function adicionarDivida() {
          const id = Date.now();
          const container = document.createElement('div');
          container.className = 'divida-item';
          container.dataset.id = id;
          container.innerHTML = \`
            <div class="patrimonio-row">
              <label for="descricaoDivida_\${id}">Descrição da dívida:</label>
              <input type="text" id="descricaoDivida_\${id}" name="descricaoDivida_\${id}" placeholder="Ex: Financiamento, Empréstimo, etc.">
            </div>
            
            <div class="patrimonio-row">
              <label for="valorDivida_\${id}">Valor total:</label>
              <input type="text" id="valorDivida_\${id}" name="valorDivida_\${id}" class="moeda" placeholder="R$ 0,00">
            </div>
            
            <div class="patrimonio-row">
              <label for="parcelasDivida_\${id}">Número de parcelas restantes:</label>
              <input type="number" id="parcelasDivida_\${id}" name="parcelasDivida_\${id}" min="0">
            </div>
            
            <div class="patrimonio-row">
              <label for="valorParcelaDivida_\${id}">Valor da parcela:</label>
              <input type="text" id="valorParcelaDivida_\${id}" name="valorParcelaDivida_\${id}" class="moeda" placeholder="R$ 0,00">
            </div>
            
            <button type="button" class="delete-btn" onclick="removerItem(this)" aria-label="Excluir dívida">Excluir</button>
          \`;
          
          document.getElementById('listaDividas').appendChild(container);
          
          // Adicionar formatação de moeda aos novos campos
          container.querySelectorAll('.moeda').forEach(function(input) {
            input.addEventListener('input', function(e) {
              formatarMoeda(e.target);
            });
          });
        }
        
        // Função para remover itens
        function removerItem(botao) {
          const item = botao.closest('.pessoa-item, .dependente-item, .patrimonio-item, .divida-item');
          if (item) {
            item.remove();
            
            // Verificar se ainda há pessoas com renda
            if (document.querySelectorAll('#pessoasRendaContainer .pessoa-item').length === 0) {
              document.getElementById('opcaoTipoFluxoCaixa').style.display = 'none';
            }
          }
        }
        
        // Função para formatar campos de moeda
        function formatarMoeda(input) {
          let valor = input.value.replace(/\\D/g, '');
          
          if (valor === '') {
            input.value = '';
            return;
          }
          
          valor = (parseFloat(valor) / 100).toFixed(2);
          input.value = 'R$ ' + valor.replace('.', ',').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.');
        }
      `}} />
    </>
  );
}
