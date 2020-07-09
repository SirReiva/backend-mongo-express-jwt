import config from '@Config/index';
import figlet from 'figlet';
import { server } from './app';
import { connect } from './database';
import mongoose from 'mongoose';
import { Server } from 'http';

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

export const init = (): Promise<{
    server: Server;
    mongo: typeof mongoose;
    disconnect: () => Promise<void>;
}> => {
    return new Promise(async (res, rej) => {
        console.log('Mode: ', process.env.NODE_ENV || 'DEV');
        figlet(config.PROJECT_NAME, (_err, result) => console.log(result));
        let mongo: typeof mongoose;
        try {
            mongo = await connect();
        } catch (error) {
            rej(error);
        }
        const disconnect = (): Promise<void> => {
            return new Promise((r, rj) => {
                server.close(async (err) => {
                    try {
                        await mongo.disconnect();
                        if (err) return rj(err);
                        r();
                    } catch (error) {
                        rj(error);
                    }
                });
            });
        };
        server.listen(3000, () => {
            console.log('Listen on port: ', 3000);
            res({ server, mongo, disconnect });
        });
    });
};

if (!isTest) init();

// const activeCluster = false;
// const max = 2;
// const CPUS = Math.min(max, os.cpus().length);
// if (CPUS > 1 && activeCluster) {
//     switch (cluster.isMaster) {
//         case true:
//             cluster.schedulingPolicy = cluster.SCHED_RR; // round-robin
//             figlet(config.PROJECT_NAME, (_err, result) => console.log(result));
//             if (isProd) console.log('Producction Mode');
//             console.log('Cluster Mode');
//             for (let i = 0; i < CPUS; i++) {
//                 //Forge New process for Cpu
//                 cluster.fork();
//             }
//             // process.on("SIGHUP", function () {//for nodemon
//             //     for (const worker of Object.values(cluster.workers)) {
//             //         worker?.process.kill("SIGTERM");
//             //     }
//             // });
//             cluster.on('online', function (worker) {
//                 console.log('Worker ' + worker.process.pid + ' is listening');
//             });
//             cluster.on('exit', function (worker) {
//                 console.log('Worker', worker.id, ' has exitted.');
//                 //cluster.fork();
//             });
//             // process.on('uncaughtException', () => {});
//             // process.on('unhandledRejection', () => {});
//             break;
//         default:
//             init();
//             break;
//     }
// } else {
//     figlet(config.PROJECT_NAME, (_err, result) => console.log(result));
//     if (isProd) console.log('Producction Mode');
//     init();
//     // process.on('uncaughtException', () => {});
//     // process.on('unhandledRejection', () => {});
// }
