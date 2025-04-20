import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  // Definir cabeçalhos CORS para permitir requisições de qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Lidar com requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Conectar ao banco de dados
    await dbConnect();

    // Processar requisições GET
    if (req.method === 'GET') {
      try {
        return res.status(200).json({
          success: true,
          message: 'Endpoint de geração de formulários disponível',
          instructions: 'Use o método POST para gerar um novo formulário'
        });
      } catch (error) {
        console.error('Erro ao acessar endpoint de geração:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao acessar endpoint de geração' 
        });
      }
    }
    // Processar requisições POST
    else if (req.method === 'POST') {
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
          createdBy: '000000000000000000000000' // ID padrão se não houver usuário autenticado
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
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      return res.status(405).json({ 
        success: false, 
        message: `Método ${req.method} não permitido` 
      });
    }
  } catch (error) {
    console.error('Erro de conexão com o banco de dados:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro de conexão com o banco de dados'
    });
  }
}

// Função para gerar ID único
function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
}
