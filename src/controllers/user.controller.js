import userService from "../services/user.services.js";
import config from '../config.js';
import { hashPassword, comparePasswords } from '../utils.js';


const ADMIN_EMAIL= config.admin_email;

class UserController  {
    async findUserController (email) {
        try {
            const usuario =  await userService.findUserService(email); 
            if (usuario.length !=0) {
                return usuario;
            }else {
                return 'Not Found';
            }
        } catch (error) {
            return error;
        }
    }
    
    async createUserController (obj) {
        try {
            const newUser = await userService.createUserService(obj);
            return  newUser;
    
        } catch (error) {
            return error;          
        }
    }
    
    async findUserByIdController (id) {
        try {
            const user = await userService.findUserByIdService(id);
            if (user){
                return user;
            }else {
                return 'Not Found';
            }
        } catch (error) {
            return error;
        }
    }
    
    async loginController (req, res) {
        try {
            const {email, password} = req.body;
            const hashedPassword = hashPassword(password)
            const usuario =  await findUserService(email); 
            if (usuario.length !==0) {
                const isPassword = await comparePasswords(password, usuario[0].password);
                if (isPassword) {
                    for (const key in req.body) {
                        req.session[key] = req.body[key]
                    }
                    req.session.logged = true;
                    if(email === ADMIN_EMAIL){ 
                        req.session.isAdmin = true;
                    }else {
                        req.session.isAdmin = false;
                    } 
                }
                res.redirect('/views/perfil')
            }else {
                res.redirect('/views/errorLogin')
            }
        } catch (error) {
            return res.status(500).json({error})       
        }
    }
    
    async logoutController (req,res) {
        try {
            req.session.destroy((error) => {
                if (error) {
                    return res.status(400).json({error});
                } else {
                    res.redirect('/views/login');
                }
            })        
        } catch (error) {
            return res.status(500).json({error})       
            
        }
    }
    
    async  githubController (req, res) {
        try {
                req.session.email = req.user.email;
                req.session.isAdmin = false;
                req.session.logged = true;
                req.session.auth = 'github';
                res.redirect('/views/perfil');
            
        } catch (error) {
            return res.status(500).json({error})    
        }
    }
    
    async  googleController (req,res) {
        try {
        req.session.email = req.user.email;
        req.session.isAdmin = false;
        req.session.logged = true;
        req.session.auth = 'google';
        res.redirect('/views/perfil');
        } catch (error) {
            return res.status(500).json({error})    
            
        }
    }
}

export default new UserController();