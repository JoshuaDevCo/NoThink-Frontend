import { IBoosterStore } from "../../store/booster";
import { IChallengeStore } from "../../store/challenge";
import { TCounterStore } from "../../store/counter";
import { IStatStore } from "../../store/stat";

export interface IGameContext {
  counter: TCounterStore;
  stat: IStatStore;
  booster: IBoosterStore;
  challenge: IChallengeStore;
}
