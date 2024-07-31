import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
    try {
        const apiData = await getAPI();
        console.log(apiData);
        res.send(apiData);
    } catch (error: any) {
        res.status(500).send(`Error fetching data from API: ${error.message}`);
    }
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

async function getAPI(): Promise<string> {
    try {
        const API_KEY = process.env.API_KEY
        if (!API_KEY) {
            throw new Error("API_KEY not found in environment variables.");
        }
        const response = await axios.get(`https://open.faceit.com/data/v4/organizers/${process.env.ORGANIZER_ID}/championships`, {
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
        } else {
            console.error(`Failed to fetch data. Status: ${response.status}`);
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
    } catch (error: any) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
        }
        console.error(`Error fetching data from api: ${error.message}`);
        throw error;
    }
};