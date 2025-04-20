import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Conectar ao banco de dados
  await dbConnect();

  // Processar requisições DELETE para excluir um formulário
  if (req.method === 'DELETE') {
    try {
      // Verificar se o ID foi fornecido
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do formulário é obrigatório'
        });
      }
      
      // Excluir o formulário
      const deletedForm = await Form.findByIdAndDelete(id);
      
      // Verificar se o formulário existia
      if (!deletedForm) {
        return res.status(404).json({
          success: false,
          message: 'Formulário não encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Formulário excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir formulário:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir formulário'
      });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido`
    });
  }
}
