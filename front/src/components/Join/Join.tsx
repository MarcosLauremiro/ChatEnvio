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
    <div className="login__conatiner">
      <h1 className="title">Join the Chat</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="button" type="submit">
          Join
        </button>
      </form>
    </div>
  );
}
