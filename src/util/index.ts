import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const mapKeys = <T extends Record<string, any>, R>(
  obj: T,
  fn: (key: string, value: T[keyof T]) => string
): Record<string, R> =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (isObject(v)) {
        return [fn(k, v), mapKeys(v, fn)];
      } else {
        return [fn(k, v), v];
      }
    })
  )

export const mapValues = <T extends Record<string, any>, R>(
  obj: T,
  fn: (value: T[keyof T], key: string) => R
): Record<string, R> =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (isObject(v)) {
        return [k, mapValues(v, fn)];
      } else {
        return [k, fn(v, k)];
      }
    })
  );

export const toKebab = (s: string): string =>
  s
    // handle lowerCase → UpperCase
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // handle acronym → word (HTTPServer → HTTP-Server)
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const isObject = (v: unknown) =>
  (typeof v === "object" && v !== null && !Array.isArray(v))

export const quote = (value: unknown) => {
  if (isObject(value)) {
    return value;
  } else {
    return `"${value}"`;
  }
}

export const toYaml = (obj: Record<string, any>, indentation = 0): string => {
  return Object.entries(obj)
    .map(([k, v]) => {
      const indent = " ".repeat(indentation * 2);
      if (isObject(v)) {
        return `${indent}${k}:\n${toYaml(v, indentation + 1)}`;
      }
      return `${indent}${k}: ${v}`;
    })
    .join("\n");
};

export const saveFile = async (destination: string, content: string) => {
  const filePath = path.join(process.cwd(), destination);
  return mkdir(path.dirname(filePath), { recursive: true })
    .then(() => writeFile(filePath, content, "utf8"));
}
