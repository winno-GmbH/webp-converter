import { formatSize } from "@/app/utils/utils";
import ImageDimensions from "./ImageDimensions";
import Preloader from "../Preloader/Preloader";
import { useEffect, useState } from "react";
import styles from "./FilePreview.module.css";
import Image from "next/image";
import React from "react";

interface fileSettings {
  resize: number;
  quality: number;
  selected?: boolean;
}

interface FilePreviewProps {
  file: File;
  resize: number;
  quality: number;
  selected: boolean;
  onRemove: () => void;
  onDownload: (file: File, settings: fileSettings) => void;
  onShow: (file: File, quality: number, resize: number) => void;
  onSelect: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = React.memo(
  ({ file, resize, quality, selected, onRemove, onDownload, onShow, onSelect }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        setIsLoading(true);
        setIsLoading(false);
      };

      loadImage();
    }, []);

    useEffect(() => {
      console.log("Preview Rerender");

      const loadImage = async () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 100); // Adjust the delay as needed
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
              <div className={styles.fileCardHeader}>
                <span>Resize: {resize.toString()}</span>
                <span>Quality: {quality.toString()}</span>
                {/* <span>Selected: {selected.toString()}</span> */}
                {/* <button onClick={onSelect}>+</button> */}
              </div>
              {/* <img
              src={URL.createObjectURL(file)}
              alt={`Preview of ${file.name}`}
              className={styles.fileImage}
              onClick={() => onShow(file, quality, resize)}
            /> */}

              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview of ${file.name}`}
                className={styles.fileImage}
                onClick={() => onShow(file, quality, resize)}
                width={160}
                height={120}
              />
            </div>
            <div>
              <div className={styles.fileName}>{file.name}</div>
              <div>Size: {formatSize(file.size)}</div>
              <div>Type: {file.type}</div>
              <ImageDimensions file={file} />
            </div>

            <button
              title="Select image"
              className={`${styles.fileSelect} ${selected ? styles.selected : styles.unselected}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {/* &times;               */}
              {selected ? "+" : ""}
            </button>
            <button title="Remove image" className={styles.fileRemove} onClick={onRemove}>
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
  }
);

FilePreview.displayName = "FilePreview";

export default FilePreview;
