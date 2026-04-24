import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';

interface UseVoiceOptions {
    onSpeechDetected: (text: string) => void;
    onWakeWordDetected: () => void;
    onListeningStateChange: (isListening: boolean) => void;
    enabled?: boolean;
}

export const useVoiceConversation = ({ 
    onSpeechDetected, 
    onWakeWordDetected, 
    onListeningStateChange,
    enabled = true 
}: UseVoiceOptions) => {
    const [isSupported, setIsSupported] = useState(true); // MediaRecorder is widely supported
    const [isMobile, setIsMobile] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isActivelyListening, setIsActivelyListening] = useState(false);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    const onSpeechDetectedRef = useRef(onSpeechDetected);
    const onListeningStateChangeRef = useRef(onListeningStateChange);
    useEffect(() => { onSpeechDetectedRef.current = onSpeechDetected; }, [onSpeechDetected]);
    useEffect(() => { onListeningStateChangeRef.current = onListeningStateChange; }, [onListeningStateChange]);

    useEffect(() => {
        const checkMobile = () => {
            const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const transcribeAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        setVoiceTranscript("Transcribing audio...");
        try {
            const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post('/ai/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const result = response.data;
            if (result.status === 'success') {
                const text = result.data.text ? result.data.text.trim() : "";
                
                if (text) {
                    console.log("Aira Whisper Transcript:", text);
                    setVoiceTranscript(text);
                    if (text.length > 2) {
                        onSpeechDetectedRef.current(text);
                    }
                } else {
                    console.log("Aira: Silence or dropped hallucination detected.");
                    setVoiceTranscript("");
                }
            } else {
                throw new Error("API explicitly failed structure");
            }
        } catch (error) {
            console.error("Transcription failed:", error);
            setVoiceTranscript("Failed to transcribe.");
        } finally {
            setTimeout(() => {
                setIsProcessing(false);
                setVoiceTranscript("");
            }, 1000);
        }
    };

    // 3. Start Recording (Push-to-Talk)
    const startListening = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("MediaRecorder API not supported.");
            setIsSupported(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                // When recording stops, compile audio and transcribe
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                transcribeAudio(audioBlob);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
                audioChunksRef.current = [];
            };

            mediaRecorder.start();
            setIsActivelyListening(true);
            onListeningStateChangeRef.current(true);
            setVoiceTranscript("");
            setInterimTranscript("");

            // Hard safety timeout: auto-stop after 15 seconds
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                console.log("Aira: Auto-stopping PTT recording after 15 seconds");
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
                setIsActivelyListening(false);
                onListeningStateChangeRef.current(false);
            }, 15000);

        } catch (err) {
            console.error("Failed to access microphone:", err);
            setIsActivelyListening(false);
            onListeningStateChangeRef.current(false);
        }
    }, []);

    // 4. Stop Recording
    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        
        setIsActivelyListening(false);
        onListeningStateChangeRef.current(false);
        window.speechSynthesis.cancel();
    }, []);

    // 5. Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    // 6. Text-to-speech
    const speak = useCallback((text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'));
        if (femaleVoice) utterance.voice = femaleVoice;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { 
        isSupported, 
        speak,
        isMobile,
        interimTranscript,
        voiceTranscript,
        isProcessing,
        isActivelyListening,
        startListening,
        stopListening 
    };
};
