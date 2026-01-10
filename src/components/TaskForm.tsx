import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, FileText, Type, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskFormData } from '@/types/task';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
  isDateBooked: (date: string) => boolean;
  getFreeDates: (year: number, month: number) => string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  editingTask, 
  onCancelEdit,
  isDateBooked,
  getFreeDates
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
  });
  const [loading, setLoading] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  const [freeDates, setFreeDates] = useState<string[]>([]);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        date: editingTask.date,
        time: editingTask.time,
      });
      setShowConflict(false);
    }
  }, [editingTask]);

  useEffect(() => {
    if (formData.date && !editingTask) {
      const isBooked = isDateBooked(formData.date);
      setShowConflict(isBooked);
      if (isBooked) {
        const [year, month] = formData.date.split('-').map(Number);
        const suggestions = getFreeDates(year, month - 1);
        setFreeDates(suggestions);
      } else {
        setFreeDates([]);
      }
    }
  }, [formData.date, isDateBooked, getFreeDates, editingTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (showConflict && !editingTask) {
      toast.error('This date is already booked. Please choose a different date.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!editingTask) {
        setFormData({
          title: '',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          time: '09:00',
        });
      }
      toast.success(editingTask ? 'Task updated successfully!' : 'Task added successfully!');
    } catch (error) {
      toast.error('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSuggestionClick = (date: string) => {
    setFormData(prev => ({ ...prev, date }));
    setShowConflict(false);
    toast.success(`Date changed to ${format(new Date(date), 'MMMM dd, yyyy')}`);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
    });
    setShowConflict(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="title" className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          className="bg-background text-sm sm:text-base"
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="description" className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description..."
          rows={3}
          className="bg-background resize-none text-sm sm:text-base"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="date" className="text-xs sm:text-sm font-medium flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            Due Date
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="bg-background text-sm sm:text-base"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="time" className="text-xs sm:text-sm font-medium flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            Due Time
          </Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="bg-background text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Conflict Warning */}
      {showConflict && (
        <div className="animate-slide-up">
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-destructive">
                This date is already booked!
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Choose an available date below:
              </p>
            </div>
          </div>

          {freeDates.length > 0 && (
            <div className="mt-3 sm:mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span>Suggested free dates:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {freeDates.map((date) => (
                  <Button
                    key={date}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateSuggestionClick(date)}
                    className="text-[10px] sm:text-xs hover:bg-primary hover:text-primary-foreground transition-colors h-7 sm:h-8 px-2 sm:px-3"
                  >
                    {format(new Date(date), 'MMM dd')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
          disabled={loading || (showConflict && !editingTask)}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : editingTask ? (
            'Update Task'
          ) : (
            'Add Task'
          )}
        </Button>
        {editingTask && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={resetForm}
            className="h-10 sm:h-11 text-sm sm:text-base"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
