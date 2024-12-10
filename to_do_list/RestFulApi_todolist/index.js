var express=require('express');
var app=express();

const Work=require('./models/work');
const Group=require('./models/group');
const User=require('./models/user');
const Company=require('./models/company');

const GeneralProcess=require('./routes/processs');
const authRoutes=require('./routes/auth');

const DummyData=require("./dummy-data");

var sequelize=require('./config');
const { raw } = require('mysql2');
const { where, Model } = require('sequelize');

Group.hasMany(Work, {foreignKey: 'groupId'});
Work.belongsTo(Group, {foreignKey: 'groupId'});

Company.hasMany(Work,{foreignKey:'companyId'});
Work.belongsTo(Company,{foreignKey:'companyId'});

Company.hasMany(User,{foreignKey:'companyId'});
User.belongsTo(Company,{foreignKey:'companyId'});

Company.hasMany(Group,{foreignKey:'companyId'});
Group.belongsTo(Company,{foreignKey:'companyId'});

const path=require('path');

/*
(async ()=>{
  await sequelize.sync();
})();*/


app.use(express.urlencoded({ extended: false }));
app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.set("view engine", "ejs");

const mail=require('./routes/mailerConfig');

app.use(GeneralProcess);
app.use(authRoutes);

app.listen(3000,()=>{
    console.log("3000 portundan api dinleniyor...");
});