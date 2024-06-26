import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession, Session } from 'next-iron-session';
import { Contract, ethers } from 'ethers';
import {
  bytesToHex,
  ecrecover,
  hexToBytes,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';

import CONFIG from '../../public/config/config.json';
import NFT_MARKETPLACE_ABI from '../../public/abis/NFTMarketplace.json';

// const NETWORKS = {
//   '31337': 'Hardhat',
// };

// type NETWORK = typeof NETWORKS;

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as string;
const pinataApiKey = process.env.PINATA_API_KEY as string;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;

export function contractAddress() {
  // const res = await fetch(`/config/config.json`);
  // const config = await res.json();

  if (!CONFIG[targetNetwork]) {
    return null;
  }

  return CONFIG[targetNetwork]['NFTMarketplace'].address;
}

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'nft-auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  });
}

export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get('message-session');
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = new ethers.Contract(
      contractAddress(),
      NFT_MARKETPLACE_ABI,
      provider
    ) as unknown as Contract;

    let nonce: string | Buffer = JSON.stringify(message);

    const chainId = BigInt(targetNetwork); // Ropsten

    nonce = hashPersonalMessage(Buffer.from(nonce, 'utf-8'));

    const { v, r, s } = fromRpcSig(req.body.signature);

    const pubkey = ecrecover(nonce, v, r, s);

    const address = bytesToHex(pubToAddress(pubkey));

    if (address === req.body.address) {
      resolve('Correct Address');
    } else {
      reject('Wrong Address');
    }
  });
};
