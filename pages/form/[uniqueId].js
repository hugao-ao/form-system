<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formulário de Atendimento Financeiro</title>
  <style>
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
  </style>
</head>
<body>
  <h1>Formulário de Atendimento Financeiro</h1>
  <form id="formularioAtendimento" novalidate>
    <div class="form-section">
      <h2>Informações Pessoais</h2>
      <div class="form-group">
        <label for="nome">Nome completo: <span aria-hidden="true">*</span></label>
        <input type="text" id="nome" name="nome" required aria-required="true" aria-describedby="nome-error">
        <div class="error-message" id="nome-error" role="alert">Por favor, preencha seu nome completo</div>
      </div>
    </div>

    <!-- Seção de pessoas com renda -->
    <div class="form-section" id="secaoPessoasRenda">
      <h2>Pessoas com Renda</h2>
      <div class="option-group">
        <label id="label-unica-renda">Você é a única pessoa que tem renda na sua casa?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-unica-renda">
          <div class="option-option">
            <input type="radio" id="unicaRendaSim" name="unicaRenda" value="Sim" onchange="togglePessoasRenda(true)">
            <label for="unicaRendaSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="unicaRendaNao" name="unicaRenda" value="Não" onchange="togglePessoasRenda(false)">
            <label for="unicaRendaNao">Não</label>
          </div>
        </div>
      </div>
      
      <div id="listaPessoasRenda" style="display: none;">
        <label>Adicione as outras pessoas que têm renda na sua casa:</label>
        <div id="pessoasRendaContainer"></div>
        <button type="button" class="btn btn-adicionar" onclick="adicionarPessoaRenda()">
          <span class="sr-only">Adicionar</span> Adicionar Pessoa
        </button>
      </div>
    </div>

    <!-- Seção de dependentes -->
    <div class="form-section" id="secaoDependentes">
      <h2>Dependentes</h2>
      <div class="option-group">
        <label id="label-tem-dependentes">Você possui dependentes?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-tem-dependentes">
          <div class="option-option">
            <input type="radio" id="temDependentesSim" name="temDependentes" value="Sim" onchange="toggleDependentes(true)">
            <label for="temDependentesSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="temDependentesNao" name="temDependentes" value="Não" onchange="toggleDependentes(false)">
            <label for="temDependentesNao">Não</label>
          </div>
        </div>
      </div>
      
      <div id="listaDependentes" style="display: none;">
        <label>Adicione seus dependentes:</label>
        <div id="dependentesContainer"></div>
        <button type="button" class="btn btn-adicionar" onclick="adicionarDependente()">
          <span class="sr-only">Adicionar</span> Adicionar Dependente
        </button>
      </div>
    </div>

    <!-- Seção de patrimônios físicos -->
    <div class="form-section">
      <h2>Patrimônios Físicos</h2>
      <label>Adicione seus patrimônios físicos:</label>
      <div id="listaPatrimonios"></div>
      <button type="button" class="btn btn-adicionar" onclick="adicionarPatrimonio()">
        <span class="sr-only">Adicionar</span> Adicionar Patrimônio
      </button>
    </div>

    <!-- Seção de seguros e planos -->
    <div class="form-section">
      <h2>Seguros e Planos</h2>
      <div class="option-group">
        <label id="label-plano-saude">Você possui plano de saúde?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-plano-saude">
          <div class="option-option">
            <input type="radio" id="planoSaudeSim" name="planoSaude" value="Sim">
            <label for="planoSaudeSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="planoSaudeNao" name="planoSaude" value="Não">
            <label for="planoSaudeNao">Não</label>
          </div>
          <div class="option-option">
            <input type="radio" id="planoSaudeNaoSei" name="planoSaude" value="Não sei">
            <label for="planoSaudeNaoSei">Não sei</label>
          </div>
        </div>
      </div>

      <div id="planosSaudePessoas"></div>
      <div id="planosSaudeDependentes"></div>

      <div class="option-group">
        <label id="label-seguro-vida">Você possui seguro de vida?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-seguro-vida">
          <div class="option-option">
            <input type="radio" id="seguroVidaSim" name="seguroVida" value="Sim">
            <label for="seguroVidaSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="seguroVidaNao" name="seguroVida" value="Não">
            <label for="seguroVidaNao">Não</label>
          </div>
          <div class="option-option">
            <input type="radio" id="seguroVidaNaoSei" name="seguroVida" value="Não sei">
            <label for="seguroVidaNaoSei">Não sei</label>
          </div>
        </div>
      </div>

      <div id="segurosVidaPessoas"></div>
    </div>

    <!-- Seção de patrimônio líquido -->
    <div class="form-section">
      <h2>Patrimônio Líquido</h2>
      <div class="form-group">
        <label for="patrimonioLiquido">
          Seu patrimônio líquido:
          <div class="tooltip">
            <span class="tooltip-icon">?</span>
            <span class="tooltip-text">Soma de todos os seus bens menos suas dívidas</span>
          </div>
        </label>
        <input type="text" id="patrimonioLiquido" name="patrimonioLiquido" class="moeda" placeholder="R$ 0,00">
      </div>
      <div id="patrimoniosPessoas"></div>
    </div>

    <!-- Seção de imposto de renda -->
    <div class="form-section">
      <h2>Imposto de Renda</h2>
      <!-- Perguntas do cliente principal -->
      <div class="option-group">
        <label id="label-declara-ir">Você declara imposto de renda?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-declara-ir">
          <div class="option-option">
            <input type="radio" id="declaraIRSim" name="declaraIR" value="Sim" onchange="toggleDeclaracaoIRCliente(true)">
            <label for="declaraIRSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="declaraIRNao" name="declaraIR" value="Não" onchange="toggleDeclaracaoIRCliente(false)">
            <label for="declaraIRNao">Não</label>
          </div>
        </div>
      </div>

      <div id="declaracaoIRCliente" style="display: none;">
        <div class="option-group">
          <label id="label-tipo-declaracao">Se sim, qual o tipo da sua declaração?</label>
          <div class="option-options" role="radiogroup" aria-labelledby="label-tipo-declaracao">
            <div class="option-option">
              <input type="radio" id="tipoCompleta" name="tipoDeclaracao" value="Completa">
              <label for="tipoCompleta">Completa</label>
            </div>
            <div class="option-option">
              <input type="radio" id="tipoSimplificada" name="tipoDeclaracao" value="Simplificada">
              <label for="tipoSimplificada">Simplificada</label>
            </div>
            <div class="option-option">
              <input type="radio" id="tipoNaoSei" name="tipoDeclaracao" value="Não sei">
              <label for="tipoNaoSei">Não sei</label>
            </div>
          </div>
        </div>

        <div class="option-group">
          <label id="label-resultado-ir">Resultado do seu IR:</label>
          <div class="option-options" role="radiogroup" aria-labelledby="label-resultado-ir">
            <div class="option-option">
              <input type="radio" id="resultadoIRRestitui" name="resultadoIR" value="Restitui">
              <label for="resultadoIRRestitui">Restitui</label>
            </div>
            <div class="option-option">
              <input type="radio" id="resultadoIRPaga" name="resultadoIR" value="Paga">
              <label for="resultadoIRPaga">Paga</label>
            </div>
            <div class="option-option">
              <input type="radio" id="resultadoIRIsento" name="resultadoIR" value="Isento">
              <label for="resultadoIRIsento">Isento</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Perguntas dos outros integrantes com renda -->
      <div id="declaracoesIRPessoas"></div>
    </div>

    <!-- Seção de fluxo de caixa -->
    <div class="form-section" id="secaoFluxoCaixa">
      <h2>Fluxo de Caixa</h2>
      
      <!-- Opção para escolher entre orçamento individual ou somado -->
      <div id="opcaoTipoFluxoCaixa" style="display: none;">
        <div class="option-group">
          <label id="label-tipo-fluxo-caixa">Como você deseja informar o orçamento?</label>
          <div class="option-options" role="radiogroup" aria-labelledby="label-tipo-fluxo-caixa">
            <div class="option-option">
              <input type="radio" id="fluxoCaixaSomado" name="tipoFluxoCaixa" value="Somado" onchange="toggleTipoFluxoCaixa('somado')">
              <label for="fluxoCaixaSomado">Valores somados de todos os integrantes</label>
            </div>
            <div class="option-option">
              <input type="radio" id="fluxoCaixaIndividual" name="tipoFluxoCaixa" value="Individual" onchange="toggleTipoFluxoCaixa('individual')">
              <label for="fluxoCaixaIndividual">Valores individuais para cada pessoa</label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fluxo de caixa somado (padrão) -->
      <div id="fluxoCaixaSomadoContainer">
        <div class="form-group">
          <label id="labelRenda" for="renda">Renda mensal:</label>
          <input type="text" id="renda" name="renda" class="moeda" placeholder="R$ 0,00">
        </div>
        <div class="form-group">
          <label id="labelCustosFixos" for="custosFixos">
            Custos fixos mensais:
            <div class="tooltip">
              <span class="tooltip-icon">?</span>
              <span class="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
            </div>
          </label>
          <input type="text" id="custosFixos" name="custosFixos" class="moeda" placeholder="R$ 0,00">
        </div>
        <div class="form-group">
          <label id="labelCustosVariaveis" for="custosVariaveis">
            Custos variáveis mensais:
            <div class="tooltip">
              <span class="tooltip-icon">?</span>
              <span class="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
            </div>
          </label>
          <input type="text" id="custosVariaveis" name="custosVariaveis" class="moeda" placeholder="R$ 0,00">
        </div>
        <div class="form-group">
          <label id="labelPoupanca" for="poupancaMensal">Quanto você consegue poupar todo mês:</label>
          <input type="text" id="poupancaMensal" name="poupancaMensal" class="moeda" placeholder="R$ 0,00">
        </div>
      </div>
      
      <!-- Fluxo de caixa individual -->
      <div id="fluxoCaixaIndividualContainer" style="display: none;">
        <!-- Container para o cliente principal -->
        <div class="pessoa-fluxo-caixa">
          <h3>Seu orçamento</h3>
          <div class="form-group">
            <label for="rendaCliente">Sua renda mensal:</label>
            <input type="text" id="rendaCliente" name="rendaCliente" class="moeda" placeholder="R$ 0,00">
          </div>
          <div class="form-group">
            <label for="custosFixosCliente">
              Seus custos fixos mensais:
              <div class="tooltip">
                <span class="tooltip-icon">?</span>
                <span class="tooltip-text">Despesas que não variam mensalmente, como aluguel, financiamentos, etc.</span>
              </div>
            </label>
            <input type="text" id="custosFixosCliente" name="custosFixosCliente" class="moeda" placeholder="R$ 0,00">
          </div>
          <div class="form-group">
            <label for="custosVariaveisCliente">
              Seus custos variáveis mensais:
              <div class="tooltip">
                <span class="tooltip-icon">?</span>
                <span class="tooltip-text">Despesas que podem variar mensalmente, como alimentação, lazer, etc.</span>
              </div>
            </label>
            <input type="text" id="custosVariaveisCliente" name="custosVariaveisCliente" class="moeda" placeholder="R$ 0,00">
          </div>
          <div class="form-group">
            <label for="poupancaMensalCliente">Quanto você consegue poupar todo mês:</label>
            <input type="text" id="poupancaMensalCliente" name="poupancaMensalCliente" class="moeda" placeholder="R$ 0,00">
          </div>
        </div>
        
        <!-- Container para as outras pessoas com renda -->
        <div id="fluxoCaixaPessoasContainer"></div>
      </div>
    </div>

    <!-- Seção de cartões e contas -->
    <div class="form-section" id="secaoCartoesContas">
      <h2>Cartões e Contas</h2>
      
      <div class="option-group">
        <label id="labelMilhas" for="usaMilhas">Você reduz custos de viagens utilizando milhas com frequência?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="labelMilhas">
          <div class="option-option">
            <input type="radio" id="usaMilhasSim" name="usaMilhas" value="Sim">
            <label for="usaMilhasSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="usaMilhasNao" name="usaMilhas" value="Não">
            <label for="usaMilhasNao">Não</label>
          </div>
        </div>
      </div>

      <div class="option-group">
        <label id="label-sem-tarifas">Seus cartões e contas são livres de tarifas?</label>
        <div class="option-options" role="radiogroup" aria-labelledby="label-sem-tarifas">
          <div class="option-option">
            <input type="radio" id="semTarifasSim" name="semTarifas" value="Sim">
            <label for="semTarifasSim">Sim</label>
          </div>
          <div class="option-option">
            <input type="radio" id="semTarifasNao" name="semTarifas" value="Não">
            <label for="semTarifasNao">Não</label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Seção de dívidas -->
    <div class="form-section" id="secaoDividas">
      <h2>Dívidas</h2>
      <label>Adicione suas dívidas:</label>
      <div id="listaDividas"></div>
      <button type="button" class="btn btn-adicionar" onclick="adicionarDivida()">
        <span class="sr-only">Adicionar</span> Adicionar Dívida
      </button>
    </div>

    <!-- Seção de informações adicionais -->
    <div class="form-section" id="secaoInfoAdicional">
      <h2>Informações Adicionais</h2>
      <div class="form-group">
        <label for="infoAdicional">Existe alguma informação que você julgue relevante informar?</label>
        <textarea id="infoAdicional" name="infoAdicional" class="info-adicional" placeholder="Digite aqui qualquer informação adicional que você considere importante..."></textarea>
      </div>
    </div>

    <button type="button" class="btn btn-enviar" id="btnEnviar">Enviar Formulário</button>
  </form>

  <div id="successMessage" class="success-message" role="alert">
    Formulário enviado com sucesso! O PDF foi gerado e está disponível para download.
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script>
    // Módulo de Utilidades
    const Utils = {
      // Função para extrair o primeiro nome
      getPrimeiroNome: function(nomeCompleto) {
        return nomeCompleto.split(' ')[0] || nomeCompleto;
      },
      
      // Função para formatar moeda
      formatarMoeda: function(valor) {
        if (!valor) return 'R$ 0,00';
        
        // Remove caracteres não numéricos
        valor = valor.toString().replace(/\D/g, '');
        
        // Converte para número e formata
        valor = (parseFloat(valor) / 100).toFixed(2);
        
        // Formata com separadores de milhar e decimal
        return 'R$ ' + valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      },
      
      // Função para validar email
      validarEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      },
      
      // Função para validar telefone
      validarTelefone: function(telefone) {
        // Remove caracteres não numéricos
        const numeroLimpo = telefone.replace(/\D/g, '');
        // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
        return numeroLimpo.length >= 10 && numeroLimpo.length <= 11;
      },
      
      // Função para formatar telefone
      formatarTelefone: function(telefone) {
        let value = telefone.replace(/\D/g, '');
        
        if (value.length > 11) {
          value = value.substring(0, 11);
        }
        
        if (value.length > 0) {
          value = value.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, function(match, g1, g2, g3) {
            let result = '';
            if (g1) result += `(${g1}`;
            if (g2) result += `) ${g2}`;
            if (g3) result += `-${g3}`;
            return result;
          });
        }
        
        return value;
      },
      
      // Função para debounce (limitar chamadas de função)
      debounce: function(func, wait) {
        let timeout;
        return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
        };
      }
    };

    // Módulo de Gerenciamento de Estado
    const Estado = {
      pessoasComRenda: [],
      dependentes: [],
      tipoFluxoCaixa: 'somado', // 'somado' ou 'individual'
      
      adicionarPessoaRenda: function(pessoa) {
        this.pessoasComRenda.push(pessoa);
        this.atualizarInterface();
      },
      
      atualizarPessoaRenda: function(id, campo, valor) {
        const pessoa = this.pessoasComRenda.find(p => p.id == id);
        if (pessoa) {
          pessoa[campo] = valor;
          this.atualizarInterface();
        }
      },
      
      removerPessoaRenda: function(id) {
        this.pessoasComRenda = this.pessoasComRenda.filter(p => p.id != id);
        this.atualizarInterface();
      },
      
      adicionarDependente: function(dependente) {
        this.dependentes.push(dependente);
        this.atualizarInterface();
      },
      
      atualizarDependente: function(id, campo, valor) {
        const dependente = this.dependentes.find(d => d.id == id);
        if (dependente) {
          dependente[campo] = valor;
          this.atualizarInterface();
        }
      },
      
      removerDependente: function(id) {
        this.dependentes = this.dependentes.filter(d => d.id != id);
        this.atualizarInterface();
      },
      
      limparPessoasRenda: function() {
        this.pessoasComRenda = [];
        this.atualizarInterface();
      },
      
      limparDependentes: function() {
        this.dependentes = [];
        this.atualizarInterface();
      },
      
      setTipoFluxoCaixa: function(tipo) {
        this.tipoFluxoCaixa = tipo;
        this.atualizarInterface();
      },
      
      atualizarInterface: function() {
        UI.atualizarPlanosSaude();
        UI.atualizarSegurosVida();
        UI.atualizarPatrimoniosPessoas();
        UI.atualizarDeclaracoesIR();
        UI.atualizarFluxoCaixaPessoas();
        UI.atualizarTextoFluxoCaixa();
        UI.atualizarOpcoesDividas();
      }
    };

    // Módulo de Interface do Usuário
    const UI = {
      // Função para adicionar pessoa com renda
      adicionarPessoaRenda: function() {
        const id = Date.now();
        const pessoa = { id, nome: '', precisaConcordar: '' };
        
        const container = document.createElement('div');
        container.className = 'pessoa-item';
        container.dataset.id = id;
        container.innerHTML = `
          <div class="patrimonio-row">
            <label for="nomePessoaRenda_${id}">Nome completo:</label>
            <input type="text" id="nomePessoaRenda_${id}" name="nomePessoaRenda" placeholder="Nome completo" oninput="UI.atualizarPessoaRenda(${id}, 'nome', this.value)">
          </div>
          
          <div class="option-group">
            <label id="label-precisa-concordar-${id}">Você precisa que essa pessoa concorde com suas decisões financeiras?</label>
            <div class="option-options" role="radiogroup" aria-labelledby="label-precisa-concordar-${id}">
              <div class="option-option">
                <input type="radio" id="precisaConcordarSim_${id}" name="precisaConcordar${id}" value="Sim" onchange="UI.atualizarPessoaRenda(${id}, 'precisaConcordar', 'Sim')">
                <label for="precisaConcordarSim_${id}">Sim</label>
              </div>
              <div class="option-option">
                <input type="radio" id="precisaConcordarNao_${id}" name="precisaConcordar${id}" value="Não" onchange="UI.atualizarPessoaRenda(${id}, 'precisaConcordar', 'Não')">
                <label for="precisaConcordarNao_${id}">Não</label>
              </div>
            </div>
          </div>
          
          <button type="button" class="delete-btn" onclick="UI.removerPessoaRenda(${id})" aria-label="Excluir pessoa">Excluir</button>
        `;
        
        document.getElementById('pessoasRendaContainer').appendChild(container);
        Estado.adicionarPessoaRenda(pessoa);
        
        // Mostrar opção de tipo de fluxo de caixa quando houver mais de uma pessoa com renda
        document.getElementById('opcaoTipoFluxoCaixa').style.display = 'block';
      },
      
      atualizarPessoaRenda: function(id, campo, valor) {
        Estado.atualizarPessoaRenda(id, campo, valor);
      },
      
      removerPessoaRenda: function(id) {
        const elemento = document.querySelector(`.pessoa-item[data-id="${id}"]`);
        if (elemento) {
          elemento.remove();
        }
        Estado.removerPessoaRenda(id);
        
        // Ocultar opção de tipo de fluxo de caixa se não houver mais pessoas com renda
        if (Estado.pessoasComRenda.length === 0) {
          document.getElementById('opcaoTipoFluxoCaixa').style.display = 'none';
          // Voltar para o modo somado
          toggleTipoFluxoCaixa('somado');
        }
      },
      
      // Função para adicionar dependente
      adicionarDependente: function() {
        const id = Date.now();
        const dependente = { id, nome: '' };
        
        const container = document.createElement('div');
        container.className = 'dependente-item';
        container.dataset.id = id;
        container.innerHTML = `
          <div class="patrimonio-row">
            <label for="nomeDependente_${id}">Nome completo:</label>
            <input type="text" id="nomeDependente_${id}" name="nomeDependente" placeholder="Nome completo" oninput="UI.atualizarDependente(${id}, 'nome', this.value)">
          </div>
          
          <button type="button" class="delete-btn" onclick="UI.removerDependente(${id})" aria-label="Excluir dependente">Excluir</button>
        `;
        
        document.getElementById('dependentesContainer').appendChild(container);
        Estado.adicionarDependente(dependente);
      },
      
      atualizarDependente: function(id, campo, valor) {
        Estado.atualizarDependente(id, campo, valor);
      },
      
      removerDependente: function(id) {
        const elemento = document.querySelector(`.dependente-item[data-id="${id}"]`);
        if (elemento) {
          elemento.remove();
        }
        Estado.removerDependente(id);
      },
      
      // Função para adicionar patrimônio
      adicionarPatrimonio: function() {
        const id = Date.now();
        const container = document.createElement('div');
        container.className = 'patrimonio-item';
        container.dataset.id = id;
        container.innerHTML = `
          <div class="patrimonio-row">
            <label for="tipoBem_${id}">Tipo do patrimônio</label>
            <input type="text" id="tipoBem_${id}" name="tipoBem" placeholder="Ex: Imóvel, Carro">
          </div>
          
          <div class="patrimonio-row">
            <div class="option-group">
              <label id="label-tem-seguro-${id}">Possui seguro?</label>
              <div class="option-options" role="radiogroup" aria-labelledby="label-tem-seguro-${id}">
                <div class="option-option">
                  <input type="radio" id="temSeguroSim_${id}" name="temSeguro_${id}" value="Sim">
                  <label for="temSeguroSim_${id}">Sim</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="temSeguroNao_${id}" name="temSeguro_${id}" value="Não">
                  <label for="temSeguroNao_${id}">Não</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="patrimonio-row">
            <label for="descricaoBem_${id}">Qual o patrimônio</label>
            <input type="text" id="descricaoBem_${id}" name="descricaoBem" placeholder="Ex: Corolla 2020, Casa em SP">
          </div>
          
          <button type="button" class="delete-btn" onclick="this.parentElement.remove()" aria-label="Excluir patrimônio">Excluir</button>
        `;
        document.getElementById('listaPatrimonios').appendChild(container);
      },
      
      // Função para adicionar dívida
      adicionarDivida: function() {
        const id = Date.now();
        const container = document.createElement('div');
        container.className = 'divida-item';
        container.dataset.id = id;
        
        let opcoesProprietario = '<option value="">Selecione</option>';
        opcoesProprietario += '<option value="cliente">Você</option>';
        
        Estado.pessoasComRenda.forEach(pessoa => {
          if (pessoa.nome) {
            const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
            opcoesProprietario += `<option value="${pessoa.id}">${primeiroNome}</option>`;
          }
        });
        
        container.innerHTML = `
          <div class="patrimonio-row">
            <label for="valorDivida_${id}">Valor da dívida</label>
            <input type="text" id="valorDivida_${id}" name="valorDivida" class="moeda" placeholder="R$ 0,00">
          </div>
          
          <div class="patrimonio-row">
            <label for="motivoDivida_${id}">Motivo da dívida</label>
            <input type="text" id="motivoDivida_${id}" name="motivoDivida" placeholder="Ex: Financiamento, Empréstimo pessoal">
          </div>
          
          <div class="patrimonio-row">
            <label for="proprietarioDivida_${id}">A quem pertence esta dívida</label>
            <select id="proprietarioDivida_${id}" name="proprietarioDivida">
              ${opcoesProprietario}
            </select>
          </div>
          
          <button type="button" class="delete-btn" onclick="this.parentElement.remove()" aria-label="Excluir dívida">Excluir</button>
        `;
        
        document.getElementById('listaDividas').appendChild(container);
        
        // Aplicar formatação de moeda
        const inputValor = container.querySelector(`#valorDivida_${id}`);
        inputValor.addEventListener('input', function() {
          this.value = Utils.formatarMoeda(this.value);
        });
      },
      
      // Atualizar opções de proprietários nas dívidas existentes
      atualizarOpcoesDividas: function() {
        const dividas = document.querySelectorAll('.divida-item');
        
        dividas.forEach(divida => {
          const id = divida.dataset.id;
          const select = divida.querySelector(`select[id^="proprietarioDivida"]`);
          const valorAtual = select.value;
          
          let opcoesProprietario = '<option value="">Selecione</option>';
          opcoesProprietario += '<option value="cliente">Você</option>';
          
          Estado.pessoasComRenda.forEach(pessoa => {
            if (pessoa.nome) {
              const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
              opcoesProprietario += `<option value="${pessoa.id}">${primeiroNome}</option>`;
            }
          });
          
          select.innerHTML = opcoesProprietario;
          
          // Restaurar valor selecionado se possível
          if (valorAtual) {
            const opcaoExistente = select.querySelector(`option[value="${valorAtual}"]`);
            if (opcaoExistente) {
              select.value = valorAtual;
            }
          }
        });
      },
      
      // Funções para atualizar seções dinâmicas
      atualizarPlanosSaude: function() {
        // Atualizar planos de saúde para pessoas com renda
        const containerPessoas = document.getElementById('planosSaudePessoas');
        containerPessoas.innerHTML = '';
        
        Estado.pessoasComRenda.forEach(pessoa => {
          if (pessoa.nome) {
            const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
            const div = document.createElement('div');
            div.className = 'option-group';
            const labelId = `label-plano-saude-${pessoa.id}`;
            div.innerHTML = `
              <label id="${labelId}">${primeiroNome} possui plano de saúde?</label>
              <div class="option-options" role="radiogroup" aria-labelledby="${labelId}">
                <div class="option-option">
                  <input type="radio" id="planoSaudeSim_${pessoa.id}" name="planoSaude_${pessoa.id}" value="Sim">
                  <label for="planoSaudeSim_${pessoa.id}">Sim</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="planoSaudeNao_${pessoa.id}" name="planoSaude_${pessoa.id}" value="Não">
                  <label for="planoSaudeNao_${pessoa.id}">Não</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="planoSaudeNaoSei_${pessoa.id}" name="planoSaude_${pessoa.id}" value="Não sei">
                  <label for="planoSaudeNaoSei_${pessoa.id}">Não sei</label>
                </div>
              </div>
            `;
            containerPessoas.appendChild(div);
          }
        });
        
        // Atualizar planos de saúde para dependentes
        const containerDependentes = document.getElementById('planosSaudeDependentes');
        containerDependentes.innerHTML = '';
        
        Estado.dependentes.forEach(dependente => {
          if (dependente.nome) {
            const primeiroNome = Utils.getPrimeiroNome(dependente.nome);
            const div = document.createElement('div');
            div.className = 'option-group';
            const labelId = `label-plano-saude-dep-${dependente.id}`;
            div.innerHTML = `
              <label id="${labelId}">${primeiroNome} possui plano de saúde?</label>
              <div class="option-options" role="radiogroup" aria-labelledby="${labelId}">
                <div class="option-option">
                  <input type="radio" id="planoSaudeDependenteSim_${dependente.id}" name="planoSaudeDependente_${dependente.id}" value="Sim">
                  <label for="planoSaudeDependenteSim_${dependente.id}">Sim</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="planoSaudeDependenteNao_${dependente.id}" name="planoSaudeDependente_${dependente.id}" value="Não">
                  <label for="planoSaudeDependenteNao_${dependente.id}">Não</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="planoSaudeDependenteNaoSei_${dependente.id}" name="planoSaudeDependente_${dependente.id}" value="Não sei">
                  <label for="planoSaudeDependenteNaoSei_${dependente.id}">Não sei</label>
                </div>
              </div>
            `;
            containerDependentes.appendChild(div);
          }
        });
      },
      
      atualizarSegurosVida: function() {
        const container = document.getElementById('segurosVidaPessoas');
        container.innerHTML = '';
        
        Estado.pessoasComRenda.forEach(pessoa => {
          if (pessoa.nome) {
            const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
            const div = document.createElement('div');
            div.className = 'option-group';
            const labelId = `label-seguro-vida-${pessoa.id}`;
            div.innerHTML = `
              <label id="${labelId}">${primeiroNome} possui seguro de vida?</label>
              <div class="option-options" role="radiogroup" aria-labelledby="${labelId}">
                <div class="option-option">
                  <input type="radio" id="seguroVidaSim_${pessoa.id}" name="seguroVida_${pessoa.id}" value="Sim">
                  <label for="seguroVidaSim_${pessoa.id}">Sim</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="seguroVidaNao_${pessoa.id}" name="seguroVida_${pessoa.id}" value="Não">
                  <label for="seguroVidaNao_${pessoa.id}">Não</label>
                </div>
                <div class="option-option">
                  <input type="radio" id="seguroVidaNaoSei_${pessoa.id}" name="seguroVida_${pessoa.id}" value="Não sei">
                  <label for="seguroVidaNaoSei_${pessoa.id}">Não sei</label>
                </div>
              </div>
            `;
            container.appendChild(div);
          }
        });
      },
      
      atualizarPatrimoniosPessoas: function() {
        const container = document.getElementById('patrimoniosPessoas');
        container.innerHTML = '';
        
        Estado.pessoasComRenda.forEach(pessoa => {
          if (pessoa.nome) {
            const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
              <label for="patrimonio_${pessoa.id}">Patrimônio líquido de ${primeiroNome}:</label>
              <input type="text" id="patrimonio_${pessoa.id}" name="patrimonio_${pessoa.id}" class="moeda" placeholder="R$ 0,00">
            `;
            container.appendChild(div);
            
            // Aplicar formatação de moeda ao novo campo
            const input = div.querySelector(`#patrimonio_${pessoa.id}`);
            input.addEventListener('input', function() {
              this.value = Utils.formatarMoeda(this.value);
            });
          }
        });
      },
      
      atualizarDeclaracoesIR: function() {
        const container = document.getElementById('declaracoesIRPessoas');
        container.innerHTML = '';
        
        Estado.pessoasComRenda.forEach(pessoa => {
          if (pessoa.nome) {
            const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
            const pessoaDiv = document.createElement('div');
            pessoaDiv.className = 'pessoa-ir-container';
            const labelId = `label-declara-ir-${pessoa.id}`;
            pessoaDiv.innerHTML = `
              <div class="option-group">
                <label id="${labelId}">${primeiroNome} declara imposto de renda?</label>
                <div class="option-options" role="radiogroup" aria-labelledby="${labelId}">
                  <div class="option-option">
                    <input type="radio" id="declaraIRSim_${pessoa.id}" name="declaraIR_${pessoa.id}" value="Sim" onchange="UI.toggleDeclaracaoIRPessoa(${pessoa.id}, true)">
                    <label for="declaraIRSim_${pessoa.id}">Sim</label>
                  </div>
                  <div class="option-option">
                    <input type="radio" id="declaraIRNao_${pessoa.id}" name="declaraIR_${pessoa.id}" value="Não" onchange="UI.toggleDeclaracaoIRPessoa(${pessoa.id}, false)">
                    <label for="declaraIRNao_${pessoa.id}">Não</label>
                  </div>
                </div>
              </div>
              
              <div id="declaracaoIRPessoa_${pessoa.id}" style="display: none;">
                <div class="option-group">
                  <label id="label-tipo-declaracao-${pessoa.id}">Se sim, qual o tipo da declaração de ${primeiroNome}?</label>
                  <div class="option-options" role="radiogroup" aria-labelledby="label-tipo-declaracao-${pessoa.id}">
                    <div class="option-option">
                      <input type="radio" id="tipoCompleta_${pessoa.id}" name="tipoDeclaracao_${pessoa.id}" value="Completa">
                      <label for="tipoCompleta_${pessoa.id}">Completa</label>
                    </div>
                    <div class="option-option">
                      <input type="radio" id="tipoSimplificada_${pessoa.id}" name="tipoDeclaracao_${pessoa.id}" value="Simplificada">
                      <label for="tipoSimplificada_${pessoa.id}">Simplificada</label>
                    </div>
                    <div class="option-option">
                      <input type="radio" id="tipoNaoSei_${pessoa.id}" name="tipoDeclaracao_${pessoa.id}" value="Não sei">
                      <label for="tipoNaoSei_${pessoa.id}">Não sei</label>
                    </div>
                  </div>
                </div>
                
                <div class="option-group">
                  <label id="label-resultado-ir-${pessoa.id}">Resultado do IR de ${primeiroNome}:</label>
                  <div class="option-options" role="radiogroup" aria-labelledby="label-resultado-ir-${pessoa.id}">
                    <div class="option-option">
                      <input type="radio" id="resultadoIRRestitui_${pessoa.id}" name="resultadoIR_${pessoa.id}" value="Restitui">
                      <label for="resultadoIRRestitui_${pessoa.id}">Restitui</label>
                    </div>
                    <div class="option-option">
                      <input type="radio" id="resultadoIRPaga_${pessoa.id}" name="resultadoIR_${pessoa.id}" value="Paga">
                      <label for="resultadoIRPaga_${pessoa.id}">Paga</label>
                    </div>
                    <div class="option-option">
                      <input type="radio" id="resultadoIRIsento_${pessoa.id}" name="resultadoIR_${pessoa.id}" value="Isento">
                      <label for="resultadoIRIsento_${pessoa.id}">Isento</label>
                    </div>
                  </div>
                </div>
              </div>
            `;
            container.appendChild(pessoaDiv);
          }
        });
      },
      
      toggleDeclaracaoIRPessoa: function(id, mostrar) {
        const secao = document.getElementById(`declaracaoIRPessoa_${id}`);
        secao.style.display = mostrar ? 'block' : 'none';
      },
      
      // Atualizar fluxo de caixa para pessoas com renda (modo individual)
      atualizarFluxoCaixaPessoas: function() {
        const container = document.getElementById('fluxoCaixaPessoasContainer');
        container.innerHTML = '';
        
        if (Estado.tipoFluxoCaixa === 'individual') {
          Estado.pessoasComRenda.forEach(pessoa => {
            if (pessoa.nome) {
              const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
              const div = document.createElement('div');
              div.className = 'pessoa-fluxo-caixa';
              div.innerHTML = `
                <h3>Orçamento de ${primeiroNome}</h3>
                <div class="option-group">
                  <label id="label-conhece-dados-${pessoa.id}">Você conhece o orçamento de ${primeiroNome}?</label>
                  <div class="option-options" role="radiogroup" aria-labelledby="label-conhece-dados-${pessoa.id}">
                    <div class="option-option">
                      <input type="radio" id="conheceDadosSim_${pessoa.id}" name="conheceDados_${pessoa.id}" value="Sim" onchange="UI.toggleConheceDados(${pessoa.id}, true)">
                      <label for="conheceDadosSim_${pessoa.id}">Sim</label>
                    </div>
                    <div class="option-option">
                      <input type="radio" id="conheceDadosNao_${pessoa.id}" name="conheceDados_${pessoa.id}" value="Não" onchange="UI.toggleConheceDados(${pessoa.id}, false)">
                      <label for="conheceDadosNao_${pessoa.id}">Não</label>
                    </div>
                  </div>
                </div>
                
                <div id="dadosFinanceiros_${pessoa.id}" style="display: none;">
                  <div class="form-group">
                    <label for="renda_${pessoa.id}">Renda mensal de ${primeiroNome}:</label>
                    <input type="text" id="renda_${pessoa.id}" name="renda_${pessoa.id}" class="moeda" placeholder="R$ 0,00">
                  </div>
                  <div class="form-group">
                    <label for="custosFixos_${pessoa.id}">Custos fixos mensais de ${primeiroNome}:</label>
                    <input type="text" id="custosFixos_${pessoa.id}" name="custosFixos_${pessoa.id}" class="moeda" placeholder="R$ 0,00">
                  </div>
                  <div class="form-group">
                    <label for="custosVariaveis_${pessoa.id}">Custos variáveis mensais de ${primeiroNome}:</label>
                    <input type="text" id="custosVariaveis_${pessoa.id}" name="custosVariaveis_${pessoa.id}" class="moeda" placeholder="R$ 0,00">
                  </div>
                  <div class="form-group">
                    <label for="poupancaMensal_${pessoa.id}">Quanto ${primeiroNome} consegue poupar todo mês:</label>
                    <input type="text" id="poupancaMensal_${pessoa.id}" name="poupancaMensal_${pessoa.id}" class="moeda" placeholder="R$ 0,00">
                  </div>
                </div>
              `;
              container.appendChild(div);
              
              // Aplicar formatação de moeda aos novos campos
              div.querySelectorAll('input.moeda').forEach(input => {
                input.addEventListener('input', function() {
                  this.value = Utils.formatarMoeda(this.value);
                });
              });
            }
          });
        }
      },
      
      toggleConheceDados: function(id, conhece) {
        const secao = document.getElementById(`dadosFinanceiros_${id}`);
        secao.style.display = conhece ? 'block' : 'none';
      },
      
      atualizarTextoFluxoCaixa: function() {
        const labelRenda = document.getElementById('labelRenda');
        
        if (Estado.pessoasComRenda.length > 0 && Estado.tipoFluxoCaixa === 'somado') {
          const nomes = Estado.pessoasComRenda.map(p => Utils.getPrimeiroNome(p.nome)).filter(n => n);
          if (nomes.length > 0) {
            const texto = nomes.length > 1 ? 
              `Você, ${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : 
              `Você e ${nomes[0]}`;
              
            labelRenda.textContent = `${texto} têm renda mensal de:`;
          }
        } else {
          labelRenda.textContent = 'Renda mensal:';
        }
      },
      
      // Funções para mostrar/ocultar seções
      togglePessoasRenda: function(ocultar) {
        document.getElementById('listaPessoasRenda').style.display = ocultar ? 'none' : 'block';
        if (ocultar) {
          document.getElementById('pessoasRendaContainer').innerHTML = '';
          Estado.limparPessoasRenda();
          
          // Ocultar opção de tipo de fluxo de caixa
          document.getElementById('opcaoTipoFluxoCaixa').style.display = 'none';
          // Voltar para o modo somado
          toggleTipoFluxoCaixa('somado');
        }
      },
      
      toggleDependentes: function(mostrar) {
        document.getElementById('listaDependentes').style.display = mostrar ? 'block' : 'none';
        if (!mostrar) {
          document.getElementById('dependentesContainer').innerHTML = '';
          Estado.limparDependentes();
        }
      },
      
      toggleDeclaracaoIRCliente: function(mostrar) {
        document.getElementById('declaracaoIRCliente').style.display = mostrar ? 'block' : 'none';
      },
      
      toggleTipoFluxoCaixa: function(tipo) {
        Estado.setTipoFluxoCaixa(tipo);
        
        // Mostrar/ocultar containers apropriados
        if (tipo === 'somado') {
          document.getElementById('fluxoCaixaSomadoContainer').style.display = 'block';
          document.getElementById('fluxoCaixaIndividualContainer').style.display = 'none';
        } else {
          document.getElementById('fluxoCaixaSomadoContainer').style.display = 'none';
          document.getElementById('fluxoCaixaIndividualContainer').style.display = 'block';
        }
      },
      
      // Inicializar eventos de UI
      inicializarEventos: function() {
        // Aplicar formatação de moeda a todos os campos de moeda
        document.querySelectorAll('input.moeda').forEach(input => {
          input.addEventListener('input', function() {
            this.value = Utils.formatarMoeda(this.value);
          });
        });
        
        // Associar função gerarPDF ao botão de enviar
        document.getElementById('btnEnviar').addEventListener('click', PDF.gerarPDF);
      }
    };

    // Módulo de Geração de PDF
    const PDF = {
      gerarPDF: async function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const data = new Date().toLocaleDateString();
        let y = 20;
        
        // Estilo para títulos
        const addTitulo = (texto, y) => {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(texto, 20, y);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          return y + 10;
        };
        
        // Estilo para subtítulos
        const addSubtitulo = (texto, y) => {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(texto, 20, y);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          return y + 8;
        };
        
        // Estilo para texto normal
        const addTexto = (texto, y) => {
          doc.text(texto, 20, y);
          return y + 7;
        };
        
        // Verificar se precisa adicionar nova página
        const verificarPagina = (y) => {
          if (y >= 270) {
            doc.addPage();
            return 20;
          }
          return y;
        };
        
        // Título do documento
        y = addTitulo('Formulário de Atendimento Financeiro', y);
        y = addTexto(`Data: ${data}`, y);
        y = verificarPagina(y + 5);
        
        // Informações básicas
        y = addSubtitulo('Informações Pessoais', y);
        const nome = document.getElementById('nome').value.trim();
        
        y = addTexto(`Nome: ${nome}`, y);
        y = verificarPagina(y + 10);
        
        // Informações sobre pessoas com renda
        if (Estado.pessoasComRenda.length > 0) {
          y = addSubtitulo('Outras pessoas com renda na casa', y);
          
          Estado.pessoasComRenda.forEach(pessoa => {
            if (pessoa.nome) {
              const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
              y = addTexto(`- ${pessoa.nome} ${pessoa.precisaConcordar ? `(Precisa concordar: ${pessoa.precisaConcordar})` : ''}`, y);
              y = verificarPagina(y);
            }
          });
          
          y = verificarPagina(y + 5);
        }
        
        // Informações sobre dependentes
        if (Estado.dependentes.length > 0) {
          y = addSubtitulo('Dependentes', y);
          
          Estado.dependentes.forEach(dependente => {
            if (dependente.nome) {
              y = addTexto(`- ${dependente.nome}`, y);
              y = verificarPagina(y);
            }
          });
          
          y = verificarPagina(y + 5);
        }
        
        // Patrimônios
        const patrimonios = document.querySelectorAll('.patrimonio-item');
        if (patrimonios.length > 0) {
          y = addSubtitulo('Patrimônios', y);
          
          patrimonios.forEach((item, index) => {
            const tipo = item.querySelector('input[name^="tipoBem"]').value || 'Não informado';
            const seguro = item.querySelector('input[name^="temSeguro"]:checked')?.value || 'Não informado';
            const descricao = item.querySelector('input[name^="descricaoBem"]').value || 'Não informado';
            
            y = addTexto(`${index + 1}. ${descricao} (${tipo})`, y);
            y = addTexto(`   Seguro: ${seguro}`, y);
            y = verificarPagina(y + 3);
          });
          
          y = verificarPagina(y + 5);
        }
        
        // Seguros e Planos
        y = addSubtitulo('Seguros e Planos', y);
        const planoSaude = document.querySelector('input[name="planoSaude"]:checked')?.value || 'Não informado';
        const seguroVida = document.querySelector('input[name="seguroVida"]:checked')?.value || 'Não informado';
        
        y = addTexto(`Plano de Saúde: ${planoSaude}`, y);
        y = addTexto(`Seguro de Vida: ${seguroVida}`, y);
        y = verificarPagina(y + 5);
        
        // Patrimônio Líquido
        y = addSubtitulo('Patrimônio Líquido', y);
        const patrimonioLiquido = document.getElementById('patrimonioLiquido').value || 'Não informado';
        y = addTexto(`Patrimônio Líquido: ${patrimonioLiquido}`, y);
        y = verificarPagina(y + 5);
        
        // Imposto de Renda
        y = addSubtitulo('Imposto de Renda', y);
        const declaraIR = document.querySelector('input[name="declaraIR"]:checked')?.value || 'Não informado';
        y = addTexto(`Declara IR: ${declaraIR}`, y);
        
        if (declaraIR === 'Sim') {
          const tipoDeclaracao = document.querySelector('input[name="tipoDeclaracao"]:checked')?.value || 'Não informado';
          const resultadoIR = document.querySelector('input[name="resultadoIR"]:checked')?.value || 'Não informado';
          
          y = addTexto(`Tipo de Declaração: ${tipoDeclaracao}`, y);
          y = addTexto(`Resultado do IR: ${resultadoIR}`, y);
        }
        
        y = verificarPagina(y + 5);
        
        // Fluxo de Caixa
        y = addSubtitulo('Fluxo de Caixa', y);
        
        if (Estado.tipoFluxoCaixa === 'somado') {
          const renda = document.getElementById('renda').value || 'Não informado';
          const custosFixos = document.getElementById('custosFixos').value || 'Não informado';
          const custosVariaveis = document.getElementById('custosVariaveis').value || 'Não informado';
          const poupancaMensal = document.getElementById('poupancaMensal').value || 'Não informado';
          
          y = addTexto(`Tipo de Fluxo: Valores somados`, y);
          y = addTexto(`Renda Mensal: ${renda}`, y);
          y = addTexto(`Custos Fixos: ${custosFixos}`, y);
          y = addTexto(`Custos Variáveis: ${custosVariaveis}`, y);
          y = addTexto(`Poupança Mensal: ${poupancaMensal}`, y);
        } else {
          y = addTexto(`Tipo de Fluxo: Valores individuais`, y);
          
          // Cliente principal
          const rendaCliente = document.getElementById('rendaCliente').value || 'Não informado';
          const custosFixosCliente = document.getElementById('custosFixosCliente').value || 'Não informado';
          const custosVariaveisCliente = document.getElementById('custosVariaveisCliente').value || 'Não informado';
          const poupancaMensalCliente = document.getElementById('poupancaMensalCliente').value || 'Não informado';
          
          y = addTexto(`Seus dados:`, y);
          y = addTexto(`- Renda Mensal: ${rendaCliente}`, y);
          y = addTexto(`- Custos Fixos: ${custosFixosCliente}`, y);
          y = addTexto(`- Custos Variáveis: ${custosVariaveisCliente}`, y);
          y = addTexto(`- Poupança Mensal: ${poupancaMensalCliente}`, y);
          y = verificarPagina(y + 3);
          
          // Outras pessoas com renda
          Estado.pessoasComRenda.forEach(pessoa => {
            if (pessoa.nome) {
              const primeiroNome = Utils.getPrimeiroNome(pessoa.nome);
              const conheceDados = document.querySelector(`input[name="conheceDados_${pessoa.id}"]:checked`)?.value || 'Não';
              
              y = addTexto(`Dados de ${primeiroNome}:`, y);
              y = addTexto(`- Conhece os dados: ${conheceDados}`, y);
              
              if (conheceDados === 'Sim') {
                const renda = document.getElementById(`renda_${pessoa.id}`).value || 'Não informado';
                const custosFixos = document.getElementById(`custosFixos_${pessoa.id}`).value || 'Não informado';
                const custosVariaveis = document.getElementById(`custosVariaveis_${pessoa.id}`).value || 'Não informado';
                const poupancaMensal = document.getElementById(`poupancaMensal_${pessoa.id}`).value || 'Não informado';
                
                y = addTexto(`- Renda Mensal: ${renda}`, y);
                y = addTexto(`- Custos Fixos: ${custosFixos}`, y);
                y = addTexto(`- Custos Variáveis: ${custosVariaveis}`, y);
                y = addTexto(`- Poupança Mensal: ${poupancaMensal}`, y);
              }
              
              y = verificarPagina(y + 3);
            }
          });
        }
        
        y = verificarPagina(y + 5);
        
        // Cartões e Contas
        y = addSubtitulo('Cartões e Contas', y);
        const usaMilhas = document.querySelector('input[name="usaMilhas"]:checked')?.value || 'Não informado';
        const semTarifas = document.querySelector('input[name="semTarifas"]:checked')?.value || 'Não informado';
        
        y = addTexto(`Reduz custos de viagens utilizando milhas: ${usaMilhas}`, y);
        y = addTexto(`Cartões/Contas sem Tarifas: ${semTarifas}`, y);
        y = verificarPagina(y + 5);
        
        // Dívidas
        const dividas = document.querySelectorAll('.divida-item');
        if (dividas.length > 0) {
          y = addSubtitulo('Dívidas', y);
          
          dividas.forEach((item, index) => {
            const valor = item.querySelector('input[name^="valorDivida"]').value || 'Não informado';
            const motivo = item.querySelector('input[name^="motivoDivida"]').value || 'Não informado';
            const proprietarioSelect = item.querySelector('select[name^="proprietarioDivida"]');
            let proprietario = 'Não informado';
            
            if (proprietarioSelect.value) {
              if (proprietarioSelect.value === 'cliente') {
                proprietario = 'Você';
              } else {
                const pessoa = Estado.pessoasComRenda.find(p => p.id == proprietarioSelect.value);
                if (pessoa && pessoa.nome) {
                  proprietario = Utils.getPrimeiroNome(pessoa.nome);
                }
              }
            }
            
            y = addTexto(`${index + 1}. Valor: ${valor}`, y);
            y = addTexto(`   Motivo: ${motivo}`, y);
            y = addTexto(`   Proprietário: ${proprietario}`, y);
            y = verificarPagina(y + 3);
          });
          
          y = verificarPagina(y + 5);
        }
        
        // Informações Adicionais
        const infoAdicional = document.getElementById('infoAdicional').value.trim();
        if (infoAdicional) {
          y = addSubtitulo('Informações Adicionais', y);
          
          // Dividir o texto em linhas para não ultrapassar a largura da página
          const linhas = doc.splitTextToSize(infoAdicional, 170);
          linhas.forEach(linha => {
            y = addTexto(linha, y);
            y = verificarPagina(y);
          });
        }
        
        // Salvar o PDF
        const nomeArquivo = `Formulario-${nome.replace(/\s+/g, '-')}-${data.replace(/\//g, '-')}.pdf`;
        doc.save(nomeArquivo);
        
        // Mostrar mensagem de sucesso
        document.getElementById('successMessage').style.display = 'block';
        setTimeout(() => {
          document.getElementById('successMessage').style.display = 'none';
        }, 5000);
      }
    };

    // Inicializar a aplicação
    document.addEventListener('DOMContentLoaded', function() {
      UI.inicializarEventos();
      
      // Funções globais que precisam ser acessíveis pelo HTML
      window.adicionarPessoaRenda = UI.adicionarPessoaRenda;
      window.adicionarDependente = UI.adicionarDependente;
      window.adicionarPatrimonio = UI.adicionarPatrimonio;
      window.adicionarDivida = UI.adicionarDivida;
      window.togglePessoasRenda = UI.togglePessoasRenda;
      window.toggleDependentes = UI.toggleDependentes;
      window.toggleDeclaracaoIRCliente = UI.toggleDeclaracaoIRCliente;
      window.toggleDeclaracaoIRPessoa = UI.toggleDeclaracaoIRPessoa;
      window.toggleTipoFluxoCaixa = UI.toggleTipoFluxoCaixa;
      window.toggleConheceDados = UI.toggleConheceDados;
    });
  </script>
</body>
</html>
