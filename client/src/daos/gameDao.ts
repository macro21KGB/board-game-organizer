import { ExtensionType, Game, ResponsePayload } from "../utils/interface";
import axios from "axios";
import { getBaseUrl } from "../utils/utils";


export class GameDaoDetaImpl {


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
        const response = await fetch(`${getBaseUrl()}/games${filterName !== undefined ? `?name=${filterName}` : ""}`, {
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

    async getGameExtensions(gameId: string): Promise<ExtensionType[]> {
        try {
            const response = await axios.get<ExtensionType[]>(`${getBaseUrl()}/extensions/${gameId}`);

            const data = response.data;

            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async getAllExtensions(): Promise<ExtensionType[]> {
        try {
            const response = await axios.get<ExtensionType[]>(`${getBaseUrl()}/extensions`);

            const data = response.data;

            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async addExtensionToGame(gameId: string, extensionId: string): Promise<ResponsePayload> {
        try {
            const response = await axios.post<ResponsePayload>(`${getBaseUrl()}/extensions/${gameId}/${extensionId}`);

            const data = response.data;

            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }
    async modifyGame(game: Game): Promise<boolean> {
        try {
            console.log(game);
            const response = await axios.put<boolean>(`${getBaseUrl()}/game`, {
                game: game,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const dataResponse = response.data;

            return dataResponse;
        } catch (error: any) {
            throw new Error(error);
        }
    }


}
