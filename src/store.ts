import { create } from "zustand";

type State = {};

type Actions = {};

// I would like to use global store but for this kind small application state is not necessary.
// I like to use store when you have to provide a fresh date to multiple components into different levels (not inherited from parent)
// Anyway this library looks easy to use but I prefer "preact react signal" which is baby easy :D

export const useStore = create<State & Actions>((set) => ({}));
