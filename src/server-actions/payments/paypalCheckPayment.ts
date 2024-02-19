"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  console.log(transactionId);

  // 1. Obtener el token de acceso para poder validar el estado de la orden
  const token = await getPayPalBearerToken();

  console.log(token);

  if (!token) {
    return {
      ok: false,
      message: "No se puedo obtener token de verificacion",
    };
  }

  // 2. obtener la informacion de la orden desde Paypal
  const res = await verifyPayPalPayment(transactionId, token);

  if (!res) {
    return {
      ok: false,
      message: "Error al verificar el pago",
    };
  }

  // 3. verificar el estado de la orden
  const { status, purchase_units } = res;
  const { invoice_id } = purchase_units[0];

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "Aun no se ha pagado en Paypal",
    };
  }

  try {
    // 4. Actualizar nuestra orden en la base de datos
    await prisma.order.update({
      where: { id: invoice_id }, //el invoice_id es el id de nuestra orden, pero ahora viene en la respuesta de paypal, gracias a que lo relacionamos al momento de crear el transactionId
      data: { isPaid: true, paidAt: new Date() },
    });

    // 5. Revalidar la ruta para que se renderice con los datos de l orden actualizada
    revalidatePath(`/orders/${invoice_id}`);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Error al actualizar la orden",
    };
  }
};

// Peticion a Paypal con nuestras credenciales para obtener el token de acceso con le que vamos a validar el estado de las ordenes
const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? ""; //endpoint al que se apunta para obtener el token

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: "no-store", //para que el fetch de Next14 no guarde el token en cache y siempre genere uno nuevo
    }).then((r) => r.json());
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Esta funcion la llamamos para obtener la informacion de una orden en Paypal, entre esa informacion esta el estado de la orden
// La funcion recibe el token de acceso para poder hacer la peticion y el transactionId
const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`; // endpoint al que se llama para obetener la informacion de la orden (se deba pasar el transactionId)

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const resp = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store", //para que el fetch de Next14 no guarde el cache
    }).then((r) => r.json());
    console.log({ resp });
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};
