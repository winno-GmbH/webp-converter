import styles from "./MainConverter.module.css";

interface InputComponentProps {
  resize: number;
  //   setResize: React.Dispatch<React.SetStateAction<number>>;
  setResize: (resize: number) => void;
}

const InputResize: React.FC<InputComponentProps> = ({ resize, setResize }) => {
  return (
    <>
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
    </>
  );
};

export default InputResize;
