//OUTSIDE API
const JsonHandler = require('./MyDataBase');
const jsonHandler = new JsonHandler('MyJsonData.json');

// API
const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

//app.listen(PORT);

app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)

app.get('/configs', (req, res) => {
    let myConfigs = jsonHandler.getConfigs();

    if(jsonHandler.getJsonValue(`Status`) !== `ON`){
        return res.status(302).send(`STATUS CODE: 302 Found!<br>Please turn ON the API!`)
    }

    return res.status(200).send(myConfigs);
})

app.put('/edit/status=:value', (req, res) => {
    const { value } = req.params;

    if(!value || !(value.toLowerCase() == `on` || value.toLowerCase() == `off`)){
        return res.status(400).send(`STATUS CODE: 400 Bad Request!<br>Example usage: /edit/status=off (off/on)`);
    }

    jsonHandler.editJsonValue(`Status`, `${value.toUpperCase()}`);
    
    return res.status(202).send(`STATUS CODE: 202 Accepted!<br>Status has been turned ${value.toUpperCase()}!`);
});

app.put('/edit/contents', (req, res) => {
    const { Cross_Fire, Roblox, Auto_Clicker, Chrome, Brave, isCustomEnabled, Custom1, Custom2, Custom3 } = req.body;

    if (Cross_Fire === undefined || typeof Cross_Fire !== 'boolean') {                          // Cross_Fire
        return res.status(400).send("Invalid Cross_Fire, must be true or false!");
    }
    else if (Roblox === undefined || typeof Roblox !== 'boolean') {                             // Roblox
        return res.status(400).send("Invalid Roblox, must be true or false!");
    }
    else if (Auto_Clicker === undefined || typeof Auto_Clicker !== 'boolean') {                 // Auto_Clicker
        return res.status(400).send("Invalid Auto_Clicker, must be true or false!");
    }
    else if (Chrome === undefined || typeof Chrome !== 'boolean') {                             // Chrome
        return res.status(400).send("Invalid Chrome, must be true or false!");
    }
    else if (Brave === undefined || typeof Brave !== 'boolean') {                               // Brave
        return res.status(400).send("Invalid Brave, must be true or false!");
    }
    else if (isCustomEnabled === undefined || typeof isCustomEnabled !== 'boolean') {           // CUSTOM NA
        return res.status(400).send("Invalid isCustomEnabled, must be true or false!");
    }
    else if(!Custom1){
        return res.status(400).send("Invalid Custom1, Please input the string in Custom1!");
    }
    else if(!Custom2){
        return res.status(400).send("Invalid Custom2, Please input the string in Custom2!");
    }
    else if(!Custom3){
        return res.status(400).send("Invalid Custom3, Please input the string in Custom3!");
    }

    jsonHandler.editJsonValue(`Cross_Fire`, Cross_Fire);
    jsonHandler.editJsonValue(`Roblox`, Roblox);
    jsonHandler.editJsonValue(`Auto_Clicker`, Auto_Clicker);
    jsonHandler.editJsonValue(`Chrome`, Chrome);
    jsonHandler.editJsonValue(`Brave`, Brave);
    // CUSTOM NA
    jsonHandler.editJsonValue(`isCustomEnabled`, isCustomEnabled);
    jsonHandler.editJsonValue(`Custom1`, Custom1);
    jsonHandler.editJsonValue(`Custom2`, Custom2);
    jsonHandler.editJsonValue(`Custom3`, Custom3);

    return res.status(202).send(`STATUS CODE: 202 Accepted!<br>Check your updated configs here. <a href="/configs">/configs</a>`);
});

// DEVELOPER MESSAGES
const mysecretkey = `Azeu`;
let isDevMsgSeen;

app.put('/developer/setmessage', (req, res) => {
    const { secretkey } = req.body;
    const { message } = req.body;
    
    if(secretkey != mysecretkey){
        return res.status(401).send(`STATUS CODE: 401 Unauthorized!<br>Invalid secretkey!`);
    }
    else if(!message){
        return res.status(400).send(`STATUS CODE: 400 Bad Request!<br>Please input the Developer Message!`);
    }
    
    jsonHandler.setDeveloperMessage(message);
    isDevMsgSeen = false; // Set 
    return res.status(202).send(`STATUS CODE: 202 Accepted!<br>The Developer Message has been set to:<br>${message}`);
});

app.get('/developer/getmessage', (req, res) => {
    const secretkey = req.query.key;
    const developer_message = jsonHandler.getDeveloperMessage();

    //Check if seen already
    if(isDevMsgSeen == true){
        return res.status(418).send(`STATUS CODE: 418 I'm a teapot!<br>Developer Message has been seen/sent already!`); 
    }
    else if (!secretkey) {
        return res.status(400).send("STATUS CODE: 400 Bad Request!<br>Please check if there is a typo in the url parameters!<br>/developer/getmessage?key=xxxnxxx");
    }
    else if(secretkey != mysecretkey){
        return res.status(401).send(`STATUS CODE: 401 Unauthorized!<br>Invalid secretkey!`);
    }
    
    isDevMsgSeen = true;
    return res.status(200).send({
        developer_message : `${developer_message}`
    });
});