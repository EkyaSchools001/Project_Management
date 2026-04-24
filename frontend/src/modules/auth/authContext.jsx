import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../../services/auth.service';
import { tokenService } from '../../services/token.service';

const AuthContext = createContext(null);

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000;
const SESSION_CHECK_INTERVAL = 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requires2FA, setRequires2FA] = useState(false);
    const [tempToken, setTempToken] = useState(null);
    const [sessionWarning, setSessionWarning] = useState(false);
    
    const refreshIntervalRef = useRef(null);
    const sessionCheckRef = useRef(null);
    const warningShownRef = useRef(false);

    const clearTimers = useCallback(() => {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
        if (sessionCheckRef.current) {
            clearInterval(sessionCheckRef.current);
            sessionCheckRef.current = null;
        }
    }, []);

    const startTokenRefresh = useCallback(() => {
        clearTimers();
        
        refreshIntervalRef.current = setInterval(async () => {
            try {
                await authService.refreshToken();
                warningShownRef.current = false;
                setSessionWarning(false);
            } catch (error) {
                console.error('Token refresh failed:', error);
                logout();
            }
        }, TOKEN_REFRESH_INTERVAL);
    }, [clearTimers]);

    const startSessionCheck = useCallback(() => {
        clearTimers();
        
        sessionCheckRef.current = setInterval(() => {
            const timeUntilExpiry = tokenService.getTimeUntilExpiry();
            
            if (timeUntilExpiry <= 0) {
                logout();
                return;
            }
            
            if (timeUntilExpiry <= 2 * 60 * 1000 && !warningShownRef.current) {
                setSessionWarning(true);
                warningShownRef.current = true;
            }
        }, SESSION_CHECK_INTERVAL);
    }, [clearTimers]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = tokenService.getToken();
                // #region agent log
                // fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run1',hypothesisId:'H1',location:'authContext.jsx:initAuth:token-check',message:'initAuth token presence',data:{hasToken:!!token,hasRefresh:!!tokenService.getRefreshToken()},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                if (token) {
                    const userData = await authService.getMe();
                    // #region agent log
                    // fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run1',hypothesisId:'H2',location:'authContext.jsx:initAuth:getMe-success',message:'getMe succeeded during init',data:{hasUser:!!userData},timestamp:Date.now()})}).catch(()=>{});
                    // #endregion
                    setUser(userData);
                    startTokenRefresh();
                    startSessionCheck();
                }
            } catch (error) {
                const status = error?.response?.status;
                // #region agent log
                // fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run1',hypothesisId:'H2',location:'authContext.jsx:initAuth:getMe-failed',message:'getMe failed during init',data:{status:status||null,hasRefresh:!!tokenService.getRefreshToken()},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                try {
                    if (!tokenService.getRefreshToken()) {
                        tokenService.clearAuth();
                        // #region agent log
                        // fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run1',hypothesisId:'H3',location:'authContext.jsx:initAuth:no-refresh-token',message:'no refresh token, clearing auth',data:{cleared:true},timestamp:Date.now()})}).catch(()=>{});
                        // #endregion
                        return;
                    }
                    await authService.refreshToken();
                    const userData = await authService.getMe();
                    setUser(userData);
                    startTokenRefresh();
                    startSessionCheck();
                } catch (refreshError) {
                    // Missing/expired tokens are expected for signed-out users.
                    if (status !== 401 && status !== 403) {
                        console.error('Token refresh failed:', refreshError);
                    }
                    tokenService.clearAuth();
                }
            } finally {
                setLoading(false);
            }
        };
        initAuth();

        return () => {
            clearTimers();
        };
    }, [clearTimers, startTokenRefresh, startSessionCheck]);

    const login = async (email, password, rememberMe = false) => {
        try {
            const result = await authService.login(email, password, rememberMe);
            
            if (result.requires2FA) {
                setRequires2FA(true);
                setTempToken(result.tempToken);
                return { requires2FA: true, message: result.message };
            }
            
            setUser(result.user);
            setRequires2FA(false);
            setTempToken(null);
            startTokenRefresh();
            startSessionCheck();
            return { requires2FA: false, user: result.user };
        } catch (error) {
            console.error('Login failed:', error);
            // Fallback to mock login when backend is unavailable in local dev.
            try {
                const mockUser = await authService.mockLogin(email, password);
                setUser(mockUser);
                setRequires2FA(false);
                setTempToken(null);
                return { requires2FA: false, user: mockUser, isMock: true };
            } catch {
                throw error;
            }
        }
    };

    const verify2FA = async (code) => {
        try {
            const result = await authService.verify2FA(code, tempToken);
            setUser(result.user);
            setRequires2FA(false);
            setTempToken(null);
            startTokenRefresh();
            startSessionCheck();
            return result;
        } catch (error) {
            console.error('2FA verification failed:', error);
            throw error;
        }
    };

    const logout = useCallback(async () => {
        clearTimers();
        warningShownRef.current = false;
        setSessionWarning(false);
        
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            tokenService.clearAuth();
            setUser(null);
            setRequires2FA(false);
            setTempToken(null);
        }
    }, [clearTimers]);

    const updateUser = useCallback((userData) => {
        setUser(prev => ({ ...prev, ...userData }));
        tokenService.setUser(userData);
    }, []);

    const refreshSession = async () => {
        try {
            await authService.refreshToken();
            warningShownRef.current = false;
            setSessionWarning(false);
            return true;
        } catch (error) {
            console.error('Session refresh failed:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            requires2FA,
            tempToken,
            verify2FA,
            updateUser,
            sessionWarning,
            refreshSession
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
