import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import { NextApiRequest,NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return toNodeHandler(auth)(req, res);
}

export const config = {
    api :{
        bodyParser:false,
    },
}