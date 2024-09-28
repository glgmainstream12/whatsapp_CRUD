import express from 'express';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
var qrcode = require('qrcode-terminal');

const app = express();
const PORT = 3000;

app.use(express.json());


// Initialize WhatsApp Client with session persistence
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'], // Add any additional Puppeteer args if needed
  },
});

// Display QR code in terminal
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('QR code received, please scan it with your WhatsApp app.');
});

// Log when the client is ready
client.on('ready', () => {
  console.log('WhatsApp client is ready!');
});

interface ReceivedMessage {
    from: string;
    body: string;
    timestamp: number;
  }
  
  const receivedMessages: ReceivedMessage[] = [];
  
  client.on('message', (msg) => {
    receivedMessages.push({
      from: msg.from,
      body: msg.body,
      timestamp: msg.timestamp,
    });
  
    console.log(`Message from ${msg.from}: ${msg.body}`);
  });

// Initialize the client
client.initialize();

// In-memory message store
interface StoredMessage {
  from: string;
  body: string;
}

const messages: StoredMessage[] = [];

// Listen for incoming messages
client.on('message', (msg: Message) => {
  messages.push({ from: msg.from, body: msg.body });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Endpoint: POST /send-message
 * Description: Send a message to a personal chat
 * Body Parameters:
 * - phoneNumber: string (recipient's phone number with country code)
 * - message: string (message to send)
 */
app.post('/send-message', async (req, res) => {
  const { phoneNumber, message } = req.body;

  // Ensure the phone number is in the correct format
  const number = phoneNumber.includes('@c.us')
    ? phoneNumber
    : `${phoneNumber}@c.us`;

  try {
    await client.sendMessage(number, message);
    res.status(200).send({ status: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ status: 'Failed to send message', error });
  }
});

/**
 * Endpoint: GET /get-messages
 * Description: Retrieve messages from a personal chat
 * Query Parameters:
 * - phoneNumber: string (phone number of the chat to retrieve messages from)
 */

app.get('/get-messages', (req: any, res: any) => {
    const { phoneNumber } = req.query;
  
    if (!phoneNumber) {
      return res.status(400).send({ status: 'Phone number is required' });
    }
  
    const number = phoneNumber.toString().includes('@c.us')
      ? phoneNumber.toString()
      : `${phoneNumber}@c.us`;
  
    const chatMessages = messages.filter((msg) => msg.from === number);
    return res.status(200).send(chatMessages);
  });

/**
 * Endpoint: POST /send-group-message
 * Description: Send a message to a group chat
 * Body Parameters:
 * - groupId: string (ID of the group chat)
 * - message: string (message to send)
 */
app.post('/send-group-message', async (req, res) => {
  const { groupId, message } = req.body;

  try {
    const chat = await client.getChatById(groupId);
    await chat.sendMessage(message);
    res.status(200).send({ status: 'Group message sent successfully!' });
  } catch (error) {
    console.error('Error sending group message:', error);
    res.status(500).send({ status: 'Failed to send group message', error });
  }
});

/**
 * Endpoint: GET /get-group-messages
 * Description: Retrieve messages from a group chat
 * Query Parameters:
 * - groupId: string (ID of the group chat)
 */
app.get('/get-group-messages', (req: any, res: any) => {
  const { groupId } = req.query;

  if (!groupId) {
    return res.status(400).send({ status: 'Group ID is required' });
  }

  const groupMessages = messages.filter((msg) => msg.from === groupId);
  res.status(200).send(groupMessages);
});

/**
 * Endpoint: GET /get-groups
 * Description: Retrieve all group IDs with a default message
 * Response Format:
 * [
 *   {
 *     "groupId": "1234567890-1234567890@g.us",
 *     "message": "Hello group, this is a test message!"
 *   },
 *   // ... more groups
 * ]
 */
app.get('/get-groups', async (req, res) => {
    try {
      const chats = await client.getChats();
      const groups = chats.filter((chat) => chat.isGroup);
  
      const groupList = groups.map((group) => ({
        groupId: group.id._serialized,
        groupName: group.name,
      }));
  
      res.status(200).json(groupList);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).send({ status: 'Failed to fetch groups', error });
    }
  });

/**
 * Optional Endpoint: POST /send-message-to-all-groups
 * Description: Send a message to all group chats
 * Body Parameters:
 * - message: string (message to send)
 */
app.post('/send-message-to-all-groups', async (req, res) => {
  const { message } = req.body;

  try {
    const chats = await client.getChats();
    const groups = chats.filter((chat) => chat.isGroup);

    for (const group of groups) {
      await group.sendMessage(message);
    }

    res.status(200).send({ status: 'Messages sent to all groups successfully!' });
  } catch (error) {
    console.error('Error sending messages to all groups:', error);
    res.status(500).send({ status: 'Failed to send messages to all groups', error });
  }
});

/**
 * Optional Endpoint: DELETE /clear-messages
 * Description: Clear all stored messages
 */
app.delete('/clear-messages', (req, res) => {
  messages.length = 0;
  res.status(200).send({ status: 'Messages cleared successfully!' });
});


app.get('/get-received-messages', (req, res) => {
    res.status(200).json(receivedMessages);
  });