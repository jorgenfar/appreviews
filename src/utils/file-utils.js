const fs = require('fs');
const { bindCallback } = require('rxjs/index');

const writeFile = (fileName, data) => {
    const boundWriteFile = bindCallback(fs.writeFile);
    return boundWriteFile(fileName, data);
};

module.exports = {
    writeFile
};
