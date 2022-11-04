const router = require("express").Router();
const { check , validationResult } = require("express-validator");
const {users} = require("../data");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken")

router.post("/signup", [
    check("Email","Provide a valid email")
        .isEmail(),
    check("Password","Provide a password that is greater than 5 characters")
        .isLength({
            min: 6
        })
] ,async (req,res) => {
    const { password , email } = req.body;

    const errors = validationResult(req);

    console.log(password,email);

    if(password.length < 6);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    let user = users.find((user)=>{
     return  user.email === email;
    });
    if(user){
     return   res.status(400).json({
            "errors": [
                {
                    "msg": "User already exits",
                }
            ]
        })
    }
    const hasshedPassword = await bcrypt.hash(password,10)
    users.push({
        email,
        password:hasshedPassword
    })
    const token = await JWT.sign({
        email
    },"hehgiohoghigi4gi87688wkhfhe",{
        expiresIn:3600000
    });
    res.json({
        token
    })

});
router.post("/login", async (req, res) =>{
    const { password, email}= req.body;
    
    let user = users.find((user)=>{
        return  user.email === email;
       });
       if(!user){
        return   res.status(400).json({
               "errors": [
                   {
                       "msg": "invalid creditionals check the username"
                   }
               ]
           })
       };
       let isMatch = await bcrypt.compare(password, user.password);
       if(!isMatch){
        return  res.status(400).json({
               "errors": [
                   {
                       "msg": "invalid creditionals check the password"
                   }
               ]
           })
       };
       const token = await JWT.sign({
        email
    },"hehgiohoghigi4gi87688wkhfhe",{
        expiresIn:36000
    });
    res.json({
        token
    })
})
router.get("/all", (req,res) =>{
    res.json(users);
})
module.exports = router;