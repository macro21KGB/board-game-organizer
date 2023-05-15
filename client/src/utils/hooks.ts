import { useLocation } from "react-router-dom"
import { ModifyGameHook } from "./interface";


export const useGameToModify = (): ModifyGameHook => {
    const location = useLocation();
    const locationObject = location.state;

    const gameToUpdate = locationObject ? locationObject.game : null;
    if (locationObject) {
        return [!!locationObject, gameToUpdate];
    }
    return [false, null];
}