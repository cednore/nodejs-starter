const app = require('./server');

// Bootstrap server
(async () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Started listening on port: ${port}`));
})();
