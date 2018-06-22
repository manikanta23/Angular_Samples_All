"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token = (function () {
    function Token(access_token, token_type, expires_in) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.expires_in = (new Date().getTime() + (expires_in * 1000));
    }
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=token.entity.js.map