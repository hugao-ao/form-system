import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';
import { v4 as uuidv4 } from 'uuid';
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
      const { clientName, clientEmail, expiresAt } = req.body;

      // Validar dados de entrada
      if (!clientName) {
        return res.status(400).json({ success: false, message: 'Nome do cliente é obrigatório' });
      }

      // Gerar ID único para o link
      const uniqueId = uuidv4();

      // Criar novo formulário
      const form = await Form.create({
        uniqueId,
        clientName,
        clientEmail: clientEmail || '',
        createdAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: 'pending',
        used: false,
        createdBy: session.user.id
      });

      // Retornar o formulário criado com o link único
      return res.status(201).json({
        success: true,
        data: {
          form,
          link: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/form/${uniqueId}`
        }
      });
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      return res.status(500).json({ success: false, message: 'Erro ao gerar link único' });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
}
