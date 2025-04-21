import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições PUT
  if (req.method === 'PUT') {
    try {
      const { uniqueId } = req.body;

      // Validar dados de entrada
      if (!uniqueId) {
        return res.status(400).json({ success: false, message: 'ID único é obrigatório' });
      }

      // Buscar e atualizar formulário
      const form = await Form.findOneAndUpdate(
        { uniqueId, used: false },
        { used: true, status: 'completed' },
        { new: true }
      );

      // Verificar se o formulário existe e foi atualizado
      if (!form) {
        return res.status(404).json({ success: false, message: 'Formulário não encontrado ou já utilizado' });
      }

      // Retornar sucesso
      return res.status(200).json({
        success: true,
        data: {
          formId: form._id,
          used: form.used,
          status: form.status
        }
      });
    } catch (error) {
      console.error('Erro ao marcar formulário como usado:', error);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar status do formulário' });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
}
