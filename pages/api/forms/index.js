import { connectToDatabase } from '../../../lib/mongoose';
import Form from '../../../models/Form';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  try {
    await connectToDatabase();
    
    if (req.method === 'GET') {
      const forms = await Form.find().sort({ createdAt: -1 });
      return res.status(200).json(forms);
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API de formulários:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
