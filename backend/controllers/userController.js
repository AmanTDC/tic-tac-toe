const {dbo} = require('../config/mongodb')
const dataControlMethods = require('../controllers/dataController')
const {getGithubData} = require('../controllers/dataController')
const {UI_URL,BACKEND_URL} = require('../config/const')
async function createUser(req,res,next){
    try{
    db = await dbo
    // console.log(req)
    res.githubData =await getGithubData(req.cookies.token)
    // console.log(req.cookies.token)
    userName = res.githubData.login
    userId = req.body.userId
    user = await new Promise(function(resolve,reject){
        db.collection('githubUser').find({"userId":userId}).toArray(function(err,res1){
            if(err)
                reject(err)
            resolve(res1)
        })

    })
    if(user.length==0){
        db.collection('githubUser').insert({
            userName,
            userId
        })
        res.redirect(`${UI_URL}/home`)
    }//BUG : Register Page not responding properly
    else{
        res.json({
            message:"Username already exists. Choose Another",
            success:false
        })
    }}catch(err){
        console.log(err)
        res.send("failed")
    }
}
async function getUser(userName,db){
    return await new Promise(function(resolve,reject){
        db.collection('githubUser').find({"userName":userName}).toArray(function(err,res){
            if(err)
                reject(err);
            else
                resolve(res);
        })
    })
}
module.exports = {
    createUser,getUser
}