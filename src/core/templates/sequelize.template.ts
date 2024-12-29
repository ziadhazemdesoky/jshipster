export const template = `
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../core/database'; // Adjust the path to your database instance

// Define the attributes for the {{resourceName}} model
export interface {{resourceName}}Attributes {
  id: number;
  name: string;
  email?: string; // Optional field
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (fields allowed during creation)
export interface {{resourceName}}CreationAttributes
  extends Optional<{{resourceName}}Attributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the model class
export class {{resourceName}}
  extends Model<{{resourceName}}Attributes, {{resourceName}}CreationAttributes>
  implements {{resourceName}}Attributes
{
  public id!: number;
  public name!: string;
  public email?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Example instance method
  public isEmailVerified(): boolean {
    return !!this.email && this.email.endsWith('@example.com');
  }
}

// Initialize the {{resourceName}} model
{{resourceName}}.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100], // Minimum and maximum length
        notEmpty: true, // Name must not be empty
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true, // Ensure a valid email format
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    tableName: '{{resourceName.toLowerCase()}}s', // Pluralize table name
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Export the model
export default {{resourceName}};
`;