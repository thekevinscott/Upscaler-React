import React, { FC, useState, useEffect, ImgHTMLAttributes } from 'react';
import Upscaler from 'upscaler';

interface IProps {
  model: string;
  scale?: number;
}

const models: {
  [index: string]: Upscaler;
} = {};

const getUpscaler = (model: string, scale?: number) => {
  if (!models[model]) {
    models[model] = new Upscaler({
      model,
      scale,
    });
  }

  return models[model];
};

const UpscaledImg: FC<IProps & ImgHTMLAttributes<HTMLImageElement>> = ({
  model,
  scale,
  src,
  ...imageProps
}) => {
  const [upscaler, setUpscaler] = useState<Upscaler>();
  const [upscaledSrc, setUpscaledSrc] = useState<string>();

  useEffect(() => {
    if (model) {
      setUpscaler(getUpscaler(model, scale));
    }
  }, [model, scale]);

  const upscale = async (src: string) => {
    const _upscaledSrc = await upscaler.upscale(src, {
      output: 'src',
    }) as string;
    setUpscaledSrc(_upscaledSrc);
  };

  useEffect(() => {
    if (upscaler) {
      upscale(src);
    }
  }, [upscaler, src]);

  if (upscaledSrc) {
    return (
      <img {...imageProps} src={upscaledSrc} />
    );
  }

  return null;
};

export default UpscaledImg;
