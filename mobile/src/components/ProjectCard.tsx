import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description?: string;
    status: string;
    progress?: number;
    due_date?: string;
    team?: string[];
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = project.progress || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{project.name}</Text>
        <View style={[styles.statusBadge, statusColors[project.status] || {}]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>

      {project.description && (
        <Text style={styles.description}>{project.description}</Text>
      )}

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      {project.due_date && (
        <Text style={styles.dueDate}>Due: {new Date(project.due_date).toLocaleDateString()}</Text>
      )}
    </View>
  );
}

const statusColors: Record<string, any> = {
  active: { backgroundColor: '#007AFF' },
  completed: { backgroundColor: '#34c759' },
  on_hold: { backgroundColor: '#ff9500' },
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});