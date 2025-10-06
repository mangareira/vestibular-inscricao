import { Hono } from "hono";
import {zValidator} from "@hono/zod-validator"
import signUpSchema from "@/utils/schemas/signup.schema";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import loginSchema from "@/utils/schemas/login.schema";

const app = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      signUpSchema.omit({"confirmPassword": true})
    ),
    async (c) => {
      const form = c.req.valid("json")

      const hashPassword = await hash(form.password, 2)

      const user = await prisma.user.create({
        data: {...form, password: hashPassword}
      })

      c.status(201)

      return c.json(user)
    }
  )
  .post(
    "/login",
    zValidator(
      "json",
      loginSchema,
    ),
    async (c) => {
      const values = c.req.valid("json")

      const user = await prisma.user.findUnique({
        where: {
          email: values.email
        }
      })

      if(!user) {
        c.status(404)
        return c.json({message: "Usuario não encontrado"})
      }

      const isEqual = await compare(values.password, user.password)

      if(!isEqual) {
        c.status(404)
        return c.json({message: "Email ou senha incorreto"})  
      }
      
      c.status(200)

      return c.json({message: "login realizado com sucesso"})
    }
  )

export default app