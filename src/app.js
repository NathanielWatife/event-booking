const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const { corsOptions } = require('./config/cors');
const  config = require('./config/config');

const app = express();

// middlware 
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });


// routes
app.use('/', eventRoutes);


// error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// synchronize the database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
});

const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;