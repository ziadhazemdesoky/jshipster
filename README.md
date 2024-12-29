# **JSHipster**

JSHipster is a modular Node.js CLI designed to simplify and accelerate backend development. With its intuitive interface and flexible architecture, JSHipster enables you to quickly bootstrap backend projects, integrate reusable modules, and create npm-ready services. **No login required**, and it works seamlessly both online and offline.

---

## **Features**

- **Project Initialization**: Scaffold a new backend project with a clean, modular structure.
- **Add Modules**: Add reusable modules, either locally or from npm, to enhance your project.
- **List Modules**: View available modules from local templates or user-made modules (starting with `jshipster-`).
- **Generate Resources**: Dynamically generate resources like services and controllers in TypeScript.
- **Create Modules**: Create a new reusable module with a professional structure, ready for npm publishing.
- **Customizable Configuration**: Tailor your project’s structure using `jshipster.config.json` for directory mappings and module settings.

---

## **Installation**

To install JSHipster globally, run:
```bash
npm install -g jshipster
```

---

## **Usage**

Here’s how you can use JSHipster to streamline your backend development:

1. **Initialize a New Project**  
   Scaffold a new backend project with:
   ```bash
   jshipster init
   ```

2. **List Available Modules**  
   View available modules from local templates and npm:
   ```bash
   jshipster list
   ```

3. **Add a Module**  
   Add a pre-built module (e.g., `auth-jwt`) to your project:
   ```bash
   jshipster add auth-jwt
   ```

4. **Generate a Resource**  
   Dynamically generate a service or controller:
   ```bash
   jshipster generate
   ```

5. **Create a New Module**  
   Create a professional, npm-ready module with a clean structure:
   ```bash
   jshipster create
   ```

6. **Customize Your Project with `jshipster.config.json`**  
   Tailor the project’s directory structure and module settings by editing `jshipster.config.json`. For example:
   ```json
   {
     "directories": {
       "controllers": "src/custom-controllers",
       "services": "src/custom-services",
       "routes": "src/custom-routes"
     },
     "modules": {
       "auth-jwt": {
         "installedAt": "2024-12-27T12:00:00Z"
       }
     }
   }
   ```

   This flexibility ensures that JSHipster adapts to your unique project needs.

---

## **How to Contribute**

JSHipster is open source and thrives on community contributions. Here’s how you can get involved:

1. **Fork the Repository**  
   Start by forking the GitHub repository to your account.

2. **Enhance or Add Templates**  
   Add or improve modules by working in the `src/templates/` directory.

3. **Submit a Pull Request**  
   Once your changes are ready, submit a pull request to the main repository for review.

4. **Create and Share Modules**  
   Publish your own JSHipster-compatible modules to npm so others can use them in their projects. Modules should follow the blueprint structure provided by JSHipster.

---

## **Why Choose JSHipster?**

- **Time-Saving**: Eliminate repetitive boilerplate tasks.
- **Modular Design**: Easily add or remove features as your project grows.
- **Reusable Ecosystem**: Leverage and contribute to a growing library of reusable modules.
- **TypeScript First**: All scaffolding and modules are built with TypeScript, ensuring strong typing and modern development practices.
- **Customizable**: Use `jshipster.config.json` to adapt the tool to your project’s specific requirements.
- **Open Source**: Join a community of developers shaping the future of backend development.

---

## **Get Started Today!**

Ready to try JSHipster? Install it globally and start building better backends, faster. For more information, check out the [GitHub repository](https://github.com/ziadhazemdesoky/jshipster).

---

## **License**

This project is licensed under the MIT License.

