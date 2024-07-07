"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationApi = void 0;
const passport_1 = __importDefault(require("passport"));
// import {Strategy as LocalStrategy} from 'passport-local';
const passport_jwt_1 = require("passport-jwt");
const Users_1 = __importDefault(require("../models/Users"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import MongoServerError from 'mongodb';
dotenv_1.default.config();
class AuthorizationApi {
    constructor(app) {
        this.app = app;
        // passport.use(new LocalStrategy(function verify(username, password, cb) {
        //   Users.findOne({username: username}).then((user) => {
        //     if (!user) { 
        //       return cb(null, false, { message: 'Incorrect username or password.' });
        //     }
        //     user.validatePassword(password).then((isValid) => {
        //       if (isValid) {
        //         return cb(null, user);
        //       } else {
        //         return cb(null, false, {message:'Incorrect username or password.'});
        //       }
        //     });
        //   }).catch((err) => {
        //     return cb(err);
        //   });
        // }));
        const privateKeyB64 = process.env.PRIVATE_KEY;
        if (!privateKeyB64) {
            console.log('no private key is setup - unable to authorize user requests');
            process.exit(1);
        }
        this.privateKey = Buffer.from(privateKeyB64, 'base64').toString('ascii');
        // console.log(`PRIVATE key used for verification of requests: ${this.privateKey}`);
        const publicKeyB64 = process.env.PUBLIC_KEY;
        if (!publicKeyB64) {
            console.log('no public key is setup - unable to authorize user requests');
            process.exit(1);
        }
        const publicKey = Buffer.from(publicKeyB64, 'base64').toString('ascii');
        console.log(`public key used for verification of requests:\n${publicKey}`);
        const options = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: publicKey,
            algorithms: ['RS256'],
        };
        passport_1.default.use(new passport_jwt_1.Strategy(options, function verify(payload, cb) {
            const user = {
                username: payload.sub,
                isAdmin: payload.isAdmin,
                password: ''
            };
            cb(null, user);
        }));
    }
    issueJWT(user) {
        const expiresIn = '1d';
        const payload = {
            sub: user.username,
            isAdmin: user.isAdmin,
            iat: Date.now(),
        };
        const jwt = jsonwebtoken_1.default.sign(payload, this.privateKey, { expiresIn: expiresIn, algorithm: 'RS256' });
        return {
            jwt: jwt,
            expiresIn: expiresIn,
        };
    }
    setup() {
        this.app.post('/api/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("attempting the login");
            if (!req.body.username || !req.body.password) {
                return res.status(400).send('Invalid request - usename and password are required');
            }
            const username = req.body.username;
            const password = req.body.password;
            Users_1.default.findOne({ username: username }).then((user) => {
                if (!user) {
                    return res.status(401).send('Unauthorized - invalid username or password');
                }
                user.validatePassword(password).then((isValid) => {
                    if (isValid) {
                        const jwtData = this.issueJWT(user);
                        return res.json({ success: true, user: user, token: jwtData.jwt, expiresIn: jwtData.expiresIn });
                    }
                    else {
                        return res.status(401).send('Unauthorized - invalid username or password');
                    }
                });
            }).catch((err) => {
                return res.status(401).send('Unauthorized');
            });
        }));
        this.app.post('/api/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.username || !req.body.password) {
                return res.status(400).send('Invalid request - usename and password are required');
            }
            const username = req.body.username;
            const password = req.body.password;
            const newUser = new Users_1.default({
                username: username,
                password: password,
                isAdmin: false,
            });
            newUser.save().then((savedUser) => {
                const jwtData = this.issueJWT(savedUser);
                return res.json({ success: true, user: savedUser, token: jwtData.jwt, expiresIn: jwtData.expiresIn });
            }).catch((err) => {
                if (err.name === "MongoServerError" && err.code === 11000) {
                    return res.status(400).send('Invalid request - usename already taken');
                }
                next(err);
            });
        }));
    }
}
exports.AuthorizationApi = AuthorizationApi;
;
