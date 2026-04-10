// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
    VideoCamera, 
    VideoCameraSlash, 
    Microphone, 
    MicrophoneSlash, 
    ScreenShare, 
    ChatCircle, 
    Users,
    PhoneDisconnect,
    Monitor,
    Desktop,
    PaperPlaneTilt,
    X
} from '@phosphor-icons/react';

export type MeetingProvider = 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';

interface Participant {
    id: string;
    name: string;
    email?: string;
    role: 'host' | 'participant';
    isMuted: boolean;
    isVideoOn: boolean;
    isScreenSharing: boolean;
}

interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: Date;
}

interface VideoConferenceProps {
    meetingId: string;
    meetingUrl?: string;
    meetingType: MeetingProvider;
    currentUser: {
        id: string;
        name: string;
        email?: string;
    };
    participants: Participant[];
    onLeave?: () => void;
}

export function VideoConference({ 
    meetingId, 
    meetingUrl, 
    meetingType,
    currentUser, 
    participants: initialParticipants,
    onLeave 
}: VideoConferenceProps) {
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        
        const message: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            message: newMessage,
            timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const handleToggleVideo = () => setIsVideoOn(!isVideoOn);
    const handleToggleMic = () => setIsMicOn(!isMicOn);
    const handleToggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

    const getEmbedUrl = (url: string, type: MeetingProvider) => {
        if (type === 'zoom') {
            return url;
        }
        if (type === 'google_meet') {
            return url;
        }
        if (type === 'microsoft_teams') {
            return url;
        }
        return url;
    };

    return (
        <div className="flex h-screen bg-background">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 relative bg-black">
                    {meetingUrl ? (
                        <iframe
                            src={getEmbedUrl(meetingUrl, meetingType)}
                            className="w-full h-full"
                            allow="camera; microphone; fullscreen; display-capture"
                            title="Video Conference"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-white">
                                <VideoCamera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Starting video conference...</p>
                                <p className="text-sm text-muted-foreground mt-2">Meeting ID: {meetingId}</p>
                            </div>
                        </div>
                    )}
                    
                    {isScreenSharing && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                            <Monitor className="h-4 w-4" />
                            Screen sharing active
                        </div>
                    )}
                </div>

                <div className="bg-card border-t p-4">
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            variant={isMicOn ? 'default' : 'destructive'}
                            size="lg"
                            className="rounded-full h-12 w-12"
                            onClick={handleToggleMic}
                        >
                            {isMicOn ? <Microphone className="h-5 w-5" /> : <MicrophoneSlash className="h-5 w-5" />}
                        </Button>
                        
                        <Button
                            variant={isVideoOn ? 'default' : 'destructive'}
                            size="lg"
                            className="rounded-full h-12 w-12"
                            onClick={handleToggleVideo}
                        >
                            {isVideoOn ? <VideoCamera className="h-5 w-5" /> : <VideoCameraSlash className="h-5 w-5" />}
                        </Button>
                        
                        <Button
                            variant={isScreenSharing ? 'secondary' : 'default'}
                            size="lg"
                            className="rounded-full h-12 w-12"
                            onClick={handleToggleScreenShare}
                        >
                            {isScreenSharing ? <Desktop className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
                        </Button>
                        
                        <Button
                            variant={showChat ? 'secondary' : 'default'}
                            size="lg"
                            className="rounded-full h-12 w-12"
                            onClick={() => {
                                setShowChat(!showChat);
                                if (!showChat) setShowParticipants(false);
                            }}
                        >
                            <ChatCircle className="h-5 w-5" />
                        </Button>
                        
                        <Button
                            variant={showParticipants ? 'secondary' : 'default'}
                            size="lg"
                            className="rounded-full h-12 w-12"
                            onClick={() => {
                                setShowParticipants(!showParticipants);
                                if (!showParticipants) setShowChat(false);
                            }}
                        >
                            <Users className="h-5 w-5" />
                        </Button>
                        
                        <Button
                            variant="destructive"
                            size="lg"
                            className="rounded-full h-12 w-12"
                            onClick={onLeave}
                        >
                            <PhoneDisconnect className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {showChat && (
                <div className="w-80 border-l bg-card flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <CardTitle className="text-lg">Chat</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {chatMessages.length === 0 ? (
                                <p className="text-center text-muted-foreground text-sm">No messages yet</p>
                            ) : (
                                chatMessages.map(msg => (
                                    <div key={msg.id} className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{msg.senderName}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm bg-muted p-2 rounded-md">{msg.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon">
                                <PaperPlaneTilt className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {showParticipants && (
                <div className="w-80 border-l bg-card flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <CardTitle className="text-lg">Participants ({participants.length})</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setShowParticipants(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3">
                            {participants.map(participant => (
                                <div key={participant.id} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{participant.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {participant.name}
                                            {participant.id === currentUser.id && <span className="text-muted-foreground"> (You)</span>}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {participant.isMuted && <MicrophoneSlash className="h-4 w-4 text-muted-foreground" />}
                                        {!participant.isVideoOn && <VideoCameraSlash className="h-4 w-4 text-muted-foreground" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
