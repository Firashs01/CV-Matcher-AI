import React, { createContext, useContext, useState, useCallback } from 'react';
import { dbService } from '../services/dbService';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshHistory = useCallback(async (userId, isAnonymous) => {
    if (!userId || isAnonymous) {
      setHistory([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await dbService.getUserHistory(userId, isAnonymous);
      setHistory(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectAnalysis = useCallback((analysis) => {
    setCurrentAnalysis(analysis);
  }, []);

  const addAnalysis = useCallback((analysis) => {
    setHistory(prev => [analysis, ...prev]);
    setCurrentAnalysis(analysis);
  }, []);

  const deleteAnalysis = useCallback(async (id) => {
    try {
      await dbService.deleteAnalysis(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete analysis:', err);
    }
  }, [currentAnalysis]);

  const value = {
    history,
    currentAnalysis,
    isLoading,
    error,
    refreshHistory,
    selectAnalysis,
    addAnalysis,
    deleteAnalysis,
    setCurrentAnalysis
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};
