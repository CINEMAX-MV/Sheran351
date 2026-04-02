const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");

__path = process.cwd();
const PORT = process.env.PORT || 8000;

// 1. පරිශීලකයා Heroku වල ලබාදෙන SESSION_ID එක
const SESSION_ID = process.env.SESSION_ID || '';

// 2. මෙතන 'YOUR_PREFIX;;' වෙනුවට ඔබට අවශ්‍ය නම දාන්න (උදා: Sheran;;)
const MY_PREFIX = 'ROCKY-MD'; 

async function startBot() {
    // Session String එක creds.json එකක් බවට පත් කිරීමේ කොටස
    if (SESSION_ID) {
        try {
            const sessionPath = path.join(__path, 'session');
            if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);

            // ලබා දී ඇති Prefix එක ඉවත් කර Base64 decode කිරීම
            const decoded = Buffer.from(SESSION_ID.replace(new RegExp(MY_PREFIX, 'g'), ""), 'base64').toString('utf-8');
            
            fs.writeFileSync(path.join(sessionPath, 'creds.json'), decoded);
            console.log(`✅ Session initialized with prefix: ${MY_PREFIX}`);
        } catch (e) {
            console.log("❌ Session Error: " + e.message);
        }
    }

    let code = require('./pair'); 
    require('events').EventEmitter.defaultMaxListeners = 500;

    app.use('/code', code);
    app.use('/pair', async (req, res, next) => {
        res.sendFile(path.join(__path, 'pair.html'));
    });
    app.use('/', async (req, res, next) => {
        res.sendFile(path.join(__path, 'main.html'));
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(PORT, () => {
        console.log(`
---------------------------------------
Don't Forget To Give Star
Server running on http://localhost:${PORT}
---------------------------------------`);
    });

    // 3. මෙතනින් පස්සේ බොට් එකේ ප්‍රධාන function එක run කරන්න (උදා: require('./main.js'))
}

startBot();

module.exports = app;
