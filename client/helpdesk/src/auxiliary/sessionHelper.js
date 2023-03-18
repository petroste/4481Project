import { useCallback, useState } from 'react';

function useSessionStorage(key, initialState) {
    const [value, setValue] = useState(sessionStorage.getItem(key), initialState);
    const updatedSetValue = useCallback(
      newValue => {
        if (newValue === initialState || typeof newValue === 'undefined') {
          sessionStorage.removeItem(key);
        } else {
          sessionStorage.setItem(key, newValue);
        }
        setValue(newValue);
      },
      [initialState, key]
    );
    return [value, updatedSetValue];
  }

export default useSessionStorage;