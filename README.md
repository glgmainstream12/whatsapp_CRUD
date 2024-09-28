# WhatsApp CRUD System with TypeScript and whatsapp-web.js

This project is a CRUD (Create, Read, Update, Delete) system built with **TypeScript** and **[whatsapp-web.js](https://wwebjs.dev/)** that allows you to interact with WhatsApp personal and group chats programmatically. You can send and receive messages, manage group chats, and store messages with automatic cleanup after one month. The application also includes an API that you can interact with using tools like Postman.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [1. Send Message to Personal Chat](#1-send-message-to-personal-chat)
  - [2. Get Messages from Personal Chat](#2-get-messages-from-personal-chat)
  - [3. Send Message to a Group](#3-send-message-to-a-group)
  - [4. Get Messages from Group Chat](#4-get-messages-from-group-chat)
  - [5. Get All Groups](#5-get-all-groups)
  - [6. Send Message to All Groups](#6-send-message-to-all-groups)
  - [7. Clear All Messages](#7-clear-all-messages)
- [Deployment](#deployment)
  - [Deploying to Google Cloud Platform](#deploying-to-google-cloud-platform)
    - [Step 1: Push Your Code to GitHub](#step-1-push-your-code-to-github)
    - [Step 2: Set Up a Google Cloud Platform Project](#step-2-set-up-a-google-cloud-platform-project)
    - [Step 3: Configure Your Application for Deployment](#step-3-configure-your-application-for-deployment)
    - [Step 4: Deploy to Google Cloud Run](#step-4-deploy-to-google-cloud-run)
    - [Step 5: Handle Puppeteer and WhatsApp Session Management](#step-5-handle-puppeteer-and-whatsapp-session-management)
    - [Step 6: Scanning the QR Code in a Cloud Environment](#step-6-scanning-the-qr-code-in-a-cloud-environment)
- [Important Notes](#important-notes)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Send Messages**: Send messages to personal chats and group chats.
- **Receive Messages**: Listen for incoming messages and store them.
- **Group Management**: Retrieve a list of groups you are part of.
- **Message Storage**: Save messages in a SQLite database with automatic deletion after one month.
- **API Endpoints**: Interact with the application via RESTful API endpoints.
- **Session Persistence**: Maintain WhatsApp sessions to avoid repeated QR code scans.
- **Deployment Ready**: Instructions to deploy the application to Google Cloud Platform using Cloud Run.

## Prerequisites

- **Node.js** (v14 or higher) and **npm** installed.
- **TypeScript** installed globally: `npm install -g typescript`.
- **Git** installed and a GitHub account.
- **Google Cloud Platform** account.
- **Docker** installed (for containerization during deployment).
- **ngrok** account (for local testing with external tools like Postman).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/glgmainstream12/whatsapp_CRUD
   cd your-repo
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Install Global Dependencies**

   Ensure you have TypeScript and ts-node installed globally:

   ```bash
   npm install -g typescript ts-node
   ```

4. **Configure Environment Variables**

   If you have any environment variables or secrets, configure them appropriately. For local development, you can use a `.env` file.

## Running the Application

1. **Compile TypeScript Code**

   ```bash
   npx tsc
   ```

2. **Start the Application**

   ```bash
   npm start
   ```

   The application will start, and a QR code will be displayed in the terminal.

3. **Scan the QR Code**

   - Open WhatsApp on your phone.
   - Navigate to **Menu** or **Settings** > **Linked Devices** > **Link a Device**.
   - Scan the QR code displayed in your terminal.

4. **Expose Your Local Server (Optional for Testing with Postman)**

   If you want to test the API endpoints using Postman or any external tool:

   - Start ngrok to expose your local server:

     ```bash
     ngrok http 3000
     ```

   - Note the HTTPS URL provided by ngrok (e.g., `https://abcd1234.ngrok.io`).

## API Documentation

### **Base URL**

- **Local Testing:** `http://localhost:3000`
- **Using ngrok:** `https://<your-ngrok-id>.ngrok.io`
- **After Deployment:** `https://<your-cloud-run-service-url>`

### **1. Send Message to Personal Chat**

- **Endpoint:** `/send-message`
- **Method:** `POST`
- **Description:** Sends a WhatsApp message to a specified personal chat.

**Request Body:**

```json
{
  "phoneNumber": "string",
  "message": "string"
}
```

- **phoneNumber:** Recipient's phone number with country code (e.g., "1234567890").
- **message:** The message content to be sent.

**Example:**

```json
{
  "phoneNumber": "1234567890",
  "message": "Hello, this is a test message!"
}
```

**Response:**

- **Success:** `200 OK`

  ```json
  {
    "status": "Message sent successfully!"
  }
  ```

- **Error:** `500 Internal Server Error`

  ```json
  {
    "status": "Failed to send message",
    "error": "Error details here"
  }
  ```

### **2. Get Messages from Personal Chat**

- **Endpoint:** `/get-messages`
- **Method:** `GET`
- **Description:** Retrieves messages from a specific personal chat.

**Query Parameters:**

- **phoneNumber:** The phone number of the chat to retrieve messages from, with country code.

**Example:**

```
GET /get-messages?phoneNumber=1234567890
```

**Response:**

- **Success:** `200 OK`

  ```json
  [
    {
      "id": 1,
      "from": "1234567890@c.us",
      "body": "Hello!",
      "timestamp": "2023-10-01T12:34:56.000Z",
      "createdAt": "2023-10-01T12:34:56.000Z",
      "updatedAt": "2023-10-01T12:34:56.000Z"
    },
    {
      "id": 2,
      "from": "1234567890@c.us",
      "body": "How are you?",
      "timestamp": "2023-10-01T12:35:00.000Z",
      "createdAt": "2023-10-01T12:35:00.000Z",
      "updatedAt": "2023-10-01T12:35:00.000Z"
    }
  ]
  ```

### **3. Send Message to a Group**

- **Endpoint:** `/send-group-message`
- **Method:** `POST`
- **Description:** Sends a WhatsApp message to a specified group chat.

**Request Body:**

```json
{
  "groupId": "string",
  "message": "string"
}
```

- **groupId:** The ID of the group (e.g., "1234567890-1234567890@g.us").
- **message:** The message content to be sent.

**Example:**

```json
{
  "groupId": "1234567890-1234567890@g.us",
  "message": "Hello group, this is a test message!"
}
```

**Response:**

- **Success:** `200 OK`

  ```json
  {
    "status": "Group message sent successfully!"
  }
  ```

- **Error:** `500 Internal Server Error`

  ```json
  {
    "status": "Failed to send group message",
    "error": "Error details here"
  }
  ```

### **4. Get Messages from Group Chat**

- **Endpoint:** `/get-group-messages`
- **Method:** `GET`
- **Description:** Retrieves messages from a specific group chat.

**Query Parameters:**

- **groupId:** The ID of the group to retrieve messages from.

**Example:**

```
GET /get-group-messages?groupId=1234567890-1234567890@g.us
```

**Response:**

- **Success:** `200 OK`

  ```json
  [
    {
      "id": 3,
      "from": "1234567890-1234567890@g.us",
      "body": "Welcome to the group!",
      "timestamp": "2023-10-01T13:00:00.000Z",
      "createdAt": "2023-10-01T13:00:00.000Z",
      "updatedAt": "2023-10-01T13:00:00.000Z"
    }
  ]
  ```

### **5. Get All Groups**

- **Endpoint:** `/get-groups`
- **Method:** `GET`
- **Description:** Retrieves all group IDs and names you are a part of.

**Response:**

- **Success:** `200 OK`

  ```json
  [
    {
      "groupId": "1234567890-1234567890@g.us",
      "groupName": "My Friends Group"
    },
    {
      "groupId": "0987654321-0987654321@g.us",
      "groupName": "Work Team"
    }
  ]
  ```

### **6. Send Message to All Groups**

- **Endpoint:** `/send-message-to-all-groups`
- **Method:** `POST`
- **Description:** Sends a message to all group chats you are part of.

**Request Body:**

```json
{
  "message": "string"
}
```

- **message:** The message content to be sent to all groups.

**Example:**

```json
{
  "message": "Hello everyone, this is a broadcast message!"
}
```

**Response:**

- **Success:** `200 OK`

  ```json
  {
    "status": "Messages sent to all groups successfully!"
  }
  ```

- **Error:** `500 Internal Server Error`

  ```json
  {
    "status": "Failed to send messages to all groups",
    "error": "Error details here"
  }
  ```

### **7. Clear All Messages**

- **Endpoint:** `/clear-messages`
- **Method:** `DELETE`
- **Description:** Clears all stored messages from the database.

**Response:**

- **Success:** `200 OK`

  ```json
  {
    "status": "Messages cleared successfully!"
  }
  ```

- **Error:** `500 Internal Server Error`

  ```json
  {
    "status": "Failed to clear messages",
    "error": "Error details here"
  }
  ```

## Deployment

### Deploying to Google Cloud Platform

#### **Step 1: Push Your Code to GitHub**

1. **Initialize Git and Commit Your Code**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a Repository on GitHub**

   - Go to GitHub and create a new repository.

3. **Add the Remote Origin and Push**

   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin master
   ```

#### **Step 2: Set Up a Google Cloud Platform Project**

1. **Create a New Project**

   - Go to the [GCP Console](https://console.cloud.google.com/).
   - Create a new project and note the **Project ID**.

2. **Enable Billing**

   - Ensure that billing is enabled for your project.

3. **Enable Required APIs**

   - **Cloud Build API**
   - **Cloud Run API**
   - **Secret Manager API** (if you plan to store secrets)

#### **Step 3: Configure Your Application for Deployment**

1. **Modify Puppeteer Configuration**

   Update your `index.ts` to include the necessary Puppeteer options for a cloud environment:

   ```typescript
   const client = new Client({
     authStrategy: new LocalAuth(),
     puppeteer: {
       args: [
         '--no-sandbox',
         '--disable-setuid-sandbox',
         '--disable-dev-shm-usage',
         '--disable-accelerated-2d-canvas',
         '--no-first-run',
         '--no-zygote',
         '--single-process',
         '--disable-gpu',
       ],
     },
   });
   ```

2. **Adjust Package.json Scripts**

   ```json
   "scripts": {
     "start": "node dist/index.js",
     "build": "tsc"
   },
   ```

3. **Add a Dockerfile**

   Create a `Dockerfile` in your project root:

   ```dockerfile
   FROM node:16-alpine

   WORKDIR /app

   COPY package*.json ./

   RUN npm install

   COPY . .

   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

4. **Add .dockerignore**

   Create a `.dockerignore` file:

   ```
   node_modules
   npm-debug.log
   Dockerfile
   .git
   .gitignore
   README.md
   src/
   ```

#### **Step 4: Deploy to Google Cloud Run**

1. **Install Google Cloud SDK**

   [Install the Google Cloud SDK](https://cloud.google.com/sdk/docs/install) if you haven't already.

2. **Authenticate with GCP**

   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Build and Deploy the Container**

   ```bash
   gcloud run deploy whatsapp-crud-app \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --timeout 300
   ```

4. **Note the Service URL**

   After deployment, note the **Service URL** to access your application.

#### **Step 5: Handle Puppeteer and WhatsApp Session Management**

1. **Session Persistence**

   Cloud Run instances are stateless; use a persistent storage solution for session data (e.g., Google Cloud Storage, Cloud SQL, or Firestore).

2. **Modify `LocalAuth` for Cloud Storage**

   Implement a custom `AuthStrategy` or modify `LocalAuth` to store session data in a persistent storage service.

#### **Step 6: Scanning the QR Code in a Cloud Environment**

1. **Expose the QR Code via an Endpoint**

   Modify your `index.ts`:

   ```typescript
   import QRCode from 'qrcode';

   let qrCodeImage: string | null = null;

   client.on('qr', (qr) => {
     QRCode.toDataURL(qr, (err, url) => {
       qrCodeImage = url;
     });
   });

   app.get('/qr', (req, res) => {
     if (qrCodeImage) {
       const html = `<img src="${qrCodeImage}" alt="WhatsApp QR Code"/>`;
       res.send(html);
     } else {
       res.send('QR Code not available. Please try again.');
     }
   });
   ```

2. **Access the QR Code**

   Visit `https://your-service-url/qr` to scan the QR code with your WhatsApp app.

## Important Notes

- **WhatsApp Terms of Service:** Ensure you comply with WhatsApp's [terms of service](https://www.whatsapp.com/legal/terms-of-service/) and [developer policies](https://www.whatsapp.com/legal/business-policy/).

- **Data Persistence:** Messages are stored in a SQLite database. For production, consider using a more robust database solution.

- **Security:** Implement authentication and authorization for your API endpoints, especially when deployed publicly.

- **Session Management:** Use persistent storage for WhatsApp sessions to avoid re-scanning the QR code.

- **Error Handling:** Ensure all possible errors are caught and handled gracefully.

- **Rate Limiting:** Implement rate limiting to prevent abuse of your API.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **[whatsapp-web.js](https://wwebjs.dev/):** A WhatsApp client library for Node.js that connects through the WhatsApp Web browser app.
- **[Express.js](https://expressjs.com/):** Fast, unopinionated, minimalist web framework for Node.js.
- **[Sequelize](https://sequelize.org/):** A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **[TypeScript](https://www.typescriptlang.org/):** A typed superset of JavaScript that compiles to plain JavaScript.
- **[Google Cloud Platform](https://cloud.google.com/):** For providing a scalable and reliable platform to deploy applications.

---

If you have any questions or need further assistance, feel free to contact me at [your-email@example.com](mailto:your-email@example.com).
