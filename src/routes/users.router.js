import { Router } from "express";
import userController from '../controllers/user.controller.js';
import passport from "passport";
import { authToken, uploader } from "../utils.js";
import { AdminPermission } from "../middlewares/auth.middleware.js";


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

router.post('/:uid/documents',uploader.fields([
    { name: 'imagenPerfil', maxCount: 1 },
    { name: 'productImage', maxCount: 100 },
    { name: 'document', maxCount: 100 },
    { name: 'identification', maxCount:1 },
    { name: 'addressProof', maxCount:1 },
    { name: 'accountStatement', maxCount:1 }
  ]),userController.documentsLoader);

router.put('/premium/:uid', userController.userPremium);  
router.get('/admin/users', AdminPermission, userController.getAllUsers);
router.get('/admin/deleteusers', AdminPermission, userController.deleteOldUsers);


export default router;