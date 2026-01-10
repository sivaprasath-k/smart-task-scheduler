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
<<<<<<< HEAD
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
=======
    <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-0.5 sm:mb-1 truncate">{title}</p>
          <p className={`text-xl sm:text-2xl lg:text-3xl font-bold font-display ${colors.text}`}>{value}</p>
          {trend && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 truncate">{trend}</p>
          )}
        </div>
        <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl ${colors.iconBg} flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
>>>>>>> 62a644c6a3541b2e50d3f9897ea1af155a0439e8
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
