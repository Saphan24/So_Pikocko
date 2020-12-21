const http = require('http');
const app = require('./app');

/** Renvoie d'un port valide */
const normalizePort = val => { 
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/** configuration sur le port 3000 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/** Recherche les différentes erreurs et enregistre dans le serveur */
const errorHandler = error => { 
  if (error.syscall !== 'listen') { 
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => { // L'écouteur d'évènements enregistre et exécute dans la console 
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
