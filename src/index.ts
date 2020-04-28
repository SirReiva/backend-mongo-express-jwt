import os from 'os';
import cluster from 'cluster';
import { connect } from  './database';
import figlet from 'figlet';
import config from './config';
import { server } from './app';

const isProd = process.env.NODE_ENV === 'production';

const init = async() => {
    await connect();
    server.listen(3000, () => {
        console.log('Listen...3000');
    });
};

const activeCluster = false;
const max = 2;
const CPUS = Math.min(max, os.cpus().length);
if (CPUS > 1 && activeCluster) {
    switch (cluster.isMaster) {
        case true:
            cluster.schedulingPolicy = cluster.SCHED_RR;// round-robin
            figlet(config.PROJECT_NAME, (err, result) => console.log(result));
            if (isProd) console.log('Producction Mode');
            console.log('Cluster Mode');
            for (let i = 0; i < CPUS; i++) { //Forge New process for Cpu
                cluster.fork();
            }
            // process.on("SIGHUP", function () {//for nodemon
            //     for (const worker of Object.values(cluster.workers)) {
            //         worker?.process.kill("SIGTERM");
            //     }
            // });
            cluster.on('online', function(worker) {
                console.log('Worker ' + worker.process.pid + ' is listening');
            });
            cluster.on("exit", function(worker) {
                console.log("Worker", worker.id, " has exitted.");
                //cluster.fork();
            });
            // process.on('uncaughtException', () => {});
            // process.on('unhandledRejection', () => {});
        break;
        default:
            init();
        break;
    }
} else {
    figlet(config.PROJECT_NAME, (err, result) => console.log(result));
    if (isProd) console.log('Producction Mode');
    init();
    // process.on('uncaughtException', () => {});
    // process.on('unhandledRejection', () => {});
}