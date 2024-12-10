const sequelize=require('../data/data_config');
const { DataTypes }=require('sequelize');

const Group=sequelize.define("group",{
    name:{
        type:DataTypes.STRING
    },
});


module.exports=Group;