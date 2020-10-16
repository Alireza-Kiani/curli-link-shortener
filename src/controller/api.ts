import { raw, RequestHandler } from 'express';
// import CRS from 'crypto-random-string';
import validator from 'validator';
import Error from '../utils/error-handler';
// import ApiService from './service';
// import { RedisData } from '../@types/redis';
import fetch from 'node-fetch'

const { API_VERSION } = process.env;

class ApiController {
    
    createLink: RequestHandler = async (req, res) => {
        try {
            const { link } = req.body;
            if (!validator.isURL(link)) {
                throw new Error('Please provide a valid URL');
            }
            const raw_res_save = await fetch('http://curli.ir:8083/set', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    link
                }),
                redirect: 'follow'
            });
            const parsed_res = await raw_res_save.json();
            return res.status(200).send(parsed_res);
        } catch (error) {
            return res.status(400).send(error);
        }        
    }

    redirectLink: RequestHandler = async (req, res, next) => {
        try {
            const { url } = req.params;
            let foundLink: null | string = null;
            // New strategy
            const redis_raw_response = await fetch(`http://curli.ir:8083/${url}`);
            if (redis_raw_response.status === 200) {
                const parsed_redis_response = await redis_raw_response.json();
                foundLink = parsed_redis_response.originalLink;
            } else {
                const alternative_raw_response = await fetch(`http://curli:8081/${url}`);
                if (alternative_raw_response.status === 200) {
                    const parsed_alternative_response = await alternative_raw_response.json();
                    foundLink = parsed_alternative_response.originalLink;
                } else {
                    throw new Error('Couldn\'t find any URL under the provided link'); 
                }
            }
            if (!/http:\/\/|https:\/\//gi.test(foundLink!)) {
                foundLink = `https://${foundLink}`;
            }
            return res.status(301).redirect(`${foundLink}`);
        } catch (error) {
            console.log(error)
            // return res.status(400).send(error);
            return next();
        }
    }
}

export default (new ApiController());