import { Router } from "express";
import userController from '../controllers/user.controller.js';
import passport from "passport";
import { authToken } from "../utils.js";

const router = Router();

//registro con passport
router.post(
    '/registro', 
    passport.authenticate('registro', {
        failureRedirect: '/views/errorRegistro',
        successRedirect: '/views/perfil',
        passReqToCallback: true,
    })
)

router.post('/login', userController.loginController);
router.get('/logout', userController.logoutController);
router.get('/registroGithub',passport.authenticate('githubRegistro', {scope : ['user.email']}))
router.get('/github', passport.authenticate('githubRegistro', {failureRedirect: '/views/errorRegistro'}), userController.githubController);

// Google
router.get('/registroGoogle', passport.authenticate('google',{scope:['profile', 'email']}));
router.get('/google', passport.authenticate('google', {scope:['email']}), userController.googleController);

router.get('/resetpass',userController.resetpassController);
router.post('/reset', userController.resetController);
router.get('/changepass',authToken,userController.changePass);
router.post('/change', userController.change);

export default router;