import { useState, useEffect, useRef, useCallback } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setIsDebouncing(false);
    };
  }, [value, delay]);

  return [debouncedValue, isDebouncing];
};

export const useDebouncedCallback = (callback, delay = 500, dependencies = []) => {
  const timeoutRef = useRef();
  const callbackRef = useRef(callback);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsPending(true);
    
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
      setIsPending(false);
    }, delay);
  }, [delay, ...dependencies]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsPending(false);
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      callbackRef.current();
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedCallback, cancel, flush, isPending];
};

export const useThrottle = (value, limit = 500) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  const [isThrottling, setIsThrottling] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
        setIsThrottling(false);
      } else {
        setIsThrottling(true);
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return [throttledValue, isThrottling];
};

export const useThrottledCallback = (callback, limit = 500, dependencies = []) => {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef();
  const callbackRef = useRef(callback);
  const [isThrottling, setIsThrottling] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback((...args) => {
    if (Date.now() - lastRan.current < limit) {
      setIsThrottling(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        lastRan.current = Date.now();
        setIsThrottling(false);
      }, limit - (Date.now() - lastRan.current));
    } else {
      callbackRef.current(...args);
      lastRan.current = Date.now();
      setIsThrottling(false);
    }
  }, [limit, ...dependencies]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsThrottling(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [throttledCallback, cancel, isThrottling];
};

export const useDebouncedState = (initialValue, delay = 500) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setIsDebouncing(false);
    };
  }, [value, delay]);

  return [
    value,
    setValue,
    debouncedValue,
    isDebouncing,
    {
      cancel: () => setIsDebouncing(false),
      flush: () => {
        setDebouncedValue(value);
        setIsDebouncing(false);
      }
    }
  ];
};

export const useDebouncedEffect = (effect, deps, delay = 500) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

export const useSearch = (initialValue = '', delay = 500, onSearch) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedSearch, isDebouncing] = useDebounce(searchValue, delay);

  useEffect(() => {
    if (onSearch && debouncedSearch !== undefined) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  return {
    searchValue,
    debouncedSearch,
    isDebouncing,
    handleSearchChange,
    clearSearch
  };
};

export const useAutoSave = (value, onSave, delay = 1000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveCount, setSaveCount] = useState(0);
  const [debouncedValue] = useDebounce(value, delay);

  useEffect(() => {
    if (debouncedValue !== undefined && onSave) {
      setIsSaving(true);
      
      const save = async () => {
        try {
          await onSave(debouncedValue);
          setLastSaved(new Date());
          setSaveCount(prev => prev + 1);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      };

      save();
    }
  }, [debouncedValue, onSave]);

  const forceSave = useCallback(async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(value);
      setLastSaved(new Date());
      setSaveCount(prev => prev + 1);
    } catch (error) {
      console.error('Force save failed:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [value, onSave]);

  return {
    isSaving,
    lastSaved,
    saveCount,
    forceSave
  };
};