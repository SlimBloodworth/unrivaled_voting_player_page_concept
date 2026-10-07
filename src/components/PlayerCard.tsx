import Image from "next/image";
import type { CandidateResult } from "@/lib/results";
import styles from "./PlayerCard.module.css";

type Props = {
  candidate: CandidateResult;
  showResults: boolean;
  isLeader: boolean;
  isChoice: boolean;
  voteLocked: boolean;
  onVote: (id: number) => void;
};

export default function PlayerCard({
  candidate,
  showResults,
  isLeader,
  isChoice,
  voteLocked,
  onVote,
}: Props) {
  const { id, name, description, imageUrl, votes, percentage } = candidate;
  const voteWord = votes === 1 ? "vote" : "votes";

  return (
    <article className={`${styles.card} ${isChoice ? styles.choice : ""}`}>
      <div className={styles.photo}>
        <Image
          src={imageUrl}
          alt={`Photo of ${name}`}
          fill
          sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 22vw"
          loading="eager"
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.position}>{description}</p>

        {showResults && (
          <div className={styles.result}>
            <div
              className={styles.track}
              role="progressbar"
              aria-label={`${name} share of votes`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
              aria-valuetext={`${percentage} percent, ${votes} ${voteWord}`}
            >
              <div
                className={`${styles.fill} ${isLeader ? styles.leader : ""}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className={styles.stats}>
              <strong>{percentage}%</strong> · {votes} {voteWord}
            </p>
          </div>
        )}

        <button
          type="button"
          className={styles.button}
          onClick={() => onVote(id)}
          disabled={voteLocked}
          aria-label={isChoice ? `You voted for ${name}` : `Vote for ${name}`}
        >
          {isChoice ? "Your vote" : "Vote"}
        </button>
      </div>
    </article>
  );
}