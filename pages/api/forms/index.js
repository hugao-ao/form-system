import dbConnect from '../../../lib/mongoose';
import Form from '../../../models/Form';

export default async function handler(req, res) {
  // Definir cabeçalhos CORS para permitir requisições de qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Lidar com requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Conectar ao banco de dados
  await dbConnect();

  // Processar requisições GET para listar todos os formulários
  if (req.method === 'GET') {
    try {
      // Buscar todos os formulários
      const forms = await Form.find({}).sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        data: forms
      });
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar formulários'
      });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido`
    });
  }
}
