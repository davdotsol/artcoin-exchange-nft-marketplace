import { withIronSession } from 'next-iron-session';
import CONFIG from '../../public/config/config.json';

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
