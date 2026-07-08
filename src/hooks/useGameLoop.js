import { useRef, useEffect, useCallback } from 'react';
import { GameLoop } from '../game';

export function useGameLoop(update, render) {
  const loopRef = useRef(null);

  useEffect(() => {
    const loop = new GameLoop(update, render);
    loopRef.current = loop;
    loop.start();

    return () => loop.stop();
  }, [update, render]);

  return loopRef;
}
