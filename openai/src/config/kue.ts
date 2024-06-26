import kue from "kue";

const queue = kue.createQueue({
  prefix: "queue",
  redis: {
    host:  "127.0.0.1", 
    // "redis", //redis
    port: 6379,
  },
});

export default queue;
