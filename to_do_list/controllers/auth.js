const { where, Model } = require("sequelize");
const Company=require("../models/company");
const Group=require("../models/group");
const User=require("../models/user");
const Work=require("../models/work");

const crypto=require("crypto");
const config=require("../config");

const mailer=require("../helpers/mailer");
const { raw } = require("mysql2");

exports.get_login = async function (req, res) {
    const message=req.session.message;
    delete req.session.message;
    return res.render("auth/log-in.ejs",{
        msg:message,
    });
    
};

exports.post_login = async function (req, res) {
   const user=await User.findAll({
    where:{
        username:req.body.email,
    },
    include:{
        model:Company,
        attributes:['id','name'],
    },
    raw:true
    });
    console.log(user);
    req.session.userInf={username:user[0].username,compid:user[0]['company.id'],companyName:user[0]['company.name']};
    if(req.body.password==user[0].password){
        
        res.redirect("/works");
    }
    else{
        req.session.message={message:"Kullanıcı adı veya şifrenizi kontrol ediniz!",class:"danger"};
        res.redirect("/login");
    }
};

exports.get_register = async function (req, res) {
    const err=req.session.err;
    delete req.session.err;
    return res.render("auth/register.ejs",{
        err:err,
    });
};

exports.post_register = async function (req, res) {
    const firstname = req.body.firstname;
    const lastname=req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmPassword;

    const companyname = req.body.companyName;
    const sector = req.body.sector;
    const establishedyear = req.body.establishedYear;
    const taxnumber = req.body.taxNumber;
    const registrationnumber = req.body.registrationNumber;
    var registerType = "";
    try{
        const user=await User.findOne({where:{username:email}});
        if(user){
          throw "Bu eposta zaten kayıtlı";
        }

        if (password != confirmpassword) {
            throw "Şifreler uyuşmuyor";
        }

        if (companyname == "" && sector == "" && establishedyear == "" && taxnumber == "" && registrationnumber == "") {
            registerType = "person";
        } else if (companyname != "" && sector != "" && establishedyear != "" && taxnumber != "" && registrationnumber != "") {
            registerType = "manager";
        } else {
            throw "İşletme bilgileri boş geçilemez!"
        }
        
       const newuser=await User.create({
           name:firstname,
           lastname:lastname,
           username:email,
           password:password,
        });

        if(registerType=="manager"){
            const company=await Company.create({
                name:companyname,
                sektor:sector,
                yil:establishedyear,
                vergiNo:taxnumber,
                sicilNo:registrationnumber,
            });
            await company.addUser(newuser);
        }
        req.session.message={message:"Kayıt başarılı giriş yapabilirsiniz!",class:"success"};
        res.redirect("/login");
    }catch(err){
        req.session.err=err;
        res.redirect("/register");
    }

};

exports.get_forgotmypassword=async function(req,res) {
    return res.render("auth/forgotmypassword",{
        message:undefined,
        classs:undefined,
    });
};

exports.post_forgotmypassword=async function(req,res) {
    const email=req.body.email;
    const user=await User.findOne({where:{
        username:email,
    }},);
    
    if(user){
        const token=crypto.randomBytes(32).toString("hex");
        user.token=token.toString();
        await user.save();

        (async()=>{
            await mailer.sendMail({
                from:'dursunalihan@gmail.com',
                to:email,
                subject:'Şifre Sıfırlama Talebi',
                html:`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .email-header {
                background-color: #4a90e2;
                color: #ffffff;
                text-align: center;
                padding: 20px;
                font-size: 24px;
            }
            .email-body {
                padding: 20px;
                color: #333333;
                line-height: 1.6;
            }
            .email-body p {
                margin: 10px 0;
            }
            .email-footer {
                text-align: center;
                padding: 15px;
                background-color: #f9f9f9;
                font-size: 12px;
                color: #777777;
            }
            .reset-button {
                display: inline-block;
                background-color: #4a90e2;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 20px;
                font-size: 16px;
            }
            .reset-button:hover {
                background-color: #357ab7;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                Şifre Sıfırlama
            </div>
            <div class="email-body">
                <p>Merhaba ${user.dataValues.name} ${user.dataValues.lastname},</p>
                <p>Yakın zamanda şifrenizi sıfırlamak istediniz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                <p>
                    <a href="http://${config.ip}/resetpassword/${user.dataValues.token}" class="reset-button">Şifre sıfırla</a>
                </p>
                <p>Şifre sıfırlama talebinde bulunmadıysanız, lütfen bu e-postayı görmezden gelin veya endişeleriniz varsa destek ile iletişime geçin.</p>
                <p>Teşekkürler,<br>To Do List Team</p>
            </div>
            <div class="email-footer">
                &copy; 2024 To Do List. Tüm hakları saklıdır. <br>
                Eğer herhangi bir sorunuz varsa, bizimle <a href="mailto:support@example.com">support@example.com</a> adresinden iletişime geçebilirsiniz.
            </div>
        </div>
    </body>
    </html>
    `
            });
        })();  
        return res.render("auth/forgotmypassword",{
            message:"Sıfırlama bağlantısı e posta adresinize gönderilmişitr!",
            classs:"success",
        });
    }else{
       return res.render("auth/forgotmypassword",{
        message:"E-posta adresinizi doğru girdiğinizden emin olunuz !",
        classs:"danger",
    });
    }
}

exports.get_resetpassword=async function(req,res) {
    const mesaj=await req.session.msg;
    delete req.session.msg;
    const token=req.params.token;
    const user=await User.findOne({
        where:{
            token:token,
        },
    });
    if(user){
        return res.render("auth/reset-password",{
            message:mesaj,
        });
    }
    else{
        res.render("404");
    }
   
}

exports.post_resetpassword=async function(req,res) {
    const password=req.body.password;
    const confpassword=req.body.confpassword;
    const token=req.params.token;

    if(password==confpassword){
       const newtoken=crypto.randomBytes(32).toString("hex");
       const user=await User.findOne({
        where:{
            token:token,
        }
       });
       user.password=password;
       user.token=newtoken;
       await user.save();
       res.redirect("/login");
    }else{
        req.session.msg="Şifreler aynı değil!";
        return res.redirect(`/resetpassword/${token}`);
    }
}

exports.get_logout=async function(req,res) {
    await req.session.destroy();
    return res.render("auth/logout");
}
