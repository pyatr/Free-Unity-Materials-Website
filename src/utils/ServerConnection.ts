import axios, {AxiosResponse} from 'axios';

export default class ServerConnection {
    private readonly serverConnection: string;
    private readonly serverPort = "8000";

    public constructor() {
        axios.defaults.withCredentials = true;
        this.serverConnection = "http://" + window.location.host + ":" + this.serverPort;
    }

    public async SendPostRequestPromise(requestName: string, requestParams: {}): Promise<AxiosResponse> {
        const response = await axios.post(this.serverConnection, {
            request: requestName,
            params: requestParams
        });
        return response;
    }
}