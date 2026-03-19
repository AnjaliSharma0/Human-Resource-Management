"use client";

import useRole from "./userole";



export default function RoleGuard({ allowed, children }: any) {
  const role = useRole();

  if (!role || !allowed.includes(role)) return null;

  return children;
}