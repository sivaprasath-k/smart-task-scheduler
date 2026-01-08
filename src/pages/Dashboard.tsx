import React, { useMemo } from 'react';
import { CalendarCheck, CalendarClock, AlertTriangle, TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types/task';

const Dashboard: React.FC = () => {
  const { tasks, loading, updateTask, deleteTask } = useTasks();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayTasks = tasks.filter(task => task.date === today);
    const upcomingTasks = tasks.filter(task => task.date > today && task.status === 'pending');
    const missedTasks = tasks.filter(task => task.status === 'missed');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks.length / totalTasks) * 100) 
      : 0;

    return {
      todayTasks,
      upcomingTasks,
      missedTasks,
      completedTasks,
      completionPercentage,
    };
  }, [tasks]);

  const handleModify = (task: Task) => {
    // Navigate to tasks page with edit mode
    window.location.href = '/tasks';
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    await updateTask(taskId, { status });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your task management progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Today's Tasks"
            value={stats.todayTasks.length}
            icon={CalendarCheck}
            color="primary"
            trend={`${stats.todayTasks.filter(t => t.status === 'completed').length} completed`}
          />
          <StatsCard
            title="Upcoming Tasks"
            value={stats.upcomingTasks.length}
            icon={CalendarClock}
            color="warning"
            trend="Scheduled for later"
          />
          <StatsCard
            title="Missed Tasks"
            value={stats.missedTasks.length}
            icon={AlertTriangle}
            color="destructive"
            trend="Needs attention"
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats.completionPercentage}%`}
            icon={TrendingUp}
            color="success"
            trend={`${stats.completedTasks.length} of ${tasks.length} tasks`}
          />
        </div>

        {/* Progress Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">Your task completion status</p>
            </div>
            <span className="text-2xl font-bold gradient-text">{stats.completionPercentage}%</span>
          </div>
          <Progress value={stats.completionPercentage} className="h-3" />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {stats.completedTasks.length} Completed
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              {stats.upcomingTasks.length + stats.todayTasks.filter(t => t.status === 'pending').length} Pending
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" />
              {stats.missedTasks.length} Missed
            </div>
          </div>
        </div>

        {/* Task Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Today's Tasks</h3>
                <p className="text-xs text-muted-foreground">{stats.todayTasks.length} tasks</p>
              </div>
            </div>
            <ScrollArea className="h-64">
              {stats.todayTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks for today</p>
              ) : (
                <div className="space-y-3 pr-4">
                  {stats.todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onModify={handleModify}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Upcoming Tasks */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Upcoming Tasks</h3>
                <p className="text-xs text-muted-foreground">{stats.upcomingTasks.length} tasks</p>
              </div>
            </div>
            <ScrollArea className="h-64">
              {stats.upcomingTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
              ) : (
                <div className="space-y-3 pr-4">
                  {stats.upcomingTasks.slice(0, 5).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onModify={handleModify}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Missed Tasks */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold">Missed Tasks</h3>
                <p className="text-xs text-muted-foreground">{stats.missedTasks.length} tasks</p>
              </div>
            </div>
            <ScrollArea className="h-64">
              {stats.missedTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No missed tasks 🎉</p>
              ) : (
                <div className="space-y-3 pr-4">
                  {stats.missedTasks.slice(0, 5).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onModify={handleModify}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
