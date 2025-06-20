
import { useEffect } from 'react';

export const usePageTitle = (title: string, restoreTitle: boolean = true) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore previous title if component unmounts
    return () => {
      if (restoreTitle) {
        document.title = previousTitle;
      }
    };
  }, [title, restoreTitle]);
};
