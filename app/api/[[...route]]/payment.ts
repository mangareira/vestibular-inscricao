import { Course } from "@/app/generated/prisma";
import api from "@/lib/api";
import prisma from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

interface ErrorResponse {
  message: string;
  error?: string;
}

interface SuccessResponse {
  message: string;
  course: Course;
  payments: Course[]
}

const app = new Hono()
  .post(
    "/create",
    zValidator("json", z.object({
      paymentForm: z.enum(["pix", "boleto"]),
      course_name: z.string()
    })),
    zValidator("cookie", z.object({
      id: z.uuid()
    })),
    async (c) => {

      const values = c.req.valid("json")
      const { id } = c.req.valid("cookie")

      const user =  await prisma.user.findUnique({
        where: {
          id,
        }
      })

      if(!user) {
        c.status(404)
        return c.json({message: "Usuario não encontrado"} as ErrorResponse)
      }

      const customers = await api.get<Array<{ id: string }>>(
        `customers?cpfCnpj=${user.cpf}`
      )

      let client_id: string | undefined = customers?.[0]?.id

      if (!client_id) {
        const createClient = await api.post<{ id: string }>(
          `customers`,
          {
            name: user.name,
            cpfCnpj: user.cpf
          }
        )

        client_id = createClient.id
      }

      const daysToAdd = values.paymentForm === 'pix' ? 1 : 7
      const due = new Date()
      due.setDate(due.getDate() + daysToAdd)
      const dueDate = due.toISOString().split('T')[0]

      const payment = await api.post<{
        pixQrCodeId: string,
        id: string,
        status: "CONFIRMED" | "OVERDUE" | "PENDING" | "RECEIVED",
        bankSlipUrl: string | undefined,

      }>(`payments`, {
        customer: client_id,
        billingType: values.paymentForm === 'pix' ? 'PIX' : 'BOLETO',
        value: 40.0,
        dueDate
      })

      if (!payment) {
        c.status(402)
        return c.json({ message: 'Erro ao criar pagamento' } as ErrorResponse)
      }

      const pixQrCodeId = await api.get<{encodedImage: string, payload: string}>(`payments/${payment.id}/pixQrCode`)

      let boleto: {bankSlipUrl?: string; identificationField?: string} | undefined;

      if (values.paymentForm === "boleto") {
        const getBoleto = await api.get<{bankSlipUrl: string; identificationField: string }>(`payments/${payment.id}/identificationField`)
        
        boleto = {
          identificationField: getBoleto.identificationField,
          bankSlipUrl: payment.bankSlipUrl
        }
      }

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          courses: {
            create: {
              name: values.course_name,
              identificationField: boleto?.identificationField,
              bankSlipUrl: boleto?.bankSlipUrl,
              pixQrCodeId: pixQrCodeId.encodedImage,
              pixCopiaECola: pixQrCodeId.payload,
              pixTransaction: payment.id,
              status: payment.status,
              value: 40
            }
          }
        }
      })

      // fetch the newly created course to return to the client
      const createdCourse = await prisma.course.findFirst({
        where: {
          userId: user.id,
          name: values.course_name,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      c.status(201)
      return c.json({ message: 'deu certo', course: createdCourse } as SuccessResponse)
    }
  )
  .get(
  '/get-payments',
  zValidator('cookie', z.object({
    id: z.uuid(),
  })),
  async (c) => {
    const { id } = c.req.valid('cookie')

    const user = await prisma.user.findUnique({
      where: { id },
      include: { courses: true },
    })

    if (!user) {
      c.status(404)
      return c.json({ message: 'Usuário não encontrado' } as ErrorResponse)
    }

    const updatedCourses: Course[] = []

    for (const course of user.courses) {
      try {
        if (!course.pixTransaction) continue

        // Busca o status atualizado no Asaas
        const paymentData = await api.get<{
          id: string
          status: 'CONFIRMED' | 'OVERDUE' | 'PENDING' | 'RECEIVED'
        }>(`payments/${course.pixTransaction}`)

        if (!paymentData) continue

        // Atualiza no banco se mudou
        if (course.status !== paymentData.status) {
          const updated = await prisma.course.update({
            where: { id: course.id },
            data: { status: paymentData.status },
          })
          updatedCourses.push(updated)
        } else {
          updatedCourses.push(course)
        }
      } catch (err) {
        console.error('Erro ao atualizar pagamento:', err)
        updatedCourses.push(course)
      }
    }

    c.status(200)
    return c.json({
      message: 'Pagamentos atualizados com sucesso',
      payments: updatedCourses,
    } as SuccessResponse)
  }
)

export default app