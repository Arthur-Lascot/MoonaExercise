import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import iamATeaPot  from "./tools/IamATeaPotTool";

export const buildMCPSever = (): McpServer => 
{
    const server = new McpServer({
        name: "MoonaHealth-MCP",
        version: '1.0.0'
    });

    server.registerTool(
        iamATeaPot.name,
        {
            title: iamATeaPot.metadata.title,
            description: iamATeaPot.metadata.description,
            inputSchema: iamATeaPot.metadata.inputSchema,
            outputSchema: iamATeaPot.metadata.outputSchema
        },
        iamATeaPot.handler as any //FIXME
    )

    return server;
}