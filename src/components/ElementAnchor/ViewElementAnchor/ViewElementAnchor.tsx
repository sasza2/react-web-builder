import React from 'react';

type ViewElementAnchorProps = {
  anchorId: string,
};

export function ViewElementAnchor({ anchorId }: ViewElementAnchorProps) {
  return (
    <div id={anchorId} style={{ height: 0, maxHeight: 0, visibility: 'hidden' }} />
  );
}
