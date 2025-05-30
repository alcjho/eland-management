import * as path from "path";
import * as fs from 'fs';

type ServiceData = { name: string, transport: string, options: { host: string, port: string } };

export const loadServices = (): ServiceData[] => {
    const microservicesConfigPath = path.join(process.cwd(), 'apps', 'eland', 'config', 'microservices.json');
    return JSON.parse(fs.readFileSync(microservicesConfigPath, 'utf-8'));
}
