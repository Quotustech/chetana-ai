import dotenv from "dotenv";
dotenv.config();
import kue from "kue";

const redisHost = process.env.REDIS_HOST;

const queue = kue.createQueue({
  prefix: "queue",
  redis: {
    host:  redisHost, 
    // "redis", //127.0.0.1
    port: 6379,
  },
});

export default queue;
