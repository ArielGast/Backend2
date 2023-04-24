export function auth(req, res, next) {
    if (req.session.logged) {
        next();
    }else {
        res.redirect('/');
    }
}

export function isLogged(req,res,next) {
    if (req.session.logged) {
        res.redirect('/views/perfil')
    }else {
        next();
    }
}

export function isAdmin(req,res,next) {
    let role;
    if (req.session.isAdmin) {
        req.session.role = 'Admin'
        
    }else {
         req.session.role = 'User'
    }
    next();
}

export function AdminPermission (req,res,next) {
    if (req.session.isAdmin) {
        next()
    } else {
        res.status(403).json({Message:'Forbiden'})
    }
}

export function UserPermission (req,res,next) {
    if (!req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({Message:'Forbiden'})
        
    }
}