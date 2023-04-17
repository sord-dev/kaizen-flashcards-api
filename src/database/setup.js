const fs = require('fs');

// import db
const db = require("./postgres.db.js");

// scan for config.sql with filesystem and convert it to string
const sql = fs.readFileSync(process.cwd() + '/src/database/config.sql').toString();

// query database with setup sql code
db.query(sql)
    .then(data => {
        db.end();
        console.log("Set-up complete.");
    })
    .catch(error => console.log(error));