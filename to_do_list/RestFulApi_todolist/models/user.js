const sequelize=require('../config');
const { DataTypes, Model }=require('sequelize');

const User=sequelize.define("user",{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    lastname:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true,
    }
});

module.exports=User;