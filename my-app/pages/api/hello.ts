// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { logServerError } from "@/lib/errors";

type Data =
  | { name: string }
  | { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    res.status(200).json({ name: "John Doe" });
  } catch (error: unknown) {
    logServerError("pages/api/hello handler", error);
    res.status(500).json({ error: "Something went wrong on our side. Please try again later." });
  }
}
