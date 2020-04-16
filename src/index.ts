import os from 'os';
import cluster from 'cluster';
import app from './app';
import { connect } from  './database';

const init = async() => {
    await connect();
    app.listen(3000, () => {
        console.log('Listen...3000')
    });
};

//init();

const max = 2;
const CPUS = Math.min(max, os.cpus().length);
if (CPUS > 1) {
    switch (cluster.isMaster) {
        case true:
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
    init();
    // process.on('uncaughtException', () => {});
    // process.on('unhandledRejection', () => {});
}