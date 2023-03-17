import axios from 'axios';

export {ServerConnection as ServerConnection};

class ServerConnection {
    private serverConnection: string;

    constructor(connectionUrl: string) {
        this.serverConnection = connectionUrl;
    }

    public async sendTestRequest() {
        try {
            const {data, status} = await axios.get(this.serverConnection);
            console.log('response status is: ', status);
            console.log('result is ', data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
}
