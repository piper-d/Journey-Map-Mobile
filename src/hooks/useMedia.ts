import { useState } from 'react';

export const useMedia = () => {
  const [media, setMedia] = useState<string[]>();

  const addMedia = (mediaUrl: string) => {
    setMedia((prevMedia) => {
      if (prevMedia === undefined) {
        return [mediaUrl];
      }
      return [...prevMedia, mediaUrl];
    });
  };

  const removeMedia = (mediaUrl: string) => {
    setMedia((prevMedia) => {
      return prevMedia?.filter((x) => x !== mediaUrl);
    });
  };

  return { media, addMedia, removeMedia };
};
