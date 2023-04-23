import { Router } from "express";
import userInfo from '../persistencia/DTOs/userInfo.dto.js';

const router = Router();

router.get('/current', (req,res) => {
    const {email, role} = req.session;
    const user = new userInfo({email,role});
     if (req.session.passport){
        const auth = req.session.auth
        res.send(`Usuario ${user.email}  con Rol ${user.role} se ha autenticado mediante ${auth}`)
    } else {
        res.send('No se ha iniciado sesión');
    } 
})

export default router;