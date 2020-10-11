import Redis from '../services/redis';

class ApiService {
    
    async getValue(hkey: string, key: string): Promise<string> {
        const redis_response: string = await Redis.hget(hkey, key);
        return redis_response;
    }
    
    async setValue(hkey: string, key: string, value: any): Promise<void> {
        Redis.hset(hkey, key, value);
    }
}


export default (new ApiService());