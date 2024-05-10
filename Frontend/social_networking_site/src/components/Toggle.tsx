const Toggle = ({ enabled, toggleSwitch }) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={toggleSwitch}
        className={`relative rounded-full h-6 w-12 ${
          enabled ? "bg-green-500" : "bg-red-400"
        } focus:outline-none`}
      >
        <span
          className={`absolute inset-0 ${
            enabled ? "translate-x-6" : "translate-x-0"
          } flex items-center justify-center h-5 w-5 bg-white rounded-full shadow-sm transition-transform`}
        >
          {enabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9a7 7 0 1110 0 1 1 0 010 2A7 7 0 015 9zM3 9a9 9 0 1114.6 6.2c.2-.5.4-1.1.4-1.7a7 7 0 10-9.3-6.5A9 9 0 013 9z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a7 7 0 00-7 7 1 1 0 102 0 5 5 0 0110 0 1 1 0 102 0 7 7 0 00-7-7zM3 10a7 7 0 1114 0 7 7 0 01-14 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>
      <span className="ml-2">{enabled ? "Accept" : "Decline"}</span>
    </div>
  );
};

export default Toggle;
