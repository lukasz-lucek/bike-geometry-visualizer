"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const CLIENT_BUILD = "../../../client/build";
const CLIENT_ENTRY = `${CLIENT_BUILD}/index.html`;
const CLIENT_ROUTES = ['/', '/app', '/login', '/register'];
class ClientServer {
    constructor(app) {
        console.log(`starting ClientServer in ${__dirname}`);
        this.app = app;
    }
    addClientRoute(route) {
        this.app.get(route, (_, res) => {
            res.sendFile(path_1.default.join(__dirname, CLIENT_ENTRY), (err) => {
                res.status(500).send(err);
            });
        });
    }
    setup() {
        this.app.use(express_1.default.static(path_1.default.join(__dirname, CLIENT_BUILD)));
        CLIENT_ROUTES.forEach((route) => {
            this.addClientRoute(route);
        });
    }
}
exports.ClientServer = ClientServer;
;
