const express = require('express');
const sequelize = require('./db'); // Sequelize instance
const postsRouter = require('./routes/posts');
const eventsRouter = require('./routes/events');
const alertsRouter = require('./routes/alerts');
const weatherRouter = require('./routes/weather');

const app = express();

// Middleware
app.use(express.json());

// Register routers
app.use('/api/posts', postsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/weather', weatherRouter);

// Start the server
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }) // Synchronize the database
  .then(() => {
    console.log('Database connected and tables created.');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
