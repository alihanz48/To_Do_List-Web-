const sequelize=require('./config');

const Work=require('./models/work');
const Group=require('./models/group');
const User=require('./models/user');
const Company=require('./models/company');

//you should lock=0 for save the data.
const lock=1;

(async ()=>{
  if(lock==0){
    const work=await Work.bulkCreate([
      {
        isim:'X Y',
        iletisim:'00000000000',
        aciklama:'Kurulum',
        adres:'X Mahallesi Y Bulvarı No:1/1',
        onay:0,
        onaylayan:'',
        ekleyen:''
      },
      {
        isim:'A B',
        iletisim:'11111111111',
        aciklama:'Arıza daha önce çok kez evine gidilmiş interneti yavaşmış çözüm bulunamamış',
        adres:'S Mahallesi D Caddesi 1.Sokak No:2/1',
        onay:0,
        onaylayan:'',
        ekleyen:''
      },
      {
        isim: 'R C',
        iletisim: '22222222222',
        aciklama: 'Müşteri modeminde sık sık bağlantı kopma sorunu yaşıyor, modem değişimi talep ediyor.',
        adres: 'E Mahallesi F Caddesi 1.Sokak No:5 Daire:3',
        onay: 0,
        onaylayan:'',
        ekleyen:''
      },
      {
        isim: 'N B',
        iletisim: '33333333333',
        aciklama: 'Bağlantı hızında düşüş var, çevrede kazı çalışması olmuş ve kablo zarar görmüş olabilir.',
        adres: 'R Mahallesi G Sokak No:8',
        onay: 1,
        onaylayan:'',
        ekleyen:''
      },
      {
        isim: 'K L',
        iletisim: '44444444444',
        aciklama: 'Kullanıcı sürekli internet bağlantısının kesildiğini belirtti, bağlantı testi yapılması gerekiyor.',
        adres: 'Y Mahallesi L Caddesi 1.Sokak No:5 Kat:2',
        onay: 0,
        onaylayan:'',
        ekleyen:''
      },
      {
        isim: 'E U',
        iletisim: '55555555555',
        aciklama: 'İnternet hiç bağlanmıyor, daha önce modem sıfırlama önerilmiş fakat çözüm olmamış.',
        adres: 'Ç Mahallesi X Caddesi 1.Sokak No:15 Daire:2',
        onay: 1,
        onaylayan:'',
        ekleyen:''
      }
    ]);
    
    const group=await Group.bulkCreate([
    {name:'null'},
    {name:'Alihan-Recep'},
    {name:'Ahmet-Mehmet'},
    {name:'gsm operator 1'},
    {name:'gsm operator 2'},
    ]);
    
    const company=await Company.bulkCreate([
      {name:'ABC İnternet',sektor:'internet',yil:'1989',vergiNo:'111111',sicilNo:'s111111'},
      {name:'QWE GSM İletişim',sektor:'operator',yil:'2000',vergiNo:'222222',sicilNo:'s222222'},
      {name:'yazilim as',sektor:'internet',yil:'2005',vergiNo:'333333',sicilNo:'s333333'}
    ]);
    
    const user=await User.bulkCreate([
      {name:'Alihan',lastname:'Dursun',username:'testname1',password:'111111111'},
      {name:'Emre',lastname:'Yılmaz',username:'testname2',password:'222222222'},
      {name:'Ahmet',lastname:'Göçer',username:'testname3',password:'333333333'},
      {name:'Mehmet',lastname:'Dağ',username:'testname4',password:'444444444'},
      {name:'Ali',lastname:'Uygar',username:'testname5',password:'555555555'},
      {name:'Fuat',lastname:'Biçen',username:'testname6',password:'666666666'}
    ]);


    await company[0].addUser(user[0]);
    await company[0].addUser(user[1]);
    await company[1].addUser(user[2]);
    await company[1].addUser(user[3]);
    await company[2].addUser(user[5]);


    await company[0].addGroup(group[1]);
    await company[0].addGroup(group[2]);  
    await company[1].addGroup(group[3]);
    await company[1].addGroup(group[4]);

    await company[0].addWork(work[0]);
    await company[0].addWork(work[1]);
    await company[0].addWork(work[2]);
    await company[1].addWork(work[3]);
    await company[1].addWork(work[4]);
    await company[1].addWork(work[5]);

    await group[1].addWork(work[0]);
    await group[1].addWork(work[1]);
    await group[2].addWork(work[2]);
    await group[3].addWork(work[3]);
    await group[3].addWork(work[4]);
    await group[4].addWork(work[5]);
  }
})();