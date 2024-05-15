type ButtonProp = {
  reqSent: boolean;
  text: string;
  styles: string;
};

const ActionButton = ({ reqSent, text, styles }: ButtonProp) => {
  return (
    <button type="submit" className={`w-full focus:outline-none ${styles}`}>
      {reqSent && (
        <i className="bi bi-arrow-clockwise inline-block animate-spin me-1"></i>
      )}
      {text}
    </button>
  );
};

export default ActionButton;
