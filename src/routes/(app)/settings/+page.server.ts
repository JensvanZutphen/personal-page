import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

const settingsSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const load = async ({ locals }) => {
  const user = await prisma.user.findUnique({ where: { id: locals.user.id } });

  return { 
    user,
    streamed: {
      settings: new Promise((resolve) => {
        setTimeout(() => {
          resolve(user)
        }, 2000)
      })
    }
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;

    const parsed = settingsSchema.safeParse({ name, email });

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    await prisma.user.update({
      where: { id: locals.user.id },
      data: parsed.data,
    });

    return { success: true };
  },
};