module.exports = {
	testEnvironment: "jsdom",
	roots: ["<rootDir>/test"],
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
	moduleFileExtensions: ["js", "ts"]
};
