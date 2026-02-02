import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.storageArea === sessionStorage) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing sessionStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export const useStorage = (type = 'local', key, initialValue) => {
  const storage = type === 'session' ? useSessionStorage : useLocalStorage;
  return storage(key, initialValue);
};

export const useStorageObject = (key, initialValue = {}) => {
  const [storedValue, setValue, removeValue] = useLocalStorage(key, initialValue);

  const get = useCallback((property, defaultValue = null) => {
    return storedValue[property] ?? defaultValue;
  }, [storedValue]);

  const set = useCallback((property, value) => {
    setValue(prev => ({
      ...prev,
      [property]: value
    }));
  }, [setValue]);

  const remove = useCallback((property) => {
    setValue(prev => {
      const newValue = { ...prev };
      delete newValue[property];
      return newValue;
    });
  }, [setValue]);

  const update = useCallback((updater) => {
    setValue(prev => ({
      ...prev,
      ...(typeof updater === 'function' ? updater(prev) : updater)
    }));
  }, [setValue]);

  const clear = useCallback(() => {
    setValue({});
  }, [setValue]);

  const has = useCallback((property) => {
    return property in storedValue;
  }, [storedValue]);

  const keys = useCallback(() => {
    return Object.keys(storedValue);
  }, [storedValue]);

  const values = useCallback(() => {
    return Object.values(storedValue);
  }, [storedValue]);

  const entries = useCallback(() => {
    return Object.entries(storedValue);
  }, [storedValue]);

  return {
    value: storedValue,
    get,
    set,
    remove,
    update,
    clear,
    has,
    keys,
    values,
    entries,
    removeValue
  };
};

export const useStorageArray = (key, initialValue = []) => {
  const [storedValue, setValue, removeValue] = useLocalStorage(key, initialValue);

  const push = useCallback((...items) => {
    setValue(prev => [...prev, ...items]);
  }, [setValue]);

  const pop = useCallback(() => {
    let popped;
    setValue(prev => {
      const newArray = [...prev];
      popped = newArray.pop();
      return newArray;
    });
    return popped;
  }, [setValue]);

  const shift = useCallback(() => {
    let shifted;
    setValue(prev => {
      const newArray = [...prev];
      shifted = newArray.shift();
      return newArray;
    });
    return shifted;
  }, [setValue]);

  const unshift = useCallback((...items) => {
    setValue(prev => [...items, ...prev]);
  }, [setValue]);

  const splice = useCallback((start, deleteCount, ...items) => {
    let removed;
    setValue(prev => {
      const newArray = [...prev];
      removed = newArray.splice(start, deleteCount, ...items);
      return newArray;
    });
    return removed;
  }, [setValue]);

  const filter = useCallback((callback) => {
    setValue(prev => prev.filter(callback));
  }, [setValue]);

  const map = useCallback((callback) => {
    setValue(prev => prev.map(callback));
  }, [setValue]);

  const find = useCallback((callback) => {
    return storedValue.find(callback);
  }, [storedValue]);

  const findIndex = useCallback((callback) => {
    return storedValue.findIndex(callback);
  }, [storedValue]);

  const includes = useCallback((item) => {
    return storedValue.includes(item);
  }, [storedValue]);

  const indexOf = useCallback((item) => {
    return storedValue.indexOf(item);
  }, [storedValue]);

  const sort = useCallback((compareFunction) => {
    setValue(prev => [...prev].sort(compareFunction));
  }, [setValue]);

  const reverse = useCallback(() => {
    setValue(prev => [...prev].reverse());
  }, [setValue]);

  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  const length = storedValue.length;

  return {
    value: storedValue,
    push,
    pop,
    shift,
    unshift,
    splice,
    filter,
    map,
    find,
    findIndex,
    includes,
    indexOf,
    sort,
    reverse,
    clear,
    length,
    removeValue
  };
};

export const useStorageWithExpiry = (key, initialValue, expiryInMinutes = 60) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      if (!item) {
        return initialValue;
      }

      const { value, expiry } = JSON.parse(item);
      
      if (Date.now() > expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value, customExpiry = expiryInMinutes) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const expiry = Date.now() + (customExpiry * 60 * 1000);
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify({ value: valueToStore, expiry }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, expiryInMinutes]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  const getTimeRemaining = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      if (!item) {
        return 0;
      }

      const { expiry } = JSON.parse(item);
      const timeRemaining = expiry - Date.now();
      
      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      return 0;
    }
  }, [key]);

  const isExpired = useCallback(() => {
    return getTimeRemaining() === 0;
  }, [getTimeRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isExpired()) {
        setStoredValue(initialValue);
        window.localStorage.removeItem(key);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [key, initialValue, isExpired]);

  return [storedValue, setValue, removeValue, { getTimeRemaining, isExpired }];
};