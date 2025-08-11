import axios from "axios"

const getUserInfo = async({
    username,
    access_token,
})=>{
    console.log(`getUserInfo ${username}  ${access_token}`);
    let requestUrl = `https://api.gitcode.com/api/v5/users/${username}?access_token=${access_token}`
    let result = await axios.get(requestUrl);
    console.log(`获取用户信息 ${JSON.stringify(result.data)}`);
   
    return  result.data
}

export {getUserInfo}