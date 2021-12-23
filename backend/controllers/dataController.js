const axios = require('axios')
const { response } = require('express')
async function getGithubData(token){
    try{
        const data = await axios.get('https://api.github.com/user',{
            headers:{
                Authorization: "token "+token
            }
        })  
        return data.data
    }
    catch(error){
        // console.log(token)
    }
}
module.exports = {
    getGithubData
}