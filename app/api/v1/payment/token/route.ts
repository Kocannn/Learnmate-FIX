// import Midtrans from 'midtrans-client-typescript';
import { Snap } from "midtrans-client-typescript/dist/lib/snap";
import { NextResponse } from "next/server";

const snap = new Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { price, orderId } = body;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: price,
    },
    callbacks: {
      finish: "localhost:3000/dashboard",
    },
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
}
