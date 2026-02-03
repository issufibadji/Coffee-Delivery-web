# Documentação técnica — Coffee Delivery

Este documento reúne explicações detalhadas do código do projeto, incluindo a seção de **"Explicação linha a linha"** solicitada e descrições gerais de como os módulos se organizam.

> Observação: para evitar repetição excessiva, linhas que cumprem a mesma função são explicadas em blocos contínuos.

---

## Visão geral da estrutura

- `src/components`: componentes de UI reutilizáveis (Header, Footer, Container etc.).
- `src/contexts`: contextos globais (AuthContext).
- `src/pages`: páginas de rota (Home, Order/Checkout, Login, History, SuccessfulOrder).
- `src/providers`: provedores de estado (OrdersProvider e ThemeProvider).
- `src/routes`: configuração de rotas e guardas.
- `src/services`: integração com APIs externas (Google UserInfo e DB/CEP).
- `src/storage`: helpers para LocalStorage.
- `src/styles`: temas e estilos globais.
- `src/utils`: funções auxiliares (ex.: preferência de pagamento, cálculo do carrinho).

---

# Explicação linha a linha

## `src/App.tsx`

- Linhas 1–9: Importam o `ToastContainer`, estilos do toast, rotas e providers principais.
- Linhas 11–27: Cria `googleClientId` do `.env` e monta `appContent` com `AuthProvider`, `OrdersProvider` e `ThemeProvider`.
- Linhas 29–38: Se existir Client ID, envolve o app com `GoogleOAuthProvider`; caso contrário, renderiza o app normalmente.

---

## `src/routes.tsx`

- Linhas 1–5: Importam utilitários de rota do React Router.
- Linhas 7–12: Importam páginas e o guard `ProtectedRoute`.
- Linhas 14–17: Importam `Header`, `Footer` e `Container`.
- Linhas 19–42: Montam a árvore de rotas:
  - `/history` é protegido por `ProtectedRoute`.
  - `/checkout` e `/order` apontam para o checkout.
  - `/login`, `/`, `/order/success` seguem fluxo normal.

---

## `src/routes/ProtectedRoute.tsx`

- Linhas 1–6: Importa React, Router, toast e helpers de Auth + redirect.
- Linhas 8–11: Define props do guard (children e message).
- Linhas 13–25: Se não autenticado, salva `redirectTo` e exibe toast com mensagem.
- Linhas 27–31: Redireciona para `/login` quando não autenticado; caso contrário, renderiza `children`.

---

## `src/contexts/AuthContext.tsx`

- Linhas 1–9: Importa React, OAuth Google, serviços e storage.
- Linhas 11–27: Define o tipo `AuthContextData` e cria o contexto com valores iniciais.
- Linhas 29–33: Define props do Provider.
- Linhas 34–96: Provider com Google:
  - Usa `useGoogleLogin`.
  - Busca userinfo na API do Google.
  - Salva usuário e aplica redirecionamento se existir `redirectTo`.
  - Controla estado de loading e mensagens de erro.
- Linhas 98–129: Provider fallback quando não há Client ID no `.env`.
- Linhas 131–140: `AuthProvider` escolhe o provider correto.

---

## `src/providers/OrdersProvider/index.tsx`

- Linhas 1–13: Importações e helpers de storage + Auth.
- Linhas 14–49: Tipos do pedido e do café; `OrderProps` inclui `userId`.
- Linhas 51–73: Define interface do contexto e tipo `CurrentOrderType`.
- Linhas 75–88: Recupera `userId` atual e define estado inicial com `ordersByUser`.
- Linhas 89–152: Reducer:
  - Adiciona/remover itens do carrinho.
  - Finaliza pedido gravando em `ordersByUser[userId]`.
- Linhas 155–162: Persiste no LocalStorage e filtra pedidos do usuário logado.
- Linhas 163–195: Ações públicas (`add`, `remove`, `complete`) com proteção por `userId`.
- Linhas 197–212: Provider expõe dados e ações para o resto do app.

---

## `src/pages/Order/index.tsx`

- Linhas 1–27: Imports do formulário, hooks, contexto e storage de snapshot.
- Linhas 29–37: Schema Zod tipado para o formulário de checkout.
- Linhas 41–65: Inicializa `useForm` e estado de pagamento.
- Linhas 71–79: Reidrata snapshot do checkout se existir (pós-login).
- Linhas 81–105: Guard no botão de confirmar:
  - Se não autenticado, salva redirect + snapshot e envia para `/login`.
  - Se autenticado, cria pedido normalmente.
