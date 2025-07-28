const { Router } = require("express")
const generalController = require('../Controllers/generalController')
const generalRoutes = Router()
const authentication = require('../Middleware/authenticateToken')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
generalRoutes.post('/Create-Post',authentication,upload.single('image') ,generalController.CreatePost);
generalRoutes.get('/Dashboard', authentication,generalController.DashboardUser);
generalRoutes.get('/Dashboard-All', authentication ,generalController.DashboardAllUser);
generalRoutes.put('/Edit-Post/:postId', authentication, generalController.EditPost);
generalRoutes.delete('/Delete-Post/:postId', authentication ,generalController.DeletePost);
generalRoutes.get('/profile/:userId', generalController.getUserProfile); 
generalRoutes.post('/follow/:userId', authentication, generalController.followUser); 
generalRoutes.post('/like/:postId', authentication, generalController.likePost);
generalRoutes.get('/comments/:postId',authentication, generalController.ShowComment);
generalRoutes.post('/comments/:postId', authentication, generalController.createComment);

module.exports = generalRoutes