const sequelize=require('../config');
const { DataTypes }=require('sequelize');

const Company=sequelize.define("company",{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    sektor:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    yil:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    vergiNo:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    sicilNo:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});

module.exports=Company;