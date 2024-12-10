const Sequelize=require('sequelize');

const sequelize=new Sequelize("todolist","root","123456789",{
    host:"localhost",
    dialect:"mysql",
    define:{
        timestamps:true
    },
    storage:"./session.mysql"
});

async function Baglan() {
    try{
        await sequelize.authenticate();
        console.log("Baglantı başarılı!!!");
    }catch(err){
        console.log(err);
    }
}
Baglan();

module.exports=sequelize;