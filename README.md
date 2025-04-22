# ShareActivities 🎯

## Sobre o Projeto
ShareActivities é uma aplicação moderna para gerenciamento de tarefas familiares, permitindo que famílias organizem e compartilhem suas atividades diárias de forma eficiente e colaborativa. Além do gerenciamento de tarefas, a plataforma oferece um espaço especial para compartilhamento de receitas culinárias, onde os usuários podem compartilhar suas receitas favoritas tanto com membros da família quanto com toda a comunidade do aplicativo. Esta funcionalidade torna o ShareActivities não apenas uma ferramenta de organização, mas também um espaço de conexão e troca de experiências gastronômicas entre famílias.

## 🚀 Tecnologias Utilizadas

### Backend
- **Java Spring Boot** - Framework robusto para desenvolvimento do backend
- **Spring Security** - Para autenticação e autorização
- **JWT** - Para gerenciamento de tokens de autenticação
- **Maven** - Gerenciamento de dependências
- **PostgreSQL** - Banco de dados relacional
- **JPA/Hibernate** - ORM para persistência de dados
- **Sistema de Arquivos** - Para armazenamento de uploads de arquivos

### Frontend
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset JavaScript com tipagem estática
- **Axios** - Cliente HTTP para requisições à API
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local
- **Expo Document Picker & Image Picker** - Para seleção de documentos e imagens

## 📱 Funcionalidades Principais
- Gerenciamento de tarefas (CRUD)
- Sistema de autenticação JWT
- Gerenciamento de família
- Sistema de notificações
- Compartilhamento de tarefas
- Gerenciamento de receitas
- Upload e visualização de documentos e imagens
- Compartilhamento de links entre membros

## 🔄 Sprints e Entregas

### Sprint 1 - MVP Básico (31/03/2025) ✅
- **Sistema de Autenticação e Gerenciamento Básico de Tarefas**
  - Implementação completa do sistema de autenticação JWT com credenciais seguras
  - CRUD completo de tarefas pessoais:
    - Criação intuitiva de tarefas com categorização por tipo (Limpeza, Compras, Reparos)
    - Definição flexível de prazos e configuração da frequência de repetição das tarefas
    - Sistema avançado de status (concluída/em andamento/pendente) com transições visuais
    - Configuração de tempo estimado para conclusão
    - Sistema de prioridades com codificação visual (alta, média, baixa)
  - Interface minimalista e intuitiva com design centrado no usuário
  - tela para visualização rápida de tarefas pendentes
  - Histórico detalhado de tarefas realizadas
  - Sistema de lembrete com niveis de urgencia baseado na data de expirar a tarefa

### Sprint 2 - Ecossistema Colaborativo (28/04/2025)
- **Compartilhamento e Interação Social**
  - Sistema robusto de grupos e compartilhamento:
    - Criação e gerenciamento de grupos familiares
    - Compartilhamento de tarefas entre membros
    - Edição colaborativa de tarefas compartilhadas
    - Chat em tempo real entre membros dos grupos
  - Central de notificações avançada:
    - Notificação para novas tarefas atribuídas
    - Notificação para tarefas pendentes próximas do vencimento
    - Notificação para tarefas que forem concluidas
  - Recursos multimídia completos:
    - Captura e upload direto de fotos como referência para execução de tarefas
    - Biblioteca compartilhada para anexos visuais com visualização otimizada
    - Sistema para compartilhamento de documentos e links relevantes às tarefas
  - Integração com GPS para notificações baseadas em localização:
    - Alertas inteligentes quando próximo a locais relacionados às tarefas pendentes
  - Recurso de automação:
    - Integração com aplicativo de produtividade
  - Analise de dados:
      - Relatórios completos de produtividade individual e coletiva

### Sprint 3 - Recursos Avançados (26/05/2025)
- **Produtividade**
  - Recursos de produtividade:
    - Sistema de comandos de voz para criação de tarefas
  - Análise avançada de dados:
    - Métricas detalhadas de tempo, conclusão e atrasos
    - Visualizações gráficas personalizáveis de desempenho

## 💡 Boas Práticas Implementadas

### Arquitetura
- **Clean Architecture** - Separação clara de responsabilidades
- **SOLID Principles** - Princípios de design de software
- **DRY (Don't Repeat Yourself)** - Código reutilizável e manutenível

### Segurança
- Autenticação JWT
- Criptografia de dados sensíveis
- Validação de inputs
- Proteção contra ataques comuns (XSS, CSRF)

### Frontend
- **Componentização** - Componentes reutilizáveis
- **Styled Components** - Estilização consistente
- **Hooks** - Gerenciamento de estado eficiente
- **Context API** - Compartilhamento de estado global

### Backend
- **DTO Pattern** - Transferência segura de dados
- **Repository Pattern** - Abstração do acesso a dados
- **Service Layer** - Lógica de negócios isolada
- **Exception Handling** - Tratamento adequado de erros

## 📂 Sistema de Gerenciamento de Arquivos

O ShareActivities implementa um sistema eficiente de gerenciamento de anexos para atividades, permitindo aos usuários:

### Funcionalidades de Anexos
- **Upload de Imagens** - Anexar fotos às atividades para referência visual
- **Upload de Documentos** - Anexar documentos PDF e outros formatos
- **Gerenciamento de Links** - Adicionar e compartilhar URLs relevantes

### Arquitetura de Armazenamento
- **Armazenamento no Sistema de Arquivos** - Os arquivos são armazenados no sistema de arquivos do servidor
- **Geração de URLs Únicas** - Cada arquivo recebe um identificador único para acesso
- **Metadados** - Armazenamento de informações como nome original e tipo do arquivo
- **Otimização** - Arquivos são servidos diretamente como recursos estáticos

### Segurança
- **Validação de Tipos** - Apenas formatos permitidos podem ser enviados
- **Limitação de Tamanho** - Arquivos são limitados a 10MB
- **Acesso Controlado** - Apenas usuários autorizados podem visualizar arquivos privados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js
- Java 17+
- PostgreSQL
- Maven

### Backend
```bash
cd BackEnd
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd FrontEnd
npm install
npx expo start
```

## 📝 Licença
Este projeto está sob a licença MIT.

---
Desenvolvido por João Gabriel
