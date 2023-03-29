import axios from 'axios';

export default class ServerConnection {
    private readonly serverConnection: string;

    public constructor() {
        this.serverConnection = window.location.host + ":3306";
    }

    public async sendRequest(requestName: string, requestParams: {}, onRequestResponse: Function) {
        console.log("server connection is " + this.serverConnection);
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