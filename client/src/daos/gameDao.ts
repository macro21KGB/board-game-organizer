import { Game } from "../utils/interface";

interface GameDao {
    getGame(gameId: string): Promise<Game>;
    getGames(): Promise<Game[]>;
    addGame(game: Game): Promise<Game>;
    updateGame(game: Game): Promise<Game>;
    deleteGame(gameId: string): Promise<Game>;
}

export class GameDaoDetaImpl implements GameDao {
    getGame(gameId: string): Promise<Game> {
        console.log(gameId);
        throw new Error("Method not implemented.");
    }
    getGames(): Promise<Game[]> {
        throw new Error("Method not implemented.");
    }
    addGame(game: Game): Promise<Game> {
        console.log(game);
        throw new Error("Method not implemented.");
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
