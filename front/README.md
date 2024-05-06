# ChatEnvio - Front-End

O ChatEnvio é um front-end desenvolvido em React para um sistema de chat que se comunica com um back-end Node.js. Ele suporta troca de mensagens em tempo real via WebSockets, gerenciamento de grupos e integrações com Redux para um gerenciamento de estado robusto. Este README descreve os principais componentes do projeto, como ele é construído e como você pode configurá-lo a partir do GitHub.

## Estrutura de Arquivos

- `main.tsx`: Arquivo de entrada principal que inicializa a aplicação React, envolvendo-a com um provedor de estado do Redux.
- `App.tsx`: Componente principal que controla o fluxo de entrada do usuário e exibe o conteúdo relevante (sala de chat ou formulário de ingressão).
- `api.ts`: Serviço de comunicação com o back-end utilizando Axios para fazer requisições HTTP.
- `store`: Diretório contendo a configuração do Redux e as rotinas para gerenciar o estado.
- `components`: Diretório contendo os componentes reutilizáveis como ChatMessage, GroupModal, Join e SearchInput.
- `pages`: Diretório contendo a página Chat.tsx.

## Pré-requisitos

- Node.js (>= 14.x)

## Instalação e Execução

Siga os passos abaixo para instalar e executar o projeto:

### 1. Clonar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

### 2. Instalar Dependencias

```bash
npm install
```

### 2. Executar o Projeto

```bash
npm start
```

Acesse http://localhost:3000 para ver a aplicação rodando.

## Componentes e Arquivos

`main.tsx`
Este é o arquivo inicial que carrega a aplicação React. Ele faz uso de `ReactDOM.createRoot` para renderizar o aplicativo na `DOM`. Também envolve o aplicativo no provedor Redux para garantir que todos os componentes possam acessar o estado global:

```bash
ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

`App.tsx`
Este é o componente principal que decide qual conteúdo exibir com base na autenticação do usuário. Ele utiliza useState e useEffect para controlar a exibição do componente Join ou da sala de chat:

```bash
function App() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    if (!userName) {
      setIsJoinModalOpen(true);
    }
  }, [userName]);

  const handleJoin = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setIsJoinModalOpen(false);
  };

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__content">
          {isJoinModalOpen && <Join onJoin={handleJoin} />}
          {!isJoinModalOpen && <ChatRoom />}
        </div>
      </div>
    </div>
  );
}

export default App;
```

`store`
A pasta store contém arquivos relacionados à configuração do Redux, incluindo index.ts, que cria a loja Redux, e routines/messages.ts, que contém a rotina assíncrona para buscar mensagens.

`store/index.ts`
O arquivo `index.ts` define a configuração inicial da loja do Redux. Ele também define tipos personalizados para uso no aplicativo.

```bash
const store = configureStore({
  reducer: {
    chats,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type StoreState = ReturnType<typeof store.getState>;
export default store;
```

`store/routines/messages.ts`
Este arquivo define a lógica para buscar mensagens do back-end de forma assíncrona e atualizar o estado global da aplicação.

```bash
export const initialFetchMessages = createAsyncThunk(
  "chat/initialFetch",
  async () => {
    const response = await chatService.getAllMessages();
    return response;
  }
);

export const getMessagesRoutines = (
  builder: ActionReducerMapBuilder<ChatState>
) => {
  builder.addCase(initialFetchMessages.pending, (state) => {
    state.loading = true;
  });
  builder.addCase(initialFetchMessages.fulfilled, (state, action) => {
    state.loading = false;
    state.messages = action.payload;
  });
  builder.addCase(initialFetchMessages.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "";
  });
};
```

### Componentes

`components/ChatMessage`
Este componente é responsável por exibir uma mensagem individual com a estilização correspondente (enviada ou recebida).

```bash
import "./styles.scss";

export interface ChatMessageProps {
  text: string;
  fromMe: boolean;
  senderName: string;
  createdAt?: Date;
  groupId: string;
}

export default function ChatMessage({
  text,
  fromMe,
  senderName,
  createdAt,
}: ChatMessageProps) {
  const date = (date?: Date) => {
    if (!date) {
      return "";
    }
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours > 9 ? hours : `0${hours}`}:${
      minutes > 9 ? minutes : `0${minutes}`
    }`;
  };
  return (
    <div className={`message ${fromMe ? "sent" : "received"}`}>
      <div className="message__content">
        <div className="message__content__sender">{senderName}</div>
        <div className="message__content__text">{text}</div>
        {createdAt && (
          <p className="message__content__at">{date(new Date(createdAt))}</p>
        )}
      </div>
    </div>
  );
}
```

`components/GroupModal`
Este componente permite que os usuários mudem de grupos ou entrem em outros grupos.

```bash
import { Modal, Button } from "antd";

interface GroupModalProps {
  currentGroup: string;
  onSelectGroup: (groupId: string) => void;
  onClose: () => void;
  visible: boolean;
  groupNames: string[];
}

const groups = ["1", "2", "3", "4"];

export default function GroupModal({
  currentGroup,
  onSelectGroup,
  onClose,
  visible,
  groupNames,
}: GroupModalProps) {
  return (
    <Modal
      title="Select a group"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      {groups
        .filter((groupId) => groupId !== currentGroup)
        .map((groupId) => (
          <Button
            key={groupId}
            onClick={() => onSelectGroup(groupId)}
            style={{ margin: "10px" }}
          >
            {groupNames[Number(groupId) - 1] || groups[Number(groupId)]}
          </Button>
        ))}
    </Modal>
  );
}
```

`components/Join`
Este componente mostra um formulário de entrada para que os usuários forneçam seus nomes e entrarem no chat.

```bash
import { useState } from "react";
import "./styles.scss";

interface JoinProps {
  onJoin: (name: string) => void;
}

export default function Join({ onJoin }: JoinProps) {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onJoin(name);
  };

  return (
    <div className="login__container">
      <h1 className="title">Join the Chat</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(value) => setName(value.target.value)}
          required
        />
        <button className="button" type="submit">
          Join
        </button>
      </form>
    </div>
  );
}
```

`components/SearchInput`
O componente `SearchInput` é um simples campo de entrada para pesquisar mensagens no chat.

```bash
import { Input } from "antd";

interface SearchInputProps {
  searchText: string;
  setSearchText: (searchText: string) => void;
}

export const SearchInput = ({
  searchText,
  setSearchText,
}: SearchInputProps) => (
  <Input
    type="text"
    placeholder="Search messages"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
);
```

`pages/Chat.tsx`
Este é o componente da página principal que contém toda a funcionalidade da sala de chat. Ele gerencia mensagens, grupos e WebSockets para comunicação em tempo real.
