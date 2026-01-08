import React, { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFormData } from '@/types/task';
import { ScrollArea } from '@/components/ui/scroll-area';

const Tasks: React.FC = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, isDateBooked, getFreeDatesInMonth } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await addTask(data);
    }
  };

  const handleModify = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    await updateTask(taskId, { status });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel - Form */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-display font-bold mb-2">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h1>
              <p className="text-muted-foreground">
                {editingTask 
                  ? 'Update your task details below'
                  : 'Create a new task and schedule it on your calendar'
                }
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex-1">
              <TaskForm
                onSubmit={handleSubmit}
                editingTask={editingTask}
                onCancelEdit={handleCancelEdit}
                isDateBooked={isDateBooked}
                getFreeDates={getFreeDatesInMonth}
              />
            </div>
          </div>

          {/* Right Panel - Task List */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold mb-2">All Tasks</h2>
                <p className="text-muted-foreground">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground max-w-xs">
                    Add your first task using the form on the left to get started.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="space-y-4 pr-4">
                    {tasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TaskCard
                          task={task}
                          onModify={handleModify}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
