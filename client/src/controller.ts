import { GameDaoDetaImpl } from './daos/gameDao';
import type { Game, ResponsePayload } from './utils/interface';

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


    public async getGames(filterName?: string): Promise<Game[]> {
        return await this.gameDao.getGames(filterName);
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

}