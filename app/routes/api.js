'use strict'

var NOT_AUTHORIZED = 'Not authorized.'; // Due to strict mode const is not working.

var userController = require('../controllers/user.server.controller');
var projectController = require('../controllers/project.server.controller');
var changeRequestController = require('../controllers/changerequest.server.controller');
var problemRequestController = require('../controllers/problemrequest.server.controller');
var settingsController = require('../controllers/settings.server.controller');
var common = require('../controllers/common.functions');

var verifySession = function(req, res, next) {
	if (req.session && req.session.user) {
		next();
	} else {
		common.errHandler(res, null, NOT_AUTHORIZED, 401);
	}
}

var verifyAdmin = function(req, res, next) {
	if (req.session.admin) {
		next();
	} else {
		common.errHandler(res, null, NOT_AUTHORIZED, 401);
	}	
}

module.exports = function(app, express) {
	var api = express.Router();

	// api.post('/users', userController.newDocument); // Development Purpose

	// User Resource
	api.get('/users', verifySession, verifyAdmin, userController.allEntries);
	api.get('/users/admin', verifySession, userController.isAdmin);
	api.get('/users/:id', verifySession, userController.getDocumentById);
	api.get('/users/:offset/:limit', verifySession, verifyAdmin, userController.pageEntries);	
	api.post('/users/authenticate', userController.login);
	api.post('/users', verifySession, verifyAdmin, userController.newDocument);
	api.put('/users/:id', verifySession, userController.updateDocumentById);
	api.put('/users/:id/changepassword', verifySession, userController.changePassword);
	api.delete('/users/:id', verifySession, userController.remove);

	// Project resource
	api.get('/projects', verifySession, projectController.allEntries);
	api.get('/projects/:id', verifySession, projectController.getDocumentById);
	api.get('/projects/:offset/:limit', verifySession, projectController.pageEntries);	
	api.post('/projects', verifySession, projectController.newDocument);
	api.put('/projects/:id', verifySession, projectController.updateDocumentById);
	api.delete('/projects/:id', verifySession, projectController.remove);

	// Change Request resource
	api.get('/changes', verifySession, changeRequestController.allEntries);
	api.get('/changes/:id', verifySession, changeRequestController.getDocumentById);
	api.get('/changes/:offset/:limit', verifySession, changeRequestController.pageEntries);	
	api.post('/changes', verifySession, changeRequestController.newDocument);
	api.put('/changes/:id', verifySession, changeRequestController.updateDocumentById);
	api.put('/changes/:id/status/:status', verifySession, changeRequestController.changeStatus);
	api.put('/changes/:id/approval', verifySession, changeRequestController.approval);
	api.delete('/changes/:id', verifySession, changeRequestController.remove);

	// Problem Request resource
	api.get('/problems', verifySession, problemRequestController.allEntries);
	api.get('/problems/:id', verifySession, problemRequestController.getDocumentById);
	api.get('/problems/:offset/:limit', verifySession, problemRequestController.pageEntries);	
	api.post('/problems', verifySession, problemRequestController.newDocument);
	api.put('/problems/:id', verifySession, problemRequestController.updateDocumentById);
	api.put('/problems/:id/status/:status', verifySession, problemRequestController.changeStatus);
	api.delete('/problems/:id', verifySession, problemRequestController.remove);

	//Settings Resource
	api.get('/settings', verifySession, verifyAdmin, settingsController.getDocument); 
	api.post('/settings', verifySession, verifyAdmin, settingsController.newDocument); 
	api.put('/settings/:id', verifySession, verifyAdmin, settingsController.updateDocumentById); 
	
	return api;
}
