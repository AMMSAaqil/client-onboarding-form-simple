interface AlertProps {
  kind: "success" | "error";
  title?: string;
  children?: React.ReactNode;
}

export default function Alert({ kind, title, children }: AlertProps) {
  const color = kind === "success" ? "var(--ok)" : "var(--error)";
  const bg = kind === "success" ? "rgba(63, 207, 142, 0.08)" : "rgba(255, 92, 122, 0.08)";
  const border = kind === "success" ? "rgba(63, 207, 142, 0.4)" : "rgba(255, 92, 122, 0.4)";
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 12, marginBottom: 12 }}
    >
      {title && <strong style={{ color, display: "block", marginBottom: 6 }}>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}