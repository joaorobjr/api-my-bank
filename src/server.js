import app from './app.js';
import dbService from './services/database.service.js';
import settings from './config/config.js';

const port = settings.app.port;

app.listen(port, () => {
  global.logger.info('Express server listening on port ' + port);
  dbService.connectDB();
});
