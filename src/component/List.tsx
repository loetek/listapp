// ListApp written in React with TypeScript utilizing localStorage to persist data across sessions.
// App has basic functionality however I was unable to finish the finishedTask checkbox.
// I did not get a chance to implement any tests. V2 would have also included more components because this current implementation is too large.

import React, { useState, useEffect } from "react";

interface ListEntry {
  entry: string;
  id: number;
  date: string;
  isDone: boolean;
}

export default function List() {
  const [listEntries, setListEntries] = useState<ListEntry[]>([]);
  const [newListEntry, setNewListEntry] = useState<string>("") || null;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(false);
  const [searchIndex, setSearchIndex] = useState<number>(0);

  const handleSaveData = (newListEntries: any) => {
    localStorage.setItem("listEntries", JSON.stringify(newListEntries));
  };

  //This function will add a new listEntry each time the user hits the add button.
  const handleAddListEntry: Function = () => {
    if (newListEntry.trim()) {
      let entryId: number = Date.now();
      let entryDate: any = new Date(entryId);
      let newListEntries: any = [
        ...listEntries,
        {
          entry: newListEntry.trim(),
          id: entryId,
          date: entryDate.toDateString(),
          isDone: isDone,
        },
      ];
      setListEntries(newListEntries);
      setNewListEntry("");
      handleSaveData(newListEntries);
    }
  };

  //This function will remove the selected entry.
  const handleDeleteListEntry: Function = (id: number) => {
    let newListEntries: any = listEntries.filter(
      (entry: any) => entry.id !== id
    );
    setListEntries(newListEntries);
    handleSaveData(newListEntries);
  };

  //This function is for searching the list based on the task.
  const handleSearchList: Function = () => {
    let searchRtn: any;
    let searchResult: Number;
    listEntries.forEach((entryItem: any, index: number) => {
      searchRtn = entryItem.entry.search(searchQuery);
      if (searchRtn === 0) {
        searchResult = entryItem.id;
        setSearchIndex(index);
        setIsFound(!isFound);
        setErrorMsg("");
        return searchResult;
      } else if (!searchResult) setErrorMsg("Result not Found");
    });
  };

  //This function was written for the checkbox. I did not get it full functioning. I had issue editing the local storage.
  const handleIsDone: Function = (id: number) => {
    setIsDone(!isDone);
    let newListEntries: any = listEntries.find((entry: any) => entry.id !== id);
    let modifiedListEntries: any = {
      entry: newListEntries.entry,
      id: newListEntries.id,
      date: newListEntries.date,
      isDone: isDone,
    };
  };

  //This useEffect hook will load the initial list.
  useEffect(() => {
    if (localStorage.getItem("listEntries")) {
      let entry = JSON.parse(localStorage.getItem("listEntries") || "{}");
      setListEntries(entry);
    }
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">QUICK LIST</h2>
      <table className="table table-dark mt-5">
        <thead>
          <tr>
            <th className="" scope="col" colSpan={3}>
              <input
                type="text"
                id="listEntryInput"
                className="form-control"
                placeholder="Add item to List"
                value={newListEntry}
                onChange={(e) => setNewListEntry(e.target.value)}
              />
            </th>
            <th>
              <button
                className="btn btn-primary btn-block"
                onClick={() => handleAddListEntry()}
                disabled={newListEntry.length <= 0}
              >
                {" "}
                Add
              </button>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th className="" scope="col" colSpan={3}>
              <input
                type="text"
                id="searchQueryInput"
                className="form-control"
                placeholder="Search all available tasks"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === "") {
                    setIsFound(false);
                  }
                }}
              />
            </th>
            <th>
              <button
                className="btn btn-primary btn-block"
                onClick={() => handleSearchList()}
                disabled={searchQuery.length <= 0}
              >
                {" "}
                Search
              </button>
            </th>
          </tr>
        </thead>
        {/* Error messaging for failed searches. */}
        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}
        <thead>
          <tr>
            <th scope="col" colSpan={1}>
              Task
            </th>{" "}
            <th scope="col" colSpan={1}>
              Date
            </th>{" "}
            <th scope="col" colSpan={1}>
              Finished
            </th>
            <th scope="col" colSpan={1}></th>
          </tr>
        </thead>
        {/* Conditional rendering for the found item in the search. */}
        {isFound && listEntries[searchIndex] && (
          <tbody style={{ backgroundColor: "#fff" }} id="table">
            <tr
              style={{ backgroundColor: "white !important" }}
              key={listEntries[searchIndex].id}
            >
              <td scope="col" colSpan={1}>
                {listEntries[searchIndex].entry}
              </td>
              <td scope="col" colSpan={1}>
                {listEntries[searchIndex].date}
              </td>
              <td scope="col" colSpan={1}>
                <label> Done Yet?</label>
                {"  "}
                <input
                  type="checkbox"
                  id={listEntries[searchIndex].id.toString()}
                  name="isDone"
                  checked={listEntries[searchIndex].isDone}
                  onChange={() => {
                    handleIsDone(listEntries[searchIndex].id);
                  }}
                ></input>
              </td>
              <td scope="col" colSpan={1}>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleDeleteListEntry(listEntries[searchIndex].id)
                  }
                >
                  {" "}
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        )}
        {!isFound && (
          <tbody id="table">
            {listEntries.map((item: any) => (
              <tr key={item.id}>
                <td scope="col" colSpan={1}>
                  {item.entry}
                </td>
                <td scope="col" colSpan={1}>
                  {item.date}
                </td>
                <td scope="col" colSpan={1}>
                  <label> Done Yet?</label>
                  {"  "}
                  <input
                    type="checkbox"
                    id={item.id}
                    name="isDone"
                    value={item.isDone}
                    checked={item.isDone}
                    onChange={() => {
                      handleIsDone(item.id);
                    }}
                  ></input>
                </td>
                <td scope="col" colSpan={1}>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteListEntry(item.id)}
                  >
                    {" "}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
