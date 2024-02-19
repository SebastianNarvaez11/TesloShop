"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const orderUpdated = await prisma.order.update({
      where: { id: orderId },
      data: {
        transactionId: transactionId,
      },
    });

    if (!orderUpdated) throw new Error("Orden no encontrada");

    return {
      ok: true,
      orderUpdated,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
