export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="card state">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  )
}

export function LoadingState() {
  return (
    <section className="card state">
      <div className="skeleton" />
      <div className="skeleton short" />
    </section>
  )
}

export function DashboardSkeleton() {
  return (
    <>
      <section className="card">
        <div className="skeleton title" />
        <div className="skeleton medium" />
        <div className="row" style={{ marginTop: '.9rem' }}>
          <div className="skeleton pillish" />
          <div className="skeleton pillish" />
        </div>
      </section>
      <section className="grid three">
        {Array.from({ length: 3 }).map((_, idx) => (
          <section key={idx} className="card">
            <div className="skeleton medium" />
            <div className="skeleton stat" />
            <div className="skeleton" />
          </section>
        ))}
      </section>
      <section className="card">
        <div className="skeleton medium" />
        <div className="skeleton" style={{ marginTop: '.8rem' }} />
        <div className="skeleton" />
        <div className="skeleton short" />
      </section>
    </>
  )
}

export function ProfileSkeleton() {
  return (
    <section className="grid">
      <section className="card">
        <div className="skeleton title" />
        <div className="skeleton medium" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton short" />
      </section>
      <section className="card">
        <div className="skeleton title" />
        <div className="skeleton" style={{ marginTop: '.8rem' }} />
        <div className="skeleton" />
        <div className="skeleton medium" />
      </section>
    </section>
  )
}

export function FormSkeleton({
  titleWidth = '45%',
  lines = 4,
}: {
  titleWidth?: string
  lines?: number
}) {
  return (
    <section className="card">
      <div className="skeleton title" style={{ width: titleWidth }} />
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className="skeleton" style={{ marginTop: idx === 0 ? '.9rem' : '.65rem' }} />
      ))}
      <div className="skeleton pillish" style={{ marginTop: '.9rem' }} />
    </section>
  )
}

export function TableSkeleton({
  titleWidth = '40%',
  rows = 4,
}: {
  titleWidth?: string
  rows?: number
}) {
  return (
    <section className="card">
      <div className="skeleton title" style={{ width: titleWidth }} />
      <div className="skeleton medium" />
      <div className="skeleton" style={{ marginTop: '.9rem' }} />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="skeleton" style={{ marginTop: '.6rem' }} />
      ))}
    </section>
  )
}

export function AIAssistantSkeleton() {
  return (
    <section className="card">
      <div className="skeleton title" style={{ width: '36%' }} />
      <div className="skeleton medium" />
      <div className="skeleton short" style={{ margin: '.7rem 0 0' }} />
      <div className="skeleton" style={{ marginTop: '.85rem' }} />
      <div className="template-grid" style={{ marginTop: '.85rem' }}>
        <div className="skeleton block" />
        <div className="skeleton block" />
      </div>
      <div className="skeleton block tall" style={{ marginTop: '.75rem' }} />
      <div className="skeleton pillish" style={{ marginTop: '.75rem' }} />
    </section>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <section className="card state error">
      <h3>Something went wrong</h3>
      <p>{message}</p>
    </section>
  )
}
