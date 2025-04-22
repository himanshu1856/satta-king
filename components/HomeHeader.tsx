import LiveClock from "./LiveClock";

const HeaderHeader = () => {
  return (
    <div className="text-center p-4 space-y-3">
      {/* Logo + Title */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          <img src="/shiv.png" alt=""  className="w-14 h-14 hover:scale-110 transition-transform duration-200 inline me-2" />
          <span className="text-black">SATTA-</span>
          <span className="text-gray-900">KING-</span>
          <span className="text-black">MHADEV</span>
          <span className="text-gray-700 text-2xl">.com</span>
        </h1>
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-700 mx-auto">
        Daily Superfast Satta King Result of April 2025 And Leak Numbers for Gali, Desawar, Ghaziabad and Faridabad 
        With Complete Old Satta King Chart of 2015–2025 From Satta King Fast, Satta King Ghaziabad, Satta King Desawar, 
        Satta King Gali, Satta King Faridabad.
      </p>

      {/* Blue info line */}
      <div className="bg-white py-2">
        <p className="text-blue-700 text-sm">
          Satta-King-Mhadev.com is most popular gaming discussion forum for players to use freely and we are not in partnership with any gaming company.
        </p>
      </div>

      {/* Red warning line */}
      <div className="bg-white py-2">
        <p className="text-red-600 font-semibold text-sm">
          कृपया ध्यान दें, लीक गेम के नाम पर किसी को कोई पैसा न दें, ना पहले ना बाद में -धन्यवाद
        </p>
      </div>

      {/* Contact link */}
      <div className="bg-white py-2">
        <p className="text-green-700 text-sm inline-block mr-2">
          हमसे संपर्क करने के लिए
        </p>
        <span className="inline-block bg-blue-600 text-white px-2 py-1 text-sm rounded-sm mr-2">➠</span>
        <a rel="noopener noreferrer" target="blank" href="https://docs.google.com/forms/d/e/1FAIpQLScvhyRrzCbW2nGY2MODdOlpNbuXGWvPiEiidKVMWJgondTqSA/viewform?usp=sharing" className="text-blue-700 underline text-sm">
          यहाँ क्लिक करें
        </a>
      </div>

      {/* Date line */}
      <div className="text-green-600 text-sm pt-2">
        {<LiveClock/>}
      </div>
    </div>
  );
};

export default HeaderHeader;
