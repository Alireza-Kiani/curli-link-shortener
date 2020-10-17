import { RequestHandler } from 'express';
import validator from 'validator';
import fetch from 'node-fetch';
import Error from '../utils/error-handler';
import ApiService from './service';

const { API_VERSION } = process.env;

class ApiController {
    
    createLink: RequestHandler = async (req, res) => {
        try {
            const { link } = req.body;
            if (!validator.isURL(link)) {
                throw new Error('Please provide a valid URL');
            }
            const parsed_res = await ApiService.set(link);
            return res.status(200).send(parsed_res);
        } catch (error) {
            return res.status(400).send(error);
        }        
    }

    redirectLink: RequestHandler = async (req, res, next) => {
        try {
            const { url } = req.params;
            let foundLink: null | string = null;
            const redis_response = await ApiService.getRedis(url);
            if (redis_response.statusCode === 200) {
                foundLink = redis_response.originalLink;
            } else {
                const db_response = await ApiService.getDb(url);
                if (db_response.statusCode === 200) {
                    foundLink = db_response.originalLink;
                } else {
                    throw new Error('Couldn\'t find any URL under the provided link'); 
                }
            }
            if (!/http:\/\/|https:\/\//gi.test(foundLink!)) {
                foundLink = `https://${foundLink}`;
            }
            await fetch(`http://curli.ir:8082/api/v${API_VERSION}/saveLink`, {
                method: 'POST',
                body: JSON.stringify({
                    ip: req.ip,
                    useragent: req.useragent,
                    link: url
                }),
                headers: {
                    'content-type': 'application/json'
                },
                redirect: 'follow'
            });
            return res.status(301).redirect(`${foundLink}`);
        } catch (error) {
            console.log(error)
            return next();
        }
    }
}

export default (new ApiController());