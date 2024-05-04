const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  swagger: "2.0",
  info: {
    title: "Chat API",
    version: "1.0.0",
    description: "Chat API with Swagger",
  },
  host: "localhost:3000",
  basePath: "/",
  paths: {
    "/message": {
      get: {
        tags: ["Message"],
        summary: "Get all messages",
        description: "Get all messages",
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              type: "array",
            },
          },
        },
      },
      post: {
        tags: ["Message"],
        summary: "Create a new message",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Message object",
            required: true,
            schema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                },
                fromMe: {
                  type: "boolean",
                },
                senderName: {
                  type: "string",
                },
                createdAt: {
                  type: "date",
                },
                groupId: {
                  type: "string",
                },
              },
            },
          },
        ],
        produces: ["application/json"],
        responses: {
          200: {
            description: "Successful operation",
            schema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                },
                fromMe: {
                  type: "boolean",
                },
                senderName: {
                  type: "string",
                },
                createdAt: {
                  type: "date",
                },
                groupId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;