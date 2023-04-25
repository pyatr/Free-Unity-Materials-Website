import axios, {AxiosResponse} from 'axios';

export default class ServerConnection {
    private readonly serverConnection: string;
    private readonly serverPort = "8000";

    public constructor() {
        axios.defaults.withCredentials = true;
        this.serverConnection = "http://" + window.location.host + ":" + this.serverPort;
    }

    public async SendPostRequest(requestName: string, requestParams: {}, onRequestResponse: Function) {
        axios.post(this.serverConnection, {
            request: requestName,
            params: requestParams
        })
            .then(function (response) {
                onRequestResponse(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    public async SendPostRequestPromise(requestName: string, requestParams: {}): Promise<AxiosResponse> {
        const response = await axios.post(this.serverConnection, {
            request: requestName,
            params: requestParams
        });
        return response;
    }
}