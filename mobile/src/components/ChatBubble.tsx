import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <View style={[styles.container, message.isMe ? styles.containerRight : styles.containerLeft]}>
      <View style={[styles.bubble, message.isMe ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={[styles.text, message.isMe ? styles.textRight : styles.textLeft]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, message.isMe ? styles.timestampRight : styles.timestampLeft]}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleRight: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    backgroundColor: '#e5e5ea',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
  },
  textRight: {
    color: '#fff',
  },
  textLeft: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampRight: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  timestampLeft: {
    color: '#666',
  },
});