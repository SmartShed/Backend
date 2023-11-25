# SmartShed Backend

### Folder Structure

```
backend/
|
|-- config/
|   |-- index.js
|   |-- database.js
|
|-- controllers/
|   |-- index.js
|   |-- userController.js
|   |-- formController.js
|   |-- sectionController.js
|
|-- helpers/
|   |-- index.js
|
|-- middlewares/
|   |-- index.js
|   |-- authentication.js
|   |-- errorHandling.js
|
|-- models/
|   |-- AuthToken.js
|   |-- Form.js
|   |-- FormData.js
|   |-- Question.js
|   |-- QuestionData.js
|   |-- SectionData.js
|   |-- User.js
|
|-- routes/
|   |-- index.js
|   |-- userRoutes.js
|   |-- formRoutes.js
|   |-- sectionRoutes.js
|
|-- utils/
|   |-- index.js
|   |-- customErrorHandler.js
|
|-- .env.example
|-- .gitignore
|-- index.js
|-- package.json
|-- package-lock.json
|-- README.md
```

# API's

## 1. Authentication APIs

### 1.1. Login

For Worker, Supervisor and Authority login

#### 1.1.1. Request

```http
POST /api/auth/login
```

#### 1.1.2. Request Body

| Field    | Type   | Description                              |
| -------- | ------ | ---------------------------------------- |
| email    | string | Email of Worker, Supervisor or Authority |
| password | string | Password                                 |

#### 1.1.3. Response

```json
{
  "status": "200 | 400",
  "message": "Login successful | Login failed",
  "auth_token": "token"
}
```

### 1.2. Register

For Worker, Supervisor and Authority registration

#### 1.2.1. Request

```http
POST /api/auth/register
```

#### 1.2.2. Request Body

| Field    | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| email    | string | Email of Worker, Supervisor or Authority   |
| password | string | Password                                   |
| name     | string | Name of employee                           |
| position | string | Position (Worker, Supervisor or Authority) |

#### 1.2.3. Response

```json
{
  "status": "200 | 400",
  "message": "Registration successful | Registration failed",
  "auth_token": "token"
}
```

### 1.3. Logout

For Worker, Supervisor and Authority registration

#### 1.3.1. Request

```http
POST /api/auth/logout
```

#### 1.3.2. Request Headers

| Field      | Type   | Description  |
| ---------- | ------ | ------------ |
| auth_token | string | Worker token |

#### 1.2.3. Response

```json
{
  "status": "200 | 400",
  "message": "Logout successful | Logout failed"
}
```

### 1.4. Google Login

For Worker, Supervisor and Authority registration

#### 1.4.1. Request

```http
POST /api/auth/login/google
```

#### 1.4.2. Request Headers

| Field | Type   | Description                              |
| ----- | ------ | ---------------------------------------- |
| email | string | Email of Worker, Supervisor or Authority |

#### 1.4.3. Response

```json
{
  "status": "200 | 400",
  "message": "Login successful | Login failed",
  "auth_token": "token"
}
```

### 1.5. Google Register

For Worker, Supervisor and Authority registration

#### 1.5.1. Request

```http
POST /api/auth/register/google
```

#### 1.5.2. Request Body

| Field    | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| email    | string | Email of Worker, Supervisor or Authority   |
| name     | string | Name of employee                           |
| position | string | Position (Worker, Supervisor or Authority) |

#### 1.5.3. Response

```json
{
  "status": "200 | 400",
  "message": "Registration successful | Registration failed",
  "auth_token": "token"
}
```

### 1.6. Add Employee

For Worker, Supervisor and Authority registration

#### 1.6.1. Request

```http
POST /api/auth/addemployee
```

#### 1.6.2. Request Body

| Field      | Type             | Description          |
| ---------- | ---------------- | -------------------- |
| worker     | array of strings | Emails of Workers    |
| supervisor | array of strings | Emails of Supervisor |
| authority  | array of strings | Emails of Authoritys |

```json
{
  "worker": ["worker01@gmail.com", "worker02@gmail.com", "worker03@gmail.com"],
  "supervisor": ["supervisor01@gmail.com", "supervisor02@gmail.com"],
  "authority": ["authority01@gmail.com"]
}
```

#### 1.6.3. Response

```json
{
  "status": "200 | 500",
  "message": "Employee emails added successfully! | Error"
}
```
