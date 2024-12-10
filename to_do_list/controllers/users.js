const express=require('express');
const router=express.Router();

const Company=require("../models/company");
const Group=require("../models/group");
const User=require("../models/user");
const Work=require("../models/work");
const { where } = require('sequelize');
const { raw } = require('mysql2');
const { name } = require('ejs');

exports.main=async function(req,res) {
    res.render("main/main_page");
}

exports.get_works=async function(req,res) {
    const inf=await req.session.userInf;
    const groups=await Group.findAll({
        where:{
            companyId:inf.compid
        },raw:true,
    });
    const works=await Work.findAll({
        where:{
            onay:0,
            companyId:inf.compid,
        },
        include:Group,   
        raw:true,
    });
    console.log(groups);
    if(inf==undefined){
        res.redirect("/login");
    }
    else{
        res.render("users/app-main-page",{
            logindata:inf,
            groups:groups,
            works:works,
        });
    }
};

exports.get_workconfirmation=async function(req,res) {
    const inf=await req.session.userInf;
    const work=await Work.update({
        onay:1,
        onaylayan:inf.username
    },{
    where:{
        id:req.params.workid,
    }
    });
    return res.redirect(req.query.returnUrl);
}

exports.get_workdelete=async function(req,res) {
    const work=await Work.destroy({
        where:{
            id:req.params.workid
        }
    });
    return res.redirect("/works");
}

exports.get_worksedit=async function(req,res) {
   const inf=await req.session.userInf;
   const workid=req.params.workid;
   const work=await Work.findAll({
    where:{
        id:workid
    },raw:true,
   });

   const groups=await Group.findAll({
    where:{
         companyId:inf.compid,
    },raw:true
   });
   
   res.render("users/work-edit",{
    work:work[0],
    groups:groups,
    logindata:inf
   });
}

exports.post_worksedit=async function(req,res) {
    const workid=req.params.workid;
    const isim=req.body.isim;
    const iletisim=req.body.iletisim;
    const aciklama=req.body.aciklama;
    const adres=req.body.adres;
    const group=req.body.grup;
    
    const work=await Work.update({
        isim:isim,
        iletisim:iletisim,
        aciklama:aciklama,
        adres:adres,
        groupId:group
    },{
        where:{
            id:workid,
        }
    });

    return res.redirect("/works");
}

exports.get_confworks=async function(req,res) {
    const inf=await req.session.userInf;
    const groups=await Group.findAll({
        where:{
            companyId:inf.compid
        },raw:true,
    });
    const works=await Work.findAll({
        where:{
            onay:1,
            companyId:inf.compid,
        },
        include:Group,   
        raw:true,
    });
    if(inf==undefined){
        res.redirect("/login");
    }
    else{
        res.render("users/confworks",{
            logindata:inf,
            groups:groups,
            works:works
        });
    }
};

exports.get_confcancel=async function(req,res) {
    const workid=req.params.workid;
    const work=await Work.update({
        onay:0,
        onaylayan:null,
    },{
        where:{
            id:workid,
        }
    });
    return res.redirect("/confworks");
};

exports.get_group=async function(req,res) {
   const inf=await req.session.userInf;
   const works=await Work.findAll({
     where:{
        onay:0,
        groupId:req.params.groupid,
        companyId:inf.compid,
     },
     include:Group,
     raw:true,
   });

   const groups=await Group.findAll({
    where:{
        companyId:inf.compid,
    },raw:true,
   });

   res.render("users/group-page",{
    logindata:inf,
    groups:groups,
    works:works,
    selectid:req.params.groupid,
    });
};

exports.get_personedit=async function(req,res) {
    const inf=await req.session.userInf;
    const msg=req.session.personaldrm;
    delete req.session.personaldrm;
    const groups=await Group.findAll({
        where:{
            companyId:inf.compid,
        },raw:true,
    });
    
    const users=await User.findAll({
        where:{
            companyId:inf.compid
        },raw:true,
    });
    
    res.render("users/edit",{
        logindata:inf,
        groups:groups,
        users:users,
        msg:msg,
    });
};

exports.post_grouprename=async function(req,res) {
   const groupid=req.body.group;
   const newname=req.body.newname;
   if(newname!=""){
    const group=await Group.update({
        name:newname,
    },{
        where:{
            id:groupid,
        }
    });
   }
   res.redirect("/person-edit");
}

exports.post_groupcreate=async function(req,res) {
   const groupname=req.body.groupname;
   const inf=await req.session.userInf;
   const group=await Group.create({
     name:groupname,
     companyId:inf.compid,
   });
   return res.redirect("/person-edit");    
}

exports.post_groupdelete=async function(req,res) {
    const groupid=req.body.group;
    const group=await Group.destroy({
        where:{
            id:groupid,
        }
    });
    return res.redirect("/person-edit");    
 }

exports.post_addperson=async function(req,res) {
    const email=req.body.email;
    const inf=await req.session.userInf;
    const user=await User.findOne({
        where:{
            username:email,
        }
    });
    if(user){
        req.session.personaldrm={msg:"Kullanıcı Eklendi !!!",class:"success"};
       const user=await User.update({
        companyId:inf.compid,
       },{
        where:{
            username:email,
        }
       });
    }else{
        req.session.personaldrm={msg:"Kullanıcı Bulunamadı !!!",class:"danger"};
    }
    return res.redirect("/person-edit");    
}

exports.post_removeperson=async function(req,res) {
    const userid=req.body.userid;
    const user=await User.update({
        companyId:null,
    },{
        where:{
            id:userid,
        }
    });
    return res.redirect("/person-edit");
}

exports.get_addwork=async function(req,res) {
    const inf=await req.session.userInf;
    const groups=await Group.findAll({
        where:{
            companyId:inf.compid
        },raw:true,
    });
    return res.render("users/add-work",{
       groups:groups,
       logindata:inf
    });
}

exports.post_addwork=async function(req,res) {
    const isim=req.body.isim;
    const iletisim=req.body.iletisim;
    const aciklama=req.body.aciklama;
    const adres=req.body.adres;
    const groupid=req.body.grup;

    const inf=await req.session.userInf;
    
    const work=await Work.create({
        isim:isim,
        iletisim:iletisim,
        aciklama:aciklama,
        adres:adres,
        onay:0,
        ekleyen:inf.username,
        groupId:groupid,
        companyId:inf.compid,
    });

    return res.redirect("/works");
}