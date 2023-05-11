import { Game, ResponsePayload } from "../utils/interface";
import axios from "axios";
import { getBaseUrl } from "../utils/utils";

interface GameDao {
    getGame(gameId: string): Promise<Game>;
    getGames(): Promise<Game[]>;
    addGame(data: FormData): Promise<ResponsePayload>;
    getPhoto(gameKey: string): Promise<string>;
    updateGame(game: Game): Promise<Game>;
    deleteGame(gameId: string): Promise<Game>;
}

export class GameDaoDetaImpl implements GameDao {

    async getGame(gameId: string): Promise<Game> {
        try {
            const response = axios.get<Game | string>(`${getBaseUrl()}/game/${gameId}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = (await response).data;

            if (data === null || data === "") throw new Error("Game not found");

            return data as Game;
        } catch (error: any) {
            throw new Error(error);
        }
    }
    async getGames(filterName?: string): Promise<Game[]> {
        const response = await fetch(`${getBaseUrl()}/games${filterName !== "" ? `?name=${filterName}` : ""}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json() as Game[];
        return data;
    }
    async addGame(data: FormData): Promise<ResponsePayload> {
        const response = await axios.post<ResponsePayload>(`${getBaseUrl()}/game`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        const dataResponse = response.data;

        return dataResponse;
    }

    async getPhoto(gameKey: string): Promise<string> {
        try {
            const response = await axios.get<Blob>(`${getBaseUrl()}/photo/${gameKey}`);

            const data: any = response.data;

            const b64Image = data.toString('base64');
            const imgSrc = `data:image/jpeg;base64,${b64Image}`;
            console.log(imgSrc);
            return imgSrc;

        } catch (err) {
            console.log(err);
            return "";
        }
    }

    updateGame(game: Game): Promise<Game> {
        console.log(game);
        throw new Error("Method not implemented.");
    }
    deleteGame(gameId: string): Promise<Game> {
        console.log(gameId);
        throw new Error("Method not implemented.");
    }
}
