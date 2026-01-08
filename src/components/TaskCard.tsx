import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, Check, X, RotateCcw } from 'lucide-react';
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
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
            Completed
          </span>
        );
      case 'missed':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
            Missed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
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
      className={`glass-card rounded-xl p-4 border-l-4 transition-all duration-300 hover:shadow-lg animate-scale-in ${getStatusStyles()}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.time}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {task.status === 'pending' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
              onClick={() => onStatusChange(task.id, 'completed')}
              title="Mark as completed"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          {task.status === 'completed' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10"
              onClick={() => onStatusChange(task.id, 'pending')}
              title="Mark as pending"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => onModify(task)}
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete task"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
