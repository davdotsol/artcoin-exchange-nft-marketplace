import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession, Session } from 'next-iron-session';
import { Contract, ethers } from 'ethers';
import {
  bytesToHex,
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';
import CONFIG from '../../public/config/config.json';
import NFT_MARKETPLACE_ABI from '../../public/abis/NFTMarketplace.json';

// Validate environment variables
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID;
const secretCookiePassword = process.env.SECRET_COOKIE_PASSWORD;

if (!targetNetwork) {
  throw new Error('NEXT_PUBLIC_NETWORK_ID is not set in environment variables');
}

if (!secretCookiePassword) {
  throw new Error('SECRET_COOKIE_PASSWORD is not set in environment variables');
}

// Helper function to get contract address
export function contractAddress(): string | null {
  const networkConfig = CONFIG[targetNetwork as keyof typeof CONFIG];
  if (!networkConfig || !networkConfig['NFTMarketplace']) {
    return null;
  }
  return networkConfig['NFTMarketplace'].address;
}

// Session middleware
export function withSession(handler: any) {
  return withIronSession(handler, {
    password: secretCookiePassword as string,
    cookieName: 'nft-auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

// Address check middleware
export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
): Promise<void> => {
  try {
    const message = req.session.get('message-session');
    if (!message) {
      res.status(400).json({ error: 'No message session found' });
      return;
    }

    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contractAddressValue = contractAddress();

    if (!contractAddressValue) {
      res.status(500).json({ error: 'Invalid contract address' });
      return;
    }

    const contract = new ethers.Contract(
      contractAddressValue,
      NFT_MARKETPLACE_ABI,
      provider
    ) as Contract;

    const nonce = JSON.stringify(message);
    const chainId = BigInt(targetNetwork);
    const messageHash = hashPersonalMessage(Buffer.from(nonce, 'utf-8'));

    const { v, r, s } = fromRpcSig(req.body.signature);

    const pubkey = ecrecover(messageHash, v, r, s);
    const recoveredAddress = bytesToHex(pubToAddress(pubkey));

    if (recoveredAddress === req.body.address) {
      res.status(200).json({ message: 'Correct Address' });
    } else {
      res.status(400).json({ error: 'Wrong Address' });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: errorMessage });
  }
};
