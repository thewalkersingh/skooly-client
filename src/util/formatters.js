import { format, parseISO } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "—";
  try {
    return format(parseISO(date), "dd MMM yyyy");
  } catch {
    return date;
  }
};

export const formatDateTime = (date) => {
  if (!date) return "—";
  try {
    return format(parseISO(date), "dd MMM yyyy, hh:mm a");
  } catch {
    return date;
  }
};

export const formatCurrency = (amount) => {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatPercentage = (value) => {
  if (value == null) return "—";
  return `${Number(value).toFixed(2)}%`;
};

export const getInitials = (firstName, lastName) => {
  if (!firstName) return "?";
  return `${firstName[0]}${lastName?.[0] ?? ""}`.toUpperCase();
};

export const getFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(" ");
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};