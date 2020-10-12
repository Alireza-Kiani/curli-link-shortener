import { RedisClient } from 'redis';
import { promisify } from 'util';
import {RedisData} from "../types/redis";

class AsyncRedis extends RedisClient {
    public readonly hgetAsync = promisify(this.hget).bind(this);
    public readonly hsetAsync = promisify(this.hset).bind(this);
    public readonly quitAsync = promisify(this.quit).bind(this);
}

class Redis {
    private _async_redis_connection: AsyncRedis;
    constructor() {
        const { REDIS_HOST, REDIS_PASSWORD } = process.env;
        this._async_redis_connection = new AsyncRedis({
            host: REDIS_HOST,
            password: REDIS_PASSWORD
        });
    }

    public async hget(hkey: string, key: string): Promise<RedisData> {
        const savedValue = await this._async_redis_connection.hgetAsync(hkey, key);
        return JSON.parse(savedValue);
    }
    
    public async hset(hkey: string, key: string, input: RedisData): Promise<void> {
        const value = JSON.stringify(input);
        await this._async_redis_connection.hsetAsync([hkey, key, value]);
    }
}

export default (new Redis());