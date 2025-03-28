const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const { corsOptions } = require('./config/cors');
const config = require('./config/config');

const app = express();
const PORT = config.app.port;

// middleware 
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', eventRoutes);

// error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

if (require.main === module) {
  // synchronize the database and start server
  sequelize.sync({ force: false })
    .then(() => {
      console.log('Database synced');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Database sync error:', err);
    });
}

module.exports = app;
