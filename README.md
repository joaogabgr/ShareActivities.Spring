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

### Frontend
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset JavaScript com tipagem estática
- **Axios** - Cliente HTTP para requisições à API
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local

## 📱 Funcionalidades Principais
- Gerenciamento de tarefas (CRUD)
- Sistema de autenticação JWT
- Gerenciamento de família
- Sistema de notificações
- Compartilhamento de tarefas
- Gerenciamento de receitas

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

### Sprint 3 - Recursos Avançados (26/05/2025)
- **Produtividade**
  - Recursos de automação e produtividade:
    - Integração com aplicativo de produtividade
    - Sistema de comandos de voz para criação de tarefas
  - Análise avançada de dados:
    - Relatórios completos de produtividade individual e coletiva
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
