import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import dbConnect from '../../../../lib/mongoose';
import Submission from '../../../../models/Submission';
import Form from '../../../../models/Form';
import Note from '../../../../models/Note';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  // Verificar se o usuário está autenticado
  if (!session) {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }

  // Conectar ao banco de dados
  await dbConnect();

  const { id } = req.query;

  // Verificar se o ID foi fornecido
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID da submissão é obrigatório' });
  }

  // Processar apenas requisições GET
  if (req.method === 'GET') {
    try {
      // Buscar submissão
      const submission = await Submission.findById(id).lean();
      
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submissão não encontrada' });
      }
      
      // Buscar formulário relacionado
      const form = await Form.findById(submission.formId).lean();
      
      if (!form) {
        return res.status(404).json({ success: false, message: 'Formulário não encontrado' });
      }
      
      // Buscar notas relacionadas
      const notes = await Note.find({ submissionId: id })
        .sort({ createdAt: -1 })
        .lean();
      
      // Criar PDF
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Adicionar página
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();
      
      // Definir margens
      const margin = 50;
      let y = height - margin;
      const lineHeight = 20;
      
      // Adicionar título
      page.drawText('Formulário de Atendimento Financeiro', {
        x: margin,
        y,
        size: 18,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight * 2;
      
      // Adicionar informações do cliente
      page.drawText(`Cliente: ${form.clientName}`, {
        x: margin,
        y,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
      
      page.drawText(`Data de preenchimento: ${new Date(submission.submittedAt).toLocaleDateString('pt-BR')}`, {
        x: margin,
        y,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight * 2;
      
      // Adicionar resumo
      page.drawText('Resumo:', {
        x: margin,
        y,
        size: 14,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
      
      // Quebrar o resumo em linhas
      const summaryLines = breakTextIntoLines(submission.summary, 70);
      for (const line of summaryLines) {
        page.drawText(line, {
          x: margin,
          y,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
      
      y -= lineHeight;
      
      // Adicionar documentos sugeridos
      page.drawText('Documentos Sugeridos:', {
        x: margin,
        y,
        size: 14,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
      
      for (const doc of submission.suggestedDocuments) {
        page.drawText(`• ${doc}`, {
          x: margin + 10,
          y,
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
      
      y -= lineHeight;
      
      // Adicionar observações
      if (notes.length > 0) {
        page.drawText('Observações:', {
          x: margin,
          y,
          size: 14,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
        
        y -= lineHeight;
        
        for (const note of notes) {
          const noteLines = breakTextIntoLines(note.content, 70);
          for (const line of noteLines) {
            page.drawText(line, {
              x: margin + 10,
              y,
              size: 12,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
            y -= lineHeight;
          }
          
          page.drawText(`(Adicionada em ${new Date(note.createdAt).toLocaleDateString('pt-BR')})`, {
            x: margin + 10,
            y,
            size: 10,
            font: timesRomanFont,
            color: rgb(0.5, 0.5, 0.5),
          });
          
          y -= lineHeight * 1.5;
        }
      }
      
      // Adicionar dados do formulário
      if (y < 200) {
        // Se não houver espaço suficiente, adicionar nova página
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
      
      page.drawText('Dados do Formulário:', {
        x: margin,
        y,
        size: 14,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
      
      // Adicionar dados do formulário
      for (const [key, value] of Object.entries(submission.data)) {
        if (value) {
          const formattedKey = formatKey(key);
          const formattedValue = typeof value === 'object' ? JSON.stringify(value) : value.toString();
          
          page.drawText(`${formattedKey}: ${formattedValue}`, {
            x: margin + 10,
            y,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          
          y -= lineHeight;
          
          // Se não houver espaço suficiente, adicionar nova página
          if (y < margin) {
            const newPage = pdfDoc.addPage([595.28, 841.89]);
            y = height - margin;
          }
        }
      }
      
      // Serializar o PDF
      const pdfBytes = await pdfDoc.save();
      
      // Definir cabeçalhos para download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=formulario_${form.clientName.replace(/\s+/g, '_')}.pdf`);
      
      // Enviar o PDF
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return res.status(500).json({ success: false, message: 'Erro ao gerar PDF' });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
}

// Função para quebrar texto em linhas
function breakTextIntoLines(text, maxCharsPerLine) {
  if (!text) return [];
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine.length > 0 ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines;
}

// Função para formatar chaves do formulário
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2');
}
