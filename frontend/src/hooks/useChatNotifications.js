import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../services/socketService';

const NOTIFICATION_SOUNDS = {
    message: '/sounds/message.mp3',
    mention: '/sounds/mention.mp3',
    reaction: '/sounds/reaction.mp3'
};

let audioContext = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
};

const playSound = async (soundType) => {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
        
        const response = await fetch(NOTIFICATION_SOUNDS[soundType]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
    } catch (error) {
        console.warn('Error playing notification sound:', error);
    }
};

const useChatNotifications = (enabled = true) => {
    const soundEnabledRef = useRef(true);
    const notificationsEnabledRef = useRef(true);

    useEffect(() => {
        if (!enabled) return;

        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (message) => {
            if (notificationsEnabledRef.current) {
                if (message.mentions?.includes('currentUser')) {
                    playSound('mention');
                } else {
                    playSound('message');
                }
            }
        };

        const handleReaction = () => {
            if (soundEnabledRef.current) {
                playSound('reaction');
            }
        };

        socket.on('receive_message', handleNewMessage);
        socket.on('message:reaction:added', handleReaction);

        return () => {
            socket.off('receive_message', handleNewMessage);
            socket.off('message:reaction:added', handleReaction);
        };
    }, [enabled]);

    const enableSounds = useCallback(() => {
        soundEnabledRef.current = true;
    }, []);

    const disableSounds = useCallback(() => {
        soundEnabledRef.current = false;
    }, []);

    const enableNotifications = useCallback(() => {
        notificationsEnabledRef.current = true;
    }, []);

    const disableNotifications = useCallback(() => {
        notificationsEnabledRef.current = false;
    }, []);

    const playMessageSound = useCallback(() => {
        if (soundEnabledRef.current) {
            playSound('message');
        }
    }, []);

    const playMentionSound = useCallback(() => {
        if (soundEnabledRef.current) {
            playSound('mention');
        }
    }, []);

    return {
        enableSounds,
        disableSounds,
        enableNotifications,
        disableNotifications,
        playMessageSound,
        playMentionSound,
        soundsEnabled: soundEnabledRef.current,
        notificationsEnabled: notificationsEnabledRef.current
    };
};

export default useChatNotifications;
