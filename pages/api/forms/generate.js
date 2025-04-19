import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  // Conectar ao banco de dados
  await dbConnect();

  // Processar apenas requisições POST
  if (req.method === 'POST') {
    try {
      const { clientName, clientEmail } = req.body;
      
      // Validar dados de entrada
      if (!clientName) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nome do cliente é obrigatório' 
        });
      }
      
      // Gerar ID único
      const uniqueId = generateUniqueId();
      
      // Criar novo formulário
      const form = await Form.create({
        uniqueId,
        clientName,
        clientEmail: clientEmail || '',
        createdAt: new Date(),
        status: 'pending',
        used: false,
        createdBy: req.body.userId || '000000000000000000000000' // ID padrão se não houver usuário autenticado
      });
      
      return res.status(201).json({
        success: true,
        data: {
          _id: form._id,
          uniqueId: form.uniqueId,
          clientName: form.clientName,
          clientEmail: form.clientEmail
        }
      });
    } catch (error) {
      console.error('Erro ao gerar link de formulário:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao gerar link de formulário' 
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

// Função para gerar ID único
function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
}
