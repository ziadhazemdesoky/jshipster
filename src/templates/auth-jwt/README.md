# **Auth Module**

The `auth-jwt` module provides basic authentication functionality using JSON Web Tokens (JWTs). It enables secure login and token verification, making it an essential building block for any backend application requiring authentication.

---

## **Features**
- **Login Endpoint**: Authenticate users and generate a JWT.
- **Token Verification**: Verify the validity of JWTs for secure API access.
- **Modular Design**: Easily integrate into any JSHipster project.

---

## **Endpoints**

### **2. GET `/auth/verify`**
Verifies the validity of a JSON Web Token (JWT).

#### **Headers**
```http
Authorization: Bearer <your-jwt-token>
```

#### **Response**
- **200 OK**: If the token is valid, returns the payload.
  ```json
  {
    "valid": true,
    "payload": {
      "username": "string",
      "iat": 1692903302,
      "exp": 1692906902
    }
  }
  ```
- **400 Bad Request**: If no token is provided.
  ```json
  {
    "message": "Token is required."
  }
  ```
- **401 Unauthorized**: If the token is invalid or expired.
  ```json
  {
    "valid": false,
    "message": "Invalid token."
  }
  ```

---

## **How to Use**

1. **Add the Module to Your Project**  
   Add the `auth-jwt` module to your JSHipster project using the CLI.

2. **Integrate the Module**  
   Import and initialize the module in your Express application:
   ```typescript
   import { init as initAuthModule } from './modules/auth-jwt';
   initAuthModule(app);
   ```

3. **Customize Authentication Logic**  
   The authentication logic (e.g., verifying user credentials) is implemented in the `AuthService`. You can customize it to integrate with your user database or other authentication mechanisms.

---

## **Environment Variables**

To configure the module, set the following environment variables in your `.env` file:

- `JWT_SECRET`: The secret key used to sign JWTs (default: `defaultSecret`).
- `TOKEN_EXPIRATION`: The token expiration time (default: `1h`).

Example `.env` file:
```
JWT_SECRET=my-super-secret-key
TOKEN_EXPIRATION=2h
```

---

## **Customization**

This module is designed to be modular and extendable. You can:
- Customize the `AuthService` to integrate with your user database.
- Add additional authentication-related endpoints (e.g., password reset, user registration).
- Extend the middleware to enforce role-based access control (RBAC).

---

## **License**

This module is open-source and licensed under the MIT License. Feel free to use and modify it as needed.