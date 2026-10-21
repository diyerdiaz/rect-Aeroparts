import { memo, type ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  icon: ReactNode;
  alert?: boolean;
}

export const MetricCard = memo(function MetricCard({ label, value, icon, alert }: Props) {
  return (
    <article className={`card metric ${alert ? 'metric--alert' : ''}`}>
      <div className="metric__head">
        <span className="muted">{label}</span>
        <span className="metric__icon">{icon}</span>
      </div>
      <strong className="metric__value">{value}</strong>
    </article>
  );
});
