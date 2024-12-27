import fs from 'fs-extra';
import path from 'path';
export class TemplateHandler {
    constructor() {
        this.templatesDir = path.resolve(__dirname, '../templates');
    }
    copyTemplate(moduleName, destination) {
        const source = path.join(this.templatesDir, moduleName);
        fs.copySync(source, destination);
    }
}
