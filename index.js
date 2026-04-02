const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const { authSession } = require('./session'); // session.js සම්බන්ධ කිරීම

__path = process.cwd();
const PORT = process.env.PORT || 8000;

// Heroku හෝ වෙනත් තැනක සෙට් කරන SESSION_ID එක ලබා ගැනීම
const SESSION_ID = process.env.SESSION_ID || '';

async function startBot() {
    console.log("Checking for Session ID...");

    // 1. Session ID එක තිබේ නම් එයින් creds.json සාදා ගැනීම
    if (SESSION_ID) {
        await authSession(SESSION_ID);
    } else {
        console.log("No SESSION_ID found. You might need to pair manually.");
    }

    // 2. අනෙකුත් Route සහ Middleware සැකසීම
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

    // 3. සර්වරය ආරම්භ කිරීම
    app.listen(PORT, () => {
        console.log(`
---------------------------------------
Don't Forget To Give Star
Server running on http://localhost:${PORT}
---------------------------------------`);
    });

    // 4. බොට් එකේ ප්‍රධාන කේතය ක්‍රියාත්මක කරන ගොනුව මෙතැනදී කැඳවන්න
    // උදාහරණ: require('./main.js'); 
}

// බොට් එක ආරම්භ කිරීම
startBot();

module.exports = app;
