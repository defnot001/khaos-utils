export default class Commands {
    private _instance: Commands | null = null;
    private constructor() {
        this._instance = this;
    }

    getInstance(): Commands {
        if (this._instance) {
            return this._instance;
        }

        return new Commands();
    }
}