import React, { useCallback, useState } from "react";
// I would use Styled-component for many reasons.
import "./Autocomplete.css";
import Highlighter from "react-highlight-words"; // No time for the fuzzy word search so we used this library.
import { debounce } from "../../../util/debounce"; // We can use lodash debounce here.

interface AutocompleteProps {
  data: Array<{ name: string }>;
  onSearch?: (searchValue: string) => void;
}

// Due to time limitation, mouse even comes with bad UX. no highlight when moving the mouse on items :)
const Autocomplete: React.FC<AutocompleteProps> = ({ data, onSearch }) => {
  const [options, setOptions] = useState({
    optionPointer: 0, // For list pointing
    showSuggestions: false, // To hind/show list of countries
    userInput: "",
  });

  // Initialize debounce function to prevent hammering the server.
  const debounceSearch = useCallback(
    (searchValue) => {
      return debounce((values) => onSearch?.(values[0]), 300)(searchValue);
    },
    [onSearch]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === "Enter") {
        setOptions((oldState) => ({
          optionPointer: 0,
          showSuggestions: false,
          userInput: data[oldState.optionPointer].name,
        }));
      }

      // User pressed the up arrow
      else if (event.code === "ArrowUp") {
        if (options.optionPointer === 0) {
          return;
        }

        setOptions((oldState) => ({
          ...oldState,
          optionPointer: oldState.optionPointer - 1,
        }));
      }

      // User pressed the down arrow
      else if (event.code === "ArrowDown") {
        if (options.optionPointer - 1 === data.length) {
          return;
        }

        setOptions((oldState) => ({
          ...oldState,
          optionPointer: oldState.optionPointer + 1,
        }));
      }
    },
    [data, options, setOptions]
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const userInput = event.currentTarget.value;

      debounceSearch(userInput);
      setOptions({
        optionPointer: 0,
        showSuggestions: true,
        userInput,
      });
    },
    [setOptions, debounceSearch]
  );

  const handleOnClick = useCallback(
    (index: number) => {
      setOptions((oldState) => ({
        ...oldState,
        optionPointer: 0,
        showSuggestions: false,
        userInput: data[index].name,
      }));
    },
    [data, setOptions]
  );

  const matchedSearch = (countryName: string, searchValue: string) => {
    if (!searchValue) return countryName;

    return (
      <Highlighter
        searchWords={[searchValue]}
        autoEscape={true}
        textToHighlight={countryName}
        highlightTag={({ children }) => (
          <strong className="highlighted-text">{children}</strong>
        )}
      />
    );
  };

  return (
    <div className="autocomplete-container">
      <label className="autocomplete-label">Find the closest country</label>
      <input
        type="search"
        className="autocomplete-input"
        placeholder="Search country name"
        onChange={handleOnChange}
        onKeyDown={onKeyDown}
        value={options.userInput}
      />
      <div className="options-container">
        {options.showSuggestions && options.userInput && data.length && (
          <ul className="list">
            {data.map((country, index) => {
              let activeClassName = "";

              // Flag the active suggestion with a class
              if (index === options.optionPointer) {
                activeClassName = "active";
              }

              return (
                <li
                  className={`list-item ${activeClassName}`}
                  key={country.name}
                  onClick={() => handleOnClick(index)}
                >
                  {matchedSearch(country.name, options.userInput)}
                </li>
              );
            })}
          </ul>
        )}

        {!options.userInput && (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
