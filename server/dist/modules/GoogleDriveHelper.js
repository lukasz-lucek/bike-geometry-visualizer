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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveHelper = void 0;
const { google } = require('googleapis');
class GoogleDriveHelper {
    constructor() {
        if (!process.env.GOOGLE_API_CLIENT_ID || !process.env.GOOGLE_API_CLIENT_SECRET || !process.env.GOOGLE_API_REDIRECT_URI) {
            console.error("GOOGLE API CREDENTIALS NOT FOUND EXITING");
            process.exit(1);
        }
        this.clientId = process.env.GOOGLE_API_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_API_CLIENT_SECRET;
        this.redirectUri = process.env.GOOGLE_API_REDIRECT_URI;
        this.scopes = ['https://www.googleapis.com/auth/drive'];
        this.oAuth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
        this.accessToken = process.env.GOOGLE_API_ACCESS_TOKEN;
        this.refreshToken = process.env.GOOGLE_API_REFRESH_TOKEN;
        if (!this.accessToken || !this.refreshToken) {
            console.log("Access token and/or refresh token not known - log in to Google to fix this");
        }
        else {
            this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken, access_token: this.accessToken });
        }
        this.driveFolder = process.env.GOOGLE_API_DRIVE_FOLDER_ID;
    }
    static getInstance() {
        if (!GoogleDriveHelper.instance) {
            GoogleDriveHelper.instance = new GoogleDriveHelper();
        }
        return GoogleDriveHelper.instance;
    }
    generateAuthUrl() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
            /** Pass in the scopes array defined above.
            * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
            scope: this.scopes,
            // Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes: true
        });
        return authUrl;
    }
    exchangeCodeForTokens(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Exchange the authorization code for access and refresh tokens
            const { tokens } = yield this.oAuth2Client.getToken(code);
            this.accessToken = tokens.access_token;
            this.refreshToken = tokens.refresh_token;
            this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken, access_token: this.accessToken });
            // TODO: Save the tokens in a database or session for future use - for now - just copy to ENV file
            console.log(`accessToken: \n${this.accessToken} \nrefreshToken: \n${this.refreshToken}`);
        });
    }
    listFiles() {
        try {
            var drive = google.drive({
                version: "v3",
                auth: this.oAuth2Client,
            });
            const listParams = {
                q: this.driveFolder ? `'${this.driveFolder}' in parents` : undefined,
                pageSize: 10,
                fields: 'files(name, id)',
            };
            drive.files.list(listParams).then((response) => {
                console.log(response.data.files);
            });
            //const files = response.data.files;
        }
        catch (err) {
            console.error('Error listing files:', err);
        }
    }
    getFileId(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var drive = google.drive({
                    version: "v3",
                    auth: this.oAuth2Client,
                });
                let querry = `name = '${name}'`;
                if (this.driveFolder) {
                    querry = querry + `and '${this.driveFolder}' in parents`;
                }
                const listParams = {
                    q: querry,
                    pageSize: 1,
                    fields: 'files(id)',
                };
                const response = yield drive.files.list(listParams);
                if (response.data.files && response.data.files.length > 0) {
                    return response.data.files[0].id;
                }
            }
            catch (err) {
                console.error('Error listing files:', err);
            }
            return null;
        });
    }
    getFileFromDrive(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getFileFromDrive: creating drive connector");
            var drive = google.drive({
                version: "v3",
                auth: this.oAuth2Client,
            });
            console.log("getFileFromDrive: getting file");
            let buf = [];
            const res = yield drive.files.get({ fileId: fileId, alt: "media", }, { responseType: "stream" });
            console.log("getFileFromDrive: reading file");
            yield new Promise((resolve, reject) => {
                res.data
                    .on("end", () => {
                    console.log(`End of reading the file`);
                    resolve();
                })
                    .on("error", (err) => {
                    reject(`Cannot create file ${err}`);
                })
                    .on("data", (chunk) => {
                    buf.push(chunk);
                });
            });
            const buffer = Buffer.concat(buf);
            return buffer.toString();
        });
    }
    putFile(contents, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var drive = google.drive({
                    version: "v3",
                    auth: this.oAuth2Client,
                });
                const fileMetadata = {
                    name: fileName,
                    parents: [this.driveFolder],
                };
                const media = {
                    mimeType: 'application/octet-stream',
                    body: contents,
                };
                const file = yield drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id',
                });
                console.log('File Id:', file.data.id);
                return file.data.id;
            }
            catch (err) {
                console.error('Error uploading file:', err);
            }
            return null;
        });
    }
}
exports.GoogleDriveHelper = GoogleDriveHelper;
;
