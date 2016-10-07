var userController = require('../controllers/user.server.controller');
var projectController = require('../controllers/project.server.controller');
var changeRequestController = require('../controllers/changerequest.server.controller');
var problemRequestController = require('../controllers/problemrequest.server.controller');

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

	// Change Request resource
	api.get('/changes', changeRequestController.allEntries);
	api.get('/changes/:id', changeRequestController.getDocumentById);
	api.post('/changes', changeRequestController.newDocument);
	api.put('/changes/:id', changeRequestController.updateDocumentById);

	// Problem Request resource
	api.get('/problems', problemRequestController.allEntries);
	api.get('/problems/:id', problemRequestController.getDocumentById);
	api.post('/problems', problemRequestController.newDocument);
	api.put('/problems/:id', problemRequestController.updateDocumentById);
	api.delete('/problems/:id', problemRequestController.remove);
	
	return api;
}
