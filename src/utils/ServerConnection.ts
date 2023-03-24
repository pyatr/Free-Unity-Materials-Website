import axios from 'axios';

export default class ServerConnection {
    private readonly serverConnection: string;

    public constructor(connectionUrl: string) {
        this.serverConnection = connectionUrl;
    }

    public async sendRequest(requestName: string, requestParams: {}, onRequestResponse: Function) {
        axios.post(this.serverConnection, {
            request: requestName,
            params: requestParams
        })
            .then(function (response) {
                onRequestResponse(response.data.toString());
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}