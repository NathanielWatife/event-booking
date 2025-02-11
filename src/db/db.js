const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database(':memory:');



db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER,
        userId INTEGER,
        status TEXT CHECK(status IN ('booked', 'cancelled'))
        );
    `);
});


module.exports = db;