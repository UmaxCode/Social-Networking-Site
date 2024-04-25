const AlternateAuthentication = () => {
  return (
    <div className="mt-4">
      <p className="flex justify-between items-center px-2 mb-3">
        <span className="h-[1px] w-[45%] bg-gray-400"></span>
        <span className="text-gray-400">Or</span>
        <span className="h-[1px] w-[45%] bg-gray-400"></span>
      </p>

      <a
        href=""
        className="block bg-blue-900 text-white py-2 px-4 rounded text-center"
      >
        <i className="bi bi-facebook me-3"></i>
        <span>Login with Facebook</span>
      </a>

      <a
        href=""
        className="block border border-blue-900 text-blue-900 py-2 px-4 rounded text-center mt-5"
      >
        <i className="bi bi-google me-3 "></i>
        <span>Login with Google</span>
      </a>
    </div>
  );
};

export default AlternateAuthentication;
