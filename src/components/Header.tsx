import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Image
        src="/unrivaled-icon.png"
        alt=""
        width={44}
        height={57}
        priority
        className={styles.icon}
      />
      <span className={styles.name}>Fan Vote</span>
    </header>
  );
}