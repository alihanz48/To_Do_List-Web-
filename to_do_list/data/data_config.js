const Sequelize=require("sequelize");

const sequelize=new Sequelize("todolist","root","123456789",{
    host:"localhost",
    dialect:"mysql"
});

module.exports=sequelize;