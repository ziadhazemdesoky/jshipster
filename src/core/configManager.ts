import fs from 'fs';
import path from 'path';

export interface JSHipsterConfig {
  modules: Record<string, any>;
  directories?: {
    controller?: string;
    service?: string;
    route?: string;
    model?: string;
    repository?: string;
    dto?: string;
    tsconfig?: string;
    module?: string;
  };
  [key: string]: any;
}

export class ConfigManager {
  private configPath: string;
  private configData: JSHipsterConfig;

  constructor(configFileName = 'jshipster.config.json') {
    this.configPath = path.resolve(process.cwd(), configFileName);

    // Ensure configuration file exists, otherwise initialize it
    if (!fs.existsSync(this.configPath)) {
      this.configData = this.getDefaultConfig();
      this.writeConfig();
    } else {
      this.configData = this.loadConfig();
    }
  }

  /**
   * Load the configuration from the file.
   */
  private loadConfig(): JSHipsterConfig {
    try {
      const data = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(
        `Error reading configuration file at ${this.configPath}:`,
        error
      );
      return this.getDefaultConfig();
    }
  }

  /**
   * Get the default configuration.
   */
  private getDefaultConfig(): JSHipsterConfig {
    return {
      modules: {},
      directories: {
        controller: 'src/controllers',
        service: 'src/services',
        route: 'src/routes',
        model: 'src/models',
        repository: 'src/repositories',
        dto: 'src/dtos',
        tsconfig: './',
        module: 'src'
      },
    };
  }

  /**
   * Save the current configuration to the file.
   */
  private writeConfig(): void {
    try {
      fs.writeFileSync(
        this.configPath,
        JSON.stringify(this.configData, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error(
        `Error writing configuration file at ${this.configPath}:`,
        error
      );
    }
  }

  /**
   * Get the entire configuration object.
   */
  public getConfig(): JSHipsterConfig {
    return this.configData;
  }

  /**
   * Get a specific module's configuration.
   */
  public getModule(moduleName: string): any {
    return this.configData.modules[moduleName] || null;
  }

  /**
   * Add or update a module's configuration.
   */
  public setModule(moduleName: string, moduleData: object): void {
    if (!this.configData.modules) {
      this.configData.modules = {};
    }
    this.configData.modules[moduleName] = {
      ...(this.configData.modules[moduleName] || {}),
      ...moduleData,
    };
    this.writeConfig();
  }

  /**
   * Remove a module from the configuration.
   */
  public removeModule(moduleName: string): void {
    if (this.configData.modules && this.configData.modules[moduleName]) {
      delete this.configData.modules[moduleName];
      this.writeConfig();
    }
  }

  /**
   * Get or set the directory mappings.
   */
  public getDirectories(): Record<string, string> {
    return this.configData.directories || this.getDefaultConfig().directories!;
  }

  public setDirectory(key: string, value: string): void {
    if (!this.configData.directories) {
      this.configData.directories = {};
    }
    this.configData.directories = {
      ...this.configData.directories,
      [key]: value,
    };
    this.writeConfig();
  }
}
