import axios, {AxiosResponse} from 'axios';

export default class ServerConnection {
    private readonly serverConnection: string;
    private readonly serverPort = "8000";

    public constructor() {
        axios.defaults.withCredentials = true;
        this.serverConnection = "http://" + window.location.host + ":" + this.serverPort;
    }

    public async SendPostRequestPromise(requestName: string, requestProperties: {}): Promise<AxiosResponse> {
        return await axios.post(this.serverConnection + "/" + requestName, requestProperties, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    public async SendGetRequestPromise(requestUrl: string): Promise<AxiosResponse> {
        return await axios.get(this.serverConnection + "/" + requestUrl);
    }
}