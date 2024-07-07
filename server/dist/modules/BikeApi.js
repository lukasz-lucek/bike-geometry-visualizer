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
exports.BikeApi = void 0;
const express_validator_1 = require("express-validator");
const GeometryState_1 = __importDefault(require("../models/GeometryState"));
const passport_1 = __importDefault(require("passport"));
const GoogleDriveHelper_1 = require("./GoogleDriveHelper");
const mongoose_1 = __importDefault(require("mongoose"));
class BikeApi {
    constructor(app) {
        this.app = app;
        //this.s3 = new S3();
        if (!process.env.CYCLIC_BUCKET_NAME) {
            console.log('S3 Bucket name missing in .env file - exiting');
            process.exit(1);
        }
        this.bucketName = process.env.CYCLIC_BUCKET_NAME;
    }
    createBikeQuery(query, reqUser) {
        const user = reqUser;
        return { $or: [Object.assign(Object.assign({}, query), { user: user.username }), Object.assign(Object.assign({}, query), { isPublic: true })] };
    }
    combineQueriesAnd(queryOne, queryTwo) {
        if (queryOne && queryTwo) {
            return { $and: [queryOne, queryTwo] };
        }
        else if (queryOne) {
            return queryOne;
        }
        else if (queryTwo) {
            return queryTwo;
        }
        return {};
    }
    setup() {
        this.app.post('/api/bike', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bikeData = req.body;
            // prevent blockade of overwriting id by mongoose
            delete bikeData._id;
            if (!req.user) {
                console.log('unkonwn user - probably something fishy is going on - passport should have handled that');
                return res.status(403).send('Unknown user');
            }
            if (!(bikeData.data)) {
                return res.status(400).send('Bad request - empty data of geometry');
            }
            const user = req.user;
            bikeData.user = user.username;
            if (!user.isAdmin) {
                bikeData.isPublic = false;
            }
            if (!bikeData.data.selectedFileHash) {
                console.log('bad data - no immage hash attached to request');
                return res.status(400).send('bike image hash is missing');
            }
            const filePath = `${bikeData.data.selectedFileHash}`;
            const driveHelper = GoogleDriveHelper_1.GoogleDriveHelper.getInstance();
            const fileId = yield driveHelper.getFileId(filePath);
            if (!fileId) {
                if (!bikeData.data.selectedFile) {
                    console.log('bad data - no immage attached to request, while hash is unkown');
                    return res.status(400).send('bike image is missing, and was never uploaded');
                }
                yield driveHelper.putFile(bikeData.data.selectedFile, filePath);
            }
            console.log('adding geometry to database');
            bikeData.data.selectedFile = '';
            try {
                yield GeometryState_1.default.create(bikeData).then(document => {
                    console.log('geometry added to database' + document);
                    res.status(201).location(`/api/bike?id=${document._id}&withImage=true`).send(document._id);
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    const message = `save bike err: ${error.message}`;
                    console.log(message);
                    return res.status(500).send(message);
                }
                else {
                    const message = `save bike err: ${typeof (error)}`;
                    console.log(message);
                    return res.status(500).send(message);
                }
            }
        }));
        this.app.put('/api/bike', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('id').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bikeData = req.body;
            if (req.query && req.query.id) {
                bikeData._id = req.query.id;
            }
            if (!bikeData._id) {
                console.log('unknown data id - cannot update');
                return res.status(400).send('unknown data id - cannot update');
            }
            if (!(bikeData.data)) {
                console.log('unknown data - cannot update');
                return res.status(400).send('unknown data - cannot update');
            }
            if (!req.user) {
                console.log('unkonwn user - probably something fishy is going on - passport should have handled that');
                return res.status(403).send('Unknown user');
            }
            const user = req.user;
            const storedBike = yield GeometryState_1.default.findOne({ _id: bikeData._id }).select({
                user: 1,
            });
            if (!((storedBike === null || storedBike === void 0 ? void 0 : storedBike.user) === user.username)) {
                return res.status(403).send('this is not your bike - cannot save changes - make a copy first');
            }
            bikeData.user = user.username;
            if (!user.isAdmin) {
                bikeData.isPublic = false;
            }
            if (!bikeData.data.selectedFileHash) {
                console.log('bad data - no immage hash attached to request');
                return res.status(400).send('bike image hash is missing');
            }
            const filePath = `${bikeData.data.selectedFileHash}`;
            const driveHelper = GoogleDriveHelper_1.GoogleDriveHelper.getInstance();
            const fileId = yield driveHelper.getFileId(filePath);
            if (!fileId) {
                if (!bikeData.data.selectedFile) {
                    console.log('bad data - no immage attached to request, while hash is unkown');
                    return res.status(400).send('bike image is missing, and was never uploaded');
                }
                yield driveHelper.putFile(bikeData.data.selectedFile, filePath);
            }
            console.log('updating geometry in database');
            bikeData.data.selectedFile = '';
            try {
                yield GeometryState_1.default.replaceOne({ _id: bikeData._id }, bikeData).then(document => {
                    console.log('geometry updated in database' + document);
                    res.status(200).location(`/api/bike?id=${document.upsertedId}&withImage=true`).send(document.upsertedId);
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    const message = `save bike err: ${error.message}`;
                    console.log(message);
                    return res.status(500).send(message);
                }
                else {
                    const message = `save bike err: ${typeof (error)}`;
                    console.log(message);
                    return res.status(500).send(message);
                }
            }
        }));
        this.app.delete('/api/bike', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('id').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query || !req.query.id) {
                res.status(400).send('invalid query - need to provide id');
                return;
            }
            GeometryState_1.default.deleteOne({ _id: req.query.id }).then(result => {
                res.status(200).send("deleted");
            }).catch(err => {
                res.status(500).send("could not delete");
            });
        }));
        this.app.get('/api/makes', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('search').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            let findQuery = null;
            if (req.query && req.query.search) {
                findQuery = {
                    make: new RegExp(".*" + req.query.search + ".*")
                };
            }
            GeometryState_1.default.collection.distinct('make', this.createBikeQuery(findQuery, req.user)).then((values) => {
                res.json(values);
            }).catch((err) => {
                res.status(500).send(`unable to fetch makes: ${err}`);
            });
        }));
        this.app.get('/api/models', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('make').escape().isLength({ min: 0, max: 50 }), (0, express_validator_1.query)('search').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('get models: ' + (((_a = req.query) === null || _a === void 0 ? void 0 : _a.search) ? req.query.search : ''));
            let findQuery = null;
            if (req.query && (req.query.search || req.query.make)) {
                findQuery = Object.assign(Object.assign({}, (req.query.make && { make: req.query.make })), (req.query.search && { model: new RegExp(".*" + req.query.search + ".*") }));
            }
            GeometryState_1.default.collection.distinct('model', this.createBikeQuery(findQuery, req.user)).then((values) => {
                res.json(values);
            }).catch((err) => {
                res.status(500).send(`unable to fetch makes: ${err}`);
            });
        }));
        this.app.get('/api/years', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('make').escape().isLength({ min: 0, max: 50 }), (0, express_validator_1.query)('model').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            let findQuery = null;
            if (req.query && (req.query.search || req.query.make)) {
                findQuery = Object.assign(Object.assign({}, (req.query.make && { make: req.query.make })), (req.query.model && { model: req.query.model }));
            }
            GeometryState_1.default.collection.distinct('year', this.createBikeQuery(findQuery, req.user)).then((values) => {
                res.json(values);
            }).catch((err) => {
                res.status(500).send(`unable to fetch years: ${err}`);
            });
        }));
        this.app.get('/api/bikes', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('model').escape().isLength({ min: 0, max: 50 }), (0, express_validator_1.query)('make').escape().isLength({ min: 0, max: 50 }), (0, express_validator_1.query)('year').escape().isNumeric(), (0, express_validator_1.query)('search').escape().isString().isLength({ min: 1, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d, _e, _f;
            const searchQuery = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.search) ? { $text: { $search: (_c = req.query) === null || _c === void 0 ? void 0 : _c.search } } : null;
            const findQuery = this.createBikeQuery(Object.assign(Object.assign(Object.assign({}, (((_d = req.query) === null || _d === void 0 ? void 0 : _d.model) && { model: new RegExp(".*" + req.query.model + ".*") })), (((_e = req.query) === null || _e === void 0 ? void 0 : _e.make) && { make: new RegExp(".*" + req.query.make + ".*") })), (((_f = req.query) === null || _f === void 0 ? void 0 : _f.year) && { year: req.query.year })), req.user);
            const combinedQuery = this.combineQueriesAnd(searchQuery, findQuery);
            //const finalQuerry = combinedQuery, req.user!);
            console.log(combinedQuery);
            const bikes = yield GeometryState_1.default.find(combinedQuery).select({
                make: 1,
                model: 1,
                year: 1,
                user: 1,
                isPublic: 1,
            });
            if (bikes) {
                res.json(bikes);
            }
            else {
                res.send("No bikes for you my frined");
            }
        }));
        this.app.get('/api/bike', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('id').escape().isLength({ min: 0, max: 50 }), (0, express_validator_1.query)('withImage').escape().isBoolean(), (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query || !req.query.id) {
                res.status(400).send("no id was provided");
                return;
            }
            GeometryState_1.default.findById(req.query.id).then(bike => {
                if (!bike || !(bike.data)) {
                    return res.status(404).send("bike not found");
                }
                if (req.query.withImage) {
                    const filePath = `${bike.data.selectedFileHash}`;
                    const driveHelper = GoogleDriveHelper_1.GoogleDriveHelper.getInstance();
                    driveHelper.getFileId(filePath).then(fileId => {
                        if (!fileId) {
                            res.status(404).send("bike image not found");
                            return;
                        }
                        driveHelper.getFileFromDrive(fileId).then(file => {
                            bike.data.selectedFile = file;
                            res.json(bike);
                        }).catch(err => {
                            res.status(404).send("bike image not readable");
                        }).catch(err => {
                            res.status(404).send("bike image not found");
                        });
                    });
                }
                else {
                    res.json(bike);
                }
            }).catch(err => {
                res.status(404).send("bike not found");
            });
        }));
        this.app.get('/api/bike/copy', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('id').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query || !req.query.id) {
                res.status(400).send("no id was provided");
                return;
            }
            GeometryState_1.default.findById(req.query.id).then((bike) => __awaiter(this, void 0, void 0, function* () {
                if (!bike || !(bike.data)) {
                    return res.status(404).send("bike not found");
                }
                const user = req.user;
                const storedBike = yield GeometryState_1.default.findOne({
                    make: bike.make,
                    model: bike.model,
                    year: bike.year,
                    user: user.username
                }).select({
                    _id: 1,
                });
                if (storedBike) {
                    return res.status(200).location(`/api/bike?id=${storedBike._id}&withImage=true`).send(storedBike._id);
                }
                const bikeData = bike;
                // prevent blockade of overwriting id by mongoose
                bikeData._id = new mongoose_1.default.Types.ObjectId().toString();
                bikeData.isNew = true;
                bikeData.user = user.username;
                if (!user.isAdmin) {
                    bikeData.isPublic = false;
                }
                console.log('adding geometry to database');
                bikeData.data.selectedFile = '';
                try {
                    GeometryState_1.default.create(bikeData).then(document => {
                        console.log('geometry added to database' + document);
                        res.status(201).location(`/api/bike?id=${document._id}&withImage=true`).send(document._id);
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        const message = `save bike err: ${error.message}`;
                        console.log(message);
                        return res.status(500).send(message);
                    }
                    else {
                        const message = `save bike err: ${typeof (error)}`;
                        console.log(message);
                        return res.status(500).send(message);
                    }
                }
            })).catch(err => {
                res.status(404).send("bike not found");
            });
        }));
        this.app.get('/api/bikeImage', passport_1.default.authenticate('jwt', { session: false }), (0, express_validator_1.query)('id').escape().isLength({ min: 0, max: 50 }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query || !req.query.id) {
                res.status(400).send("no id was provided");
                return;
            }
            GeometryState_1.default.findById(req.query.id).select({ "data.selectedFileHash": 1 }).then(bike => {
                if (!bike || !(bike.data)) {
                    return res.status(404).send("bike not found");
                }
                const filePath = `${bike.data.selectedFileHash}`;
                const driveHelper = GoogleDriveHelper_1.GoogleDriveHelper.getInstance();
                driveHelper.getFileId(filePath).then(fileId => {
                    if (!fileId) {
                        res.status(404).send("bike image not found");
                        return;
                    }
                    driveHelper.getFileFromDrive(fileId).then(file => {
                        res.send(file);
                    }).catch(err => {
                        res.status(404).send("bike image not readable");
                    });
                }).catch(err => {
                    res.status(404).send("bike not found");
                });
            }).catch(err => {
                res.status(404).send("bike not found");
            });
        }));
    }
}
exports.BikeApi = BikeApi;
;
