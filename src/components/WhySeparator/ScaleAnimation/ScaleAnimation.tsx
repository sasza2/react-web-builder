import React from 'react';

type ScaleAnimationProps = React.PropsWithChildren<{
  maxWidth: number,
}>;

export function ScaleAnimation({ children, maxWidth }: ScaleAnimationProps) {
  const scale = maxWidth > window.innerWidth ? window.innerWidth / maxWidth : 1;
  return (
    <div style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}>
      {children}
    </div>
  );
}
