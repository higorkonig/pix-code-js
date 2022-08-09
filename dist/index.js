"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.valor = valor.toFixed(2);
    }
    Pix.prototype._getIdETamanhoEvalor = function (id, valor) {
        var size = String(valor.length).padStart(2, "0");
        return id + size + valor;
    };
    Pix.prototype._montarInfomacoesDoRecebedor = function () {
        var gui = this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_GUI, "BR.GOV.BCB.PIX");
        var chave = this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_KEY, this.chavePix);
        if (this.descricao)
            return this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION, gui + chave + this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, this.descricao));
        return this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION, gui + chave);
    };
    Pix.prototype._getAdicionalInformacao = function () {
        var txid = this._getIdETamanhoEvalor(ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, this.codigoTransferencia);
        return this._getIdETamanhoEvalor(ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
    };
    Pix.prototype.generateCode = function () {
        var payload = this._getIdETamanhoEvalor(ID_PAYLOAD_FORMAT_INDICATOR, "01") +
            this._montarInfomacoesDoRecebedor() +
            this._getIdETamanhoEvalor(ID_MERCHANT_CATEGORY_CODE, "0000") +
            this._getIdETamanhoEvalor(ID_TRANSACTION_CURRENCY, "986") +
            this._getIdETamanhoEvalor(ID_TRANSACTION_AMOUNT, this.valor) +
            this._getIdETamanhoEvalor(ID_COUNTRY_CODE, "BR") +
            this._getIdETamanhoEvalor(ID_MERCHANT_NAME, this.nomeRecebedor) +
            this._getIdETamanhoEvalor(ID_MERCHANT_CITY, this.cidadeRecebedor) +
            this._getAdicionalInformacao();
        return payload + this._getCRC16(payload);
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
exports.default = Pix;
