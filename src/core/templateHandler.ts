import fs from 'fs-extra';
import path from 'path';

export class TemplateHandler {
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.resolve(__dirname, '../templates');
  }

  public copyTemplate(moduleName: string, destination: string) {
    const source = path.join(this.templatesDir, moduleName);
    fs.copySync(source, destination);
  }
}
