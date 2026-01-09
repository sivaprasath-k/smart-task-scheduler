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

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Task[];
      
      // Update missed status for past tasks
      const today = new Date().toISOString().split('T')[0];
      const updatedTasks = tasksData.map(task => {
        if (task.date < today && task.status === 'pending') {
          return { ...task, status: 'missed' as const };
        }
        return task;
      });
      
      // Sort by date ascending (done in JS to avoid needing Firestore composite index)
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
