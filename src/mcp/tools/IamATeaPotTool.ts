import { readFile } from "fs/promises";
import path from "path"

const iamATeaPot = {
    name: 'local-TeaPot',
    metadata: {
        title: 'TeaPot',
        description: 'I am a tea pot',
        inputSchema: {},
        outputSchema: {}
    },
    handler: async () => {
        const filePath = path.resolve(process.cwd(), './TeaPot.png');
        const buffer = await readFile(filePath);
        const base64 = buffer.toString('base64');

        return {
            content: [{type: 'image', mimeType: 'image/png', data: base64}],
            structuredContent: {success: true}
        };
    }
};

export default iamATeaPot;