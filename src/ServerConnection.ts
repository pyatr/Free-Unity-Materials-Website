import axios from 'axios';

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

    public async tryLogin(email: string, password: string) {
        axios.post(this.serverConnection, {
            action: "trylogin",
            email: email,
            password: password
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    public async createNewUser(name: string, email: string, password: string) {
        axios.post(this.serverConnection, {
            name,
            email,
            password
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export default ServerConnection;