
import { useEffect } from 'react';

export const usePageTitle = (title: string, restoreTitle: boolean = true) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Only restore title if explicitly requested and component unmounts
    return () => {
      if (restoreTitle && previousTitle !== title) {
        document.title = previousTitle;
      }
    };
  }, [title, restoreTitle]);
};
