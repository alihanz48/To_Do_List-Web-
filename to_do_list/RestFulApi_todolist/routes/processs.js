const express = require("express");
const router = express.Router();


const Work=require('../models/work');
const Group=require('../models/group');
const User=require('../models/user');
const Company=require('../models/company');
const { where } = require("sequelize");
const { raw } = require("mysql2");

router.get("/works/updatedata/:id/:bool",async(req,res)=>{
    const conf=Number(req.params.bool);
    const id=Number(req.params.id);
    const person=req.query.person;
    const work=await Work.update(
     {
       onay:conf,
       onaylayan:person,
     },
     {
     where:{
       id:id,
     }
    });
    res.end();
 });
 
 router.get("/changegroup/:wid/:gid",async(req,res)=>{
   const wid=req.params.wid;
   const gid=req.params.gid;
   const work=await Work.update(
     {
       groupId:gid,
     },
     {
       where:{
        id:wid,
       },
     },
   );
   res.end();
 });
 
 router.get("/editgroup/:id/:gname",async(req,res)=>{
   const id=req.params.id;
   const gname=req.params.gname;
   const group=await Group.update(
     {
       name:gname
     },
     {
       where:{
        id:id,
       },
     },
   );
   res.end();
 });
 
 router.get("/deletegroup/:id",async(req,res)=>{
   const gid=req.params.id;
   const work=await Work.update(
     {
       groupId:1
     },
     {
       where:{
        GroupId:gid,
       },
     },
   );
   const group=await Group.destroy({
     where:{
       id:gid,
     }
   });
   res.end();
 });
 
 router.get("/works/:groupid",async(req,res)=>{
   const group=await Group.findByPk(req.params.groupid);
   const work=await group.getWorks({where:{
     onay:0
   },raw:true});
   res.status(200).json(work);
   res.end();
 });
 
 router.get("/onlywork/:id",async(req,res)=>{
   const id=req.params.id;
   const work=await Work.findByPk(id)
   console.log(work);
   res.status(200).json(work);
   res.end();
 });
 
 router.get("/workdetail/:wid",async(req,res)=>{
   const work=await Work.findAll({
     where:{
       onay:0,
       id:req.params.wid
     },
     include:Group,
     raw:true
   });
   console.log(work);
   res.status(200).json(work);
   res.end();
 });
 
 router.get("/work-delete/:id",async(req,res)=>{
   const id=Number(req.params.id);
 
   const work=await Work.destroy(
     {
       where:{
         id:id,
       },
     },
   );
   res.end();
 });
 
 router.get("/addgroup/:grpname",async(req,res)=>{
   const name =req.params.grpname;
   const compid=req.query.compid;

   const group = await Group.create({
     name:name,
     companyId:compid,
   });
   res.end();
 });

 router.get("/persons/:compid",async(req,res)=>{
   const comp = req.params.compid;

   const user=await User.findAll({
    where:{
      companyId:comp,
    },raw:true,
   });

   res.status(200).json(user);

   res.end();

   console.log(user);
 });
 
 router.get("/checkperson",async(req,res)=>{
  const username=req.query.person;

  const user=await User.findOne({
    where:{
       username:username,
    }
  });

  if(user==null){
    res.status(200).json(false);
  }else{
    res.status(200).json(true);
  }
 });

 router.get("/extractionperson",async(req,res)=>{
  const compid=req.query.compid;
  const person=req.query.personid;

  const user=await User.findOne({
    where:{
      id:person,
    }
  });

  const company=await Company.findOne({
    where:{
      id:compid,
    }
  });
  
  await company.removeUser(user);

  res.end();
 });

 router.get("/persons",async(req,res)=>{
  try{
    const comp = req.query.compid;
    const person=req.query.person;
  
    const company=await Company.findOne({
      where:{
        id:comp,
      },
    });
  
    const user=await User.findOne({
      where:{
        username:person
      },
    });

    if(user==null){
      res.status(500);
    }else{
      await company.addUser(user);
      res.status(200).end();
    }
    
  }catch (err){
    res.status(500);
  }
});
 
 router.get("/addwork",async(req,res)=>{
   const name=req.query.name;
   const tel=req.query.tel;
   const aciklama=req.query.aciklama;
   const adres=req.query.adres;
   const groupid=req.query.groupid;
   const compid=req.query.compid;
   const byadded=req.query.byadded;
 
   const work=await Work.create({
     isim:name,
     iletisim:tel,
     aciklama:aciklama,
     adres:adres,
     onay:0,
     groupId:groupid,
     companyId:compid,
     ekleyen:byadded,
   });
   res.end();
 });
 
 
 router.get("/work-save",async(req,res)=>{
   const id=Number(req.query.id);
   const name=req.query.name;
   const tel=req.query.tel;
   const aciklama=req.query.aciklama;
   const adres=req.query.adres;
   const ekleyen=req.query.ekleyen;
 
   const work=await Work.update(
    {
      isim:name,
      iletisim:tel,
      aciklama:aciklama,
      adres:adres,
      ekleyen:ekleyen
    },
    {
    where:{
      id:id,
    }
   });
   res.end();
 });
 
 router.get("/confworks",async(req,res)=>{
  const compid=req.query.compid;
   const work=await Work.findAll({
     include:Group,
     where:{
      onay:1,
      companyId:compid,
    },raw:true
   });
   console.log(work);
   res.status(200).json(work);
   res.end();
 });
 
 router.get("/works",async(req,res)=>{
  const compid=req.query.compid;
    const work=await Work.findAll({
     where:{
       onay:0,
       companyId:compid,
     },raw:true
    });
    console.log(work);
    res.status(200).json(work);
    res.end();
 });
 
 router.get("/groups",async(req,res)=>{
   const compid=req.query.compid;
   const group=await Group.findAll({where:{companyId:compid}},{raw:true});
   res.status(200).json(group);
   console.log(group);
 })

 module.exports=router;