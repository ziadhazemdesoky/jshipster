export const template = `
export interface {{resourceName}}DTO {
  id: string;
  name: string;
  description?: string;
}

export interface Create{{resourceName}}DTO {
  name: string;
  description?: string;
}

export interface Update{{resourceName}}DTO {
  name?: string;
  description?: string;
}
`;
