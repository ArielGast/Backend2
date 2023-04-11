import { Router } from "express";
import { loginController, logoutController, githubController, googleController } from "../controllers/user.controller.js"; 
import passport from "passport";

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

router.post('/login', loginController);
router.get('/logout', logoutController);
router.get('/registroGithub',passport.authenticate('githubRegistro', {scope : ['user.email']}))
router.get('/github', passport.authenticate('githubRegistro', {failureRedirect: '/views/errorRegistro'}), githubController);

// Google
router.get('/registroGoogle', passport.authenticate('google',{scope:['profile', 'email']}));
router.get('/google', passport.authenticate('google', {scope:['email']}), googleController);

export default router;