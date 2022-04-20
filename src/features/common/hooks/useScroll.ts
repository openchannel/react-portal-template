import * as React from 'react';

export const useScroll = (x = 0, y = 0) => {
  React.useLayoutEffect(() => {
    window.scroll(x, y);
  }, []);
};
