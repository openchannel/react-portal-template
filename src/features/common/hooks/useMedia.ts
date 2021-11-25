import * as React from 'react';

export function useMedia() {
  const [value, setValue] = React.useState(false);
  React.useEffect(() => {
    const mediaQueryList = window.matchMedia('(max-width: 768px)');
    const handler = () => setValue(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', handler);
    handler();

    return () => mediaQueryList.removeEventListener('change', handler);
  }, []);
  return value;
}
