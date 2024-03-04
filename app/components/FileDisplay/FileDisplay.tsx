"use client";

import FilePreview from "./FilePreview";
import styles from "./FileDisplay.module.css";
import { EditIcon } from "@/app/assets/icons/svg/edit-icon";
import React, { useEffect } from "react";

interface fileSettings {
  resize: number;
  quality: number;
  selected?: boolean;
}

interface FileDisplayProps {
  title: string;
  files: File[];
  // files: { file: File; settings: fileSettings }[]
  settings?: fileSettings[];
  onRemoveFile: (index: number) => void;
  onDownloadFile: (file: File, settings: fileSettings) => void;
  onRenameAlbum: (albumName: string) => void;
  onShow: (file: File, resize: number, quality: number) => void;
  onSelectFile: (index: number) => void;
}

const FileDisplay: React.FC<FileDisplayProps> = React.memo(
  ({ title, files, settings = [], onRemoveFile, onDownloadFile, onRenameAlbum, onShow, onSelectFile }) => {
    console.log(settings);

    useEffect(() => {
      console.log("FileDisplay rerendering");
    }, []);

    return (
      <div className={styles.displayBlock}>
        {/* <h3 className={styles.displayTitle}>{title}</h3> */}
        <div className={styles.displayHeader}>
          <div className={styles.displayTitle}>
            <input
              required
              name="album"
              placeholder="Input the package name, please"
              defaultValue={title}
              onBlur={(e) => onRenameAlbum(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />
            <EditIcon />
          </div>
          {/* <div>select all</div> */}
        </div>

        <div className={styles.displayWrapper}>
          {files.map((file, index) => (
            <FilePreview
              // key={file.name}
              key={index}
              file={file}
              resize={settings[index]?.resize || 1}
              quality={settings[index]?.quality || 1}
              selected={settings[index]?.selected || false}
              onRemove={() => onRemoveFile(index)}
              onDownload={() => onDownloadFile(file, settings[index])}
              onShow={() => onShow(file, settings[index]?.resize, settings[index]?.quality)}
              onSelect={() => onSelectFile(index)}
            />
          ))}
        </div>
      </div>
    );
  }
);

FileDisplay.displayName = "FileDisplay";

export default FileDisplay;
