import userService from "../services/user.services.js";
import config from '../config.js';
import { hashPassword, comparePasswords, generateToken } from '../utils.js';
import logger from "../utils/winston.js";
import nodemailer from 'nodemailer';
import UserInfo from "../persistencia/DTOs/userInfo.dto.js";

const PORT = config.port;
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
            const actualDate = new Date();
            const userMail= req.session.email;
            const fechaActual = actualDate.toLocaleDateString();
            const horaActual = actualDate.toLocaleTimeString();
            const logOut = {
                last_connection: `${fechaActual} ${horaActual}`
              };
            const updateUser = await userService.findOneAndUpdate({ email: userMail }, logOut);
            req.session.destroy((error) => {
                if (error) {
                    return res.status(400).json({error}) 
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
        const resetLink = `http://localhost:${PORT}/users/changepass?token=${token}`
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

    async documentsLoader (req,res) {
        try {
            const userId = req.params.uid;
            const user = await userService.findUserByIdService(userId);
            if (!user) return res.status(404).json({ message: 'User not found'});
            const filesUploaded = req.files;
            for (const file in filesUploaded) {
                const fileArray = filesUploaded[file];
                for (const fields of fileArray) {
                    const hasFile = user.documents.some((doc) => doc.name === fields.fieldname);
                    if (hasFile) return res.status(400).json({message: 'File already loaded'});
                    const doc = {
                        name: fields.fieldname,
                        reference: fields.path
                    };
                    user.documents.push(doc);
                    await user.save();  
            };  
        };
        return res.json({ message: 'Document(s) uploaded successfully' })
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async userPremium (req,res) {
        try {
            const userId = req.params.uid;
            const user = await userService.findUserByIdService(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });      
            const requiredDocuments = ['identification', 'addressProof', 'accountStatement'];
            const documentsUploaded = user.documents.filter(document => requiredDocuments.includes(document.name));
            if (documentsUploaded.length !== requiredDocuments.length) {
                return res.status(400).json({ message: 'All documents are required'});
            } else {
                user.role = 'Premium';
                await user.save()
                return res.status(200).json({message: 'User updated to Premium'});
            } 
        } catch (error) {
            return res.status(500).json({error})            
        }
    }

    async getAllUsers (req,res) {
        try {
            const users = await userService.findAllService();
            const usersDTO = users.map((user) => new UserInfo(user));
            return res.status(200).json(usersDTO);
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async deleteOldUsers (req,res) {
        try {
            let daysOfLastConnection = 0;
            const actualDate = new Date();
            const users = await userService.findAllService();
            for (const user of users){
                if (user.email !== 'adminCoder@coder.com') {
                    if (user.last_connection) {
                        const lastconnection = user.last_connection.slice(0,9);
                        const lastconnectionToDate = new Date(Date.parse(lastconnection))
                        daysOfLastConnection = Math.floor((actualDate - lastconnectionToDate)/(24*60*60*1000));
                    } else {
                        daysOfLastConnection = 3;
                    }
                    if (daysOfLastConnection > 2) {
                        console.log('--------------');
                        console.log(`User ${user.first_name} ${user.last_name} will be eliminated due inactivity`); // dejo el log para realizar verificación
                        await userService.deleteOneService(user._id);
                        const transport = nodemailer.createTransport({
                            service: 'gmail',
                            port: 587,
                            auth: {
                                user: USER_GMAIL,
                                pass: USER_PASS
                            }
                        });
                        const result = await transport.sendMail({
                            from: 'System administrator',
                            to: user.email,
                            subject: 'Información sobre su cuenta',
                            html: `
                                <h2> Cuenta Eliminada</h2>
                                <a> Su cuenta ha sido eliminada por inactividad </a>
            
                            `,
                            attachments: [] 
                        });
                        if(result.accepted.length !== 0) console.log('Mail Send');
                    } else return res.status(400).json({message: 'No users to be eliminated'})
                }
            }; 
            return res.status(200).json({message: 'Users deleted'})

        } catch (error) {
            return res.status(500).json({error})
        }
    }
}

export default new UserController();