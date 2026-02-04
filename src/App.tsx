import { useState, useEffect } from "react";
import "./App.css";

interface Options {
  lowercase: boolean;
  uppercase: boolean;
  numeric: boolean;
  special: boolean;
  custom: boolean;
}

type OptionKey = keyof Options;

interface CharacterSets {
  lowercase: string;
  uppercase: string;
  numeric: string;
  special: string;
}

function App() {
  const [options, setOptions] = useState<Options>({
    lowercase: true,
    uppercase: true,
    numeric: true,
    special: true,
    custom: false,
  });
  const [customChars, setCustomChars] = useState<string>("");
  const [length, setLength] = useState<number>(8);
  const [minNumbers, setMinNumbers] = useState<number>(1);
  const [minSpecial, setMinSpecial] = useState<number>(1);
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const characterSets: CharacterSets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numeric: "0123456789",
    special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const generatePassword = (): void => {
    setError("");
    let charset = "";
    let generatedPassword = "";

    if (options.custom) {
      charset = customChars.replace(/s+/g, "");

      if (!charset) {
        setPassword("");
        setError("Custom characters cannot be empty");
        return;
      }

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        generatedPassword += charset[randomIndex];
      }
    } else {
      const totalMinRequired =
        (options.numeric ? minNumbers : 0) + (options.special ? minSpecial : 0);

      if (totalMinRequired > length) {
        setError(
          `Password length must be at least ${totalMinRequired} to meet minimum requirements`
        );
        setPassword("");
        return;
      }

      if (options.lowercase) charset += characterSets.lowercase;
      if (options.uppercase) charset += characterSets.uppercase;
      if (options.numeric) charset += characterSets.numeric;
      if (options.special) charset += characterSets.special;

      if (!charset) {
        setPassword("");
        setError("Please select at least one character set");
        return;
      }

      if (options.numeric && minNumbers > 0) {
        for (let i = 0; i < minNumbers; i++) {
          const randomIndex = Math.floor(
            Math.random() * characterSets.numeric.length
          );
          generatedPassword += characterSets.numeric[randomIndex];
        }
      }

      if (options.special && minSpecial > 0) {
        for (let i = 0; i < minSpecial; i++) {
          const randomIndex = Math.floor(
            Math.random() * characterSets.special.length
          );
          generatedPassword += characterSets.special[randomIndex];
        }
      }

      const remainingLength = length - generatedPassword.length;
      for (let i = 0; i < remainingLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        generatedPassword += charset[randomIndex];
      }

      generatedPassword = generatedPassword
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    }

    setPassword(generatedPassword);
    setCopied(false);
  };

  const handleOptionChange = (option: OptionKey): void => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const copyToClipboard = async (): Promise<void> => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, length, customChars, minNumbers, minSpecial]);

  const maxMinNumbers = options.numeric
    ? Math.max(0, length - (options.special ? minSpecial : 0))
    : 0;
  const maxMinSpecial = options.special
    ? Math.max(0, length - (options.numeric ? minNumbers : 0))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Password Generator
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Character Sets
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={() => handleOptionChange("lowercase")}
                disabled={options.custom}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span
                className={`text-gray-700 ${
                  options.custom ? "opacity-50" : ""
                }`}
              >
                lowercase (a-z)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={() => handleOptionChange("uppercase")}
                disabled={options.custom}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span
                className={`text-gray-700 ${
                  options.custom ? "opacity-50" : ""
                }`}
              >
                uppercase (A-Z)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.numeric}
                onChange={() => handleOptionChange("numeric")}
                disabled={options.custom}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span
                className={`text-gray-700 ${
                  options.custom ? "opacity-50" : ""
                }`}
              >
                Numeric (0-9)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.special}
                onChange={() => handleOptionChange("special")}
                disabled={options.custom}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span
                className={`text-gray-700 ${
                  options.custom ? "opacity-50" : ""
                }`}
              >
                Special Characters
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.custom}
                onChange={() => handleOptionChange("custom")}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-700">Use Custom Input</span>
            </label>
          </div>
        </div>
        {options.custom && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Characters
            </label>
            <input
              type="text"
              value={customChars}
              onChange={(e) => setCustomChars(e.target.value)}
              placeholder="e.g. abc123!@"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        )}
        {(options.numeric || options.special) && !options.custom && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Minimum Requirements
            </h2>
            <div className="grid grid-cols-2 gap-4 items-end">
              {options.numeric && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Numbers
                  </label>
                  <input
                    type="number"
                    value={minNumbers}
                    disabled={options.custom}
                    onChange={(e) =>
                      setMinNumbers(
                        Math.max(
                          0,
                          Math.min(maxMinNumbers, parseInt(e.target.value) || 0)
                        )
                      )
                    }
                    min="0"
                    max={maxMinNumbers}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}
              {options.special && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Special Characters
                  </label>
                  <input
                    type="number"
                    value={minSpecial}
                    disabled={options.custom}
                    onChange={(e) =>
                      setMinSpecial(
                        Math.max(
                          0,
                          Math.min(maxMinSpecial, parseInt(e.target.value) || 0)
                        )
                      )
                    }
                    min="0"
                    max={maxMinSpecial}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-semibold text-gray-700">
              Password Length
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) =>
                setLength(
                  Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                )
              }
              min="1"
              max="100"
              className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <input
            type="range"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>100</span>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Generated Password
          </label>
          <div className="relative">
            <input
              type="text"
              value={password}
              readOnly
              className="w-full px-4 py-3 pr-24 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-lg focus:outline-none"
              placeholder="Your password will appear here"
            />
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-medium transition-colors ${
                password
                  ? copied
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          onClick={generatePassword}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          Generate New Password
        </button>
      </div>
    </div>
  );
}

export default App;
