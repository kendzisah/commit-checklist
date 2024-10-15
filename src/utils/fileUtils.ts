import * as fs from 'fs';

export function readJsonFile<T>(filePath: string): T | null {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    console.error(`Failed to read JSON file at ${filePath}: ${error.message}`);
    return null;
  }
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
