import { jsPDF } from 'jspdf';
import dbConnect from '../../../../lib/mongoose';
import Form from '../../../../models/Form';
import Submission from '../../../../models/Submission';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Conectar ao banco de dados
  await dbConnect();

  // Processar requisições GET para gerar PDF
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
      
      // Criar o PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(20);
      doc.text('Relatório de Atendimento Financeiro', 105, 20, { align: 'center' });
      
      // Adicionar informações do cliente
      doc.setFontSize(14);
      doc.text('Informações do Cliente', 20, 40);
      
      doc.setFontSize(12);
      doc.text(`Nome: ${form.clientName}`, 20, 50);
      doc.text(`Email: ${form.clientEmail || 'Não informado'}`, 20, 60);
      doc.text(`Data de Criação: ${new Date(form.createdAt).toLocaleDateString('pt-BR')}`, 20, 70);
      doc.text(`Status: ${form.status === 'pending' ? 'Pendente' : 'Preenchido'}`, 20, 80);
      
      // Se houver submissão, adicionar resumo e documentos sugeridos
      if (submission) {
        // Adicionar resumo
        doc.setFontSize(14);
        doc.text('Resumo do Atendimento', 20, 100);
        
        doc.setFontSize(12);
        const formData = submission.formData;
        
        let resumo = '';
        
        if (formData.dadosPessoais) {
          resumo += `Cliente ${formData.dadosPessoais.nome}, ${formData.dadosPessoais.profissao}, `;
          resumo += `com renda mensal de ${formData.dadosPessoais.rendaMensal}.\n\n`;
        }
        
        if (formData.pessoasRenda && formData.pessoasRenda.length > 0) {
          resumo += `Família com ${formData.pessoasRenda.length} pessoa(s) adicional(is) com renda.\n`;
        }
        
        if (formData.dependentes && formData.dependentes.length > 0) {
          resumo += `Possui ${formData.dependentes.length} dependente(s).\n\n`;
        }
        
        if (formData.patrimonios && formData.patrimonios.length > 0) {
          resumo += `Patrimônios principais:\n`;
          formData.patrimonios.forEach(patrimonio => {
            resumo += `- ${patrimonio.descricao}: ${patrimonio.valor}\n`;
          });
          resumo += '\n';
        }
        
        if (formData.dividas && formData.dividas.length > 0) {
          resumo += `Dívidas principais:\n`;
          formData.dividas.forEach(divida => {
            resumo += `- ${divida.descricao}: ${divida.valorTotal}\n`;
          });
          resumo += '\n';
        }
        
        if (formData.objetivos) {
          resumo += `Objetivos financeiros:\n`;
          resumo += `- Curto prazo: ${formData.objetivos.curto || 'Não informado'}\n`;
          resumo += `- Médio prazo: ${formData.objetivos.medio || 'Não informado'}\n`;
          resumo += `- Longo prazo: ${formData.objetivos.longo || 'Não informado'}\n\n`;
        }
        
        if (formData.observacoes) {
          resumo += `Observações adicionais: ${formData.observacoes}\n`;
        }
        
        // Quebrar o texto em linhas para caber na página
        const splitResumo = doc.splitTextToSize(resumo, 170);
        doc.text(splitResumo, 20, 110);
        
        // Calcular a posição Y para os documentos sugeridos
        let yPos = 110 + (splitResumo.length * 7);
        
        // Adicionar documentos sugeridos
        doc.setFontSize(14);
        doc.text('Documentos Sugeridos para a Reunião', 20, yPos);
        
        doc.setFontSize(12);
        yPos += 10;
        
        // Lista básica de documentos
        const documentos = [
          "Documento de identidade (RG e CPF)",
          "Comprovante de residência atualizado",
          "Comprovantes de renda dos últimos 3 meses",
          "Extratos bancários dos últimos 3 meses",
          "Declaração de Imposto de Renda mais recente"
        ];
        
        // Adicionar documentos adicionais baseados nas informações do formulário
        if (formData.patrimonios && formData.patrimonios.length > 0) {
          documentos.push("Documentos dos bens (escrituras, CRLVs, etc.)");
        }
        
        if (formData.dividas && formData.dividas.length > 0) {
          documentos.push("Contratos de financiamentos e empréstimos");
          documentos.push("Faturas de cartões de crédito dos últimos 3 meses");
        }
        
        documentos.forEach((doc, index) => {
          doc.text(`${index + 1}. ${doc}`, 20, yPos + (index * 7));
        });
      }
      
      // Adicionar rodapé
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('Sistema de Formulários Personalizados - Versão 1.0', 105, 295, { align: 'center' });
      }
      
      // Enviar o PDF como resposta
      const pdfBuffer = doc.output('arraybuffer');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=formulario-${form.clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao gerar PDF'
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
