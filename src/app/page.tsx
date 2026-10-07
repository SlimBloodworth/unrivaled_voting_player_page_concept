import Header from "@/components/Header";
import VotingPanel from "@/components/VotingPanel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <p className={styles.eyebrow}>Weekly nominees</p>
        <h1 className={styles.title}>Player of the Week</h1>
        <p className={styles.intro}>
          Pick your favorite. Results appear as soon as you vote.
        </p>
        <section className={styles.players} aria-label="Candidates">
          <VotingPanel />
        </section>
      </main>
      <footer className={styles.footer}>
        Fan-made portfolio concept. Not affiliated with Unrivaled.
      </footer>
    </>
  );
}