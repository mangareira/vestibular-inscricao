import { Hono } from "hono";
import {zValidator} from "@hono/zod-validator"
import signUpSchema from "@/utils/schemas/signup.schema";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

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

export default app