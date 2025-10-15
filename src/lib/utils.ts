type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export const textByLevelMap: { [key: number]: string } = {
  1: "โชคดีมาก",
  2: "โชคดี",
  3: "ปานกลาง",
  4: "ไม่ค่อยดี",
  5: "โชคร้าย",
};
