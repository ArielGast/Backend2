
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
    if (req.session.isAdmin) {
        req.session.role = 'Admin'
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
    if (req.session.role == 'User' || req.session.role == 'Premium') {
        next();
    } else {
        res.status(403).json({Message:'Forbiden'})
        
    }
}

export function AdminPremiumPermission (req,res,next) {
    if (req.session.role == 'Premium' || req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({Message:'Forbiden'})
        
    }
}