import { RequestHandler } from 'express';
import CRS from 'crypto-random-string';
import validator from 'validator';
import Error from '../utils/error-handler';
import ApiService from './service';
import {RedisData} from "../types/redis";

const { API_VERSION } = process.env;

class ApiController {
    
    createLink: RequestHandler = async (req, res) => {
        try {
            const { link } = req.body;
            if (!validator.isURL(link)) {
                throw new Error('Please provide a valid URL');
            }
            const randomUniqueLink = CRS({ length: 5 });
            await ApiService.setValue(API_VERSION!, randomUniqueLink, {link, date: new Date()});
            return res.status(200).send({ shortLink: randomUniqueLink });
        } catch (error) {
            return res.status(400).send(error);
        }        
    }

    redirectLink: RequestHandler = async (req, res) => {
        try {
            const { url } = req.params;
            const redisResponse: RedisData = await ApiService.getValue(API_VERSION!, url);
            if (!redisResponse) {
                throw new Error('Couldn\'t find any URL under the provided link');
            }
            let foundLink = redisResponse.link;
            if (!/http:\/\/|https:\/\//gi.test(foundLink)) {
                foundLink = `https://${foundLink}`;
            }
            return res.status(301).redirect(`${foundLink}`);
        } catch (error) {
            console.log(error)
            return res.status(400).send(error);
        }
    }
}

export default (new ApiController());