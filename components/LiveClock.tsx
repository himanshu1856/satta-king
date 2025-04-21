import { useEffect, useState } from "react";

const getISTTime = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export default function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setTime(getISTTime());
    updateTime(); // initial call
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null; // ⛔️ Don't render until client is ready

  return (
    <div className="text-center text-lg font-mono p-4 bg-white shadow rounded">
      <div className="text-gray-600">{formatDate(time)}</div>
      <div className="text-2xl text-black">{formatTime(time)}</div>
    </div>
  );
}
