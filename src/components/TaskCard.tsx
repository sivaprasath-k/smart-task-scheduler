import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onModify: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onModify, onDelete, onStatusChange }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusStyles = () => {
    switch (task.status) {
      case 'completed':
        return 'border-l-success bg-success/5';
      case 'missed':
        return 'border-l-destructive bg-destructive/5';
      default:
        return 'border-l-warning bg-warning/5';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'completed':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-success/10 text-success">
            Done
          </span>
        );
      case 'missed':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-destructive/10 text-destructive">
            Missed
          </span>
        );
      default:
        return (
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full bg-warning/10 text-warning">
            Pending
          </span>
        );
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const formattedDate = format(new Date(task.date), 'MMM dd, yyyy');

  return (
    <div 
      className={`glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 transition-all duration-300 hover:shadow-lg animate-scale-in ${getStatusStyles()}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate max-w-[200px] sm:max-w-none">{task.title}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{task.time}</span>
            </div>
          </div>
        </div>

        {/* Actions - horizontal on mobile, vertical on desktop */}
        <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2 justify-end">
          {task.status === 'pending' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-success hover:text-success hover:bg-success/10"
              onClick={() => onStatusChange(task.id, 'completed')}
              title="Mark as completed"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          )}
          {task.status === 'completed' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-warning hover:text-warning hover:bg-warning/10"
              onClick={() => onStatusChange(task.id, 'pending')}
              title="Mark as pending"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => onModify(task)}
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete task"
          >
            {isDeleting ? (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
