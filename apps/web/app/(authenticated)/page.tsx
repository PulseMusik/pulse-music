'use client'

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

import { useUser } from "../lib/auth/UserContext";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  const { userData } = useUser()

  return (
    <h1>{userData?.email || 'Email'}</h1>
  );
}
