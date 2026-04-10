import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    status: string;
    priority?: string;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <View style={[styles.container, isCompleted && styles.completed]}>
      <View style={styles.header}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>
          {task.title}
        </Text>
        <View style={[styles.priorityBadge, priorityColors[task.priority || 'low']]}>
          <Text style={styles.priorityText}>{task.priority || 'low'}</Text>
        </View>
      </View>
      
      {task.description && (
        <Text style={styles.description}>{task.description}</Text>
      )}
      
      {task.due_date && (
        <Text style={styles.dueDate}>Due: {new Date(task.due_date).toLocaleDateString()}</Text>
      )}
    </View>
  );
}

const priorityColors: Record<string, any> = {
  high: { backgroundColor: '#ff3b30' },
  medium: { backgroundColor: '#ff9500' },
  low: { backgroundColor: '#34c759' },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});