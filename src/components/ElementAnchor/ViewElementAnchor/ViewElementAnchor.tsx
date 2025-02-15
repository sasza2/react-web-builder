import React from 'react';

const ANCHOR_STYLE: React.CSSProperties = {
  height: 0,
  maxHeight: 0,
  pointerEvents: 'none',
  visibility: 'hidden',
};

type ViewElementAnchorProps = {
  anchorId: string,
};

export function ViewElementAnchor({ anchorId }: ViewElementAnchorProps) {
  return (
    <div
      className="react-web-builder-component-anchor"
      id={anchorId}
      style={ANCHOR_STYLE}
    />
  );
}
