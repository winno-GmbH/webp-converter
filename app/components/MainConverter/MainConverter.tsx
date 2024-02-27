"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UploadIcon } from "@/app/assets/icons/svg/upload-icon";
import { PlayIcon } from "@/app/assets/icons/svg/play-icon";
import FileDisplay from "../FileDisplay/FileDisplay";
import Preloader from "../Preloader/Preloader";
import { DownloadIcon } from "@/app/assets/icons/svg/download-icon";
import styles from "./MainConverter.module.css";

interface fileSettings {
  resize: number;
  quality: number;
}

const MainConverter: React.FC = () => {
  const [convertedFiles, setConvertedFiles] = useState<{ file: File; settings: fileSettings }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; settings: fileSettings }[]>([]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [newFileName, setNewFileName] = useState<string>("");
  const [newResize, setNewResize] = useState<string>("");
  const [newQuality, setNewQuality] = useState<string>("");
  const [albumName, setAlbumName] = useState<string>("My files");

  // const [resize, setResize] = useState<number>(0.7);
  // const [quality, setQuality] = useState<number>(0.8);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultResize = 1;
  const defaultQuality = 0.8;

  const [resize, setResize] = useState<number>(defaultResize);
  const [quality, setQuality] = useState<number>(defaultQuality);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedResizeString = localStorage.getItem("imageResize");
  //     const storedResize = storedResizeString ? parseFloat(storedResizeString) : defaultResize;
  //     setResize(storedResize);

  //     const storedQualityString = localStorage.getItem("imageQuality");
  //     const storedQuality = storedQualityString ? parseFloat(storedQualityString) : defaultQuality;
  //     setQuality(storedQuality);
  //   }
  // }, []);

  // // Update localStorage when settings change
  // useEffect(() => {
  //   if (resize !== defaultResize) localStorage.setItem("imageResize", resize.toString());
  // }, [resize]);

  // useEffect(() => {
  //   if (quality !== defaultQuality) localStorage.setItem("imageQuality", quality.toString());
  // }, [quality]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileDrop(event.dataTransfer.files);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsLoading(true);
      const newFiles = Array.from(files).map((file) => ({
        file,
        settings: { resize, quality }, // Use resize and quality states
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setIsLoading(false);
    }
  };

  const handleRemoveFile = (index: number, source: "uploaded" | "converted") => {
    if (source === "uploaded") {
      setUploadedFiles((prevUploadedFiles) => {
        const newUploadedFiles = [...prevUploadedFiles];
        newUploadedFiles.splice(index, 1);
        return newUploadedFiles;
      });
    } else if (source === "converted") {
      setConvertedFiles((prevConvertedFiles) => {
        const newConvertedFiles = [...prevConvertedFiles];
        newConvertedFiles.splice(index, 1);
        return newConvertedFiles;
      });
    }
  };

  const handleFileDrop = (files: FileList | null) => {
    if (files) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      const filteredFiles = Array.from(files).filter((file) => allowedTypes.includes(file.type));

      const newFiles = Array.from(filteredFiles).map((file) => ({
        file,
        settings: { resize, quality }, // Use resize and quality states
      }));

      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const convertToWebP = async (file: File, settings: fileSettings): Promise<File> => {
    // console.log(settings.resize);
    return new Promise((resolve) => {
      if (file.type === "image/webp") {
        // If the file is already in WebP format, resolve with the original file
        resolve(file);
      } else {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width * settings.resize;
          canvas.height = img.height * settings.resize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, img.width * settings.resize, img.height * settings.resize);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                    type: "image/webp",
                  });
                  resolve(webpFile);
                }
              },
              "image/webp",
              settings.quality
            );
          }
        };
        img.src = URL.createObjectURL(file);
      }
    });
  };

  const handleConvertToWebP = async () => {
    // const convertedFilesArray = await Promise.all(uploadedFiles.map((file) => convertToWebP(file)));

    //! Maybe here we can also add original file sizes to count % compression

    const convertedFilesArray = await Promise.all(
      uploadedFiles.map(async ({ file, settings }) => {
        const convertedFile = await convertToWebP(file, settings);
        return { file: convertedFile, settings };
      })
    );

    setConvertedFiles(convertedFilesArray);
  };

  const handleDownloadSingleFile = async (file: File, settings: fileSettings) => {
    const convertedFile = await convertToWebP(file, settings);
    saveAs(convertedFile, convertedFile.name.replace(/\.[^.]+$/, ".webp"));
  };

  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    /** Here we can add some progress bar - or at least preloader while generating WebP files  */

    const convertedFilesArray = await Promise.all(
      uploadedFiles.map(async ({ file, settings }) => {
        const convertedFile = await convertToWebP(file, settings);
        return { file: convertedFile, settings };
      })
    );

    convertedFilesArray.forEach((file, index) => {
      // zip.file(`converted-${index + 1}.webp`, file);
      // zip.file(`conv-${file.name + 1}.webp`, file);
      zip.file(`${file.file.name}`, file.file);
    });

    zip.generateAsync({ type: "blob" }).then((content: any) => {
      saveAs(content, `${albumName.replace(" ", "_")}-webp.zip`);
    });
  };

  const handleShowImage = (file: File, resize: number, quality: number) => {
    setSelectedImage(file);
    setShowImageModal(true);
    setNewFileName(file.name);
    setNewResize(resize.toString());
    setNewQuality(quality.toString());
  };

  return (
    <main>
      <h1>Online Image Converter</h1>

      <div className={styles.navigation}>
        <label className={styles.uploadLabel}>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept=".jpg, .jpeg, .png, .webp"
            className={styles.uploadInput}
          />
          <span className={`${styles.bigButton} ${styles.uploadButton}`}>
            <UploadIcon />
            Upload Images
          </span>
        </label>
        <div className={styles.uploadRange}>
          <span>Resize: </span>
          <input
            type="range"
            min="10"
            max="100"
            value={resize * 100}
            id="resizeRange"
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              const roundedValue = (parsedValue / 100).toFixed(2);
              setResize(parseFloat(roundedValue));
            }}
          />
          <span id="resizePercent" className={styles.uploadPercents}>
            {Math.round(resize * 100)}
          </span>
          %
        </div>
        <div className={styles.uploadRange}>
          <span>Quality: </span>
          <input
            type="range"
            min="10"
            max="100"
            value={quality * 100}
            id="qualityRange"
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              const roundedValue = (parsedValue / 100).toFixed(2);
              setQuality(parseFloat(roundedValue));
            }}
          />
          <span id="qualityPercent" className={styles.uploadPercents}>
            {Math.round(quality * 100)}
          </span>
          %
        </div>
        {/* <button className={`${styles.bigButton} ${styles.convertButton}`} onClick={handleConvertToWebP}>
          <PlayIcon />
          Convert to WebP
        </button> */}

        <button className={`${styles.bigButton} ${styles.downloadButton}`} onClick={handleDownloadAllAsZip}>
          <DownloadIcon /> Save all as *.zip
          {/* <span>{uploadedFiles.length}</span> */}
        </button>
      </div>

      {/* Drag and drop area */}
      <div
        className={`${styles.dragDropArea} ${isDragging ? styles.dragOver : styles.dragOut}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>You can drop your files here...</p>
      </div>

      {/* Uploaded Files area */}
      {isLoading && (
        <div style={{ backgroundColor: "red" }}>
          {/* Loading... */}
          <Preloader />
        </div>
      )}
      {uploadedFiles.length !== 0 && (
        <>
          <FileDisplay
            // title={`Album name: ${albumName} / maybe can make it editable later. And use to save and store images in DB.`}
            title="Uploaded files"
            // files={uploadedFiles}
            files={uploadedFiles.map(({ file }) => file)}
            settings={uploadedFiles.map(({ settings }) => settings)}
            onRemoveFile={(index) => handleRemoveFile(index, "uploaded")}
            onDownloadFile={handleDownloadSingleFile}
            onShow={handleShowImage}
          />
        </>
      )}
    </main>
  );
};

export default MainConverter;
