import React, { ComponentProps, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) {
      setImage('');
      return;
    }

    const isDirectUrl = /^(https?:\/\/|data:|blob:)/i.test(path);
    if (isDirectUrl) {
      setImage(path);
      return;
    }

    let cancelled = false;
    setImage('');

    (async () => {
      const { data, error } = await supabase.storage
        .from('product-images')
        .download(path);

      if (error) {
        console.warn('Failed to download image from Supabase storage:', error.message || error);
      }

      if (data && !cancelled) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          if (!cancelled) {
            setImage(fr.result as string);
          }
        };
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path]);

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;