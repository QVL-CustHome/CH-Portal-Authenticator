interface FeedbackProps {
  error?: string | null;
  info?: string | null;
}

// Zone de message des formulaires : erreur API ou confirmation.
export default function Feedback({ error, info }: FeedbackProps) {
  if (error) return <p className="feedback feedback-error">{error}</p>;
  if (info) return <p className="feedback feedback-info">{info}</p>;
  return null;
}
