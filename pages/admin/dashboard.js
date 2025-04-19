// Função para buscar dados dos formulários
const fetchFormData = async () => {
  try {
    setLoading(true);
    // Buscar dados reais do banco de dados
    const response = await fetch('/api/forms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.data) {
        // Separar formulários pendentes e preenchidos
        const pendentes = data.data.filter(form => form.status === 'pending');
        const preenchidos = data.data.filter(form => form.status === 'completed');
        
        setFormData({ pendentes, preenchidos });
      } else {
        // Se não houver dados ou ocorrer um erro, inicializar com arrays vazios
        setFormData({ pendentes: [], preenchidos: [] });
      }
    } else {
      console.error('Erro ao buscar formulários:', response.statusText);
      setFormData({ pendentes: [], preenchidos: [] });
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    setFormData({ pendentes: [], preenchidos: [] });
  } finally {
    setLoading(false);
  }
};

// Função para gerar novo link
const handleGerarLink = async () => {
  const clientName = prompt('Nome do cliente:');
  if (!clientName) return;
  
  const clientEmail = prompt('Email do cliente (opcional):');
  
  try {
    // Gerar link real através da API
    const response = await fetch('/api/forms/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName,
        clientEmail: clientEmail || '',
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.data) {
        const fullLink = `${window.location.origin}/form/${data.data.uniqueId}`;
        
        // Copiar link para a área de transferência
        navigator.clipboard.writeText(fullLink)
          .then(() => {
            alert(`Link gerado e copiado para a área de transferência!\n\n${fullLink}`);
          })
          .catch(() => {
            alert(`Link gerado com sucesso!\n\n${fullLink}\n\nCopie manualmente o link acima.`);
          });
        
        // Atualizar a lista com o novo formulário
        fetchFormData();
      } else {
        alert('Erro ao gerar link: ' + (data.message || 'Erro desconhecido'));
      }
    } else {
      alert('Erro ao gerar link. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao gerar link. Tente novamente.');
  }
};

// Função para ver detalhes de um formulário
const handleVerDetalhes = (id) => {
  router.push(`/admin/forms/${id}`);
};

// Função para excluir um formulário
const handleExcluirFormulario = async (id) => {
  if (confirm('Tem certeza que deseja excluir este formulário?')) {
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Atualizar a lista após exclusão
        fetchFormData();
        alert('Formulário excluído com sucesso!');
      } else {
        alert('Erro ao excluir formulário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao excluir formulário:', error);
      alert('Erro ao excluir formulário. Tente novamente.');
    }
  }
};
