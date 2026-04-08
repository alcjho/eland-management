import * as path from "path";
import * as fs from 'fs';
import { HttpServiceData, ServiceData, TcpServiceData } from "../types/services.types";

// utilities.ts

type RawServiceData = { name: string, transport: string, options: { host?: string, port?: string | number, baseURL?: string } };

export const loadServices = (): ServiceData[] => {
  const microservicesConfigPath = path.join(process.cwd(), 'apps', 'eland', 'config', 'microservices.json');
  
  // Read and Parse JSON
  const rawData: RawServiceData[] = JSON.parse(fs.readFileSync(microservicesConfigPath, 'utf-8'));

  return rawData.map(service => {
    if (service.transport === 'TCP' && service.options.host && service.options.port) {
      // Ensure port is a number for TCP services
      const port = typeof service.options.port === 'string' 
                   ? parseInt(service.options.port, 10) 
                   : service.options.port;

      return {
        name: service.name,
        transport: 'TCP', // Literal type
        options: { host: service.options.host, port: port as number }
      } as TcpServiceData;
    } 
    // ... handle other transport types if needed (e.g., 'RMQ')
    else if (service.transport === 'HTTP' && service.options.baseURL) {
      return {
        name: service.name,
        transport: 'HTTP', // Literal type
        options: { baseURL: service.options.baseURL }
      } as HttpServiceData;
    }
    
    // Fallback or throw error for unknown/malformed services
    throw new Error(`Malformed or unsupported service configuration for: ${service.name}`);
  }) as ServiceData[];
}