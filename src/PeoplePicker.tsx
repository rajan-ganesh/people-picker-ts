import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { usersData } from "./data/usersData";
import "./styles/PeoplePicker.css";
import { User } from "./interfaces/User";

const PeoplePicker = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]); // Items that are Chips
  const [availableUsers, setAvailableUsers] = useState<User[]>(usersData); // Items in the list
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [isAddingUser, setAddingUser] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [highlightedChipIndex, setHighlightedChipIndex] = useState<number | null>(null);
  const [highlightedUserIndex, setHighlightedUserIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Brings up list popup and activates cursor for search 
  const handleAddUserClick = () => {
    setAddingUser(true);
    setSearchText("");
    setPopupVisible(true);

    if (isAddingUser && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Removes chip and adds the item to list
  const handleChipRemoval = (userId: string) => {
    const updatedUsers = selectedUsers.filter((user) => user.id !== userId);
    const removedUser = selectedUsers.find((user) => user.id === userId);
    if (removedUser) {
      setAvailableUsers([...availableUsers, removedUser]);
    }
    setSelectedUsers(updatedUsers);
  };

  // Adds new chip and removes item from list
  const handleChipAddition = (user: User) => {
    const updatedUsers = [...selectedUsers, user];
    const updatedAvailableUsers = availableUsers.filter(
      (u) => u.id !== user.id
    );
    setSelectedUsers(updatedUsers);
    setAvailableUsers(updatedAvailableUsers);
    setPopupVisible(false);
    setAddingUser(false);
    setHighlightedUserIndex(null);
    handleAddUserClick();
  };

  // Triggers list updation when search term changes
  const handleSearchInputChange = () => {
    if (inputRef.current) {
      setSearchText(inputRef.current.innerText);
    }
  };

  // Makes up & down arrows select from list, and backspace delete chips
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isAddingUser && isPopupVisible) {
      if (event.key === "ArrowDown") {
        setHighlightedUserIndex((prevIndex) =>
          prevIndex === null
            ? 0
            : Math.min(prevIndex + 1, filteredUsers.length - 1)
        );
      } else if (event.key === "ArrowUp") {
        setHighlightedUserIndex((prevIndex) =>
          prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)
        );
      } else if (event.key === "Enter") {
        if (highlightedUserIndex !== null) {
          handleChipAddition(filteredUsers[highlightedUserIndex]);
        }
      } else if (event.key === "Backspace") {
        if (searchText === "") {
          const lastChipIndex = selectedUsers.length - 1;
          if (lastChipIndex >= 0) {
            console.log("lastChipIndex", lastChipIndex);
            if (highlightedChipIndex === lastChipIndex) {
              handleChipRemoval(selectedUsers[lastChipIndex].id);
            } else {
              setHighlightedChipIndex(lastChipIndex);
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if (highlightedChipIndex != null) {
      const user = selectedUsers[highlightedChipIndex];

      if (user) {
        const element = document.getElementById(user.id);
        console.log("element is ", element);
        if (element) {
          element.style.backgroundColor = "pink";
        }
      }
    }
  }, [highlightedChipIndex]);

  useEffect(() => {
    selectedUsers.filter((user) => {
      if (user) {
        const element = document.getElementById(user.id);
        if (element) {
          element.style.backgroundColor = "";
        }
      }
    });
  }, [selectedUsers]);

  useEffect(() => {
    if (isAddingUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingUser]);

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="people-picker-container">
      <div className="line" />
      <div className="chips-container">
        {selectedUsers.map((user) => (
          <div key={user.id} id={user.id} className="chip">
            <img src={user.profilePic} alt="Profile" className="profile-pic" />
            <span className="user-name">{user.name}</span>
            <button
              onClick={() => handleChipRemoval(user.id)}
              className="remove-button"
            >
              X
            </button>
          </div>
        ))}

        <div
          className={`add-user-subtext ${isAddingUser ? "editing" : ""}`}
          onClick={handleAddUserClick}
        >
          {isAddingUser ? (
            <div
              ref={inputRef}
              contentEditable
              className="editable-input"
              onInput={handleSearchInputChange}
              onKeyDown={handleKeyDown}
            />
          ) : (
            "Add User..."
          )}
        </div>
      </div>
      {isPopupVisible && (
        <div className="popup">
          <button
            className="close-popup"
            onClick={() => (setPopupVisible(false), setAddingUser(false))}
          >
            Close
          </button>
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <b>No Matching Users Available!</b>
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className={`user-row ${
                  index === highlightedUserIndex ? "highlighted" : ""
                }`}
                onClick={() => handleChipAddition(user)}
              >
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="profile-pic"
                />
                <span className="user-name">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PeoplePicker;
