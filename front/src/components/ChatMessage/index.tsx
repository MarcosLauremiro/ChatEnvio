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
