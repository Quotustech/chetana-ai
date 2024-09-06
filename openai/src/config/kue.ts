import kue from "kue";

const queue = kue.createQueue({
  prefix: "queue",
  redis: {
    host:  "redis", 
    // "redis", //redis
    port: 6379,
  },
});

export default queue;
