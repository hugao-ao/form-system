import dbConnect from '../../../lib/mongoose';
import Submission from '../../../models/Submission';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Conectar ao banco de dados
  await dbConnect();

  // Processar requisições GET para obter detalhes de uma submissão
  if (req.method === 'GET') {
    try {
      // Verificar se o ID foi fornecido
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do formulário é obrigatório'
        });
      }
      
      // Buscar a submissão pelo ID do formulário
      const submission = await Submission.findOne({ formId: id });
      
      // Verificar se a submissão existe
      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submissão não encontrada'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: submission
      });
    } catch (error) {
      console.error('Erro ao buscar submissão:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar submissão'
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
