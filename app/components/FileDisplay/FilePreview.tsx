import { formatSize } from "@/app/utils/utils";
import ImageDimensions from "./ImageDimensions";
import Preloader from "../Preloader/Preloader";
import { useEffect, useState } from "react";
import styles from "./FilePreview.module.css";

interface fileSettings {
  resize: number;
  quality: number;
}

interface FilePreviewProps {
  file: File;
  resize: number;
  quality: number;
  onRemove: () => void;
  onDownload: (file: File, settings: fileSettings) => void;
  onShow: (file: File, quality: number, resize: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, resize, quality, onRemove, onDownload, onShow }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setIsLoading(false);
    };

    loadImage();
  }, [file]);

  return (
    <div
      className={`${styles.filePreview} ${file.type === "image/webp" ? styles.fileWebp : styles.fileOriginal}`}

      //   className={`border p-2 max-w-36 ${
      //     file.type === "image/webp" ? "bg-green-200" : "bg-slate-100"
      //   }  rounded-md cursor-pointer`}
    >
      {isLoading ? (
        <div className="w-full h-40 flex items-center justify-center bg-gray-200">
          {/* Loading... */}
          <Preloader />
        </div>
      ) : (
        <div className={styles.fileCard} onClick={() => console.log(file.name)}>
          <div>
            {/* <div className={styles.fileCardHeader}>
              <span>Resize: {resize.toString()}</span>
              <span>Quality: {quality.toString()}</span>
            </div> */}
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview of ${file.name}`}
              className={styles.fileImage}
              onClick={() => onShow(file, quality, resize)}
            />
          </div>
          <div>
            <div className={styles.fileName}>{file.name}</div>
            <div>Size: {formatSize(file.size)}</div>
            <div>Type: {file.type}</div>
            <ImageDimensions file={file} />
          </div>
          <button className={styles.fileRemove} onClick={onRemove}>
            &times;
          </button>

          <button
            className={styles.saveAsWebp}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(file, { resize, quality });
            }}
          >
            Save as *.webp
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
