// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Paperclip, 
    Smile, 
    Mic, 
    Square, 
    Play, 
    Pause,
    X,
    Image,
    FileText,
    File
} from 'lucide-react';
import chatService from '../../../services/chat.service';
import { getSocket } from '../../../services/socketService';

const EMOJI_LIST = ['😀', '😂', '😍', '🤔', '😮', '😢', '🎉', '🔥', '👍', '❤️'];

const MessageComposer = ({ roomId, onSend, disabled }) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    
    const fileInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const audioPreviewRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const typingTimeoutRef = useRef(null);
    const socket = getSocket();

    useEffect(() => {
        return () => {
            if (recordedAudio) {
                URL.revokeObjectURL(recordedAudio);
            }
        };
    }, [recordedAudio]);

    const handleTyping = (e) => {
        setMessage(e.target.value);
        
        if (socket) {
            socket.emit('user:typing:start', { roomId, userId: 'currentUser', userName: 'You' });
            
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('user:typing:stop', { roomId, userId: 'currentUser' });
            }, 3000);
        }
    };

    const handleSend = async () => {
        if (!message.trim() || disabled) return;

        try {
            const sentMessage = await chatService.sendMessage(roomId, message);
            
            if (socket) {
                socket.emit('send_message', {
                    ...sentMessage,
                    roomId
                });
            }
            
            if (onSend) onSend(sentMessage);
            setMessage('');
            setShowEmojiPicker(false);
            
            if (socket) {
                socket.emit('user:typing:stop', { roomId, userId: 'currentUser' });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        try {
            const uploaded = await chatService.uploadChatFile(roomId, file);
            
            await chatService.sendMessage(roomId, '', [uploaded]);
            
            if (socket) {
                socket.emit('send_message', {
                    roomId,
                    attachments: [uploaded]
                });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedAudio(url);
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const cancelRecording = () => {
        setRecordedAudio(null);
        setAudioBlob(null);
        setIsPlayingPreview(false);
    };

    const sendAudio = async () => {
        if (!audioBlob) return;
        
        setIsUploading(true);
        const audioFile = new File([audioBlob], `voice-memo-${Date.now()}.webm`, { type: 'audio/webm' });
        
        try {
            const uploaded = await chatService.uploadChatFile(roomId, audioFile);
            await chatService.sendMessage(roomId, '', [uploaded]);
            cancelRecording();
        } catch (error) {
            console.error('Error sending audio:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const toggleAudioPreview = () => {
        if (audioPreviewRef.current) {
            if (isPlayingPreview) {
                audioPreviewRef.current.pause();
            } else {
                audioPreviewRef.current.play();
            }
            setIsPlayingPreview(!isPlayingPreview);
        }
    };

    return (
        <div className="bg-white px-6 py-4 border-t border-slate-100">
            <div className="flex items-end gap-3">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAttachments(!showAttachments)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 border border-slate-100 transition-all"
                    >
                        <Paperclip size={20} />
                    </button>
                </div>

                <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-600/5 focus-within:border-rose-600/20 transition-all overflow-hidden flex flex-col">
                    {recordedAudio && (
                        <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: 'auto' }}
                            className="px-4 py-3 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={toggleAudioPreview}
                                    className="w-10 h-10 flex items-center justify-center bg-rose-600 text-foreground rounded-xl hover:bg-rose-700 transition-all"
                                >
                                    {isPlayingPreview ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                                </button>
                                <div className="text-[10px] font-black text-rose-600 uppercase tracking-wider">Voice Message Ready</div>
                                <audio ref={audioPreviewRef} src={recordedAudio} onEnded={() => setIsPlayingPreview(false)} className="hidden" />
                            </div>
                            <button onClick={cancelRecording} className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}

                    <textarea
                        value={message}
                        onChange={handleTyping}
                        onKeyDown={handleKeyDown}
                        placeholder={isRecording ? "Recording..." : "Type a message..."}
                        disabled={isRecording || disabled}
                        rows={1}
                        className="w-full bg-transparent py-4 px-6 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none resize-none max-h-32 no-scrollbar"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 border border-slate-100 transition-all"
                    >
                        <Smile size={20} />
                    </button>

                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full right-0 mb-3 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 flex gap-1 z-50"
                            >
                                {EMOJI_LIST.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => {
                                            setMessage(prev => prev + emoji);
                                            setShowEmojiPicker(false);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all hover:scale-125 text-xl"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={
                        recordedAudio 
                            ? sendAudio 
                            : isRecording 
                                ? stopRecording 
                                : (message.trim() ? handleSend : startRecording)
                    }
                    disabled={isUploading}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                        isRecording 
                            ? 'bg-rose-600 text-foreground animate-pulse' 
                            : message.trim() 
                                ? 'bg-rose-600 text-foreground hover:bg-rose-700' 
                                : 'bg-background text-foreground hover:bg-backgroundlack'
                    }`}
                >
                    {isUploading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isRecording ? (
                        <Square size={16} fill="currentColor" />
                    ) : message.trim() ? (
                        <Send size={20} />
                    ) : (
                        <Mic size={20} />
                    )}
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <AnimatePresence>
                    {showAttachments && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-0 mb-3 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50"
                        >
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 rounded-2xl text-muted-foreground hover:text-rose-600 transition-all"
                                >
                                    <Image size={20} />
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 rounded-2xl text-muted-foreground hover:text-rose-600 transition-all"
                                >
                                    <FileText size={20} />
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 rounded-2xl text-muted-foreground hover:text-rose-600 transition-all"
                                >
                                    <File size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MessageComposer;
