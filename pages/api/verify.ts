import { v4 } from 'uuid';
import { Session } from 'next-iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import {
  withSession,
  contractAddress,
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
} from './utils';
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

        const jsonRes = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          {
            pinataMetadata: {
              name: v4(),
            },
            pinataContent: nft,
          },
          {
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
            },
          }
        );

        return res.status(200).send(jsonRes.data);
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
