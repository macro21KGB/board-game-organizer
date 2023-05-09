import { Game, ResponsePayload } from "../utils/interface";

interface GameDao {
    getGame(gameId: string): Promise<Game>;
    getGames(): Promise<Game[]>;
    addGame(game: Game): Promise<ResponsePayload>;
    updateGame(game: Game): Promise<Game>;
    deleteGame(gameId: string): Promise<Game>;
}

export class GameDaoDetaImpl implements GameDao {
    getGame(gameId: string): Promise<Game> {
        console.log(gameId);
        throw new Error("Method not implemented.");
    }
    async getGames(filterName?: string): Promise<Game[]> {
        const response = await fetch(`/api/games${filterName !== "" ? `?name=${filterName}` : ""}`, {
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
            game: game
        }

        const response = await fetch('/api/game', {
            method: 'POST',
            body: JSON.stringify(payloadToSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json() as ResponsePayload;
        return data;
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
