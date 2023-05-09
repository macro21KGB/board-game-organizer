import { Game, ResponsePayload } from "../utils/interface";
import axios from "axios";

interface GameDao {
    getGame(gameId: string): Promise<Game>;
    getGames(): Promise<Game[]>;
    addGame(game: Game): Promise<ResponsePayload>;
    addGamePhoto(photo: string, key: string): Promise<ResponsePayload>;
    updateGame(game: Game): Promise<Game>;
    deleteGame(gameId: string): Promise<Game>;
}

export class GameDaoDetaImpl implements GameDao {
    public static SERVER_URL = "http://localhost:4200/api";


    getGame(gameId: string): Promise<Game> {
        console.log(gameId);
        throw new Error("Method not implemented.");
    }
    async getGames(filterName?: string): Promise<Game[]> {
        const response = await fetch(`${GameDaoDetaImpl.SERVER_URL}/games${filterName !== "" ? `?name=${filterName}` : ""}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json() as { items: Game[] };
        return data.items;
    }
    async addGame(game: Game): Promise<ResponsePayload> {
        const payloadToSend = {
            game: {
                ...game,
                imageUrl: null
            }
        }
        const response = await fetch(`${GameDaoDetaImpl.SERVER_URL}/game`, {
            method: 'POST',
            body: JSON.stringify(payloadToSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json() as ResponsePayload;

        if (!data.success) {
            throw new Error("Error adding game");
        }

        return data;
    }

    async addGamePhoto(photo: string, key: string): Promise<ResponsePayload> {

        const payloadToSend = new FormData();
        payloadToSend.append('photo', photo);

        const responsePhoto = await axios.post<ResponsePayload>(`${GameDaoDetaImpl.SERVER_URL}/game/photo?key=${key}`, {
            payloadToSend
        })

        const dataPhoto = responsePhoto.data;

        return dataPhoto;
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
