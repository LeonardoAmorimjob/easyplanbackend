import Bee from 'bee-queue';
import EmailCancelado from '../Aplicacao/trabalhos/EmailCancelado';
import redisConfig from '../Config/redis';

const trabalhos = [EmailCancelado];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    trabalhos.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, trabalho) {
    return this.queues[queue].bee.createJob(trabalho).save();
  }

  processQueue() {
    trabalhos.forEach((trabalho) => {
      const { bee, handle } = this.queues[trabalho.key];
      bee.on('falied', this.handleFailure).process(handle);
    });
  }

  handleFailure(trabalho, err) {
    console.log(`Queue ${trabalho.queue.nome}:FALIED`, err);
  }
}
export default new Queue();
