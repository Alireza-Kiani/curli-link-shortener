import Redis from '../services/redis';
import {RedisData} from "../types/redis";

class ApiService {
    
    async getValue(hkey: string, key: string): Promise<RedisData> {
        return await Redis.hget(hkey, key);
    }
    
    async setValue(hkey: string, key: string, value: RedisData): Promise<void> {
        await Redis.hset(hkey, key, value);
    }
}


export default (new ApiService());