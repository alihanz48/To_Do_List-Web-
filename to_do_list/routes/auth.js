const express=require("express");
const router=express.Router();

const authControllers=require("../controllers/auth");


router.get("/resetpassword/:token",authControllers.get_resetpassword);
router.post("/resetpassword/:token",authControllers.post_resetpassword);

router.get("/login",authControllers.get_login);
router.post("/login",authControllers.post_login);

router.get("/register",authControllers.get_register);
router.post("/register",authControllers.post_register);

router.get("/forgotmypassword",authControllers.get_forgotmypassword);
router.post("/forgotmypassword",authControllers.post_forgotmypassword);

router.get("/logout",authControllers.get_logout);

module.exports=router;