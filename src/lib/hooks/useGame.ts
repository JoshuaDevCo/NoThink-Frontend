import { useContext } from "react";
import { GameContext } from "../context/game";

export const useGame = () => useContext(GameContext)