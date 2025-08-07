const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <span className="text-lg text-green-700 font-semibold tracking-wide">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
