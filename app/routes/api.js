var userController = require('../controllers/user.server.controller');
var projectController = require('../controllers/project.server.controller');

module.exports = function(app, express) {
	var api = express.Router();

	// User Resource
	api.get('/users', userController.allEntries);
	api.get('/users/:id', userController.getDocumentById);
	api.post('/users/authenticate', userController.login);
	api.post('/users', userController.newDocument);
	api.put('/users/:id', userController.updateDocumentById);

	// Project resource
	api.get('/projects', projectController.allEntries);
	api.get('/projects/:id', projectController.getDocumentById);
	api.post('/projects', projectController.newDocument);
	api.put('/projects/:id', projectController.updateDocumentById);

	return api;
}
