import fs from 'fs';
import path from 'path';
export class ConfigManager {
    constructor(configFileName = 'jshipster.config.json') {
        this.configPath = path.resolve(process.cwd(), configFileName);
        // Ensure configuration file exists, otherwise initialize it
        if (!fs.existsSync(this.configPath)) {
            this.configData = this.getDefaultConfig();
            this.writeConfig();
        }
        else {
            this.configData = this.loadConfig();
        }
    }
    /**
     * Load the configuration from the file.
     */
    loadConfig() {
        try {
            const data = fs.readFileSync(this.configPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(`Error reading configuration file at ${this.configPath}:`, error);
            return this.getDefaultConfig();
        }
    }
    /**
     * Get the default configuration.
     */
    getDefaultConfig() {
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
    writeConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.configData, null, 2), 'utf-8');
        }
        catch (error) {
            console.error(`Error writing configuration file at ${this.configPath}:`, error);
        }
    }
    /**
     * Get the entire configuration object.
     */
    getConfig() {
        return this.configData;
    }
    /**
     * Get a specific module's configuration.
     */
    getModule(moduleName) {
        return this.configData.modules[moduleName] || null;
    }
    /**
     * Add or update a module's configuration.
     */
    setModule(moduleName, moduleData) {
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
    removeModule(moduleName) {
        if (this.configData.modules && this.configData.modules[moduleName]) {
            delete this.configData.modules[moduleName];
            this.writeConfig();
        }
    }
    /**
     * Get or set the directory mappings.
     */
    getDirectories() {
        return this.configData.directories || this.getDefaultConfig().directories;
    }
    setDirectory(key, value) {
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
