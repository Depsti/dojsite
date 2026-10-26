import {Queue} from './queue.mjs';
import path from 'node:path';
const command=process.argv[2],dir=path.resolve(process.env.BOT_DATA_DIR||process.env.RAILWAY_VOLUME_MOUNT_PATH||'./data');
if(!['status','retry'].includes(command))throw Error('Verwendung: queue-admin.mjs status|retry');
const q=new Queue(dir);try{if(command==='retry'){q.retry();console.log('Blockierte Ereignisse sind wieder freigegeben.');}console.log(JSON.stringify(q.stats(),null,2));}finally{q.close();}
