const fs = require('fs');

class JsonHandler {
    constructor(filePath) {
        this.filePath = filePath;
        this.loadData();
    }

    loadData() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.jsonData = JSON.parse(data);
        } catch (error) {
            console.error('Error loading JSON data:', error.message);
            this.jsonData = {};
        }
    }

    saveData() {
        try {
            const jsonContent = JSON.stringify(this.jsonData, null, 2);
            fs.writeFileSync(this.filePath, jsonContent, 'utf8');
        } catch (error) {
            console.error('Error saving JSON data:', error.message);
        }
    }

    getJsonValue(key) {
        return this.jsonData[key];
    }

    addJsonValue(key, value) {
        this.jsonData[key] = value;
        this.saveData();
    }

    editJsonValue(key, value) {
        if (this.jsonData.hasOwnProperty(key)) {
            this.jsonData[key] = value;
            this.saveData();
            //console.log(`Value for key '${key}' edited successfully.`);
        } else {
            //console.error(`Key '${key}' does not exist in the JSON data.`);
        }
    }

    getConfigs() {
        try {
            const fileContents = fs.readFileSync('MyJsonData.json', 'utf8');
            return fileContents;
        } catch (error) {
            return error;
        }
    }

    getDeveloperMessage() {
        try {
            return fs.readFileSync('DeveloperMessage.txt', 'utf8');
        } catch (err) {
            return null;
        }
    }

    setDeveloperMessage(message){
        try {
            return fs.writeFileSync('DeveloperMessage.txt', message, 'utf8')
        }catch(err){
            return null;
        }
    }

    editPCStatusValue(key, value){
        if (this.jsonData[0].hasOwnProperty(key)) {
            this.jsonData[0][key] = value;
            this.saveData();
            //console.log(`Value for key '${key}' edited successfully.`);
        } else {
            //console.error(`Key '${key}' does not exist in the JSON data.`);
        }
    }

    editPCHiddenValue(key, value){
        if (this.jsonData[1].hasOwnProperty(key)) {
            this.jsonData[1][key] = value;
            this.saveData();
            //console.log(`Value for key '${key}' edited successfully.`);
        } else {
            //console.error(`Key '${key}' does not exist in the JSON data.`);
        }
    }

    getStatusAndHideConfigs(){
        try {
            return fs.readFileSync('MyPCStatus.json', 'utf8');
        } catch (err) {
            return null;
        }
    }
}

module.exports = JsonHandler;