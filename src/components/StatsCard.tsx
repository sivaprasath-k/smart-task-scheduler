import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'accent';
}

const colorMap = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    iconBg: 'bg-primary',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    iconBg: 'bg-success',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    iconBg: 'bg-warning',
  },
  destructive: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    iconBg: 'bg-destructive',
  },
  accent: {
    bg: 'bg-accent/20',
    text: 'text-accent',
    iconBg: 'bg-accent',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  const colors = colorMap[color];

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className={`text-3xl font-bold font-display ${colors.text}`}>{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
