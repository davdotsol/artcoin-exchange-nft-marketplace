import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

type ActiveLinkProps = {
  href: string;
  activeClass: string;
  inactiveClass: string;
  pathname: string;
  name: string;
};

const ActiveLink = ({
  href,
  activeClass,
  inactiveClass,
  pathname,
  name,
}: ActiveLinkProps) => {
  let className = pathname === href ? activeClass : inactiveClass;

  return (
    <Link
      href={href}
      className={`${className} rounded-md px-3 py-2 text-sm font-medium`}
    >
      {name}
    </Link>
  );
};

export default ActiveLink;
