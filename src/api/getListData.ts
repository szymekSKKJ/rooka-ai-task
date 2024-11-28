import { useQuery } from "@tanstack/react-query";
import mockJson from "./mock.json";

export type ListItem = {
  id: number;
  title: string;
  description: string;
  isVisible: boolean;
};

export type DeletedListItem = Omit<ListItem, "description">;

export const useGetListData = () => {
  const query = useQuery({
    queryKey: ["list"],
    staleTime: Infinity,
    queryFn: async () => {
      await sleep(1000);

      const mockData = mockJson as Omit<ListItem, "isVisible">[];

      return shuffle(mockData)
        .map((item) => {
          return { ...item, isVisible: getRandom() === 0 ? false : true };
        })
        .filter((data) => data.isVisible);
    },
  });

  return query;
};

const getRandom = () => Math.floor(Math.random() * 2);

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};
