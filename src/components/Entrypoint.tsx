import { useEffect, useState } from "react";
import { ListItem, useGetListData } from "../api/getListData";
import { Card } from "./Card/Card";
import { Spinner } from "./UI/Spinner";

const mergeArraysById = <T,>(arr1: (T & { id: number })[], arr2: (T & { id: number })[]) => {
  const map = new Map();

  [...arr1, ...arr2].forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    } else {
      map.set(item.id, { ...map.get(item.id), ...item });
    }
  });

  return Array.from(map.values());
};

export const Entrypoint = () => {
  const listQuery = useGetListData();

  const [cards, setCards] = useState<ListItem[]>([]);
  const [areDeletedCardsVisible, setAreDeletedCardsVisible] = useState(false);

  useEffect(() => {
    if (listQuery.data) {
      setCards((currentValue) => {
        const copiedCurrentValue = [...currentValue];

        // Instead of deleting data I just merged them.
        // In real scenario the better approach is to get some data at start, then getting only data which is not already got

        return mergeArraysById(copiedCurrentValue, listQuery.data);
      });
    }
  }, [listQuery.data, listQuery.isLoading]);

  const visibleCards = cards.filter((data) => data.isVisible);
  const invisibleCards = cards.filter((data) => data.isVisible === false);

  return (
    <>
      {listQuery.isLoading ? (
        <Spinner />
      ) : (
        <div className="flex gap-x-16">
          <div className="w-full max-w-xl">
            <h1 className="mb-1 font-medium text-lg">My Awesome List ({visibleCards.length})</h1>
            <div className="flex flex-col gap-y-3">
              {visibleCards.map((card) => (
                <Card key={`${card.id}`} id={card.id} title={card.title} description={card.description} setCards={setCards} />
              ))}
            </div>
          </div>
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between gap-2">
              <h1 className="mb-1 font-medium text-lg">Deleted Cards ({invisibleCards.length})</h1>
              <button
                className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1 ml-auto"
                onClick={() => {
                  listQuery.refetch();
                }}>
                Refresh
              </button>
              <button
                className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
                onClick={() => {
                  // You have said that "write the code, so in the future you will be able to add "revert" functionality" so that is all what you need to do it

                  setCards((currentValue) => {
                    const copiedCurrentValue = [...currentValue];

                    copiedCurrentValue.forEach((data) => {
                      data.isVisible = true;
                    });

                    return copiedCurrentValue;
                  });
                }}>
                Revert
              </button>
              <button
                className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
                onClick={() => {
                  setAreDeletedCardsVisible(true);
                }}>
                Reveal
              </button>
            </div>
            <div className="flex flex-col gap-y-3">
              {areDeletedCardsVisible && invisibleCards.map((card) => <Card key={`${card.id}`} id={card.id} title={card.title} setCards={setCards} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
