"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pix = void 0;
var qrcode_1 = __importDefault(require("qrcode"));
var ID_PAYLOAD_FORMAT_INDICATOR = "00";
var ID_MERCHANT_ACCOUNT_INFORMATION = "26";
var ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
var ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
var ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
var ID_MERCHANT_CATEGORY_CODE = "52";
var ID_TRANSACTION_CURRENCY = "53";
var ID_TRANSACTION_AMOUNT = "54";
var ID_COUNTRY_CODE = "58";
var ID_MERCHANT_NAME = "59";
var ID_MERCHANT_CITY = "60";
var ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
var ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
var ID_CRC16 = "63";
var Pix = /** @class */ (function () {
    function Pix(chavePix, nomeRecebedor, cidadeRecebedor, valor, descricao, codigoTransferencia) {
        this.chavePix = chavePix;
        this.descricao = descricao ? descricao : '';
        this.nomeRecebedor = nomeRecebedor;
        this.cidadeRecebedor = cidadeRecebedor;
        this.codigoTransferencia = codigoTransferencia ? codigoTransferencia : '***';
        this.valor = valor ? valor.toFixed(2) : '';
    }
    Pix.prototype._getIdTamanhoEvalor = function (id, valor) {
        var size = String(valor.length).padStart(2, "0");
        return id + size + valor;
    };
    Pix.prototype._montarInfomacoesDoRecebedor = function () {
        var gui = this._getIdTamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_GUI, "BR.GOV.BCB.PIX");
        var chave = this._getIdTamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_KEY, this.chavePix);
        if (this.descricao)
            return this._getIdTamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION, gui + chave + this._getIdTamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, this.descricao));
        return this._getIdTamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION, gui + chave);
    };
    Pix.prototype._getAdicionalInformacao = function () {
        var txid = this._getIdTamanhoEvalor(ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, this.codigoTransferencia);
        return this._getIdTamanhoEvalor(ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
    };
    Pix.prototype.generateCode = function () {
        var payload = this._getIdTamanhoEvalor(ID_PAYLOAD_FORMAT_INDICATOR, "01") +
            this._montarInfomacoesDoRecebedor() +
            this._getIdTamanhoEvalor(ID_MERCHANT_CATEGORY_CODE, "0000") +
            this._getIdTamanhoEvalor(ID_TRANSACTION_CURRENCY, "986");
        if (this.valor)
            payload += this._getIdTamanhoEvalor(ID_TRANSACTION_AMOUNT, this.valor);
        payload += this._getIdTamanhoEvalor(ID_COUNTRY_CODE, "BR") +
            this._getIdTamanhoEvalor(ID_MERCHANT_NAME, this.nomeRecebedor) +
            this._getIdTamanhoEvalor(ID_MERCHANT_CITY, this.cidadeRecebedor) +
            this._getAdicionalInformacao();
        return payload + this._getCRC16(payload);
    };
    Pix.prototype.generateQRCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, qrcode_1.default.toDataURL(this.generateCode())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Pix.prototype._getCRC16 = function (payload) {
        function ord(str) {
            return str.charCodeAt(0);
        }
        function dechex(numero) {
            if (numero < 0) {
                numero = 0xffffffff + numero + 1;
            }
            return parseInt(numero, 10).toString(16);
        }
        //ADICIONA DADOS GERAIS NO PAYLOAD
        payload = payload + ID_CRC16 + "04";
        //DADOS DEFINIDOS PELO BACEN
        var polinomio = 0x1021;
        var resultado = 0xffff;
        var length;
        //CHECKSUM
        if ((length = payload.length) > 0) {
            for (var offset = 0; offset < length; offset++) {
                resultado ^= ord(payload[offset]) << 8;
                for (var bitwise = 0; bitwise < 8; bitwise++) {
                    if ((resultado <<= 1) & 0x10000)
                        resultado ^= polinomio;
                    resultado &= 0xffff;
                }
            }
        }
        //RETORNA CÓDIGO CRC16 DE 4 CARACTERES
        return ID_CRC16 + "04" + dechex(resultado).toUpperCase();
    };
    return Pix;
}());
exports.Pix = Pix;
;
