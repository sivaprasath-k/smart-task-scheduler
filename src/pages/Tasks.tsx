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
<<<<<<< HEAD
=======
    // Scroll to top on mobile when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
>>>>>>> 62a644c6a3541b2e50d3f9897ea1af155a0439e8
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
<<<<<<< HEAD
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
=======
      <div className="min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          {/* Left Panel - Form */}
          <div className="flex flex-col">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 sm:mb-2">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {editingTask 
                  ? 'Update your task details below'
                  : 'Create a new task and schedule it'
>>>>>>> 62a644c6a3541b2e50d3f9897ea1af155a0439e8
                }
              </p>
            </div>

<<<<<<< HEAD
            <div className="glass-card rounded-2xl p-6 flex-1">
=======
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 flex-1">
>>>>>>> 62a644c6a3541b2e50d3f9897ea1af155a0439e8
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
<<<<<<< HEAD
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
=======
          <div className="flex flex-col mt-4 lg:mt-0">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-1 sm:mb-2">All Tasks</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>

            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
>>>>>>> 62a644c6a3541b2e50d3f9897ea1af155a0439e8
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
<<<<<<< HEAD
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
=======
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No tasks yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Add your first task using the form above to get started.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[50vh] lg:h-[calc(100vh-16rem)]">
                  <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
>>>>>>> 62a644c6a3541b2e50d3f9897ea1af155a0439e8
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
