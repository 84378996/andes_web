import moment from "moment";

export function currentDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

export function dateTimeFormat(value: string | undefined | null) {
  if (value === undefined) return "";
  if (value === null) return "";

  const m = moment(value);
  if (m.isValid()) {
    return m.format("YYYY-MM-DD HH:mm:ss");
  }
  return value;
}

export function dateFormat(value: string | null) {
  if (value === undefined) return "";
  if (value === null) return "";

  const m = moment(value);
  if (m.isValid()) {
    return m.format("YYYY-MM-DD");
  }
  return value;
}

export function timeFormat(value: string | null) {
  if (value === undefined) return "";
  if (value === null) return "";

  const m = moment(value);
  if (m.isValid()) {
    return m.format("HH:mm:ss");
  }
  return value;
}

export function timeMilliFormat(value: string | null) {
  if (value === undefined) return "";
  if (value === null) return "";

  const m = moment(value);
  if (m.isValid()) {
    return m.format("HH:mm:ss.SSS");
  }
  return value;
}

export function fileSizeFormat(size: number | undefined | null) {
  if (size === undefined) return "";
  if (size === null) return "";

  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return Math.ceil(size / 1024) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return Math.ceil(size / (1024 * 1024)) + " MB";
  } else {
    return Math.ceil(size / (1024 * 1024 * 1024)) + " GB";
  }
}

export function numberFormat(
  num: number | undefined | null,
  decimal: number
): string {
  if (num === undefined) return "";
  if (num === null) return "";

  const roundedNumber = parseFloat(num.toFixed(decimal));
  const numberString = roundedNumber.toString();
  const trimmedNumberString = numberString.replace(/(\.\d*?[1-9])0+$/, "$1");

  return trimmedNumberString;
}
