import { connectToDatabase } from '../../../lib/mongoose';
import Form from '../../../models/Form';
import { getSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  const { clientName, clientEmail } = req.body;
  
  if (!clientName) {
    return res.status(400).json({ error: 'Nome do cliente é obrigatório' });
  }
  
  try {
    await connectToDatabase();
    
    // Gerar ID único
    const uniqueId = uuidv4();
    
    // Criar novo formulário
    const newForm = new Form({
      uniqueId,
      clientName,
      clientEmail,
      isUsed: false,
      createdBy: session.user.id
    });
    
    await newForm.save();
    
    return res.status(201).json({ 
      message: 'Link gerado com sucesso',
      uniqueId
    });
  } catch (error) {
    console.error('Erro ao gerar link:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
