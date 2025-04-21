import dbConnect from '../../../lib/mongoose';
import Submission from '../../../models/Submission';
import Form from '../../../models/Form';
import Note from '../../../models/Note';
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

  // Processar requisição GET
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
      
      // Retornar dados completos
      return res.status(200).json({
        success: true,
        data: {
          _id: submission._id,
          formData: form,
          data: submission.data,
          submittedAt: submission.submittedAt,
          summary: submission.summary,
          suggestedDocuments: submission.suggestedDocuments,
          notes
        }
      });
    } catch (error) {
      console.error('Erro ao buscar submissão:', error);
      return res.status(500).json({ success: false, message: 'Erro ao buscar dados do formulário' });
    }
  }
  
  // Processar requisição DELETE
  else if (req.method === 'DELETE') {
    try {
      // Buscar submissão
      const submission = await Submission.findById(id);
      
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submissão não encontrada' });
      }
      
      // Excluir notas relacionadas
      await Note.deleteMany({ submissionId: id });
      
      // Excluir submissão
      await Submission.findByIdAndDelete(id);
      
      // Atualizar status do formulário para permitir novo uso
      await Form.findByIdAndUpdate(submission.formId, {
        used: false,
        status: 'pending'
      });
      
      // Retornar sucesso
      return res.status(200).json({
        success: true,
        message: 'Formulário excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir submissão:', error);
      return res.status(500).json({ success: false, message: 'Erro ao excluir formulário' });
    }
  }
  
  else {
    // Método não permitido
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
}
