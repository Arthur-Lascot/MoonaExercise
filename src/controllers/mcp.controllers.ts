import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import z from 'zod';

const transports: { [sessionId: string]: StreamableHTTPServerTransport} = {}

export const clientToServerCommunication = async (req: any, res: any) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
    }
    else if (! sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: sessionId => {transports[sessionId] = transport}
        });

        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId]
            }
        };

        const server = new McpServer({
            name: 'example-server',
            version: '1.0.0'
        });

        server.registerTool(
            'echo',
            {
                title: 'Echo Tool',
                description: 'Echoes back the provided message',
                inputSchema: { message: z.string() },
                outputSchema: { echo: z.string() }
            },
            async ({ message }) => {
                const output = { echo: `Tool echo: ${message}` };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
                    structuredContent: output
                };
            }
        );

        await server.connect(transport);
    }
    else {
        res.status(400).json({
            jsonrpc: "2.0",
            error: {code : -32000, message: 'Bad request: No valid session ID provided'},
            id: null
        });
        return;
    }
    await transport.handleRequest(req, res, req.body);
} 

export const handleSessionRequest = async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing sessionId');
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
}