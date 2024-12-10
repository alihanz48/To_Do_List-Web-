const sequelize=require('../config');
const { DataTypes }=require('sequelize');

const Group=sequelize.define("group",{
    name:{
        type:DataTypes.STRING
    },
});


module.exports=Group;