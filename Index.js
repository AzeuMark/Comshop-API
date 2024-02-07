//OUTSIDE API
const JsonHandler = require('./MyDataBase');
const jsonHandler = new JsonHandler('MyJsonData.json');
const jsonPCStatus = new JsonHandler('MyPCStatus.json');

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

// PC's Status
app.put('/pc-status/edit', (req, res) => {
    const { JPC1, JPC2, JPC3, JPC4, DPC1, DPC2, DPC3 } = req.body;

    // J
    if (JPC1 === undefined || (JPC1.toUpperCase() !== "ON" && JPC1.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid JPC1, must be ON or OFF!");
    } else if (JPC2 === undefined || (JPC2.toUpperCase() !== "ON" && JPC2.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid JPC2, must be ON or OFF!");
    } else if (JPC3 === undefined || (JPC3.toUpperCase() !== "ON" && JPC3.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid JPC3, must be ON or OFF!");
    } else if (JPC4 === undefined || (JPC4.toUpperCase() !== "ON" && JPC4.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid JPC4, must be ON or OFF!");
    }

    // D
    if (DPC1 === undefined || (DPC1.toUpperCase() !== "ON" && DPC1.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid DPC1, must be ON or OFF!");
    } else if (DPC2 === undefined || (DPC2.toUpperCase() !== "ON" && DPC2.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid DPC2, must be ON or OFF!");
    } else if (DPC3 === undefined || (DPC3.toUpperCase() !== "ON" && DPC3.toUpperCase() !== "OFF")) {
        return res.status(400).send("Invalid DPC3, must be ON or OFF!");
    }
   
    // Edit J
    jsonPCStatus.editPCStatusValue(`JPC1`, JPC1);
    jsonPCStatus.editPCStatusValue(`JPC2`, JPC2);
    jsonPCStatus.editPCStatusValue(`JPC3`, JPC3);
    jsonPCStatus.editPCStatusValue(`JPC4`, JPC4);

    // Edit D
    jsonPCStatus.editPCStatusValue(`DPC1`, DPC1);
    jsonPCStatus.editPCStatusValue(`DPC2`, DPC2);
    jsonPCStatus.editPCStatusValue(`DPC3`, DPC3);
    
    return res.status(202).send(`STATUS CODE: 202 Accepted!<br>Check your updated statuses here. <a href="/pc-status/get">/pc-status/get</a>`);
});

app.put('/pc-hide/edit', (req, res) => {
    const { JPC1_Hide, JPC2_Hide, JPC3_Hide, JPC4_Hide, DPC1_Hide, DPC2_Hide, DPC3_Hide } = req.body;

    // Hide J
    if (JPC1_Hide === undefined || typeof JPC1_Hide !== 'boolean') {
        return res.status(400).send("Invalid JPC1_Hide, must be true or false!");
    }else if (JPC2_Hide === undefined || typeof JPC2_Hide !== 'boolean') {                          
        return res.status(400).send("Invalid JPC2_Hide, must be true or false!");
    }else if (JPC3_Hide === undefined || typeof JPC3_Hide !== 'boolean') {                          
        return res.status(400).send("Invalid JPC3_Hide, must be true or false!");
    }else if (JPC4_Hide === undefined || typeof JPC4_Hide !== 'boolean') {                         
        return res.status(400).send("Invalid JPC4_Hide, must be true or false!");
    }
    
    // Hide D
    if (DPC1_Hide === undefined || typeof DPC1_Hide !== 'boolean') { 
        return res.status(400).send("Invalid DPC1_Hide, must be true or false!");
    }else if (DPC2_Hide === undefined || typeof DPC2_Hide !== 'boolean') {
        return res.status(400).send("Invalid DPC2_Hide, must be true or false!");
    }else if (DPC3_Hide === undefined || typeof DPC3_Hide !== 'boolean') {
        return res.status(400).send("Invalid DPC3_Hide, must be true or false!");
    }
    
    // Edit Hide J
    jsonPCStatus.editPCHiddenValue(`JPC1_Hide`, JPC1_Hide);
    jsonPCStatus.editPCHiddenValue(`JPC2_Hide`, JPC2_Hide);
    jsonPCStatus.editPCHiddenValue(`JPC3_Hide`, JPC3_Hide);
    jsonPCStatus.editPCHiddenValue(`JPC4_Hide`, JPC4_Hide);

    // Edit Hide D 
    jsonPCStatus.editPCHiddenValue(`DPC1_Hide`, DPC1_Hide);
    jsonPCStatus.editPCHiddenValue(`DPC2_Hide`, DPC2_Hide);
    jsonPCStatus.editPCHiddenValue(`DPC3_Hide`, DPC3_Hide);
    
    return res.status(202).send(`STATUS CODE: 202 Accepted!<br>Check your updated statuses here. <a href="/pc-status/get">/pc-status/get</a>`);
});

app.get('/status-hide/configs', (req, res) => {

    if(jsonHandler.getJsonValue(`Status`) !== `ON`){
        return res.status(302).send(`STATUS CODE: 302 Found!<br>Please turn ON the API!`)
    }

    return res.status(200).send(jsonPCStatus.getStatusAndHideConfigs());
});
