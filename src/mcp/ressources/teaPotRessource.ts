import { readFile } from "fs/promises";
import path from "path";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const teaPotResource = {
    name: "local-teapot",
    template: new ResourceTemplate("local://teapot", { list: undefined }),
    metadata: {
        title: "Teapot",
        description: "this teapot is an impostor"
    },
    handler: async () => {
        const filePath = path.resolve(process.cwd(), "./TeaPot.png");
        const data = (await readFile(filePath)).toString("base64");

        return {
            contents: [
                {
                    uri: "local://teapot",
                    mimeType: "image/png",
                    data
                }
            ]
        };
    }
};

export default teaPotResource;