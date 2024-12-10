const express=require("express");
const { route } = require("./auth");
const router=express.Router();

const usersController=require("../controllers/users");
const isLogin=require("../middlewares/isLogin");

router.get("/workconfirmation/:workid",isLogin,usersController.get_workconfirmation);

router.get("/workdelete/:workid",isLogin,usersController.get_workdelete);

router.get("/works-edit/:workid",isLogin,usersController.get_worksedit);
router.post("/works-edit/:workid",isLogin,usersController.post_worksedit);

router.get("/confcancel/:workid",isLogin,usersController.get_confcancel);

router.get("/groups/:groupid",isLogin,usersController.get_group);

router.get("/person-edit",isLogin,usersController.get_personedit);

router.post("/grouprename",isLogin,usersController.post_grouprename);
router.post("/groupcreate",isLogin,usersController.post_groupcreate);
router.post("/groupdelete",isLogin,usersController.post_groupdelete);

router.post("/addperson",isLogin,usersController.post_addperson);
router.post("/removeperson",isLogin,usersController.post_removeperson);

router.get("/addwork",isLogin,usersController.get_addwork);
router.post("/addwork",isLogin,usersController.post_addwork);

router.get("/confworks",isLogin,usersController.get_confworks);

router.get("/works",isLogin,usersController.get_works);

router.get("/",usersController.main);

module.exports=router;