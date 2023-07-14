import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getBackpackDomain } from '@/lib/networkRequests';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key } = req.query;
  const owner_username = await getBackpackDomain(public_key as string);
  if (!owner_username) {
    res.status(404).json({
      error: "User does not exist in the backpack database"
    });
    return;
  }
  console.log('WAO Domain: ', owner_username);
  res.status(200).json({
    username: owner_username
  });
};

export default handler;