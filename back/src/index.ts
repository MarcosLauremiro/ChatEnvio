import express, { Request, Response } from "express";
import * as http from "http";
import * as WebSocket from "ws";
import cors from "cors";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Message } from "./entity/Message";
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swaggerConfig');

const app = express();
export const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });
require("dotenv").config();

const db = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  database: "chat",
  entities: [Message],
});

db.initialize()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

const broadcast = (msg: any) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
};

wss.on("connection", (ws) => {
  const heartbeat = () => {
    if (!ws) return;
    if (ws.readyState !== 1) return;
    ws.send(
      JSON.stringify({
        type: "heartbeat",
        msg: true,
      })
    );
    setTimeout(heartbeat, 20000);
  };
  heartbeat();
});
// console.log( swagger);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use(cors({ origin: "*" }));
app.use(express.json());

interface ChatMessageProps {
  text: string;
  fromMe: boolean;
  senderName: string;
  createdAt: Date;
  groupId: string;
}

app.get("/message", async (_: Request, res: Response) => {
  try {
    const messageRepo = db.getRepository(Message);
    const messages: ChatMessageProps[] = await messageRepo.find({
      order: {
        createdAt: "ASC",
      },
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }

  // TODO
  /**
   * Desenvolva uma lógica eficiente para listar as mensagens contidas no array,
   * assegurando uma apresentação organizada e acessível aos usuários.
   * Essa implementação proporcionará uma experiência de visualização clara e
   * facilitará a interação com as mensagens disponíveis.
   */
});

app.post("/message", async (req: Request, res: Response) => {
  const messageRepo = db.getRepository(Message);

  const body: ChatMessageProps = req.body;
  const message = messageRepo.create({
    fromMe: true,
    senderName: body.senderName,
    text: body.text,
    groupId: body.groupId,
  });

  await messageRepo.save(message);

  broadcast({
    type: "message",
    message,
  });

  return res.status(201).json(message);
});

app.all("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "URL not found" })
);

server.listen(3000, async () => {
  console.log(`Server started on port 3000 :)`);
});