- Linhas 107–118: Renderiza formulário e carrinho.

---

## `src/pages/History/index.tsx`

- Linhas 1–9: Importa estilos, contexto e card.
- Linhas 11–32: Exibe mensagem caso não existam pedidos; caso contrário, lista pedidos do usuário atual.

---

## `src/pages/Login/index.tsx`

- Linhas 1–6: Importa AuthContext e helpers de redirect.
- Linhas 17–27: Redireciona para `/` se já estiver autenticado.
- Linhas 29–57: Renderiza card de login:
  - Mostra alerta se veio de rota protegida.
  - Exibe aviso se não há Client ID.
  - Mostra loading no botão quando estiver autenticando.

---

## `src/pages/Login/styles.ts`

- Linhas 3–31: Layout do card e container.
- Linhas 33–39: Estilo do alerta de login.
- Linhas 41–65: Botão com estilos e estados.
- Linhas 67–81: Spinner de loading do botão.

---

## `src/components/Header/index.tsx`

- Linhas 1–25: Imports de ícones, contextos e estilos.
- Linhas 27–49: Obtém `cart` e `user` + calcula iniciais para fallback de avatar.
- Linhas 51–85: Renderiza Header com localização, carrinho, histórico e login/logout.

---

## `src/components/Header/styles.ts`

- Linhas 4–45: Estilos do container e badge de localização.
- Linhas 47–75: Estilos de links de ícone (carrinho e histórico).
- Linhas 77–94: Botão “Entrar”.
- Linhas 96–124: Avatar do usuário e fallback com iniciais.
- Linhas 126–155: Meta de usuário e botão de logout.

---

## `src/services/googleUserInfo.ts`

- Linhas 1–10: Tipagem dos dados vindos da API do Google.
- Linhas 12–26: Fetch da API `userinfo` com o access token.

---

## `src/storage/auth.ts`

- Linhas 1–7: Define a chave de storage e função para salvar usuário.
- Linhas 9–20: Recupera usuário do storage com fallback seguro.
- Linhas 23–25: Remove usuário do storage no logout.

---

## `src/storage/orders.ts`

- Linhas 1–6: Tipos do mapa `ordersByUser` e do estado completo.
- Linhas 8–9: Chaves de storage (nova e legacy).
- Linhas 11–41: Lê estado do storage e migra `currentOrder` antigo.
- Linhas 43–47: Persistência do estado novo.

---

## `src/storage/redirect.ts`

- Linhas 1–19: Tipos de redirect e snapshot do checkout.
- Linhas 21–22: Chaves do LocalStorage.
- Linhas 24–66: Funções de salvar/ler/limpar redirect e snapshot.

---

## `src/services/api.ts`

- Linhas 1–7: Cria instância do Axios com `baseURL` do CEP/DB.

---

## `src/utils/get-new-order-info.ts`

- Responsável por calcular o resumo do carrinho (total de produtos, entrega e total geral).

---

## `src/utils/get-payment-preference.ts`

- Traduz o código de pagamento (`creditCard`, `debitCard`, `money`) para rótulos amigáveis.

---

# Explicações adicionais (fluxo do app)

## Fluxo de autenticação

1. Usuário clica em “Entrar com Google”.
2. `AuthContext` inicia login via Google OAuth.
3. Access token é trocado por `userinfo` na API do Google.
4. Usuário é persistido em LocalStorage.
5. Se existir `redirectTo`, ele é aplicado após login.

## Proteções de rota e ação

- `/history` é protegido por `ProtectedRoute`.
- Checkout só é confirmado se autenticado; caso contrário, salva snapshot e redireciona.

## Separação de pedidos por usuário

- Pedidos são armazenados em `ordersByUser` com chave igual ao `userId`.
- O histórico filtra apenas os pedidos do usuário logado.

---

# Checklists manuais

- [ ] Acessar `/history` deslogado → redireciona para `/login` com mensagem.
- [ ] Confirmar pedido sem login → redireciona para `/login`, não cria pedido.
- [ ] Logar e voltar para `/checkout` → formulário reidratado.
- [ ] Criar pedido como usuário A e trocar para usuário B → histórico não exibe pedidos do A.

