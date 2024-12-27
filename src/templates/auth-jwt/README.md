# Auth Module

The `auth-jwt` module provides basic authentication using JSON Web Tokens (JWTs). 

## Endpoints

### POST `/auth/login`
Authenticate a user and return a JWT.

#### Request Body
```json
{
  "username": "string",
  "password": "string"
}
