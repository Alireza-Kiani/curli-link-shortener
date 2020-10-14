import {RedisClient} from 'redis';
import {promisify} from 'util';
import {RedisData} from "../@types/redis";

class AsyncRedis extends RedisClient {
    public readonly hgetAsync = promisify(this.hget).bind(this);
    public readonly hsetAsync = promisify(this.hset).bind(this);
    public readonly hgetallAsync = promisify(this.hgetall).bind(this);
    public readonly hdelAsync = (hkey: string, key: string): any => {
        return new Promise((resolve, reject) => {
            this.hdel(hkey, key, (err: any, success: any) => {
                if (err) {
                    reject(err);
                }
                resolve(success);
            });
        });
    }
}


class Redis {
    private _async_redis_connection: AsyncRedis;
    private API_VERSION: string;

    constructor() {
        this.API_VERSION = process.env.API_VERSION!;
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

    public async hgetall(): Promise<any> {
        return await this._async_redis_connection.hgetallAsync(this.API_VERSION);
    }

    public async hdel(key: any): Promise<void> {
        await this._async_redis_connection.hdelAsync(this.API_VERSION, key);
    }
}

export default (new Redis());