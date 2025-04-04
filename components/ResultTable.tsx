type GameResult = {
    name: string;
    result: string;
    time: string;
  };
  
  export default function ResultTable({ results }: { results: GameResult[] }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Live Satta Results
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-center border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 border-r">Game</th>
                <th className="py-2 border-r">Result</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 font-medium text-blue-800 border-r">{item.name}</td>
                  <td className="py-3 font-semibold text-red-600 border-r">{item.result}</td>
                  <td className="py-3 text-sm text-gray-600">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  