import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';
import Submission from '../../../models/Submission';

export default async function handler(req, res) {
  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições POST
  if (req.method === 'POST') {
    try {
      const { formId, data } = req.body;

      // Validar dados de entrada
      if (!formId || !data) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID do formulário e dados são obrigatórios' 
        });
      }

      // Verificar se o formulário existe
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(404).json({ 
          success: false, 
          message: 'Formulário não encontrado' 
        });
      }

      // Gerar resumo inteligente e sugestões de documentos
      const summary = generateSummary(data);
      const suggestedDocuments = suggestDocuments(data);

      // Criar nova submissão
      const submission = await Submission.create({
        formId,
        data,
        submittedAt: new Date(),
        summary,
        suggestedDocuments
      });

      // Atualizar o status do formulário para completed e marcar como usado
      await Form.findByIdAndUpdate(
        formId,
        { status: 'completed', used: true },
        { new: true }
      );

      // Retornar sucesso
      return res.status(201).json({
        success: true,
        data: {
          submissionId: submission._id
        }
      });
    } catch (error) {
      console.error('Erro ao criar submissão:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao processar submissão do formulário' 
      });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      success: false, 
      message: `Método ${req.method} não permitido` 
    });
  }
}

// Função para gerar um resumo inteligente dos dados do formulário
function generateSummary(data) {
  let summary = '';
  
  // Nome do cliente
  if (data.nome) {
    summary += `O cliente ${data.nome} preencheu o formulário de atendimento financeiro. `;
  }

  // Situação de renda
  if (data.unicaRenda === 'Sim') {
    summary += 'É a única pessoa com renda na residência. ';
  } else if (data.unicaRenda === 'Não') {
    summary += 'Compartilha a renda da residência com outras pessoas. ';
  }

  // Dependentes
  if (data.temDependentes === 'Sim') {
    summary += 'Possui dependentes. ';
  } else if (data.temDependentes === 'Não') {
    summary += 'Não possui dependentes. ';
  }

  // Plano de saúde
  if (data.planoSaude === 'Sim') {
    summary += 'Possui plano de saúde. ';
  } else if (data.planoSaude === 'Não') {
    summary += 'Não possui plano de saúde. ';
  }

  // Seguro de vida
  if (data.seguroVida === 'Sim') {
    summary += 'Possui seguro de vida. ';
  } else if (data.seguroVida === 'Não') {
    summary += 'Não possui seguro de vida. ';
  }

  // Declaração de IR
  if (data.declaraIR === 'Sim') {
    summary += `Declara imposto de renda (${data.tipoDeclaracao || 'tipo não especificado'}). `;
    if (data.resultadoIR) {
      summary += `Resultado do IR: ${data.resultadoIR}. `;
    }
  } else if (data.declaraIR === 'Não') {
    summary += 'Não declara imposto de renda. ';
  }

  // Uso de milhas
  if (data.usaMilhas === 'Sim') {
    summary += 'Utiliza milhas para reduzir custos de viagens. ';
  } else if (data.usaMilhas === 'Não') {
    summary += 'Não utiliza milhas para viagens. ';
  }

  // Tarifas bancárias
  if (data.semTarifas === 'Sim') {
    summary += 'Possui cartões e contas livres de tarifas. ';
  } else if (data.semTarifas === 'Não') {
    summary += 'Paga tarifas em cartões e contas bancárias. ';
  }

  // Informações adicionais
  if (data.infoAdicional && data.infoAdicional.trim() !== '') {
    summary += 'Forneceu informações adicionais que devem ser consideradas na análise.';
  }

  return summary;
}

// Função para sugerir documentos com base nos dados do formulário
function suggestDocuments(data) {
  const documents = [
    'Documento de identificação (RG/CNH)',
    'CPF',
    'Comprovante de residência'
  ];

  // Adicionar documentos baseados nas respostas
  if (data.unicaRenda === 'Não') {
    documents.push('Comprovantes de renda de todos os integrantes da família');
  } else {
    documents.push('Comprovante de renda');
  }

  if (data.temDependentes === 'Sim') {
    documents.push('Documentos dos dependentes (certidão de nascimento/RG)');
  }

  if (data.declaraIR === 'Sim') {
    documents.push('Última declaração de imposto de renda completa');
    documents.push('Recibo de entrega da declaração');
  }

  // Documentos relacionados a patrimônios
  documents.push('Extratos bancários dos últimos 3 meses');
  documents.push('Extratos de investimentos atualizados (se houver)');

  // Documentos relacionados a dívidas
  documents.push('Faturas de cartões de crédito dos últimos 3 meses (se houver)');
  documents.push('Contratos de financiamentos ou empréstimos ativos (se houver)');

  return documents;
}
