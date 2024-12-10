const express=require('express');
const router=express.Router();

const Work=require('../models/work');
const Group=require('../models/group');
const User=require('../models/user');
const Company=require('../models/company');
const mailer=require('./mailerConfig');
const { where } = require('sequelize');
const { raw } = require('mysql2');
const crypto=require('crypto');


router.get("/signuppersonal/:name/:lastname/:username/:password",async(req,res)=>{
    const user=await User.create({
        name:req.params.name,
        lastname:req.params.lastname,
        username:req.params.username,
        password:req.params.password
    });
    res.end();
});

router.get("/signupcompany/:company/:sektor/:yil/:vergino/:sicilno/:username",async(req,res)=>{
  const company=await Company.create({
    name:req.params.company,
    sektor:req.params.sektor,
    yil:req.params.yil,
    vergiNo:req.params.vergino,
    sicilNo:req.params.sicilno
  });

  const user=await User.findOne({where:{
    username:req.params.username,
  }});

  await company.addUser(user);

  res.end();
});

router.get("/login/:username/:password",async(req,res)=>{
  const user=await User.findAll({
    where:{
        username:req.params.username,
        password:req.params.password,
    },
    include:Company,
    raw:true,
  });
  res.status(200).json(user);
  res.end();
});

router.get("/checkuser/:username",async(req,res)=>{
  const user=await User.findAll({
    where:{
        username:req.params.username,
    },
    raw:true,
  });
  res.status(200).json(user);
  res.end();
});

router.get("/reqforgotmypass/:username",async(req,res)=>{
  var token=crypto.randomBytes(32).toString("hex");

  const user=await User.findOne({
    where:{
        username:req.params.username,
    },
  });

  try{
    user.token=token.toString();
    await user.save();

  const info = await mailer.sendMail({
    from: 'dursunalihan@gmail.com', // sender address
    to: req.params.username, // list of receivers
    subject: 'Parola Sıfırlama', // Subject line
    html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Şifre Sıfırlama</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #6A11CB, #2575FC);
            color: #fff;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            color: #333;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #6A11CB, #2575FC);
            color: #fff;
            text-decoration: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 6px;
            font-weight: bold;
            transition: all 0.3s ease;
            text-decoration:none;
        }
        .btn:hover {
            background: linear-gradient(135deg, #2575FC, #6A11CB);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-decoration:none;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Şifre Sıfırlama</h1>
        <p>Merhaba,</p>
        <p>Hesabınız için şifre sıfırlama talebi aldık. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
        <a href="http://192.168.1.103:3000/resetpassword/${token}" class="btn">Şifremi Sıfırla</a>
        <p>Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
        <div class="footer">
            <p>© 2024 Şirket Adı. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>`
, // html body
  });
  res.status(200);
  console.log("Message sent: %s", info.messageId);
  }catch(err){
    res.status(550);
  }
  res.end();
});

router.get("/resetpassword/:token",async(req,res)=>{
  const user=await User.findOne({where:{token:req.params.token}});
  console.log(user);
  if(user!=null){
    res.render("reset_web_page",{data:{
      token:req.params.token,
    }});
  }else{
    res.render("404");
  }
  res.end();
});

router.post("/resetpassword/:token",async(req,res)=>{
  const pass=req.body.password;
  const confpass=req.body.confpassword;
  const token=req.params.token;
  const user=await User.findOne({
     where:{
       token:token
     } 
  });

  if(pass==confpass){
    var newtoken=crypto.randomBytes(32).toString("hex");
    const user=await User.update(
    {
      password:req.body.password,
       token:newtoken,
    },
    {
      where:{
        token:token,
      },
    },
    );
    res.redirect("/successresetpass");
  }else{
    return res.render("reset_web_page",{data:{
      token:token,
      msg:"Şifreler uyuşmuyor !!!"
    }});
  }
  res.end();
});

router.get("/successresetpass",async(req,res)=>{
  res.render("successresetpass");
  res.end();
});

module.exports=router;