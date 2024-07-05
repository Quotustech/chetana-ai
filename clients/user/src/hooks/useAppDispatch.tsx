// hooks.ts (or hooks/useAppDispatch.ts)
//import { useDispatch } from "react-redux";
import { useDispatch, useDispatch as useDispatchBase, useSelector as useSelectorBase } from "react-redux";
import type { AppDispatch } from "@/redux/store"; // Adjust the import path according to your folder structure

export const useAppDispatch = () => useDispatch<AppDispatch>();
