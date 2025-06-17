import {base44Service} from './Base44Service.js';

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Initialize WhatsApp client with session persistence
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Display QR code in terminal
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code to connect WhatsApp');
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

    // Send to Zapier webhook
    try {
        await axios.post(
            'https://hooks.zapier.com/hooks/catch/23282710/uyud2xs/',
            {
                messageText: message.body,
                imageUrl: imageUrl,
                groupName: groupName || 'Direct Chat'
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
//create message instead of zapier 
const base44 = new base44Service();
        base44.createMessage({
           messageText: message.body,
           imageUrl: imageUrl,
	   whatsapp_group: groupName || 'Direct Chat',
        
            created_by: 'user123'
        }).then(response => {
            console.log('Message created successfully:', response);
        }).catch((error) => {
console.error('Error creating message:', error);
        });

        console.log('✅ Webhook sent successfully');
    } catch (err) {
        console.error('❌ Webhook error:', err.response?.data || err.message);
    }
});

// Start the client
client.initialize();
