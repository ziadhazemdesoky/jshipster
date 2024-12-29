import fs from 'fs-extra';

export function ensureDirectoryExists(directory: string): void {
  try {
    fs.ensureDirSync(directory);
  } catch (err) {
    throw new Error(`Failed to ensure directory: ${directory}. Error: ${err}`);
  }
}

export function writeFileSafely(filePath: string, content: string): void {
  if (fs.existsSync(filePath)) {
    throw new Error(`File already exists: ${filePath}`);
  }
  fs.writeFileSync(filePath, content);
}
