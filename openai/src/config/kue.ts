import kue from "kue";

const queue = kue.createQueue({
  prefix: "queue",
  redis: {
    host: "redis", //127.0.0.1 //redis
    port: 6379,
  },
});

export default queue;
