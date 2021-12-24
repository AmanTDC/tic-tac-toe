const {app} = require('../index')
const {GITHUB_URL,CLIENT_ID,CLIENT_SECRET,UI_URL} = require('../config/const')
const axios = require('axios')
const {dbo} = require('../config/mongodb')
const {getGithubData} = require('../controllers/dataController')
const {getUser} = require('../controllers/userController')
async function loginUser(req,res,next){
    try{
        const response = await axios.post(`${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`)
        const access_token = response.data.split('&')[0].split('=')[1]
        res.cookie('token',access_token)
        next()
    }
    catch(error){
        // console.log(error)
        console.log('In error')

        res.redirect(UI_URL)
        
    }
    


}


async function authenticateUser(req,res,next){
    try{
        
    
        res.githubData =await getGithubData(req.cookies.token)  
        // console.log(req.cookies.token)
        var userName = res.githubData.login
        db = await dbo
        // var userDetails = await getUser(userName,db)
        // console.log(userDetails)
        // if(userDetails.length==0||userDetails.use)
        //     res.json({isValidUser:false,redirect:"/register"})
        // else{
        //     res.userDetails = userDetails
        //     next()
        // }
        next()
    }
    catch(err){
        res.json({isValidUser:false,redirect:"/"})
        // console.log(err)
    }
}
module.exports = {
    authenticateUser,loginUser
}