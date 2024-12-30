import * as ts from 'typescript'
import yaml from "js-yaml";
import path from 'path';
import fs from 'fs'

export async function generateSwaggerFromControllers(controllersDir: string, outputFile: string) {
    const paths: Record<string, any> = {};
  
    // Read all controller files
    const controllerFiles = fs
      .readdirSync(controllersDir)
      .filter((file) => file.endsWith(".ts"));
  
    for (const file of controllerFiles) {
      const filePath = path.join(controllersDir, file);
      console.log("Processing file:", filePath);
  
      // Parse controller file
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const sourceFile = ts.createSourceFile(file, fileContent, ts.ScriptTarget.ESNext);
  
      ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name?.text.endsWith("Controller")) {
          node.members.forEach((member) => {
            if (ts.isMethodDeclaration(member)) {
              const methodName = member.name.getText(sourceFile);
              const jsDocText = extractJsDocFromNode(member, fileContent);
              const metadata = parseJsDoc(jsDocText);
  
              if (metadata.path && metadata.method) {
                paths[metadata.path] = paths[metadata.path] || {};
                paths[metadata.path][metadata.method] = {
                  summary: metadata.summary || `Handler for ${methodName}`,
                  parameters: metadata.parameters || [],
                  responses: {
                    200: { description: "Success" },
                    400: { description: "Bad Request" },
                    404: { description: "Not Found" },
                    500: { description: "Internal Server Error" },
                  },
                };
              }
            }
          });
        }
      });
    }
  
    // Construct OpenAPI Specification
    const openApiSpec = {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
      },
      paths,
    };
    // Write swagger.yaml
    fs.writeFileSync(outputFile, yaml.dump(openApiSpec), "utf8");
    console.log(`Swagger documentation generated at ${outputFile}`);
  }
  
  // Extract JSDoc comments from a node
  function extractJsDocFromNode(node: ts.Node, fileContent: string): string {
    const commentRanges = ts.getLeadingCommentRanges(fileContent, node.getFullStart());
    if (!commentRanges || commentRanges.length === 0) {
      return "";
    }
  
    // Extract the comment text
    const commentText = commentRanges
      .map((range) => fileContent.slice(range.pos, range.end))
      .join("\n")
      .trim();
  
    return commentText.startsWith("/**") ? commentText : "";
  }
  
  // Parse JSDoc text to extract metadata
  function parseJsDoc(jsDocText: string): Record<string, any> {
    const metadata: Record<string, any> = {};
  
    if (!jsDocText) return metadata;
  
    const lines = jsDocText
      .split("\n")
      .map((line) => line.trim().replace(/^\*\s?/, ""));
  
    lines.forEach((line) => {
      if (line.startsWith("@route")) {
        const [_, method, path] = line.split(" ");
        metadata.method = method?.toLowerCase();
        metadata.path = path;
      } else if (line.startsWith("@param")) {
        const [_, name, location, ...rest] = line.split(" ");
        metadata.parameters = metadata.parameters || [];
        metadata.parameters.push({
          name,
          in: location?.replace(/[\[\]]/g, "") || "body",
          description: rest.join(" "),
          required: !line.includes("[optional]"),
        });
      } else if (line.startsWith("@summary")) {
        metadata.summary = line.replace("@summary", "").trim();
      }
    });
  
    return metadata;
  }