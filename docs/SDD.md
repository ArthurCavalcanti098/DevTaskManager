Você é um arquiteto de software sênior especializado em documentação técnica enterprise-level.

Quero criar um documento SDD (Software Design Document) EXTREMAMENTE PROFISSIONAL e DETALHADO para um projeto chamado:

# DevTasks Manager

O objetivo é produzir um documento técnico completo, profundo e altamente estruturado, como se fosse criado dentro de uma software house profissional ou empresa SaaS real.

Este documento será a base oficial do desenvolvimento do sistema.

---

# OBJETIVO DO DOCUMENTO

O SDD deve definir ABSOLUTAMENTE TUDO do sistema:

* arquitetura
* regras de negócio
* fluxos
* componentes
* banco de dados
* validações
* segurança
* autenticação
* UI/UX
* estrutura de pastas
* padrões de código
* integrações
* comportamento esperado
* edge cases
* regras do frontend
* regras do backend
* responsividade
* animações
* acessibilidade
* performance
* estratégias futuras

O documento deve ser extremamente detalhado para reduzir ambiguidades e evitar erros de implementação.

---

# FORMATO

Gerar um documento profissional em Markdown (.md).

Usar:

* títulos hierárquicos
* tabelas
* listas organizadas
* exemplos técnicos
* diagramas Mermaid quando necessário
* linguagem técnica profissional

---

# ESTRUTURA OBRIGATÓRIA DO DOCUMENTO

# 1. VISÃO GERAL DO PROJETO

Incluir:

* objetivo do sistema
* problema que resolve
* público-alvo
* escopo
* diferenciais
* visão de produto
* metas técnicas
* metas de UX

---

# 2. STACK TECNOLÓGICA

Detalhar:

* Next.js
* TypeScript
* PostgreSQL
* Prisma
* TailwindCSS
* Framer Motion
* Auth.js/NextAuth
* React Hook Form
* Zod

Explicar:

* por que cada tecnologia foi escolhida
* benefícios
* responsabilidades

---

# 3. ARQUITETURA DO SISTEMA

Criar explicação COMPLETA da arquitetura:

* App Router architecture
* divisão frontend/backend
* server components vs client components
* estratégia de renderização
* gerenciamento de estado
* modularização
* feature-based architecture
* separação de responsabilidades

Incluir diagramas Mermaid.

---

# 4. ESTRUTURA DE PASTAS

Definir estrutura COMPLETA:

src/
app/
components/
features/
services/
repositories/
hooks/
types/
utils/
validators/
lib/

Explicar:

* responsabilidade de cada pasta
* regras de uso
* dependências permitidas
* anti-patterns

---

# 5. PADRÕES DE CÓDIGO

Definir padrões obrigatórios:

* nomenclatura
* componentização
* tipagem
* separação lógica/UI
* hooks
* tratamento de erros
* funções utilitárias
* composição
* acessibilidade
* responsividade

Definir:

* o que DEVE ser feito
* o que NÃO DEVE ser feito

---

# 6. DESIGN SYSTEM

Definir:

* paleta de cores
* tipografia
* espaçamento
* sombras
* bordas
* grid
* animações
* estados visuais

Inspirar-se em:

* Linear
* Vercel
* Raycast
* Notion

Definir regras:

* hover
* transitions
* glassmorphism
* contrastes
* dark mode

---

# 7. UX E ANIMAÇÕES

Definir animações detalhadamente:

* scroll animations
* fade in/out
* stagger animations
* microinterações
* drag animations
* loading states
* hover states
* transições entre páginas

Explicar:

* duração
* easing
* comportamento
* intensidade

Definir também:

* o que NÃO fazer
* evitar exageros
* evitar animações agressivas

---

# 8. MODELAGEM DO BANCO

Criar modelagem COMPLETA:

Entidades:

* User
* Task
* Tag

Detalhar:

* campos
* tipos
* índices
* relacionamentos
* constraints
* regras
* cascade behaviors

Incluir:

* schema Prisma
* diagramas ERD em Mermaid

---

# 9. AUTENTICAÇÃO E SEGURANÇA

Definir:

* fluxo de login
* fluxo de registro
* JWT
* sessões
* hash de senha
* proteção de rotas
* rate limiting
* validações
* sanitização
* prevenção contra:

  * XSS
  * CSRF
  * SQL Injection

---

# 10. REGRAS DE NEGÓCIO

Documentar TODAS as regras.

Exemplos:

* usuário só vê próprias tarefas
* título obrigatório
* limite de caracteres
* prioridades válidas
* tags duplicadas
* exclusão de tarefas
* comportamento do kanban
* ordenação
* pesquisa

Definir:

* regras válidas
* regras inválidas
* edge cases

---

# 11. SISTEMA KANBAN

Explicar COMPLETAMENTE:

* drag and drop
* persistência
* atualização otimista
* ordenação
* sincronização
* comportamento visual
* performance

Definir:

* fluxo interno
* estados
* rollback em erro

---

# 12. APIs E FLUXOS

Documentar:

* endpoints
* payloads
* responses
* status codes
* validações
* erros possíveis

Criar tabela detalhada de APIs.

---

# 13. VALIDAÇÕES

Definir TODAS validações do sistema:

Frontend:

* formulários
* feedback visual
* UX

Backend:

* Zod
* sanitização
* consistência

---

# 14. PERFORMANCE

Definir:

* lazy loading
* code splitting
* memoization
* cache
* otimizações do Next.js
* otimizações Prisma
* otimizações PostgreSQL

---

# 15. ACESSIBILIDADE

Definir:

* aria labels
* navegação teclado
* contraste
* foco
* screen readers

---

# 16. RESPONSIVIDADE

Definir comportamento:

* mobile
* tablet
* desktop
* widescreen

---

# 17. LOGGING E MONITORAMENTO

Definir:

* logs
* tratamento de erros
* debug
* rastreamento

---

# 18. TESTES

Definir estratégia:

* unitários
* integração
* e2e

Mesmo que não sejam implementados agora.

---

# 19. ROADMAP FUTURO

Possíveis melhorias:

* colaboração em tempo real
* notificações
* modo equipe
* calendário
* analytics

---

# 20. ANTI-PATTERNS

Criar seção enorme com:

* o que NÃO fazer
* más práticas
* problemas comuns
* erros arquiteturais
* padrões proibidos

---

# ESTILO DO DOCUMENTO

O documento deve:

* soar extremamente profissional
* parecer documentação corporativa real
* ser profundo
* técnico
* consistente
* sem superficialidade

---

# IMPORTANTE

NÃO gerar:

* documentação rasa
* tópicos curtos
* placeholders genéricos
* respostas simplificadas

Quero um documento MUITO EXTENSO, altamente técnico e detalhado.
