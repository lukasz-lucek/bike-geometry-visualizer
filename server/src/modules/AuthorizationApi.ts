import {Express} from 'express';
import passport from 'passport'
// import {Strategy as LocalStrategy} from 'passport-local';
import {ExtractJwt, Strategy as JWTStrategy, StrategyOptions as JWTStrategyOptions} from 'passport-jwt';
import Users, { IUser } from '../models/Users';
import dotenv from "dotenv";
import jsonwebtoken from 'jsonwebtoken';
// import MongoServerError from 'mongodb';

dotenv.config();

export class AuthorizationApi {
  private app: Express;
  private privateKey: string;
  constructor(app : Express) {
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
      console.log('no private key is setup - unable to authorize user requests')
      process.exit(1);
    }
    this.privateKey = Buffer.from(privateKeyB64, 'base64').toString('ascii');
    // console.log(`PRIVATE key used for verification of requests: ${this.privateKey}`);

    const publicKeyB64 = process.env.PUBLIC_KEY;
    if (!publicKeyB64) {
      console.log('no public key is setup - unable to authorize user requests')
      process.exit(1);
    }
    const publicKey = Buffer.from(publicKeyB64, 'base64').toString('ascii');
    console.log(`public key used for verification of requests:\n${publicKey}`);

    const options : JWTStrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    };

    passport.use(new JWTStrategy(options, function verify(payload, cb) {
      const user : IUser = {
        username: payload.sub,
        isAdmin: payload.isAdmin,
        password: ''
      }
      cb(null, user);
    }));
  }

  private issueJWT(user: IUser) : {jwt: string, expiresIn: string} {
    const expiresIn = '1d';
    const payload = {
      sub: user.username,
      isAdmin: user.isAdmin,
      iat: Date.now(),
    }

    const jwt = jsonwebtoken.sign(payload, this.privateKey, {expiresIn: expiresIn, algorithm: 'RS256'});
    return {
      jwt: jwt,
      expiresIn: expiresIn,
    }
  }

  public setup() {
    this.app.post('/api/login', async (req, res) => {
      console.log("attempting the login");
      if (!req.body.username || !req.body.password) {
        return res.status(400).send('Invalid request - usename and password are required');
      }
      const username = req.body.username;
      const password = req.body.password;

      Users.findOne({username: username}).then((user) => {
        if (!user) { 
          return res.status(401).send('Unauthorized - invalid username or password');
        }

        user.validatePassword(password).then((isValid) => {
          if (isValid) {
            const jwtData = this.issueJWT(user);
            return res.json({success: true, user: user, token: jwtData.jwt, expiresIn: jwtData.expiresIn});
          } else {
            return res.status(401).send('Unauthorized - invalid username or password');
          }
        });

      }).catch((err) => {
        return res.status(401).send('Unauthorized');
      });
    });

    this.app.post('/api/register', async (req, res, next) => {
      if (!req.body.username || !req.body.password) {
        return res.status(400).send('Invalid request - usename and password are required');
      }
      const username = req.body.username;
      const password = req.body.password;

      const newUser = new Users({
        username: username,
        password: password,
        isAdmin: false,
      });

      newUser.save().then((savedUser) => {
        const jwtData = this.issueJWT(savedUser);
        return res.json({success: true, user: savedUser, token: jwtData.jwt, expiresIn: jwtData.expiresIn})
      }).catch((err) => {
        if (err.name === "MongoServerError" && err.code === 11000) {
          return res.status(400).send('Invalid request - usename already taken');
        }
        next(err)
      });
    })
  }
};