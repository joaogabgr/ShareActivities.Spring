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

### Sprint 1 - Autenticação e Funcionalidades Básicas
- Implementação do JWT
- CRUD básico de tarefas (Criar, Ler, Deletar)
- Setup inicial da arquitetura

### Sprint 2 - Gerenciamento Familiar
- Implementação da edição de tarefas
- Sistema de gerenciamento familiar
- Visualização de tarefas familiares
- Melhorias na interface do usuário

### Sprint 3 - Recursos Avançados
- Sistema de notificações
- CRUD completo de receitas
- Melhorias gerais na usabilidade
- Otimizações de performance

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