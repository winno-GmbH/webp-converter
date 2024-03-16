"use client";

import { MouseEventHandler, SetStateAction, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UploadIcon } from "@/app/assets/icons/svg/upload-icon";
// import { PlayIcon } from "@/app/assets/icons/svg/play-icon";
import FileDisplay from "../FileDisplay/FileDisplay";
import Preloader from "../Preloader/Preloader";
import Saveloader from "../Preloader/Saveloader";
import { DownloadIcon } from "@/app/assets/icons/svg/download-icon";
import styles from "./MainConverter.module.css";
import InputResize from "./InputResize";
import InputQuality from "./InputQuality";
import ImageDimensions from "../FileDisplay/ImageDimensions";
import { formatSize } from "@/app/utils/utils";
import { DragDropIcon } from "@/app/assets/icons/svg/drag-drop-icon";

interface fileSettings {
  resize: number;
  quality: number;
  selected?: boolean;
}

const MainConverter: React.FC = () => {
  const [convertedFiles, setConvertedFiles] = useState<{ file: File; settings: fileSettings }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; settings: fileSettings }[]>([]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<File | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const [newFileName, setNewFileName] = useState<string>("");
  const [newResize, setNewResize] = useState<string>("");
  const [newQuality, setNewQuality] = useState<string>("");

  const [albumName, setAlbumName] = useState<string>("My files");

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const defaultResize = 1;
  const defaultQuality = 0.75;

  const [resize, setResize] = useState<number>(defaultResize);
  const [quality, setQuality] = useState<number>(defaultQuality);
  // const modalFileNameRef = useRef<HTMLInputElement>(null);

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
    setIsLoading(true);
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        settings: { resize, quality, selected: true }, // Use resize and quality states
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    setIsLoading(false);
  };

  const handleRemoveFile = (index: number, source: "uploaded" | "converted") => {
    console.log("remove", index);

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

  const handleSelectFile = (index: number) => {
    // console.log("Select", index);

    // console.log(uploadedFiles[index].settings.selected);
    // uploadedFiles[index].settings.selected = !uploadedFiles[index].settings.selected;

    setUploadedFiles((prevUploadedFiles) => {
      const newUploadedFiles = [...prevUploadedFiles];
      const selectedFile = newUploadedFiles[index];
      selectedFile.settings.selected = !selectedFile.settings.selected; // Toggle the selected value
      return newUploadedFiles; // Update the state with the modified array
    });
    // console.log(uploadedFiles[index].settings.selected);
  };

  const handleResize = (resize: number) => {
    setResize(resize);

    setUploadedFiles((prevUploadedFiles) => {
      const newUploadedFiles = [...prevUploadedFiles];
      newUploadedFiles
        .filter((file) => file.settings.selected)
        .map((file) => {
          file.settings.resize = resize;
          return file;
        });

      return newUploadedFiles; // Update the state with the modified array
    });
  };

  const handleQuality = (quality: number) => {
    setQuality(quality);

    setUploadedFiles((prevUploadedFiles) => {
      const newUploadedFiles = [...prevUploadedFiles];
      newUploadedFiles
        .filter((file) => file.settings.selected)
        .map((file) => {
          file.settings.quality = quality;
          return file;
        });

      return newUploadedFiles; // Update the state with the modified array
    });
  };

  const handleFileDrop = (files: FileList | null) => {
    if (files) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      const filteredFiles = Array.from(files).filter((file) => allowedTypes.includes(file.type));

      const newFiles = Array.from(filteredFiles).map((file) => ({
        file,
        settings: { resize, quality, selected: true }, // Use resize and quality states
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

  // const handleDownloadOneFile = async (file: File, settings: fileSettings) => {
  //   const convertedFile = await convertToWebP(file, settings);
  //   saveAs(convertedFile, convertedFile.name.replace(/\.[^.]+$/, ".webp"));
  // };

  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    setIsSaving(true);

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

    setIsSaving(false);

    zip.generateAsync({ type: "blob" }).then((content: any) => {
      saveAs(content, `${albumName.replaceAll(" ", "_")}-webp.zip`);
    });
  };

  const handleShowImage = async (file: File, index: number, resize: number, quality: number) => {
    setNewFileName(file.name);

    setSelectedImageIndex(index);
    console.log(index);

    setSelectedImage(file);
    setConvertedImage(null);
    const convetedFile = await convertToWebP(file, { resize: resize, quality: quality });
    setConvertedImage(convetedFile);

    setShowImageModal(true);

    setNewResize(resize.toString());
    setNewQuality(quality.toString());
  };

  //! ** Можно ещё на модальном окне сделать кнопки prev - next
  //! и менять selectedImage и ConvertedImage прямо в том окне
  //! получается для этого нужно модальное окно сделать отдельным компонентом
  //! и прокидывать в него selectedFile (или только индекс) и по кнопкам менять его и useEffect

  const handleUpdatePreview = async () => {
    if (selectedImage) {
      console.log("Preview");
      const convetedFile = await convertToWebP(selectedImage, {
        resize: parseFloat(newResize),
        quality: parseFloat(newQuality),
      });
      setConvertedImage(convetedFile);
    }
  };

  const handleSaveFile = () => {
    //console.log(newFileName);

    if (selectedImage) {
      setUploadedFiles((prevFiles) =>
        prevFiles.map((fileObject) =>
          fileObject.file === selectedImage
            ? {
                ...fileObject,
                file: new File([selectedImage], newFileName, { type: fileObject.file.type }),
                settings: { ...fileObject.settings, resize: parseFloat(newResize), quality: parseFloat(newQuality) },
              }
            : fileObject
        )
      );
    }

    // Update the file name and settings in the converted files array
    if (selectedImage && convertedFiles.some((file) => file.file === selectedImage)) {
      setConvertedFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.file === selectedImage
            ? {
                ...file,
                file: new File([selectedImage], newFileName, { type: file.file.type }),
                settings: { ...file.settings, resize: parseFloat(newResize), quality: parseFloat(newQuality) },
              }
            : file
        )
      );
    }

    // Close the modal
    // setSelectedImage(null);
    // setNewFileName("");
  };

  const handleCloseImageModal: MouseEventHandler<HTMLDivElement | HTMLButtonElement> = (event) => {
    event.stopPropagation();
    // console.log("Target", event.target);
    if (
      event.target == document.querySelector("#modalBackground") ||
      event.target == document.querySelector("#modalCloseBtn")
    ) {
      setSelectedImage(null);
      setNewFileName("");
    }
  };

  const handleRenameAlbum = (albumName: string) => {
    setAlbumName(albumName);
  };

  const handleUploadClick = () => {
    const uploadBtn = document.querySelector("#uploadBtn") as HTMLButtonElement | null;
    if (uploadBtn) {
      uploadBtn.click();
    }
  };

  const handleNext = async () => {
    // alert("Next image");

    if (selectedImageIndex !== null && selectedImageIndex < uploadedFiles.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setSelectedImage(uploadedFiles[selectedImageIndex + 1].file);

      setNewFileName(uploadedFiles[selectedImageIndex + 1].file.name);
      setNewResize(uploadedFiles[selectedImageIndex + 1].settings.resize.toString());
      setNewQuality(uploadedFiles[selectedImageIndex + 1].settings.quality.toString());

      setConvertedImage(null);
      const convetedFile = await convertToWebP(uploadedFiles[selectedImageIndex + 1].file, {
        resize: resize,
        quality: quality,
      });
      setConvertedImage(convetedFile);
      console.log(selectedImageIndex);
    }
  };

  const handlePrevious = async () => {
    // alert("Prev image");
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setSelectedImage(uploadedFiles[selectedImageIndex - 1].file);
      setNewFileName(uploadedFiles[selectedImageIndex - 1].file.name);
      setNewResize(uploadedFiles[selectedImageIndex - 1].settings.resize.toString());
      setNewQuality(uploadedFiles[selectedImageIndex - 1].settings.quality.toString());

      setConvertedImage(null);
      const convetedFile = await convertToWebP(uploadedFiles[selectedImageIndex - 1].file, {
        resize: resize,
        quality: quality,
      });
      setConvertedImage(convetedFile);
      console.log(selectedImageIndex);
    }
  };

  useEffect(() => {
    console.log("Main rerendering");
  }, []);

  return (
    <main>
      <h1>Online Image Converter</h1>

      <div className={styles.navigation}>
        <label className={styles.uploadLabel} id="uploadBtn">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept=".jpg, .jpeg, .png, .webp"
            className={styles.uploadInput}
          />
          <span className={`${styles.bigButton} ${styles.uploadButton}`}>
            <UploadIcon />
            {isLoading ? "Loading ..." : "Upload Images"}
          </span>
        </label>
        <div className={styles.uploadRange}>
          <InputResize resize={resize} setResize={handleResize} />
        </div>
        <div className={styles.uploadRange}>
          <InputQuality quality={quality} setQuality={handleQuality} />
        </div>
        {/* <button className={`${styles.bigButton} ${styles.convertButton}`} onClick={handleConvertToWebP}>
          <PlayIcon />
          Convert to WebP
        </button> */}

        <button className={`${styles.bigButton} ${styles.downloadButton}`} onClick={handleDownloadAllAsZip}>
          {isSaving ? (
            <>
              Saving <Saveloader />
            </>
          ) : (
            <>
              <DownloadIcon /> Save all as *.zip
            </>
          )}
          <span>{uploadedFiles.length}</span>
        </button>
      </div>

      {/* Drag and drop area */}
      <div
        className={`${styles.dragDropArea} ${isDragging ? styles.dragOver : styles.dragOut}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <DragDropIcon />
        <h3>You can drop your files here...</h3>
        <p>Accepted image formats: .jpg, .png</p>
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
            title={albumName}
            // files={uploadedFiles}
            files={uploadedFiles.map(({ file }) => file)}
            settings={uploadedFiles.map(({ settings }) => settings)}
            onRemoveFile={(index) => handleRemoveFile(index, "uploaded")}
            onDownloadFile={handleDownloadSingleFile}
            onRenameAlbum={handleRenameAlbum}
            onShow={handleShowImage}
            onSelectFile={handleSelectFile}
          />
        </>
      )}
      {selectedImage && showImageModal && (
        <ImageModal
          // image={uploadedFiles[selectedImageIndex]}
          image={selectedImage}
          convertedImage={convertedImage}
          imageSize={newResize}
          imageQuality={newQuality}
          imageName={newFileName}
          setNewSize={setNewResize}
          setNewQuality={setNewQuality}
          setNewFileName={setNewFileName}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onClose={handleCloseImageModal}
          onUpdatePreview={handleUpdatePreview}
          onSaveFile={handleSaveFile}
          onDownloadFile={handleDownloadSingleFile}
        />
        // <div className={styles.modalWindow} onClick={handleCloseImageModal} id="modalBackground">
        //   <div className={styles.modalBody}>
        //     <div className={styles.modalHeader}>
        //       Resize:
        //       <input
        //         type="text"
        //         value={newResize}
        //         onChange={(e) => setNewResize(e.target.value)}
        //         className={styles.modalInput}
        //       />
        //       Quality:
        //       <input
        //         type="text"
        //         value={newQuality}
        //         // onChange={(e) => setNewQuality(e.target.value)}
        //         onChange={(e) => setNewQuality(e.target.value)}
        //         className={styles.modalInput}
        //       />
        //       <button className={`${styles.modalButton} ${styles.convertButton}`} onClick={handleUpdatePreview}>
        //         Preview
        //       </button>
        //       Name:
        //       <input
        //         ref={modalFileName}
        //         type="text"
        //         value={newFileName}
        //         onChange={(e) => setNewFileName(e.target.value)}
        //         className={styles.modalInputName}
        //       />
        //       <button className={`${styles.modalButton} ${styles.uploadButton}`} onClick={handleSaveFile}>
        //         Update Image
        //       </button>
        //     </div>
        //     <div className={styles.modalPreview}>
        //       <div className={styles.modalHalf}>
        //         <div className={styles.modalHalfTitle}>
        //           <span>Original: {formatSize(selectedImage.size)}</span>
        //           <ImageDimensions file={selectedImage} />
        //         </div>
        //         {/* eslint-disable-next-line @next/next/no-img-element */}
        //         <img src={URL.createObjectURL(selectedImage)} alt={selectedImage.name} />
        //       </div>
        //       {!convertedImage && (
        //         <div className={styles.modalHalf}>
        //           <p style={{ textAlign: "center" }}>
        //             Loading image...
        //             <br />
        //             <br />
        //             <Preloader />
        //           </p>
        //         </div>
        //       )}
        //       {convertedImage && (
        //         <div className={styles.modalHalf}>
        //           <div className={styles.modalHalfTitle}>
        //             <span>
        //               Converted: {formatSize(convertedImage.size)}
        //               {` (~${Math.round((convertedImage.size / selectedImage.size) * 100)}% of original)`}
        //             </span>
        //             <ImageDimensions file={convertedImage} />
        //           </div>
        //           {/* eslint-disable-next-line @next/next/no-img-element */}
        //           <img src={URL.createObjectURL(convertedImage)} alt={convertedImage.name} />
        //         </div>
        //       )}
        //     </div>
        //     <div className={styles.modalFooter}>
        //       <button type="button" onClick={handlePrevious}>
        //         Prev Image
        //       </button>
        //       <button type="button" onClick={handleNext}>
        //         Next Image
        //       </button>
        //       {/* <button className={`${styles.modalButton} ${styles.downloadButton}`} onClick={handleDownloadSingleFile}>
        //       Save as *.webp
        //       </button> */}
        //       {convertedImage && (
        //         <button
        //           className={`${styles.modalButton} ${styles.downloadButton}`}
        //           onClick={(e) => {
        //             e.stopPropagation();
        //             handleDownloadSingleFile(convertedImage, { resize, quality });
        //           }}
        //         >
        //           Save converted image (as *.webp)
        //         </button>
        //       )}
        //     </div>
        //     <button className={styles.modalCloseBtn} onClick={handleCloseImageModal} id="modalCloseBtn">
        //       &times;
        //     </button>
        //   </div>
        // </div>
      )}
    </main>
  );
};

interface ImageModalProps {
  image: File;
  convertedImage: File | null;
  imageSize: string;
  imageQuality: string;
  imageName: string;
  setNewSize: React.Dispatch<React.SetStateAction<string>>;
  setNewQuality: React.Dispatch<React.SetStateAction<string>>;
  setNewFileName: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onPrevious: () => void;
  onClose: MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  onUpdatePreview: () => void; // Add the correct type for this function
  onSaveFile: () => void; // Add the correct type for this function
  onDownloadFile: (file: File, settings: fileSettings) => Promise<void>; // Add the correct type for this function
}

const ImageModal = ({
  image,
  convertedImage,
  imageSize,
  imageQuality,
  imageName,
  setNewSize,
  setNewQuality,
  setNewFileName,
  onNext,
  onPrevious,
  onClose,
  onUpdatePreview,
  onSaveFile,
  onDownloadFile,
}: ImageModalProps) => {
  // const convetedFile = await convertToWebP(file, { resize: resize, quality: quality });

  // const modalFileNameRef = useRef<HTMLInputElement>(null);

  // modalFileNameRef.current?.focus();
  // modalFileNameRef.current?.select();

  useEffect(() => {
    console.log("Modal rerendering");
  }, []);

  return (
    // <div className="modal">
    //   <img src={image.src} alt={image.alt} />
    //   <button onClick={onPrevious}>Previous</button>
    //   <button onClick={onNext}>Next</button>
    //   <button onClick={onClose}>Close</button>
    // </div>
    <div className={styles.modalWindow} onClick={onClose} id="modalBackground">
      <div className={styles.modalBody}>
        <div className={styles.modalHeader}>
          Resize:
          <input
            type="text"
            value={imageSize}
            onChange={(e) => setNewSize(e.target.value)}
            className={styles.modalInput}
          />
          Quality:
          <input
            type="text"
            value={imageQuality}
            // onChange={(e) => setNewQuality(e.target.value)}
            onChange={(e) => setNewQuality(e.target.value)}
            className={styles.modalInput}
          />
          <button className={`${styles.modalButton} ${styles.convertButton}`} onClick={onUpdatePreview}>
            Preview
          </button>
          Name:
          <input
            // ref={modalFileNameRef}
            type="text"
            value={imageName}
            onChange={(e) => setNewFileName(e.target.value)}
            className={styles.modalInputName}
          />
          <button className={`${styles.modalButton} ${styles.uploadButton}`} onClick={onSaveFile}>
            Save Image
          </button>
        </div>
        <div className={styles.modalPreview}>
          <div className={styles.modalHalf}>
            <div className={styles.modalHalfTitle}>
              <span>Original: {formatSize(image.size)}</span>
              <ImageDimensions file={image} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={URL.createObjectURL(image)} alt={image.name} />
          </div>

          {!convertedImage && (
            <div className={styles.modalHalf}>
              <p style={{ textAlign: "center" }}>
                Loading image...
                <br />
                <br />
                <Preloader />
              </p>
            </div>
          )}

          {convertedImage && (
            <div className={styles.modalHalf}>
              <div className={styles.modalHalfTitle}>
                <span>
                  Converted: {formatSize(convertedImage.size)}
                  {` (~${Math.round((convertedImage.size / image.size) * 100)}% of original)`}
                </span>
                <ImageDimensions file={convertedImage} />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(convertedImage)} alt={convertedImage.name} />
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <div className={styles.modalNavigation}>
            <button type="button" className={styles.modalNavBtn} onClick={onPrevious}>
              Prev Image
            </button>
            <button type="button" className={styles.modalNavBtn} onClick={onNext}>
              Next Image
            </button>
          </div>

          <button
            disabled={convertedImage === null}
            className={`${styles.modalButton} ${styles.downloadButton}`}
            onClick={(e) => {
              e.stopPropagation();
              if (convertedImage) {
                // onDownloadFile(convertedImage, { resize: imageSize, quality });
                saveAs(convertedImage, convertedImage.name.replace(/\.[^.]+$/, ".webp"));
              }
            }}
          >
            Save converted image (as *.webp)
          </button>
        </div>
        <button className={styles.modalCloseBtn} onClick={onClose} id="modalCloseBtn">
          &times;
        </button>
      </div>
    </div>
  );
};

export default MainConverter;
