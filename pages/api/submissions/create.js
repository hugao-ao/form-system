import dbConnect from '../../../lib/mongoose';
import Submission from '../../../models/Submission';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições POST
  if (req.method === 'POST') {
    try {
      const { formId, formData } = req.body;
      
      // Validar dados de entrada
      if (!formId || !formData) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID do formulário e dados são obrigatórios' 
        });
      }
      
      // Criar nova submissão
      const submission = await Submission.create({
        formId,
        formData,
        submittedAt: new Date()
      });
      
      // Atualizar o status do formulário para "completed" e marcar como usado
      await Form.findByIdAndUpdate(formId, {
        status: 'completed',
        used: true
      });
      
      return res.status(201).json({
        success: true,
        data: {
          _id: submission._id,
          formId: submission.formId,
          submittedAt: submission.submittedAt
        }
      });
    } catch (error) {
      console.error('Erro ao salvar submissão:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao salvar submissão' 
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
