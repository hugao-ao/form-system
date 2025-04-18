import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

export default function FormDetail({ session }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/submissions/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setSubmission(data.data);
          setNotes(data.data.notes || []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erro ao carregar dados do formulário');
        console.error('Erro ao buscar submissão:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmission();
  }, [id]);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    
    setAddingNote(true);
    
    try {
      const response = await fetch('/api/notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: submission._id,
          content: note,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotes([...notes, data.data]);
        setNote('');
      } else {
        alert('Erro ao adicionar observação: ' + data.message);
      }
    } catch (err) {
      console.error('Erro ao adicionar observação:', err);
      alert('Ocorreu um erro ao adicionar a observação');
    } finally {
      setAddingNote(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await fetch(`/api/pdf/generate/${submission._id}`);
      const blob = await response.blob();
      
      // Criar URL para o blob
      const url = window.URL.createObjectURL(blob);
      
      // Criar link para download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `formulario_${submission.formData.clientName.replace(/\s+/g, '_')}.pdf`;
      
      // Adicionar ao documento, clicar e remover
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Ocorreu um erro ao gerar o PDF');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!emailTo) {
      alert('Por favor, informe um email');
      return;
    }
    
    setSendingEmail(true);
    
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: submission._id,
          email: emailTo,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Email enviado com sucesso!');
        setShowEmailForm(false);
        setEmailTo('');
      } else {
        alert('Erro ao enviar email: ' + data.message);
      }
    } catch (err) {
      console.error('Erro ao enviar email:', err);
      alert('Ocorreu um erro ao enviar o email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!confirm('Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/submissions/${submission._id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Formulário excluído com sucesso!');
        router.push('/admin/dashboard');
      } else {
        alert('Erro ao excluir formulário: ' + data.message);
      }
    } catch (err) {
      console.error('Erro ao excluir formulário:', err);
      alert('Ocorreu um erro ao excluir o formulário');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados do formulário...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Erro ao carregar formulário</h1>
        <p>{error}</p>
        <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="error-container">
        <h1>Formulário não encontrado</h1>
        <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Detalhes do Formulário | {submission.formData?.clientName || 'Cliente'}</title>
      </Head>

      <div className="form-detail-container">
        <header>
          <div className="header-left">
            <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
              &larr; Voltar
            </button>
            <h1>Formulário de {submission.formData?.clientName || 'Cliente'}</h1>
          </div>
          <div className="header-actions">
            <button onClick={handleGeneratePDF} className="action-btn pdf">
              Gerar PDF
            </button>
            <button onClick={() => setShowEmailForm(!showEmailForm)} className="action-btn email">
              Enviar por Email
            </button>
            <button onClick={handleDeleteSubmission} className="action-btn delete">
              Excluir
            </button>
          </div>
        </header>

        {showEmailForm && (
          <div className="email-form-container">
            <form onSubmit={handleSendEmail} className="email-form">
              <div className="form-group">
                <label htmlFor="emailTo">Email para envio:</label>
                <input
                  id="emailTo"
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  required
                  placeholder="exemplo@email.com"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowEmailForm(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="send-btn" disabled={sendingEmail}>
                  {sendingEmail ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <main>
          <div className="summary-section">
            <h2>Resumo</h2>
            <div className="summary-content">
              <p>{submission.summary}</p>
            </div>
          </div>

          <div className="documents-section">
            <h2>Documentos Sugeridos</h2>
            <ul className="documents-list">
              {submission.suggestedDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>

          <div className="notes-section">
            <h2>Observações</h2>
            
            {notes.length === 0 ? (
              <p className="no-notes">Nenhuma observação adicionada.</p>
            ) : (
              <div className="notes-list">
                {notes.map((noteItem) => (
                  <div key={noteItem._id} className="note-item">
                    <p className="note-content">{noteItem.content}</p>
                    <p className="note-meta">
                      Adicionada em {new Date(noteItem.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="add-note-form">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicione uma observação..."
                rows={4}
              ></textarea>
              <button 
                onClick={handleAddNote} 
                className="add-note-btn"
                disabled={addingNote || !note.trim()}
              >
                {addingNote ? 'Adicionando...' : 'Adicionar Observação'}
              </button>
            </div>
          </div>

          <div className="form-data-section">
            <h2>Dados do Formulário</h2>
            <div className="form-data">
              {/* Aqui você pode renderizar os dados do formulário de forma estruturada */}
              <pre>{JSON.stringify(submission.data, null, 2)}</pre>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .form-detail-container {
          min-height: 100vh;
          background-color: #002d26;
          color: #ffffff;
        }

        header {
          background-color: #014034;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          flex-wrap: wrap;
          gap: 15px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        h1 {
          color: #ffd700;
          margin: 0;
          font-size: 1.8rem;
        }

        .back-btn {
          background-color: transparent;
          border: 1px solid #ffffff;
          color: #ffffff;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .back-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.pdf {
          background-color: #3498db;
          color: white;
        }

        .action-btn.email {
          background-color: #2ecc71;
          color: white;
        }

        .action-btn.delete {
          background-color: #e74c3c;
          color: white;
        }

        .action-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        main {
          padding: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .summary-section, .documents-section, .notes-section, .form-data-section {
          background-color: #014034;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #ffd700;
          margin-top: 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #015c4a;
          padding-bottom: 10px;
        }

        .summary-content {
          line-height: 1.6;
          font-size: 16px;
        }

        .documents-list {
          list-style-type: none;
          padding: 0;
        }

        .documents-list li {
          padding: 10px 0;
          border-bottom: 1px solid #015c4a;
          display: flex;
          align-items: center;
        }

        .documents-list li:before {
          content: "•";
          color: #ffd700;
          font-weight: bold;
          display: inline-block; 
          width: 1em;
          margin-left: -1em;
        }

        .documents-list li:last-child {
          border-bottom: none;
        }

        .notes-list {
          margin-bottom: 25px;
        }

        .note-item {
          background-color: #015c4a;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .note-content {
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        .note-meta {
          margin: 0;
          font-size: 12px;
          color: #cccccc;
          text-align: right;
        }

        .no-notes {
          color: #cccccc;
          font-style: italic;
        }

        .add-note-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        textarea {
          width: 100%;
          padding: 12px;
          border-radius: 5px;
          border: 1px solid transparent;
          font-size: 14px;
          background-color: #f5f5f5;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
        }

        .add-note-btn {
          background-color: #ffd700;
          color: #002d26;
          border: none;
          padding: 12px;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-end;
        }

        .add-note-btn:hover:not(:disabled) {
          background-color: #ffc400;
          transform: translateY(-2px);
        }

        .add-note-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .form-data {
          background-color: #015c4a;
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
        }

        pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: monospace;
          font-size: 14px;
        }

        .email-form-container {
          padding: 20px;
          background-color: #014034;
          margin: 0 30px 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .email-form {
          display: flex;
          gap: 15px;
          align-items: flex-end;
        }

        .form-group {
          flex: 1;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border-radius: 5px;
          border: 1px solid transparent;
          font-size: 14px;
          background-color: #f5f5f5;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .cancel-btn {
          background-color: transparent;
          border: 1px solid #ffffff;
          color: #ffffff;
          padding: 12px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .send-btn {
          background-color: #2ecc71;
          color: white;
          border: none;
          padding: 12px 15px;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .send-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .send-btn:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          text-align: center;
          padding: 20px;
          background-color: #002d26;
          color: #ffffff;
        }

        .loading-spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #ffd700;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .email-form {
            flex-direction: column;
          }
          
          .form-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session }
  };
}
