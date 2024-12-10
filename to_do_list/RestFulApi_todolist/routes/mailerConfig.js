const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"example@gmail.com",
        pass:"izee ekej nzlg vkbm",
    }
});

module.exports=transporter;