import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger();

const directoryPath = path.join(process.cwd(), 'apps/eland/config');

// Define a type for the config entries for better readability and safety
type ServiceConfig = {
  cmd: string;
  service: string;
  type: string; 
  method?: string; // Included for duplicate check
  exchange?: string;
  routingKey?: string;
  root?: string;
  isStream?: boolean;
  path?: string;
};

// ... other imports remain the same ...

export const loadAllConfigs = (): ServiceConfig[] => {
  const mergedConfig: ServiceConfig[] = [];
  // Key: Unique composite string, Value: The file where it was first found
  const seenConfigs = new Map<string, string>(); 
  let hasDuplicates = false;

  try {
    const files = fs.readdirSync(directoryPath);
    const configFiles = files.filter(file => file.endsWith('config.json'));

    configFiles.forEach(file => {
      try {
        const filePath = path.join(directoryPath, file);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const parsedData: ServiceConfig[] = JSON.parse(rawData);

        // Check for duplicates before merging
        parsedData.forEach(entry => {
          let key: string;
          let duplicateMessageFields: string;

          if (entry.type === 'http' || entry.type === 'stream') {
            const method = entry.method || 'N/A';
            key = `${entry.cmd}::${entry.service}::${entry.type}::${method}`;
            duplicateMessageFields = `cmd: **${entry.cmd}**, service: **${entry.service}**, type: **${entry.type}**, and method: **${method}**`;
          } else {
            key = `${entry.cmd}::${entry.service}`;
            duplicateMessageFields = `cmd: **${entry.cmd}** and service: **${entry.service}**`;
          }
          
          if (seenConfigs.has(key)) {
            logger.error(
              `🚨 Duplicate Configuration Found! The combination of ${duplicateMessageFields} is defined in both **${seenConfigs.get(key)}** and **${file}**.`
            );
            hasDuplicates = true;
          } else {
            seenConfigs.set(key, file);
            mergedConfig.push(entry);
          }
        });

      } catch (error) {
        logger.error(`Error loading ${file}:`, error);
      }
    });

    if (hasDuplicates) {
        logger.warn('⚠️ **WARNING**: Configuration loaded with duplicates removed (first definition kept). Please resolve conflicting entries.');
    }
    
    return mergedConfig; 
    
  } catch (error) {
    logger.error('Error reading utilities directory:', error);
    return [];
  }
};