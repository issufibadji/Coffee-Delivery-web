<h1 align="center">🥤 Coffee Delivery ☕</h1>

<div align="center">
 <img src="./src/assets/homeImage.png" width="400px" alt="Home Image"/>
</div>

<h3 align="center">Um site de delivery de cafés desenvolvido com React + Typescript para a trilha de React do Ignite, Rocketseat.</h3>

---

<h2>Demonstração 🎥</h2>

_<h3>Um pequeno tour pelo Projeto 💻</h3>_

<img src='./github/tour.gif' alt='Tour GIF'/>

_<h3>Adicionando e removendo cafés do carrinho 🛒</h3>_

<img src='./github/carrinho.gif' alt='Tour GIF'/>

_<h3>Completando Pedidos 📦</h3>_

<img src='./github/completando_pedido.gif' alt='Tour GIF'/>

_<h3>Vendo o Histórico 📄</h3>_

<img src='./github/historico.gif' alt='Tour GIF'/>

<br>

---

<h2>Fui além do desafio! 🚀</h2>

<br>

- ✔️ Fiz o website ser `responsivo`
- ✔️ Adicionei um `tema escuro`
- ✔️ Coloquei `auto complete da cidade e do UF` baseado no CEP
- ✔️ Desenvolvi uma página para ver o `histórico de pedidos`
- ✔️ Adicionei `mensagens` para notificar o usuário
- ✔️ Desenvolvi uma `validação do formulário` em tempo real

<br>

---

<h2>Mas, o que eu aprendi? 🤔</h2>

<br>

- Aprendi a utilizar `reducers` para manusear estados mais complexos
- Aprendi a utilizar o `React Hook Form e Zod` para os formulários
- Aprendi a usar o `Date-Fns` para manipular datas
- Aprendi a criar `variáveis auxiliares` para deixar o `código mais limpo e legível`

<br>

---

<h2>Tecnologias Utilizadas 🛠</h2>

#### FrontEnd: `ReactJS!`

- Axios
- React Icons
- React Toastify
- React Hook Form
- Zod Resolver
- Typescript
- Context API
- Uuidv4
- Date-fns
- React Router Dom
- Google OAuth (Login com Google)

###### 1- Install the dependencies:

`` npm install ``

###### 2 - Run de web aplication in development mode:

``  npm run dev ``

---


<h2>Integração com Supabase 🗄️</h2>

<h3>1) Instale as dependências</h3>

```
npm install
```

<h3>2) Configure as variáveis no .env</h3>

Crie (ou edite) um arquivo <code>.env</code> na raiz:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ O token com prefixo <code>sbp_</code> é um Personal Access Token da plataforma Supabase e não deve ser usado no front-end.
> Use a chave pública do projeto em <strong>Project Settings → API</strong> (anon/publishable key).

<h3>3) Rode o projeto</h3>

```
npm run dev
```

<h2>Login com Google (OAuth) 🔐</h2>

<h3>1) Criar Client ID no Google Cloud</h3>

1. Acesse <strong>Google Cloud Console</strong>.
2. Vá em <strong>APIs & Services → Credentials</strong>.
3. Clique em <strong>Create Credentials → OAuth client ID</strong>.
4. Escolha <strong>Web application</strong>.

<h3>2) Configure os endpoints do OAuth</h3>

No seu Client ID, adicione:

<strong>Authorized JavaScript origins</strong>

```
http://localhost:3000
```

<strong>Authorized redirect URIs</strong>

```
http://localhost:3000
```

<em>Se estiver usando outra porta (ex.: 5173), substitua o endereço pelo que aparece no navegador.</em>

<h3>3) Crie o arquivo .env</h3>

Na raiz do projeto, crie um arquivo <code>.env</code>:

```
VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID.apps.googleusercontent.com
```

<h3>4) Reinicie o Vite</h3>

O Vite carrega variáveis de ambiente apenas no boot, então pare e rode novamente:

```
npm run dev
```


<div style="display: inline_block"><br>
  <img align="center" alt="npm" height="35" width="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" />
  <img align="center" alt="Js" height="35" width="45"  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg">
  <img align="center" alt="Ts" height="35" width="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg">
  <img align="center" alt="React" height="35" width="45" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg">
 </div>

<br>

---

<div id="footer" align="center"><a href="https://www.linkedin.com/in/matheus-andrade23/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
<a href = "mailto:matheusandrade.ma2003@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a></div>
