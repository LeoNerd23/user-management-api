# User Management API

[![1.0.0](https://img.shields.io/badge/version-1.0.0-blue)](#)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

This is a backend service for user management, providing functionalities such as user registration, verification, updating, and deletion. It uses MongoDB for storing user data and Express.js for handling HTTP requests.

## Installation
1. Clone the repository:
```
git clone https://github.com/yourusername/user-management-api.git

cd user-management-api
````
2. Install dependencies:
```
npm install
```

3. Create a .env file at the root of the project and set the required environment variables as mentioned above.

4. Start the server:
```
npm run dev
```
The server will run on http://localhost:3000 by default.

## Features

- **User Registration**: Allows users to sign up by providing necessary details (email, password, first name, last name).
- **Email Verification**: Sends a verification code to the user's email upon registration, which must be validated to activate the account.
- **User Management**: Supports updating user information and deleting users.
- **Data Validation**: Ensures that user inputs follow the correct format using regular expressions (regex).

## API Endpoints

### 1. **POST /user**
   **Description**: Registers a new user.
   
   **Request Body**:
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "johndoe@example.com",
     "password": "Password123!"
   }
   ```
   Response:

- 201: User created successfully.
- 400: Validation errors (e.g., invalid email, password format, or name format).
- 500: Internal server error.

### 2. **POST /verify**
Description: Verifies a user's email using the verification code sent to their email during registration.

Request Body:
   **Request Body**:
   ```json
      {
        "userId": "user_id_here",
        "verificationCode": "123456"
      }
   ```

Response:

- 200: User verified successfully.
- 400: Invalid verification code.
- 404: User not found.
- 500: Internal server error.

### 3. **GET /user/:id**
Description: Retrieves a user by their ID.

Response:

- 200: Returns the user data.
- 404: User not found.
- 400: Invalid user ID format.
- 500: Internal server error.

### 4. **DELETE /user/:id**
Description: Deletes a user by their ID.

Response:

- 200: User deleted successfully.
- 404: User not found.
- 400: Invalid user ID format.
- 500: Internal server error.

### 5. **PUT /user/:id**
Description: Updates a user's firstName and lastName.

   **Request Body**:
   ```json
      {
        "firstName": "Jane",
        "lastName": "Doe"
      }
   ```

Response:

- 200: User updated successfully.
- 400: Invalid name format.
- 404: User not found.
- 500: Internal server error.

## Environment Variables
You need to set the following environment variables in your .env file:

- MONGO_URI: MongoDB connection string.
- JWT_SECRET: Secret key for JWT generation (for user authentication, if implemented).
- EMAIL_SERVICE: Email service provider (e.g., SendGrid, SES).
- EMAIL_USERNAME: Your email service username.
- EMAIL_PASSWORD: Your email service password.