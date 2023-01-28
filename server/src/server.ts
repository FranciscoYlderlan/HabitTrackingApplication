import Fastify from "fastify";
import  cors  from '@fastify/cors';
import { appRoutes } from "./routes";

const port = 3333;
const host = '0.0.0.0'

const app =  Fastify();

app.register(cors);
app.register(appRoutes);

app.listen({ host, port })
.then(() => console.log(`HTTP Server is Running on \nhttp://${host}:${port}`))
