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
  try {
    await dbConnect();

    // Processar requisições GET para validar um formulário
    if (req.method === 'GET') {
      try {
        const { uniqueId } = req.query;
        
        // Verificar se o ID único foi fornecido
        if (!uniqueId) {
          return res.status(400).json({
            success: false,
            message: 'ID único do formulário é obrigatório'
          });
        }
        
        // Buscar o formulário pelo ID único
        const form = await Form.findOne({ uniqueId });
        
        // Verificar se o formulário existe
        if (!form) {
          return res.status(404).json({
            success: false,
            message: 'Formulário não encontrado'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: form
        });
      } catch (error) {
        console.error('Erro ao validar formulário:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro ao validar formulário'
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
  } catch (error) {
    console.error('Erro de conexão com o banco de dados:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro de conexão com o banco de dados'
    });
  }
}
