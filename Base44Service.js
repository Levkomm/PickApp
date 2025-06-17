//Base44Service 

import { createClient } from '@base44/sdk';
export class base44Service {
    constructor() {
        // This function can be extended to include more Base44 service methods if needed
        this.create = function () {
            return createClient({
                appId: '680e678ffae7fe33fb4ad6c7',
		token: '25fb47e1037048e5a3b84739b433b79c',
            });
        };
        this.createMessage = async (messageData) => {
            // --- 2. Request Processing ---
            try {
                const base44 = this.create();
                // --- 3. Validation ---
                // Ensure the required fields are present in the incoming data
                if (!messageData.messageText || !messageData.imageUrl) {
                    return new Response(JSON.stringify({
                        error: 'Bad Request: `messageText` and `imageUrl` are required fields.'
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
                const createdMessage = await base44.entities.Message.create(finalMessageData);
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
    }
}
