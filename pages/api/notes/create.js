import dbConnect from '../../../lib/mongoose';
import Note from '../../../models/Note';
import Submission from '../../../models/Submission';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  // Verificar se o usuário está autenticado
  if (!session) {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }

  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições POST
  if (req.method === 'POST') {
    try {
      const { submissionId, content } = req.body;

      // Validar dados de entrada
      if (!submissionId || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID da submissão e conteúdo são obrigatórios' 
        });
      }

      // Verificar se a submissão existe
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          message: 'Submissão não encontrada' 
        });
      }

      // Criar nova nota
      const note = await Note.create({
        submissionId,
        content,
        createdAt: new Date(),
        createdBy: session.user.id
      });

      // Retornar sucesso
      return res.status(201).json({
        success: true,
        data: note
      });
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao adicionar observação' 
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
