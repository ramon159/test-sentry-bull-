/* eslint-disable no-console */
import Queue from 'bull';
import redisConfig from '../../config/redis';

import * as jobs from '../jobs';

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find((obj) => obj.name === name);

    return queue.bull.add(data); // send to redis server the key: data
  },
  process() {
    this.queues.forEach((obj) => {
      obj.bull.process(obj.handle);

      obj.bull.on('failed', (job, err) => {
        console.log('job failed', obj.key, job.data);
        console.log(err);
      });
    });
  },
};
