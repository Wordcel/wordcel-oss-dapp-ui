import NextCors from 'nextjs-cors';
import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { public_key } = req.query;
  const user = await prisma.user.findFirst({
    where: {
      public_key: public_key as string
    }
  });
  if (!user) {
    res.status(404).json({
      error: 'User does not exist'
    });
    return;
  };
  const connection_count = await prisma.connection.count({
    where: { profile_owner: user.public_key }
  });
  res.status(200).json({
    ...user,
    connection_count
  });
};

export default withSentry(handler);