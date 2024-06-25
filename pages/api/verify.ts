import { v4 } from 'uuid';
import { Session } from 'next-iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSession, contractAddress, addressCheckMiddleware } from './utils';
import { NFTMetaData } from '@_types/nft';

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const { body } = req;
        const nft = body.nft as NFTMetaData;
        if (!nft.name || !nft.description || !nft.attributes) {
          return res.status(422).send({ message: 'Form data are missing!' });
        }

        await addressCheckMiddleware(req, res);

        return res.status(200).send({ message: 'NFT has been created' });
      } catch (error) {
        return res.status(422).send({ message: 'Cannot create JSON!' });
      }
    } else if (req.method === 'GET') {
      const _contractAddress = await contractAddress();
      try {
        const message = { _contractAddress, id: v4() };
        req.session.set('message-session', message);
        await req.session.save();
        return res.json(message);
      } catch (error) {
        return res.status(422).send({ message: 'Cannot generate a message!' });
      }
    } else {
      return res.status(200).json({ message: 'Invalid api route' });
    }
  }
);
