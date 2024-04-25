type ButtonProp = {
  reqSent: boolean;
  text: string;
};

const SiginSignupButton = ({ reqSent, text }: ButtonProp) => {
  return (
    <button
      type="submit"
      className="w-full bg-telegram-light text-white py-2 px-4 rounded-md hover:bg-telegram-default focus:outline-none focus:bg-telegram-default mt-4"
    >
      {reqSent && (
        <i className="bi bi-arrow-clockwise inline-block animate-spin me-1"></i>
      )}
      {text}
    </button>
  );
};

export default SiginSignupButton;
