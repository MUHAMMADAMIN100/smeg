import { describe, expect, it } from "vitest";
import { discountPercent, formatNumber, formatPrice, plural } from "@/lib/format";

const NBSP = " ";

describe("formatNumber", () => {
  it("разделяет тысячи неразрывным пробелом", () => {
    expect(formatNumber(12345)).toBe(`12${NBSP}345`);
    expect(formatNumber(1234567)).toBe(`1${NBSP}234${NBSP}567`);
  });

  it("не трогает числа до тысячи", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(0)).toBe("0");
  });

  it("округляет дробные и сохраняет знак", () => {
    expect(formatNumber(1999.6)).toBe(`2${NBSP}000`);
    expect(formatNumber(-1500)).toBe(`-1${NBSP}500`);
  });
});

describe("formatPrice", () => {
  it("добавляет валюту через неразрывный пробел", () => {
    expect(formatPrice(18900)).toBe(`18${NBSP}900${NBSP}TJS`);
  });
});

describe("discountPercent", () => {
  it("считает процент скидки", () => {
    expect(discountPercent(8000, 10000)).toBe(20);
  });

  it("возвращает null без скидки", () => {
    expect(discountPercent(8000)).toBeNull();
    expect(discountPercent(8000, 8000)).toBeNull();
    expect(discountPercent(8000, 7000)).toBeNull();
  });
});

describe("plural", () => {
  const forms: [string, string, string] = ["товар", "товара", "товаров"];
  it("склоняет по-русски", () => {
    expect(plural(1, forms)).toBe("товар");
    expect(plural(2, forms)).toBe("товара");
    expect(plural(5, forms)).toBe("товаров");
    expect(plural(11, forms)).toBe("товаров");
    expect(plural(21, forms)).toBe("товар");
    expect(plural(22, forms)).toBe("товара");
    expect(plural(0, forms)).toBe("товаров");
  });
});
