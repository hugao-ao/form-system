import dbConnect from '../../../../lib/mongoose';
import Form from '../../../../models/Form';
import Submission from '../../../../models/Submission';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Conectar ao banco de dados
  await dbConnect();

  // Processar requisições GET para gerar HTML para impressão
  if (req.method === 'GET') {
    try {
      // Verificar se o ID foi fornecido
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do formulário é obrigatório'
        });
      }
      
      // Buscar o formulário pelo ID
      const form = await Form.findById(id);
      
      // Verificar se o formulário existe
      if (!form) {
        return res.status(404).json({
          success: false,
          message: 'Formulário não encontrado'
        });
      }
      
      // Buscar a submissão pelo ID do formulário
      const submission = await Submission.findOne({ formId: id });
      
      // Gerar HTML para impressão
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Atendimento - ${form.clientName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
            }
            h1 {
              color: #002d26;
              text-align: center;
              margin-bottom: 30px;
            }
            h2 {
              color: #014034;
              margin-top: 30px;
              margin-bottom: 15px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-block {
              margin-bottom: 20px;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                margin: 20px;
              }
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Atendimento Financeiro</h1>
          
          <div class="info-block">
            <h2>Informações do Cliente</h2>
            <div class="info-item">
              <span class="label">Nome:</span> ${form.clientName}
            </div>
            <div class="info-item">
              <span class="label">Email:</span> ${form.clientEmail || 'Não informado'}
            </div>
            <div class="info-item">
              <span class="label">Data de Criação:</span> ${new Date(form.createdAt).toLocaleDateString('pt-BR')}
            </div>
            <div class="info-item">
              <span class="label">Status:</span> ${form.status === 'pending' ? 'Pendente' : 'Preenchido'}
            </div>
          </div>
          
          ${submission ? `
          <div class="info-block">
            <h2>Resumo do Atendimento</h2>
            <div class="info-item">
              ${submission.formData.dadosPessoais ? `
              <p>Cliente ${submission.formData.dadosPessoais.nome}, ${submission.formData.dadosPessoais.profissao}, 
              com renda mensal de ${submission.formData.dadosPessoais.rendaMensal}.</p>
              ` : ''}
              
              ${submission.formData.pessoasRenda && submission.formData.pessoasRenda.length > 0 ? `
              <p>Família com ${submission.formData.pessoasRenda.length} pessoa(s) adicional(is) com renda.</p>
              ` : ''}
              
              ${submission.formData.dependentes && submission.formData.dependentes.length > 0 ? `
              <p>Possui ${submission.formData.dependentes.length} dependente(s).</p>
              ` : ''}
              
              ${submission.formData.patrimonios && submission.formData.patrimonios.length > 0 ? `
              <h3>Patrimônios principais:</h3>
              <ul>
                ${submission.formData.patrimonios.map(patrimonio => `
                <li>${patrimonio.descricao}: ${patrimonio.valor}</li>
                `).join('')}
              </ul>
              ` : ''}
              
              ${submission.formData.dividas && submission.formData.dividas.length > 0 ? `
              <h3>Dívidas principais:</h3>
              <ul>
                ${submission.formData.dividas.map(divida => `
                <li>${divida.descricao}: ${divida.valorTotal}</li>
                `).join('')}
              </ul>
              ` : ''}
              
              ${submission.formData.objetivos ? `
              <h3>Objetivos financeiros:</h3>
              <ul>
                <li>Curto prazo: ${submission.formData.objetivos.curto || 'Não informado'}</li>
                <li>Médio prazo: ${submission.formData.objetivos.medio || 'Não informado'}</li>
                <li>Longo prazo: ${submission.formData.objetivos.longo || 'Não informado'}</li>
              </ul>
              ` : ''}
              
              ${submission.formData.observacoes ? `
              <h3>Observações adicionais:</h3>
              <p>${submission.formData.observacoes}</p>
              ` : ''}
            </div>
          </div>
          
          <div class="info-block">
            <h2>Documentos Sugeridos para a Reunião</h2>
            <ul>
              <li>Documento de identidade (RG e CPF)</li>
              <li>Comprovante de residência atualizado</li>
              <li>Comprovantes de renda dos últimos 3 meses</li>
              <li>Extratos bancários dos últimos 3 meses</li>
              <li>Declaração de Imposto de Renda mais recente</li>
              ${submission.formData.patrimonios && submission.formData.patrimonios.length > 0 ? `
              <li>Documentos dos bens (escrituras, CRLVs, etc.)</li>
              ` : ''}
              ${submission.formData.dividas && submission.formData.dividas.length > 0 ? `
              <li>Contratos de financiamentos e empréstimos</li>
              <li>Faturas de cartões de crédito dos últimos 3 meses</li>
              ` : ''}
            </ul>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Sistema de Formulários Personalizados - Versão 1.0</p>
            <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `;
      
      // Enviar o HTML como resposta
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório'
      });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido`
    });
  }
}
