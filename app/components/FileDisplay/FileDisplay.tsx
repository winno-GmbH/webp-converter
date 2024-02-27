"use client";

import FilePreview from "./FilePreview";
import styles from "./FileDisplay.module.css";
import { EditIcon } from "@/app/assets/icons/svg/edit-icon";

interface fileSettings {
  resize: number;
  quality: number;
}

interface FileDisplayProps {
  title: string;
  files: File[];
  // files: { file: File; settings: fileSettings }[]
  settings?: fileSettings[];
  onRemoveFile: (index: number) => void;
  onDownloadFile: (file: File, settings: fileSettings) => void;
  onShow: (file: File, resize: number, quality: number) => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({
  title,
  files,
  settings = [],
  onRemoveFile,
  onDownloadFile,
  onShow,
}) => {
  console.log(settings);

  return (
    <div className={styles.displayBlock}>
      <h3 className={styles.displayTitle}>
        {title}
        {/* <EditIcon /> */}
      </h3>

      <div className={styles.displayWrapper}>
        {files.map((file, index) => (
          <FilePreview
            key={index}
            file={file}
            resize={settings[index]?.resize || 1}
            quality={settings[index]?.quality || 1}
            onRemove={() => onRemoveFile(index)}
            onDownload={() => onDownloadFile(file, settings[index])}
            onShow={() => onShow(file, settings[index]?.resize, settings[index]?.quality)}
          />
        ))}
      </div>
    </div>
  );
};

export default FileDisplay;
