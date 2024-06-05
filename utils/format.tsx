"use client";
import React from "react";
import { format, differenceInDays, differenceInCalendarDays } from "date-fns";

interface DateDisplayProps {
  isoDate: string;
  status: string;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ isoDate, status }) => {
  // Membuat objek Date dari string ISO 8601
  const targetDate = new Date(isoDate);
  // Mendapatkan tanggal saat ini
  const currentDate = new Date();
  // Menghitung selisih hari
  const daysLeft = differenceInCalendarDays(targetDate, currentDate);
  // Memformat tanggal menjadi "dd/MM/yyyy"
  const formattedDate = format(targetDate, "dd/MM/yyyy");

  return (
    <div className="flex space-x-3">
      {status === "completed" ? (
        <p className="capitalize font-semibold text-green-500">{status}</p>
      ) : (
        <p className="text-destructive font-semibold">
          {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
        </p>
      )}
      <p>{formattedDate}</p>
    </div>
  );
};

export default DateDisplay;
