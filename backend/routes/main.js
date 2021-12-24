const {app} = require('../index')
const {authenticateUser,loginUser} = require('../middlewares/authentication')
const {createUser} = require('../controllers/userController')
const {UI_URL} = require('../config/const')
const path = require('path')
app.route('/')
    .get(authenticateUser,(req,res,next)=>{
        res.redirect(UI_URL+'/home')
    })
app.route('/newUser')
    .post(createUser)

app.route('/oauth/github')
    .get(loginUser,(req,res,next)=>{
        res.redirect(UI_URL+'/home')
    })
app.route('/login')
    .get((req,res,next)=>{
        res.redirect(UI_URL+'/home')
    })
app.route('/isValidUser')
    .get(authenticateUser,(req,res,next)=>{
        console.log("hey")
        res.json({isValidUser:true})
    })
module.exports = {
    app
}
