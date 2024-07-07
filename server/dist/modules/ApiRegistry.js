"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRegistry = void 0;
const BikeApi_1 = require("./BikeApi");
const AuthorizationApi_1 = require("./AuthorizationApi");
const GoogleDriveApiWrapper_1 = require("./GoogleDriveApiWrapper");
class ApiRegistry {
    constructor(app) {
        this.app = app;
        this.authorizationApi = new AuthorizationApi_1.AuthorizationApi(this.app);
        this.bikeApi = new BikeApi_1.BikeApi(this.app);
        this.googleDriveApiWrapper = new GoogleDriveApiWrapper_1.GoogleDriveApiWrapper(this.app);
    }
    setup() {
        this.authorizationApi.setup();
        this.bikeApi.setup();
        this.googleDriveApiWrapper.setup();
    }
}
exports.ApiRegistry = ApiRegistry;
;
