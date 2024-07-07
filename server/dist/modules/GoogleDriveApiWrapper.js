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
exports.GoogleDriveApiWrapper = void 0;
const passport_1 = __importDefault(require("passport"));
const GoogleDriveHelper_1 = require("./GoogleDriveHelper");
const { google } = require('googleapis');
class GoogleDriveApiWrapper {
    constructor(app) {
        this.app = app;
        this.driveHelper = GoogleDriveHelper_1.GoogleDriveHelper.getInstance();
    }
    setup() {
        this.app.get('/api/auth/google', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            // TODO - fix below checking if user is admin - should be done by passport somehow
            const user = req.user;
            if (!user.isAdmin) {
                console.error(`non admin user ${user.username} accessing ${req.url}`);
                res.sendStatus(403);
                return;
            }
            const authUrl = this.driveHelper.generateAuthUrl();
            console.log(`auth URL: ${authUrl}`);
            res.send(authUrl);
        }));
        this.app.get('/api/auth/google/callback', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (!user.isAdmin) {
                console.error(`non admin user ${user.username} accessing ${req.url}`);
                res.sendStatus(403);
                return;
            }
            const code = req.query.code;
            // const code = decodeURIComponent(req.query.code as string);
            console.log(`code from google: ${code}`);
            try {
                yield this.driveHelper.exchangeCodeForTokens(code);
                // Redirect the user to a success page or perform other actions
                res.send('Authentication successful!');
            }
            catch (error) {
                console.error('Error authenticating:', error);
                res.status(500).send('Authentication failed.');
            }
        }));
    }
}
exports.GoogleDriveApiWrapper = GoogleDriveApiWrapper;
;
