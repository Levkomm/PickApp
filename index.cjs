
//copy of no zapier code


const { Client, LocalAuth } = require('whatsapp-web.js');

const axios = require('axios');

const express = require('express');
const qrcode = require('qrcode');
let qrSvg = '';

const app = express();
const port = process.env.PORT || 3000;


// Initialize WhatsApp client with session persistence
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});


// Display QR code in web
app.get('/', (req, res) => {
  res.send('<h1>WhatsApp Bot is running</h1><p><img src="/qr" /></p>');
});

app.get('/qr', (req, res) => {
  if (!qrSvg) return res.send('QR not ready');
  res.type('svg');
  res.send(qrSvg);
});

client.on('qr', async qr => {
  qrSvg = await qrcode.toString(qr, { type: 'svg' });
  console.log('🔐 QR code updated and available at /qr');
});

app.listen(port, () => {
  console.log(`🌐 Server is running at http://localhost:${port}`);
});



// Ready event
client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

// Message received
client.on('message', async message => {
    console.log(`📥 Message from ${message.from}: ${message.body}`);

    // Handle ping test
    if (message.body.toLowerCase() === '!ping') {
        await message.reply('pong!');
        return;
    }

    // Handle stop command
    if (message.body.toLowerCase() === '!stop') {
        await message.reply('👋 Stopping the bot...');
        client.destroy();
        return;
    }

    // Print object helper (for debugging)
    const printObject = function (object) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
                    console.log(`Key: ${key} is an object, printing it`);
                    printObject(object[key]);
                    console.log(`finished printing key ${key}`);
                } else {
                    console.log(`Key: ${key}, Value:${object[key]}`);
                }
            }
        }
    };
const processMessages = async function () {
  const appId = '685abd54d007c43f6f6e0107';
  const apiKey = '25fb47e1037048e5a3b84739b433b79c';

  console.log("Calling the 'processMessages' function for app: 680e678ffae7fe33fb4ad6c7...");

  try {
    const functionUrl = `https://base44.app/api/apps/${appId}/functions/processMessages`;

    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    };

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ HTTP Error ${response.status}:`);
      console.error(errorText);
      return;
    }

    const result = await response.json();

    if (result.success) {
      console.log("\n✅ Success! Messages processed successfully.");
      console.log("--- Processing Summary ---");
      console.log(`Messages processed: ${result.summary.messagesProcessed}`);
      console.log(`Successful: ${result.summary.successful}`);
      console.log(`Failed: ${result.summary.failed}`);
      console.log(`Items created: ${result.summary.totalItemsCreated}`);
      console.log(`Objects identified: ${result.summary.totalObjectsIdentified}`);
    } else {
      console.error("\n❌ Failure. The function executed but returned an error:");
      console.error(result.error || "Unknown error from function.");
    }

  } catch (e) {
    console.error("\n💥 An unexpected error occurred during the API call:");
    console.error(e.message);
  }
};

const createMessage = async function (messageData) {
const base44 = await import('@base44/sdk');
            // --- 2. Request Processing ---
            try {
                
                const base44SDK = base44.createClient({
                appId: '685abd54d007c43f6f6e0107',
		apiKey: '25fb47e1037048e5a3b84739b433b79c',
		token: '25fb47e1037048e5a3b84739b433b79c',
                });
                // --- 3. Validation ---
                // Ensure the required fields are present in the incoming data
                if (!messageData.messageText || !messageData.imageUrl) {
                    return new Response(JSON.stringify({
                        error: 'Bad Request: messageText and imageUrl are required fields.'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                // --- 4. Data Preparation & Creation ---
                // Prepare the final object to be saved to the database
                const finalMessageData = {
                    messageText: messageData.messageText,
                    imageUrl: messageData.imageUrl,
                    whatsapp_group: messageData.whatsapp_group || null, // Optional field
                    creation_time: new Date().toISOString(), // Set creation time to now
                    status: 'unprocessed', // New messages always start as unprocessed
                    created_by: messageData.created_by || 'api-service' // Default creator if not specified
                };
                // Use the Base44 SDK to create the new Message entity
                const createdMessage = await base44SDK.entities.Message.create(finalMessageData);
                // --- 5. Success Response ---
                // Return a success response with the newly created message object
                return new Response(JSON.stringify({
                    success: true,
                    message: createdMessage
                }), {
                    status: 201, // 201 Created
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            catch (error) {
                // --- 6. Error Handling ---
                console.error("Error in createMessage function:", error);
                const errorMessage = error instanceof SyntaxError ? "Invalid JSON in request body." : "An internal server error occurred.";
                return new Response(JSON.stringify({ error: errorMessage }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        };

    // Get group name if in group
    let groupName = null;
    if (message.from.endsWith('@g.us')) {
        try {
            const chat = await message.getChat();
            if (chat.isGroup) {
                groupName = chat.name;
                console.log(`📛 Group Name: ${groupName}`);
            }
        } catch (err) {
            console.error('❌ Error fetching group name:', err.message);
        }
    }

    // Handle media
    let media = {};
    if (message.hasMedia) {
        media = await message.downloadMedia();
    }

    // Upload image to Imgur
    const IMGUR_CLIENT_ID = '548475c1d272ba3'; // Your Imgur client ID

    async function uploadImageToImgur(imageData) {
        try {
            const response = await axios.post(
                'https://api.imgur.com/3/image',
                { image: imageData, type: 'base64' },
                { headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` } }
            );
            if (response.data.success) {
                console.log('✅ Image uploaded successfully!');
                return response.data.data.link;
            } else {
                console.error('❌ Upload failed:', response.data);
                return null;
            }
        } catch (error) {
            console.error('❌ Error uploading image:', error.message);
            return null;
        }
    }

    const imageUrl = media.data ? await uploadImageToImgur(media.data) : null;
    if (message.hasMedia && !imageUrl) return;

  
   try {
  // Send to Zapier webhook
    //    await axios.post(
      //      'https://hooks.zapier.com/hooks/catch/23282710/uyud2xs/',
        //    {
          //      messageText: message.body,
            //    imageUrl: imageUrl,
              //  groupName: groupName || 'Direct Chat'
          //  },
           // {
            //    headers: { 'Content-Type': 'application/json' }
          //  }
       // );
//create message instead of zapier 

        createMessage({
           messageText: message.body,
           imageUrl: imageUrl,
	   whatsapp_group: groupName || 'Direct Chat',
        
            created_by: 'user123'
        }).then(response => {
            console.log('Message created successfully:', response);
        }).catch((error) => {
console.error('Error creating message:', error);
        });
processMessages();
        console.log('✅ Webhook sent successfully');
    } catch (err) {
        console.error('❌ Webhook error:', err.response?.data || err.message);
    }
});

// Start the client
client.initialize();
