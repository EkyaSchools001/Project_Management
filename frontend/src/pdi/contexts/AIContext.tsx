import React, { createContext, useContext, useState, useCallback } from 'react';

interface AIContextType {
    contextData: any;
    setContextData: (data: any) => void;
    clearContextData: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contextData, setContextData] = useState<any>(null);

    const updateContext = useCallback((data: any) => {
        setContextData(data);
    }, []);

    const clearContext = useCallback(() => {
        setContextData(null);
    }, []);

    return (
        <AIContext.Provider value={{ contextData, setContextData: updateContext, clearContextData: clearContext }}>
            {children}
        </AIContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAIContext = () => {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAIContext must be used within an AIProvider');
    }
    return context;
};
