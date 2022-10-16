import type { NextApiRequest, NextApiResponse } from "next";
import {
  verifyMethod,
  authenticate
} from "@/lib/server";
import { withSentry } from "@sentry/nextjs";
import { uploadImageNode } from "@/lib/server";
import { Keypair } from "@solana/web3.js";
import formidable, { File } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFiles = Array<[string, File]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Verify the request method
  const allowed = verifyMethod(req, res, "POST");
  if (!allowed) return;

  let proceedWithUpload = false;

  // Collect all the files
  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new formidable.IncomingForm();
      const files: ProcessedFiles = [];
      form.on("file", function (field, file) {
        files.push([field, file]);
      });
      form.on("error", (err) => reject(err));
      form.parse(req, async (err, fields) => {
        if (err) {
          res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
          res.end(String(err));
          return;
        }
        const { public_key, signature } = fields;

        if (!public_key || !signature) {
          res.status(400).json({
            error: "Insufficient authorization data",
          });
          return;
        }

        // Authenticate the public key using signature
        const authenticated = authenticate(
          public_key as string,
          JSON.parse(signature as string),
          res
        );
        if (!authenticated) return;

        // Check if user exists
        const user = await prisma.user.findFirst({
          where: {
            public_key: public_key as string,
          },
        });

        if (!user) {
          res.status(400).json({
            error: "User does not exist",
          });
          return;
        }
        proceedWithUpload = true;
        resolve(files);
      });
    }
  );

  const private_key_raw = JSON.parse(process.env.BUNDLR_PRIVATE_KEY);
  const private_key_array: number[] = Array.from(private_key_raw);
  const private_key = Uint8Array.from(private_key_array);
  const keypair = Keypair.fromSecretKey(private_key);

  const image = files?.[0][1];
  if (!proceedWithUpload || !image) return;

  const response = await uploadImageNode(image, keypair);
  if (response.error) {
    res.status(500).json(response)
  } else {
    res.status(200).json(response);
  }

};

export default withSentry(handler);
