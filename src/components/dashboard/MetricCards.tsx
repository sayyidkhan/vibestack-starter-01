import { Card } from '../ui/primitives'

const metrics = [
  ['Active Users', '1,248'],
  ['MRR', '$24,900'],
  ['Open Experiments', '7'],
]

export function MetricCards() {
  return (
    <section className="grid three">
      {metrics.map(([label, value]) => (
        <Card key={label}>
          <p className="muted">{label}</p>
          <h3>{value}</h3>
        </Card>
      ))}
    </section>
  )
}
