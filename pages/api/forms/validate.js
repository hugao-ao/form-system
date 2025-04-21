import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições GET
  if (req.method === 'GET') {
    try {
      const { uniqueId } = req.query;

      // Validar dados de entrada
      if (!uniqueId) {
        return res.status(400).json({ success: false, message: 'ID único é obrigatório' });
      }

      // Buscar formulário pelo ID único
      const form = await Form.findOne({ uniqueId });

      // Verificar se o formulário existe
      if (!form) {
        return res.status(404).json({ success: false, message: 'Formulário não encontrado' });
      }

      // Verificar se o formulário já foi usado
      if (form.used) {
        return res.status(403).json({ success: false, message: 'Este link já foi utilizado e não pode ser acessado novamente' });
      }

      // Verificar se o formulário expirou
      if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
        await Form.findByIdAndUpdate(form._id, { status: 'expired' });
        return res.status(403).json({ success: false, message: 'Este link expirou e não pode mais ser utilizado' });
      }

      // Retornar informações básicas do formulário (sem marcar como usado ainda)
      return res.status(200).json({
        success: true,
        data: {
          formId: form._id,
          clientName: form.clientName,
          valid: true
        }
      });
    } catch (error) {
      console.error('Erro ao validar link:', error);
      return res.status(500).json({ success: false, message: 'Erro ao validar link único' });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
}
