import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";



import { poolRoutes } from "./routes/pool";
import { authRoutes } from "./routes/auth";
import { guessRoutes } from "./routes/guess";
import { gameRoutes } from "./routes/game";
import { userRoutes } from "./routes/user";
import { ZodError } from "zod";


async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {    
    origin: true,
  });
  
  fastify.setErrorHandler((err, req, res) => {
    if (err instanceof ZodError){
      const mappedErrors = err.errors.map((zodError) => {
        if(zodError.path.length === 0){
          return res.code(400).send(new Error('Body Vazio'))
        }
        return `${zodError.path[0]}: ${zodError.message}`
      })
      const joinedErrors = mappedErrors.join(', ')
      console.log(err)
      // return res.code(400).send(new Error(joinedErrors))
    }
  })
  // Em produção isso precisa ser uma variável ambiente

  await fastify.register(jwt,{
    secret: "nlwcopa",
  })

  await fastify.register(poolRoutes)
  await fastify.register(authRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(userRoutes)
 
  // http://localhost:3333/pools
  



  
  await fastify.listen({ port: 3333, host: "0.0.0.0"});
}

bootstrap();
