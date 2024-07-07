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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ClientServer_1 = require("./modules/ClientServer");
const ApiRegistry_1 = require("./modules/ApiRegistry");
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default.set('strictQuery', false);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_URI) {
            console.log("MONGO_URI environment variable not specified - cannot run - exiting");
            process.exit(1);
        }
        const conn = yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
const environment = process.env.NODE_ENV || 'development';
const whitelist = environment === 'development' ? ['http://localhost:3000'] : [];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        console.log("whitelisted domain");
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use((0, cors_1.default)(corsOptionsDelegate));
console.log(`starting server in ${__dirname}`);
// app.use(express.static(path.join(__dirname, "../../client/build")));
app.use(express_1.default.json({ limit: '5mb' }));
// app.use(express.bodyParser({limit: '50mb'}));
const clientServer = new ClientServer_1.ClientServer(app);
const apiRegistry = new ApiRegistry_1.ApiRegistry(app);
clientServer.setup();
apiRegistry.setup();
const PORT = process.env.PORT || 3001;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});
