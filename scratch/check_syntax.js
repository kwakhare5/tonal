const fs = require('fs');
const content = fs.readFileSync('content.js', 'utf8');
try {
    new Function(content);
    console.log("No syntax errors");
} catch (e) {
    console.log(e.message);
    if (e.stack) {
        console.log(e.stack);
    }
}
