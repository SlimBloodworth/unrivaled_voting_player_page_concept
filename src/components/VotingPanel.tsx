"use client";

import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import type { CandidateResult } from "@/lib/results";
import styles from "./VotingPanel.module.css";

type Results = { totalVotes: number; candidates: CandidateResult[] };

const STORAGE_KEY = "potw-voted-candidate";

function readSavedVote(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(saved) && saved > 0 ? saved : null;
  } catch {
    return null;
  }
}

export default function VotingPanel() {
  const [results, setResults] = useState<Results | null>(null);
  const [votedFor, setVotedFor] = useState<number | null>(readSavedVote);
  const [peek, setPeek] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/results", { cache: "no-store" });
        if (!res.ok) throw new Error("Bad response");
        const data: Results = await res.json();
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) {
          setError("Could not load the candidates. Please refresh and try again.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleVote(candidateId: number) {
    if (votedFor !== null || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      if (!res.ok) throw new Error("Vote failed");

      const data: Results = await res.json();
      setResults(data);
      setVotedFor(candidateId);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(candidateId));
      } catch {
        // Storage blocked: the vote still counted, it just can't be remembered.
      }

      const name =
        data.candidates.find((c) => c.id === candidateId)?.name ?? "your pick";
      setAnnouncement(`Your vote for ${name} was recorded. Results are now showing.`);
    } catch {
      setError("Your vote could not be recorded. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!results) {
    return error ? (
      <p role="alert" className={styles.error}>
        {error}
      </p>
    ) : (
      <p role="status" className={styles.message}>
        Loading candidates…
      </p>
    );
  }

  const hasVoted = votedFor !== null;
  const showResults = hasVoted || peek;
  const topVotes = Math.max(0, ...results.candidates.map((c) => c.votes));

  return (
    <>
      <div className={styles.toolbar}>
        {!hasVoted && (
          <button
            type="button"
            className={styles.link}
            onClick={() => setPeek((value) => !value)}
          >
            {peek ? "Hide results" : "See results"}
          </button>
        )}
        {showResults && (
          <p className={styles.message}>
            {results.totalVotes} {results.totalVotes === 1 ? "vote" : "votes"} so far
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <p className={styles.srOnly} aria-live="polite">
        {announcement}
      </p>

      <div className={styles.grid}>
        {results.candidates.map((candidate) => (
          <PlayerCard
            key={candidate.id}
            candidate={candidate}
            showResults={showResults}
            isLeader={topVotes > 0 && candidate.votes === topVotes}
            isChoice={votedFor === candidate.id}
            voteLocked={hasVoted || submitting}
            onVote={handleVote}
          />
        ))}
      </div>
    </>
  );
}