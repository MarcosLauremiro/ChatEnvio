/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Input, Menu, Dropdown, message, Modal, Form } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";
import ChatMessage, { ChatMessageProps } from "../components/ChatMessage";
import { useChat } from "../store/hooks";
import { useDispatch } from "react-redux";
import { initialFetchMessages } from "../store/routines/messages";
import { chatService } from "../api";
import { chatActions } from "../store/features/messages";
import GroupModal from "../components/GroupModal";
import { SearchInput } from "../components/SerchInput";
import { LiaLocationArrowSolid } from "react-icons/lia";

export default function ChatRoom() {
  const [messageText, setMessageText] = useState("");
  const [currentGroup, setCurrentGroup] = useState("1");
  const [isChangeGroupModalOpen, setIsChangeGroupModalOpen] = useState(false);
  const { messages } = useChat();
  const dispatch = useDispatch();
  const userName = localStorage.getItem("userName") || "Unknown User";
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [searchText, setSearchText] = useState("");
  const [groupName, setGroupName] = useState("Grupo 1");
  const [isEditGroupNameModalOpen, setIsEditGroupNameModalOpen] =
    useState(false);
  const [groupNames, setGroupNames] = useState([
    "Grupo 1",
    "Grupo 2",
    "Grupo 3",
    "Grupo 4",
  ]);
  const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);
  const [userGroups, setUserGroups] = useState(["1", "2", "3", "4"]);

  // TODO
  /**
   * Agora, é hora de aprimorar o armazenamento das mensagens! Atualmente,
   * o ChatEnvio está registrando suas mensagens no estado do componente,
   * o que não é ideal para uma aplicação destinada a atender milhares de usuários.
   * Recomendo que adote uma abordagem mais escalável,
   * como utilizar um gerenciador de estado como o Redux.
   * Isso proporcionará uma gestão mais eficiente e otimizada das mensagens,
   * garantindo um desempenho superior à medida que a aplicação cresce em escala.
   */

  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [currentGroup]);

  useEffect(() => {
    if (!socket) return;
    const heartbeat = () => {
      if (!socket) return;
      if (socket.readyState !== 1) return;
      socket.send(JSON.stringify({ ping: "Pong" }));
      setTimeout(heartbeat, 10000);
    };

    socket.onopen = function () {
      heartbeat();
      message.success("Seu chat está conectado! ✅");
    };

    const listener = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "heartbeat" || data.message.senderName === userName)
        if (data.message.groupId === currentGroup) return;
      dispatch(chatActions.add({ ...data.message, fromMe: false }));
    };

    socket.addEventListener("message", listener);
    socket.onclose = function () {
      message.success("Sucesso ao conectar (onclose)");
    };
    socket.onerror = function () {
      message.success("Erro ao conectar (onerror)");
    };

    return () => {
      socket.removeEventListener("message", listener);
    };
  }, [socket, userName, currentGroup]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [currentGroup]);

  //     // TODO addNewMessage
  //     /**
  //      *
  //      * É hora de sintonizar os eventos no WebSocket!
  //      * Implemente uma lógica de listener para capturar os eventos enviados pelo backend,
  //      * adicionando as mensagens ao chat em tempo real. Essa implementação garantirá uma
  //      * experiência dinâmica e instantânea, permitindo que as mensagens sejam exibidas no
  //      * chat assim que forem recebidas do backend.
  //      *
  //      */

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    dispatch(initialFetchMessages() as any);
  }, []);

  const handleMessageOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setMessageText(event.target.value);
  };

  const handleCreateMessage = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (messageText && dummy.current) {
      // TODO sendMessage
      /**
       * 
        Desenvolva a lógica de envio da nova mensagem para o backend. 
        Essa implementação garantirá que as mensagens enviadas sejam processadas de forma eficiente, 
        permitindo uma comunicação contínua e confiável entre o frontend e o backend.
       */
      const data: ChatMessageProps = {
        fromMe: true,
        senderName: userName,
        text: messageText,
        groupId: currentGroup,
      };

      const res = await chatService.sendMessage(data);
      dispatch(chatActions.add(res));

      setMessageText("");

      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChangeGroupClick = () => {
    setIsChangeGroupModalOpen(true);
  };

  const handleGroupSelect = (groupId: string) => {
    setCurrentGroup(groupId);
    setIsChangeGroupModalOpen(false);
  };

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleEditGroupNameClick = () => {
    setGroupName(groupNames[Number(currentGroup) - 1]);
    setIsEditGroupNameModalOpen(true);
  };

  const handleEditGroupNameOk = () => {
    const newGroupNames = [...groupNames];
    newGroupNames[Number(currentGroup) - 1] = groupName;
    setGroupNames(newGroupNames);
    setIsEditGroupNameModalOpen(false);
  };

  const handleEditGroupNameCancel = () => {
    setIsEditGroupNameModalOpen(false);
  };

  const handleExitGroupClick = () => {
    setIsExitConfirmModalOpen(true);
  };

  const handleExitConfirm = () => {
    setUserGroups(userGroups.filter((groupId) => groupId !== currentGroup));
    setIsExitConfirmModalOpen(false);
  };

  const handleExitCancel = () => {
    setIsExitConfirmModalOpen(false);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (messageText.trim()) {
        handleCreateMessage(event);
      }
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleEditGroupNameClick}>
        Edit group name
      </Menu.Item>
      <Menu.Item key="2" onClick={handleEditGroupNameClick}>
        Change group icon
      </Menu.Item>
      <Menu.Item key="3" onClick={handleChangeGroupClick}>
        Change group
      </Menu.Item>
      <Menu.Item key="4" onClick={handleExitGroupClick}>
        Exit group
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <GroupModal
        currentGroup={currentGroup}
        onSelectGroup={handleGroupSelect}
        onClose={() => setIsChangeGroupModalOpen(false)}
        visible={isChangeGroupModalOpen}
        groupNames={groupNames}
      />
      <Modal
        title="Editar nome do grupo"
        visible={isEditGroupNameModalOpen}
        onOk={handleEditGroupNameOk}
        onCancel={handleEditGroupNameCancel}
      >
        <Form>
          <Form.Item label="Nome do grupo">
            <Input value={groupName} onChange={handleGroupNameChange} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Exit"
        visible={isExitConfirmModalOpen}
        onOk={handleExitConfirm}
        onCancel={handleExitCancel}
        closable={true}
      >
        Are you sure you want to leave the group?
      </Modal>
      <div className="chat-container">
        <div className="chat-container__background">
          <header style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="image">{groupNames[Number(currentGroup) - 1]}</div>
            <Dropdown.Button
              style={{ width: 50 }}
              overlay={menu}
              icon={<MoreOutlined style={{ fontSize: "1.65rem" }} />}
            />
          </header>
          <SearchInput searchText={searchText} setSearchText={setSearchText} />
          <main>
            <div>
              {messages
                .filter(
                  (msg) =>
                    msg.groupId === currentGroup &&
                    msg.text.includes(searchText)
                )
                .map((msg, index) => {
                  return (
                    <ChatMessage
                      key={index}
                      fromMe={msg.senderName === userName}
                      senderName={
                        msg.senderName === userName ? "Eu" : msg.senderName
                      }
                      text={msg.text}
                      createdAt={msg.createdAt}
                      groupId={msg.groupId}
                    />
                  );
                })}
              <div ref={dummy} />
            </div>
          </main>
          <footer>
            {userGroups.includes(currentGroup) && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="text"
                  value={messageText}
                  placeholder="Type a message"
                  onChange={handleMessageOnChange}
                  onPressEnter={handleKeyPress}
                />
                <button className="btn__message" onClick={handleCreateMessage}>
                  <LiaLocationArrowSolid size={24} />
                </button>
              </form>
            )}
          </footer>
        </div>
      </div>
    </>
  );
}
