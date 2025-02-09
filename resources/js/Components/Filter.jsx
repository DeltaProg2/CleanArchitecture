import { Fragment } from "react";
import { Tab } from "@headlessui/react";
export default function Filter({ onClick }) {
  const handleClick = (e) => onClick(e.target.value);

  return (
    <Tab.Group as="div" className="mr-6" defaultIndex={2}>
      <Tab.List>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={
                selected
                  ? "bg-white text-black border border-gray-400 font-medium text-sm rounded-l-md order-1 p-2 hover:bg-indigo-400 bg-indigo-400"
                  : "bg-white text-black border border-gray-400 font-medium text-sm rounded-l-md order-1 p-2 hover:bg-indigo-400"
              }
              onClick={handleClick}
              value="active"
            >
              Начатые
            </button>
          )}
        </Tab>

        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={
                selected
                  ? "bg-white text-black border border-gray-400 font-medium text-sm order-1 p-2 hover:bg-indigo-400 bg-indigo-400"
                  : "bg-white text-black border border-gray-400 font-medium text-sm order-1 p-2 hover:bg-indigo-400"
              }
              onClick={handleClick}
              value="done"
            >
              Пройденные
            </button>
          )}
        </Tab>

        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={
                selected
                  ? "bg-white text-black border border-gray-400 font-medium text-sm rounded-r-md order-1 py-2 px-4 hover:bg-indigo-400 bg-indigo-400"
                  : "bg-white text-black border border-gray-400 font-medium text-sm rounded-r-md order-1 py-2 px-4 hover:bg-indigo-400"
              }
              onClick={handleClick}
              value="all"
            >
              Все
            </button>
          )}
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
}
