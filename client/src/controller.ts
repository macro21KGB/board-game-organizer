import { GameDaoDetaImpl } from './daos/gameDao';
import type { ExtensionType, Game, ResponsePayload } from './utils/interface';

export default class Controller {


    private static _instance: Controller;

    private gameDao: GameDaoDetaImpl

    constructor() {
        this.gameDao = new GameDaoDetaImpl();
    }

    public static getInstance(): Controller {
        if (!this._instance) {
            this._instance = new Controller();
        }
        return this._instance;
    }


    public async getGames(filterName?: string, onlyGames: boolean = false): Promise<Game[]> {
        return await this.gameDao.getGames(filterName, onlyGames);
    }

    public async getGame(gameId: string): Promise<Game> {
        return await this.gameDao.getGame(gameId);
    }

    public async getPhoto(gameKey: string) {
        return await this.gameDao.getPhoto(gameKey);
    }

    async addGame(data: FormData): Promise<ResponsePayload> {
        return this.gameDao.addGame(data);
    }

    public async getGameExtensions(gameId: string): Promise<ExtensionType[]> {
        return await this.gameDao.getGameExtensions(gameId);
    }
    public async getAllExtensions(): Promise<ExtensionType[]> {
        return await this.gameDao.getAllExtensions();
    }

    public async modifyGame(game: Game): Promise<boolean> {
        return await this.gameDao.modifyGame(game);
    }

    public async addExtension(gameId: string, extensionId: string): Promise<ResponsePayload> {
        return await this.gameDao.addExtensionToGame(gameId, extensionId);
    }

    public async removeGame(gameId: string): Promise<boolean> {
        return await this.gameDao.removeGame(gameId);
    }
}