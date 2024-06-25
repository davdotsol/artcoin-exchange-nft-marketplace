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

    // nonce = ethers.keccak256(Buffer.from(nonce, 'utf-8'));

    const chainId = BigInt(targetNetwork); // Ropsten

    const echash = hashPersonalMessage(Buffer.from(nonce, 'utf-8'));
    // const r = hexToBytes('0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9')
    // const s = hexToBytes('0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66')
    // const v = BigInt(41)

    const { v, r, s } = fromRpcSig(req.body.signature);

    const pubkey = ecrecover(echash, v, r, s);

    const address = bytesToHex(pubToAddress(pubkey));

    if (address === req.body.address) {
      resolve('Correct Address');
    } else {
      reject('Wrong Address');
    }
  });
};
