import { useState } from 'react';
import { MediaObject } from '../types/MediaTypes';

export const useMedia = () => {
  const [media, setMedia] = useState<MediaObject[]>();

  const addMedia = (mediaObj: MediaObject) => {
    setMedia((prevMedia) => {
      if (prevMedia === undefined) {
        return [mediaObj];
      }
      return [...prevMedia, mediaObj];
    });
  };

  const removeMedia = (mediaUrl: string) => {
    const mediaObj = media?.filter((x) => x.url === mediaUrl);

    //mediaObj should always be one
    if (mediaObj !== undefined && mediaObj.length === 1)
      setMedia((prevMedia) => {
        return prevMedia?.filter((x) => x !== mediaObj[0]);
      });
  };

  return { media, setMedia, addMedia, removeMedia };
};
