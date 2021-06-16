const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

app.set('port', port);

http.createServer(app);

app.listen(port, () => console.log(`Le serveur est lancé : http://localhost:${port}`) );