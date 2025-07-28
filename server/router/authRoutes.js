const { Router } = require("express")
const authController = require('../Controllers/authController')
const authRoutes = Router()


authRoutes.post('/login', authController.Login)
authRoutes.post('/register', authController.Register)


module.exports = authRoutes