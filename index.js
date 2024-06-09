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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiData = yield getAPI();
        console.log(apiData);
        res.send(apiData);
    }
    catch (error) {
        res.status(500).send(`Error fetching data from API: ${error.message}`);
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
function getAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const API_KEY = process.env.API_KEY;
            if (!API_KEY) {
                throw new Error("API_KEY not found in environment variables.");
            }
            const response = yield axios_1.default.get(`https://open.faceit.com/data/v4/organizers/${process.env.ORGANIZER_ID}/championships`, {
                params: {
                    game: 'ow2',
                    limit: '40'
                },
                headers: {
                    Authorization: `Bearer ${API_KEY}`
                },
            });
            if (response.status === 200) {
                const data = response.data;
                return data;
            }
            else {
                console.error(`Failed to fetch data. Status: ${response.status}`);
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
        }
        catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error('Request timed out');
            }
            console.error(`Error fetching data from api: ${error.message}`);
            throw error;
        }
    });
}
;
// async function getTournamentName(): promise<string> {
// }
