import {allowed,special} from './access.mjs';
import {privileged,student} from './accounts.mjs';
export const ticketManager=u=>allowed(u,'tickets')&&special(u,'ticketsManage')&&!student(u);
export const ticketVisible=(t,u)=>!!t&&allowed(u,'tickets')&&(privileged(u)||ticketManager(u)||t.assignees.includes(u.id)||t.readers.includes(u.id));
export const ticketWriter=(t,u)=>ticketVisible(t,u)&&allowed(u,'tickets','edit')&&!student(u)&&t.status!=='Archiviert'&&(ticketManager(u)||t.assignees.includes(u.id));
