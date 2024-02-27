import { useEffect, useState } from "react";

interface ImageDimensionsProps {
  file: File;
}

const ImageDimensions: React.FC<ImageDimensionsProps> = ({ file }) => {
  const [dimensions, setDimensions] = useState<string>("");

  useEffect(() => {
    getImageDimensions(file).then((result) => setDimensions(result));
  }, [file]);

  const getImageDimensions = async (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const dimensions = `${img.width}x${img.height}px`;
        resolve(dimensions);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  return <div>{dimensions}</div>;
};

export default ImageDimensions;
