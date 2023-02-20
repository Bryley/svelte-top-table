import type { FilterColumnData } from "$lib/pagination/types";

export interface Number {
    number: number;
    isEven: boolean;
    isNegative: boolean;
    half: number;
    fizz: "Fizz" | "Buzz" | "FizzBuzz" | null;
    text: string;
}

function numberToText(num: number): string {
    const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];
    const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];
    const scales = [
        "",
        "thousand",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
        "sextillion",
        "septillion",
        "octillion",
        "nonillion",
    ];

    if (num === 0) {
        return "zero";
    }

    let numString = num.toString();
    let numLength = numString.length;
    let groups = ((numLength + 2) / 3) | 0;
    let numGroups = new Array(groups);
    let group;
    let i;

    for (i = 0; i < groups; i += 1) {
        group = numString.slice(-3);
        numGroups[i] = group;
        numString = numString.slice(0, -3);
    }

    let text = "";
    let groupNum;
    let groupText;
    let groupScale;

    for (i = 0; i < groups; i += 1) {
        groupNum = Number(numGroups[i]);
        if (groupNum !== 0) {
            if (i > 0) {
                text = scales[i] + " " + text;
            }
            groupText = "";
            if (groupNum > 99) {
                groupText += ones[Math.floor(groupNum / 100)] + " hundred ";
                groupNum %= 100;
            }
            if (groupNum > 19) {
                groupText += tens[Math.floor(groupNum / 10)] + " ";
                groupNum %= 10;
            }
            if (groupNum > 0) {
                groupText += ones[groupNum] + " ";
            }
            groupScale = scales[i];
            if (groupScale !== "") {
                groupScale += " ";
            }
            text = groupText + groupScale + text;
        }
    }
    return text.trim();
}

export function getNumber(num: number): Number {
    const dis3 = num % 3 === 0;
    const dis5 = num % 5 === 0;
    return {
        number: num,
        isEven: num % 2 === 0,
        isNegative: num < 0,
        half: num / 2,
        fizz: dis3 && dis5 ? "FizzBuzz" : dis3 ? "Fizz" : dis5 ? "Buzz" : null,
        text: numberToText(num),
    };
}
export const COLUMN_DATA: { [column: string]: FilterColumnData } = {
    number: {
        type: "number",
        displayName: "Number",
    },
    isEven: {
        type: "boolean",
        displayName: "Is Even",
    },
    isNegative: {
        type: "boolean",
        displayName: "Is Negative",
    },
    half: {
        type: "number",
        displayName: "Half",
    },
    fizz: {
        type: "category",
        displayName: "FizzBuzz",
        categories: async () => ["Fizz", "Buzz", "FizzBuzz"],
    },
    text: {
        type: "string",
        displayName: "Text",
    },
};
