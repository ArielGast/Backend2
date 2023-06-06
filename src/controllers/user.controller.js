import userService from "../services/user.services.js";
import config from '../config.js';
import { hashPassword, comparePasswords, generateToken } from '../utils.js';
import logger from "../utils/winston.js";
import nodemailer from 'nodemailer';



const ADMIN_EMAIL= config.admin_email;
const ADMIN_PASSWORD = config.admin_pass;
const USER_GMAIL = config.user_gmail;
const USER_PASS = config.user_pass;


class UserController  {
    async findUserController (email) {
        try {
            const usuario =  await userService.findUserService(email); 
            if (usuario) {
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
            return newUser
    
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
            if(email === ADMIN_EMAIL && password===ADMIN_PASSWORD){ 
                req.session.isAdmin = true;
                req.session.logged = true;
                res.redirect('/api/products')
            }else {
                req.session.isAdmin = false;
                const hashedPassword = hashPassword(password)
                const usuario =  await userService.findUserService(email); 
                if (usuario) {
                    const isPassword = await comparePasswords(password, usuario.password);
                    if (isPassword) {
                        for (const key in req.body) {
                            req.session[key] = req.body[key]
                        }
                        req.session.logged = true;
                        res.redirect('/views/perfil')
                    } 
                } else {
                    logger.warning('Fail login attempt')
                    res.redirect('/views/errorLogin')
            }
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

    async resetpassController (req,res) {
        try {
            res.redirect('/views/resetpass');
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async resetController (req,res) {
        const {email} = req.body;
        const user = await userService.findUserService(email);
        if (!user) return res.status(404).send({message: 'Mail not found'})
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: USER_GMAIL,
                pass: USER_PASS
            }
        })
        const token = generateToken(email)
        const resetLink = `http://localhost:8080/users/changepass?token=${token}`
        try {
            const result = await transport.sendMail({
                from: 'System administrator',
                to: email,
                subject: 'test de recupero de contraseña',
                html: `
                    <h2> Link de recupero de contraseña</h2>
                    <a href= ${resetLink}>Click aqui</a>

                `,
                attachments: [] 
            })
            if(result.accepted.length !== 0) return res.status(200).send({message:'Mail Send'})
            
        } catch (error) {
            return res.status(500).json({error})
        }

    }

    async changePass (req,res) {
        try {
            res.redirect('/views/changepass')
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async change (req,res,) {
        const email = req.user
        const {newPassword} = req.body;
        try {
            const user = await userService.findUserService(email);
            const hashNewPassword = hashPassword(newPassword);
            const isPassword = await comparePasswords(newPassword, user[0].password);
            if (isPassword) return res.send({message: 'Password must be different'})
            const userUpdated = await userService.updateUser({password: hashNewPassword, ...user})
            res.status(200).send({message: 'Password changed successfully'})
            return userUpdated;     
        } catch (error) {
            return res.status(500).json({error})
        }

    }

}

export default new UserController();