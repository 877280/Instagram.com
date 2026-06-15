
function resultToObject(result) {
    const dataStr = result.stdout.toString().trim();
    const parts = dataStr.split('\n\n');
    const bodyString = parts[parts.length - 1].trim();
    return JSON.parse(bodyString); 
}

module.exports = { resultToObject };
