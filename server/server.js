import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your_api_key_here'
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hello from Kraus!",
    });
});

app.post("/", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: "Prompt is required." });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred." });
    }
});

app.listen(5000, () => console.log("Server is running on port http://localhost:5000"));
