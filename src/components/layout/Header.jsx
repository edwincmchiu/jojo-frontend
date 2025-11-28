export default function Header({ currentStep }) {
  const steps = ['基本', '限制', '時間'];
  
  return (
    <div className="bg-brand-dark text-white p-6 rounded-b-3xl shadow-md z-10">
      <div className="flex justify-between items-center mb-6">
        <button className="text-gray-400 hover:text-white">&lt; 返回</button>
        <h1 className="text-xl font-bold tracking-wider text-brand-yellow">JoJo 揪揪</h1>
        <div className="w-8"></div>
      </div>
      
      {/* 進度條 */}
      <div className="flex items-center justify-between px-2">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum <= currentStep;
          const isLineActive = currentStep > stepNum;
          
          return (
            <div key={idx} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isActive ? 'bg-brand-yellow text-brand-dark' : 'bg-gray-600 text-white'}`}>
                  {stepNum}
                </div>
                <span className="text-xs mt-1 text-gray-300 absolute top-8 w-max">{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="h-1 flex-1 mx-2 bg-gray-600 rounded">
                  <div className={`h-full bg-brand-yellow transition-all duration-500 ease-out ${isLineActive ? 'w-full' : 'w-0'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}