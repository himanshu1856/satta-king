type GameResult = {
    name: string;
    time: string;
    resultPrev: string;
    resultCurr: string;
    highlight?: boolean;
  };
  
  export default function TimewiseResultTable({ results }: { results: GameResult[] }) {
    return (
      <div className="border border-gray-400 mb-6">
        {/* Header */}
        <div className="bg-emerald-400 font-medium   text-xl  text-white text-center py-2">
        Timewise Superfast Satta King Results of April 07, 2025 & April 06, 2025
        </div>
  
        {/* Table header */}
        <div className="bg-gray-800 text-white flex px-4 py-2 font-semibold text-lg">
          <div className="w-1/2">Games List</div>
          <div className="w-1/4 text-center">Sun. 6th</div>
          <div className="w-1/4 text-center">Mon. 7th</div>
        </div>
  
        {/* Table rows */}
        {results.map((game, idx) => (
          <div
            key={idx}
            className={`flex items-center px-4 py-3 ${
              game.highlight ? 'bg-yellow-400' : 'bg-white'
            } border-b border-gray-300`}
          >
            {/* Game info */}
            <div className="w-1/2">
              <div className="font-bold text-gray-900">{game.name}</div>
              <div className="text-sm text-gray-700">
                at {game.time}{' '}
                <a href="#" className="text-blue-600 underline ml-1 text-sm">
                  Record Chart
                </a>
              </div>
            </div>
  
            {/* Results */}
            <div className="w-1/4 text-center text-xl font-semibold">{game.resultPrev}</div>
            <div className="w-1/4 text-center text-xl font-semibold">{game.resultCurr}</div>
          </div>
        ))}
  
        {/* Footer */}
        <div className="bg-gray-800 text-white text-center py-2 text-lg">
          Click here for more games results.
        </div>
      </div>
    );
  }
  