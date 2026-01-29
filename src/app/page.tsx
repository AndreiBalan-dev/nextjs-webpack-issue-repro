"use client";
import { motion } from "framer-motion";
export default function Home() {
  return <motion.h1 initial={{opacity:0}} animate={{opacity:1}}>Test</motion.h1>
}
