const { toDefaultValue } = require('sequelize/lib/utils');
const sequelize=require('../config');
const { DataTypes }=require('sequelize');

const Work=sequelize.define("work",{
    isim:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    iletisim:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    aciklama:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    adres:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    onay:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    onaylayan:{
        type:DataTypes.STRING,
        allowNull:true,
        toDefaultValue:''
    },ekleyen:{
        type:DataTypes.STRING,
        allowNull:false,
    }
    
});


module.exports=Work;