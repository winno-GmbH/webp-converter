import styles from "./MainConverter.module.css";

interface InputComponentProps {
  quality: number;
  //   setResize: React.Dispatch<React.SetStateAction<number>>;
  setQuality: (quality: number) => void;
}

const InputQuality: React.FC<InputComponentProps> = ({ quality, setQuality }) => {
  return (
    <>
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
        onWheel={(e) => {
          const newValue = quality * 100 + e.deltaY / 100;
          const clampedValue = Math.min(Math.max(newValue, 10), 100);
          const roundedValue = (clampedValue / 100).toFixed(2);
          setQuality(parseFloat(roundedValue));
        }}
      />
      <span id="qualityPercent" className={styles.uploadPercents}>
        {Math.round(quality * 100)}
      </span>
      %
    </>
  );
};

export default InputQuality;
