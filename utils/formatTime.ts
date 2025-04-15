export function formatTimeTo12Hour(time24: string): string {
    if (!time24) return "";
  
    const [hourStr, minuteStr] = time24.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
  
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
  
    const period = isPM ? "PM" : "AM";
    return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }
  