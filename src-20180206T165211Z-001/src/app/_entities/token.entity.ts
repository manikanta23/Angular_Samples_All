export class Token {
    access_token: string;
    token_type: string;
    expires_in: number;
    expiry_datetime: number;

    constructor(access_token: string, token_type: string, expires_in: number) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.expires_in = (new Date().getTime() + (expires_in * 1000));
    }
}