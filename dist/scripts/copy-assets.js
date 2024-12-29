import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';
// Emulate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Paths
const templatesSrc = path.resolve(__dirname, '../../src/templates');
const templatesDest = path.resolve(__dirname, '../templates');
// Copy assets
(async function copyAssets() {
    try {
        await fs.copy(templatesSrc, templatesDest, { overwrite: true });
        console.log('Assets successfully copied to dist.');
    }
    catch (error) {
        console.error(`Error copying assets: ${error}`);
        process.exit(1);
    }
})();
