# PickApp
This application is the Backend server, that reads messages sent to the special whatsapp number, creates a new message item in base 44.
This is a commonJS application, so some of the node modules need to be changed.
Therefore, after running npm i, you will need to tell base44 to be treated as a commonJs application, these are the steps to perform this(update in a linux environment, you can just run changeenv.sh):
1. Go to /node_modules/@base44/packaje.json
    Change 
    "main":"dist/index.js"
   To
   "main":"dist/index.cjs"
2. Rename the file @base44/sdk/dist/index.js to index.cjs

Issues to be handled:
1. Currently, base44 does not allow using backend functions with our api key, but this is being handled, once it is handled, the server will also perform the process messages functionality ( code is already written) which creates items and alerts
2. Calculate expiration for item according to the whatsapp group it was sent to
