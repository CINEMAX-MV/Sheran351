const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");

__path = process.cwd();
const PORT = process.env.PORT || 8000;

// Config වලින් හෝ කෙලින්ම Session ID එක ලබා ගැනීම
const SESSION_ID = process.env.SESSION_ID || 'ROCKY-MD@xRJgmZoL#ZiCDMWkLQtO_Y6_uCJOAk91F2x5MASb8qOFlpD4uBVc';
const MY_PREFIX = 'ROCKY-MD@'; 

async function startBot() {
    if (SESSION_ID) {
        try {
            const sessionPath = path.join(__path, 'session');
            if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);

            // 1. Prefix එක අයින් කිරීම
            let cleanedSession = SESSION_ID;
            if (SESSION_ID.startsWith(MY_PREFIX)) {
                cleanedSession = SESSION_ID.substring(MY_PREFIX.length);
            }

            // 2. Decode කිරීම (මෙහිදී JSON parse කිරීමට පෙර error check කරනවා)
            const decoded = Buffer.from(cleanedSession, 'base64').toString('utf-8');
            
            // වැදගත්: Decoded data එක JSON format එකේදැයි පරීක්ෂා කිරීම
            JSON.parse(decoded); 

            fs.writeFileSync(path.join(sessionPath, 'creds.json'), decoded);
            console.log(`✅ Session file created successfully!`);
        } catch (e) {
            console.log("❌ CRITICAL SESSION ERROR: ඔබ ලබාදුන් Session ID එක වැරදියි හෝ එය නිවැරදි Base64 format එකක් නොවේ.");
            console.log("Detail:", e.message);
            // බොට් එක වැරදි session එකකින් run වීම වැළැක්වීමට මෙතැනින් නතර කළ හැක
        }
    }

    // අනෙකුත් Route සහ Middleware
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
        console.log(`Server running on port ${PORT}`);
    });

    // 🔴 වැදගත්: ඔබේ බොට් එකේ ප්‍රධාන ගොනුව (උදා: main.js) මෙතනදී call කරන්න
    // require('./main'); 
}

startBot();
module.exports = app;
