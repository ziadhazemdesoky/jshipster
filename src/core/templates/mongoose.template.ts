export const template = `import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of the {{resourceName}} document
 */
export interface I{{resourceName}} extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for {{resourceName}}
const {{resourceName}}Schema: Schema<I{{resourceName}}> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Export the model with the extended interface
export const {{resourceName}} = mongoose.model<I{{resourceName}}>(
  '{{resourceName}}',
  {{resourceName}}Schema
);
`;