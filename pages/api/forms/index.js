import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  // Verificar se o usuário está autenticado
  if (!session) {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }

  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições GET
  if (req.method === 'GET') {
    try {
      // Buscar todos os formulários
      const forms = await Form.find({})
        .sort({ createdAt: -1 }) // Ordenar do mais recente para o mais antigo
        .lean();

      // Retornar os formulários
      return res.status(200).json({
        success: true,
        data: forms
      });
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      return res.status(500).json({ success: false, message: 'Erro ao buscar formulários' });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
}
