# Sistema de Formulários Personalizados

Este é um guia detalhado para a implantação e uso do Sistema de Formulários Personalizados desenvolvido com Next.js e MongoDB.

## Visão Geral do Sistema

O sistema permite:

1. Gerar links únicos de formulários para pessoas diferentes
2. Consultar formulários preenchidos sem opção de alterá-los
3. Adicionar observações aos formulários preenchidos
4. Gerar PDF dos formulários com observações e enviá-los por email
5. Visualizar resumo inteligente das informações fornecidas
6. Obter sugestões de documentações pessoais para reuniões
7. Acompanhar quais clientes preencheram os formulários

## Estrutura do Projeto

```
form-system/
├── components/       # Componentes React reutilizáveis
├── lib/              # Utilitários e configurações
│   ├── mongoose.js   # Conexão com MongoDB
├── models/           # Modelos de dados MongoDB
│   ├── Form.js       # Modelo para formulários
│   ├── Note.js       # Modelo para observações
│   ├── Submission.js # Modelo para submissões
│   ├── User.js       # Modelo para usuários
├── pages/            # Páginas da aplicação
│   ├── admin/        # Área administrativa
│   ├── api/          # Endpoints da API
│   ├── form/         # Páginas de formulário
├── public/           # Arquivos estáticos
├── styles/           # Estilos CSS
```

## Implantação no Render

### Pré-requisitos

1. Conta no Render (hugoviana91@gmail.com)
2. Conta no MongoDB Atlas (hugoviana91@gmail.com)

### Configuração do MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) e faça login
2. Crie um novo cluster (opção gratuita disponível)
3. Configure um usuário de banco de dados:
   - Vá para "Database Access" e clique em "Add New Database User"
   - Defina um nome de usuário e senha
   - Conceda permissões de leitura e escrita
4. Configure o acesso à rede:
   - Vá para "Network Access" e clique em "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)
5. Obtenha a string de conexão:
   - Vá para o cluster e clique em "Connect"
   - Selecione "Connect your application"
   - Copie a string de conexão (substitua `<password>` pela senha do usuário)

### Implantação no Render

1. Acesse [Render](https://render.com/) e faça login
2. Crie um novo Web Service:
   - Clique em "New" e selecione "Web Service"
   - Conecte ao repositório Git ou faça upload do código diretamente
3. Configure o serviço:
   - Nome: form-system (ou outro de sua preferência)
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Configure as variáveis de ambiente:
   - MONGODB_URI: string de conexão do MongoDB Atlas
   - NEXTAUTH_SECRET: string aleatória para segurança (ex: `openssl rand -base64 32`)
   - NEXTAUTH_URL: URL do seu serviço no Render
   - EMAIL_SERVER: servidor SMTP (ex: smtp.gmail.com)
   - EMAIL_PORT: porta do servidor SMTP (ex: 587)
   - EMAIL_USER: seu email para envio
   - EMAIL_PASSWORD: senha do email ou senha de app
   - EMAIL_FROM: endereço de email de origem
5. Clique em "Create Web Service"

## Uso do Sistema

### Área Administrativa

1. Acesse a área administrativa em `/admin/login`
2. Faça login com as credenciais configuradas
3. No dashboard, você pode:
   - Gerar novos links de formulário para clientes
   - Ver quais clientes preencheram os formulários
   - Acessar detalhes de cada formulário preenchido

### Geração de Links

1. No dashboard administrativo, clique em "Gerar Novo Link"
2. Preencha o nome do cliente e email (opcional)
3. Clique em "Gerar Link" e copie o link gerado
4. Envie o link para o cliente (o link só pode ser usado uma vez)

### Visualização de Formulários

1. No dashboard, clique em um formulário preenchido
2. Visualize o resumo inteligente e as sugestões de documentos
3. Adicione observações conforme necessário
4. Gere um PDF do formulário ou envie por email

## Suporte e Manutenção

Para suporte ou dúvidas sobre o sistema, entre em contato com o desenvolvedor.

---

Desenvolvido com ❤️ usando Next.js e MongoDB
