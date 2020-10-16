import fetch from 'node-fetch';
import { Set, Get } from '../@types/response';

const { API_VERSION } = process.env;

class ApiService {

    async set(link: string): Promise<Set> {
        const raw_res_save = await fetch(`http://curli.ir:8083/api/v${API_VERSION}/set`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                link
            }),
            redirect: 'follow'
        });
        const parsed_res: Set = await raw_res_save.json();
        return parsed_res;
    }

    async getRedis(url: string): Promise<Get> {
        const redis_raw_response = await fetch(`http://curli.ir:8083/api/v${API_VERSION}/${url}`);
        const parsed_redis_response = await redis_raw_response.json();
        return { 
            originalLink: parsed_redis_response.originalLink,
            statusCode: redis_raw_response.status
        } as Get;
    }

    async getDb(url: string): Promise<Get> {
        const alternative_raw_response = await fetch(`http://curli:8081/${url}`);
        const parsed_alternative_response = await alternative_raw_response.json();
        return {
            originalLink: parsed_alternative_response.originalLink,
            statusCode: alternative_raw_response.status
        } as Get;
    }

}

export default (new ApiService());