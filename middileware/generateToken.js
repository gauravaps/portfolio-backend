const jsonwebtoken=require('jsonwebtoken');
const dotenv =require('dotenv');


dotenv.config();


// exports.generateToken=(id,expire)=>{
//      const token =jsonwebtoken.sign({id},process.env.SECRET_TOKEN,{expiresIn:expire})
//     return token;

// } 

exports.generateToken = (user, expire) => {
    const token = jsonwebtoken.sign(
        { id:user._id, admin:user.admin },
        process.env.SECRET_TOKEN,
        { expiresIn: expire }
    );
    return token;
};
