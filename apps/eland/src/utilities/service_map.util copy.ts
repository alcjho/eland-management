import * as fs from 'fs';
import * as path from 'path';

const directoryPath = path.join(process.cwd(), 'apps/eland/config');

export const loadAllConfigs = () => {
  const mergedConfig: { cmd: string; service: string; type: string }[] = [];

  try {
    // Read all files in the directory
    const files = fs.readdirSync(directoryPath);

    // ✅ Filter only files that end with "config.json"
    const configFiles = files.filter(file => file.endsWith('config.json'));

    configFiles.forEach(file => {
      try {
        const filePath = path.join(directoryPath, file);

        // Read JSON content
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const parsedData: { cmd: string; service: string; type: string, exchange?: string, routingKey?: string}[] = JSON.parse(rawData);

        // ✅ Merge entries from the file into the main array
        mergedConfig.push(...parsedData);

      } catch (error) {
        console.error(`Error loading ${file}:`, error);
      }
    });

    return mergedConfig;
  } catch (error) {
    console.error('Error reading utilities directory:', error);
    return [];
  }
};