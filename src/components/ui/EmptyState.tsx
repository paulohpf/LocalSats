export function EmptyState({ message, detail }: { message: string; detail?: string }) {
  return <div className="empty"><span className="empty-icon">₿</span><p>{message}</p>{detail && <span className="muted">{detail}</span>}</div>
}
