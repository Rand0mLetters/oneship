import express from 'express';
const app = express();
import cors from 'cors';
import { getInfocusNews, getPublication } from './getNews.js';
import { getCalendar, getScheduleForDay } from './getCalendar.js';
import { DEFAULT_SETTINGS, createMessage, getMessagesForUser, readData, writeData } from './db.js';
import { checkForBadData, getTodayInFunnyFormat } from './util.js';
import { loginUser } from './auth.js';

app.use(cors());

app.get("/version", (_, response) => {
    // look at me using semver
    // correctly
    response.status(200).send({
        current: "0.0.0",
        min: "0.0.0",
        alpha: "0.0.1-alpha",
        beta: "0.0.1-beta",
        server: "0.0.1-alpha"
    });
});

const getNews = async () => {
    const palyVoice = await getPublication("https://palyvoice.com/?s=");
    const cMag = await getPublication("https://cmagazine.org/?s=");
    const vikingMag = await getPublication("https://vikingsportsmag.com/?s=");
    const verde = await getPublication("https://verdemagazine.com/?s=", "C Magazine");
    const infocus = await getInfocusNews();
    return [
        { title: "Verde", articles: verde },
        { title: "Viking Magazine", articles: vikingMag },
        { title: "C Magazine", articles: cMag },
        { title: "Paly Voice", articles: palyVoice },
        { title: "InFocus", articles: infocus }
    ];
}

app.get('/api/news', async (_, response) => {
    const data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return response.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    response.status(200).send(data.data().news);
});

app.get('/api/schedule/:day', async (request, response) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return response.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    response.status(200).send(data.data().schedule);
});

app.get('/api/calendar', async (_, response) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return response.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    response.status(200).send(data.data().calendar);
});

// called by frontend on startup
// just throw all the data at the app
app.get('/api/startup', async (_, response) => {
    try{
        var data = await readData("app", "daily");
        var invalid = checkForBadData(data);
        if(invalid) return response.status(409).send({
            error: "Data not in expected state",
            message: invalid
        });
        data = data.data();
        console.log("sending startup data");
        console.log("calendar: " + data.calendar.length + " events" + " | schedule: " + data.schedule.value.length + " periods" + " | news: " + data.news.length + " publications");
        console.log("data lastUpdate: " + data.lastUpdate + " | today: " + getTodayInFunnyFormat());
        response.status(200).send(data);
    }catch(e){
        console.log(e);
        console.log("error sending startup data");
        response.status(500).send({ error: e });
    }
});

// called by https://uptimerobot.com every 12h at 6am + 6pm
// I didn't want to wake up at 5am and set the interval to 24h
app.use('/api/poll', async (_, response) => {
    await startServerToday();
    response.status(200).send({ status: "ok" });
});

app.post("/api/register", express.json(), async (request, response) => {
    // TODO: require token
    const body = request.body;
    console.log(body);
    const email = body.email;
    const displayName = body.displayName;
    const uid = body.uid;
    const pfp = body.pfp;
    if(email == null || displayName == null || uid == null) return response.status(400).send({ error: "Missing required fields" });
    if(email.split("@")[1] != "pausd.us") return response.status(403).send({ error: "Email must be a PAUSD email" });
    console.log("received request to register user " + uid + " with email " + email + " and display name " + displayName + "");
    var obj = {
        email,
        displayName,
        uid,
        pfp,
        ...DEFAULT_SETTINGS
    };
    await writeData("users", uid, obj);
    response.status(200).send(obj);
});

app.post("/api/login", async (request, response) => {
    const email = request.query.email;
    const password = request.query.password;
    if(email == null || password == null) return response.status(400).send({ error: "Missing required fields" });
    console.log("logging in user " + email + " with password " + password);
    const result = await loginUser(email, password);
    if(result.status == 200){
        const userData = await readData("users", result.message.localId);
        const messages = await getMessagesForUser(result.message.localId);
        if(userData.exists){
            response.status(200).send({
                data: userData.data(),
                messages,
                token: result.idToken,
                refreshToken: result.refreshToken
            });
        }else{
            response.status(500).send({
                error: "User with id " + result.message.localId + " does not exist in the database",
            });
        }
    }else{
        response.status(result.status).send({
            error: result.message,
        });
    }
});

app.post("/api/create-message", async (request, response) => {
    const body = request.body;
    const result = await createMessage(body);
    response.status(result.status).send(result.message);
});

app.get('/', (_, response) => {
    response.status(200).send("Server status: runnning");
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});

const startServerToday = async () => {
    // get all data needed for app startup
    var calendar = await getCalendar();
    var today = getTodayInFunnyFormat();
    var schedule = await getScheduleForDay("20230411");
    var news = await getNews();
    var data = {
        lastUpdate: getTodayInFunnyFormat(),
        calendar: calendar,
        schedule: { date: today, value: schedule },
        news: news
    };

    // write data to firestore
    await writeData("app", "daily", data);
}

export default app;