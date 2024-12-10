const express=require('express');
const app=express();


const path=require("path");
const sequelize=require('./data/data_config');
const cookieParser=require("cookie-parser");
const session=require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:"secret-key",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60*60*24*1000,
    },
    store:new SequelizeStore({
        db:sequelize
    })
}));

const dummyData=require('./data/dummy-data');

const Company=require("./models/company");
const Group=require("./models/group");
const User=require("./models/user");
const Work=require("./models/work");
const { userInfo } = require('os');

Group.hasMany(Work, {foreignKey: 'groupId'});
Work.belongsTo(Group, {foreignKey: 'groupId'});

Company.hasMany(Work,{foreignKey:'companyId'});
Work.belongsTo(Company,{foreignKey:'companyId'});

Company.hasMany(User,{foreignKey:'companyId'});
User.belongsTo(Company,{foreignKey:'companyId'});

Company.hasMany(Group,{foreignKey:'companyId'});
Group.belongsTo(Company,{foreignKey:'companyId'});

(async()=>{
    //await sequelize.sync();
})();

const authRoutes=require("./routes/auth");
const mainRoutes=require("./routes/user");

app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/public",express.static(path.join(__dirname,"public")));

app.use(authRoutes);
app.use(mainRoutes);

app.listen(3000,()=>{
    console.log("server 3000 portundan dinleniyor");
});