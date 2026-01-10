import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, TaskFormData } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(tasksQuery, async (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
        createdAt: docSnapshot.data().createdAt?.toDate() || new Date(),
      })) as Task[];
      
      const today = new Date().toISOString().split('T')[0];
      const updatedTasks: Task[] = [];
      
      for (const task of tasksData) {
        if (task.date < today) {
          if (task.status === 'completed') {
            // Delete completed tasks after their day ends
            const taskRef = doc(db, 'tasks', task.id);
            await deleteDoc(taskRef);
            // Don't add to updatedTasks - it's deleted
          } else if (task.status === 'pending') {
            // Mark pending tasks as missed
            const taskRef = doc(db, 'tasks', task.id);
            await updateDoc(taskRef, { status: 'missed' });
            updatedTasks.push({ ...task, status: 'missed' });
          } else {
            // Keep missed tasks
            updatedTasks.push(task);
          }
        } else {
          updatedTasks.push(task);
        }
      }
      
      // Sort by date ascending
      updatedTasks.sort((a, b) => a.date.localeCompare(b.date));
      
      setTasks(updatedTasks);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = useCallback(async (taskData: TaskFormData) => {
    if (!user) throw new Error('User not authenticated');

    const newTask = {
      ...taskData,
      status: 'pending',
      createdAt: Timestamp.now(),
      uid: user.uid,
    };

    await addDoc(collection(db, 'tasks'), newTask);
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  }, []);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(task => task.date === date);
  }, [tasks]);

  const getFreeDatesInMonth = useCallback((year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bookedDates = new Set(tasks.map(task => task.date));
    const freeDates: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!bookedDates.has(dateStr) && dateStr >= today) {
        freeDates.push(dateStr);
      }
    }

    return freeDates.slice(0, 5); // Return max 5 suggestions
  }, [tasks]);

  const isDateBooked = useCallback((date: string) => {
    return tasks.some(task => task.date === date);
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getTasksByDate,
    getFreeDatesInMonth,
    isDateBooked,
  };
};
