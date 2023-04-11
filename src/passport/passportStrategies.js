import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as githubStrategy } from "passport-github2";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import { findUserController, createUserController, findUserByIdController } from "../controllers/user.controller.js"; 
import { hashPassword } from '../utils.js';
import config from '../config.js';


const GITHUB_CLIENTID= config.github_clientID;
const GITHUB_CLIENT_SECRET= config.github_client_Secret;
const GOOGLE_CLIENTID = config.google_clientID;
const GOOGLE_CLIENT_SECRET = config.google_client_Secret;


//local
passport.use(
    'registro',
    new localStrategy ({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        const usuario = await findUserController(email);
        if (usuario.length !== 0) {
            return done(null, false)
        }
        const hashNewPassword = await hashPassword(password);
        const newUser = {...req.body, password: hashNewPassword};
        const newUserDB = await createUserController(newUser);
        done(null, newUserDB)
    }
    )
)

// Github

passport.use(
    'githubRegistro',
    new githubStrategy ({
        clientID: GITHUB_CLIENTID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/users/github'
    },
    async (accesToken, refreshToken, profile, done) => {
        const usuario = await findUserController(profile._json.email)
        if(!usuario) {
            const newUser = {
                first_name: profile._json.name.split(' ')[0],
                last_name: profile._json.name.split(' ')[1] || '',
                email: profile._json.email,
                password: ''
            }
            const dbResult = await createUserController(newUser);
            done(null, dbResult);
        }else {
            done(null, usuario)
        }
    }
    )
)


// Google

passport.use('google',
new googleStrategy({
    clientID: GOOGLE_CLIENTID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/users/google"
  }, async (accessToken, refreshToken, profile, done) => {
    const usuario = await findUserController(profile._json.email)
        if(!usuario) {
            const newUser = {
                first_name: profile._json.given_name,
                last_name: profile._json.family_name || '',
                email: profile._json.email,
                password: ''
            }
            const dbResult = await createUserController(newUser);
            done(null, dbResult);
        }else {
            done(null, usuario)
        }
  }
))

passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})


passport.deserializeUser(async(_id, done) => {
    const usuario = await findUserByIdController(_id);
    done(null, usuario)
})