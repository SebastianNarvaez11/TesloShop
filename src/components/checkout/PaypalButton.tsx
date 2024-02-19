"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import React, { FC } from "react";
import { paypalCheckPayment, setTransactionId } from "@/server-actions";

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton: FC<Props> = ({ orderId, amount }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundenAmount = String(Math.round(amount * 100) / 100); //Paypal no recibe numeros con mas de 4 decimales, y solo strings

  if (isPending) {
    return <span>Cargando...</span>;
  }

  //esta funcion se llama justo al momento de precionar el boton de Paypal
  //antes de empezar el proceso de logueo en paypal ya se ha generado el transactionId
  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    // Generacion del transaction ID
    const transactionId = await actions.order.create({
      purchase_units: [
        {
         //invoice_id: orderId => con esto estamos enlazando nuestro id de la orden de la bd, con la orden de paypal, 
         // con el fin de que Paypal tambien tenga una referencia de nuestra orden y no permita que se pague mas de una vez
          invoice_id: orderId,
          amount: {
            value: roundenAmount,
          },
        },
      ],
    });

    console.log(transactionId);

    const { ok, message } = await setTransactionId(
      orderId,
      transactionId
    );

    if (!ok) {
      alert(message);
    }

    return transactionId;
  };

  // Esta funcion se llama cuando el proceso del pago finaliza y retornamos a la nuestra pagina
  //En esta funcion capturamos los datos del pago y procedemos a realizar la validacion del estado de la orden directamnete contra Paypal
  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) return;

    //  el details.id es el transactionId

    await paypalCheckPayment(details.id);
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
