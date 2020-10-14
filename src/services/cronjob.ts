import {CronJob} from "cron";
import Redis from "./redis";
import fetch from "node-fetch";

const cron = new CronJob("0 0 0 * * */6", async () => {
    const response = await Redis.hgetall();
    let date: Date = new Date();
    date.setDate(date.getDate() - 7);
    const targetDate: number = date.getTime()


    for (let data in response) {
        const link = await JSON.parse(response[data]);
        const parsedDate = new Date(link.date).getTime();

        if (targetDate >= parsedDate){
            const response = await fetch("http://curli.ir:8081/", {
                method: "Post",
                body: JSON.stringify({
                    "shortLink": data,
                    "link": link.link,
                    "date": link.date
                }),
                headers: {
                    "Content-Type": "Application/json"
                }
            })

            if(response.status == 200) {
                await Redis.hdel(data);
            }
        }
    }
});



cron.start();