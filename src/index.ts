const ID_PAYLOAD_FORMAT_INDICATOR = "00";
const ID_MERCHANT_ACCOUNT_INFORMATION = "26";
const ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
const ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
const ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
const ID_MERCHANT_CATEGORY_CODE = "52";
const ID_TRANSACTION_CURRENCY = "53";
const ID_TRANSACTION_AMOUNT = "54";
const ID_COUNTRY_CODE = "58";
const ID_MERCHANT_NAME = "59";
const ID_MERCHANT_CITY = "60";
const ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
const ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
const ID_CRC16 = "63";

class Pix {
  private chavePix: string
  private descricao: string
  private nomeRecebedor: string
  private cidadeRecebedor: string
  private codigoTransferencia: string
  private valor: string

  constructor(chavePix: string, nomeRecebedor: string, cidadeRecebedor: string, valor: number, descricao?: string, codigoTransferencia?: string,) {
    this.chavePix = chavePix;
    this.descricao = descricao ? descricao : '';
    this.nomeRecebedor = nomeRecebedor;
    this.cidadeRecebedor = cidadeRecebedor;
    this.codigoTransferencia = codigoTransferencia ? codigoTransferencia : '***';
    this.valor = valor.toFixed(2);
  }

  private _getIdETamanhoEvalor(id: string, valor: string): string {
    const size = String(valor.length).padStart(2, "0");
    return id + size + valor;
  }

  private _montarInfomacoesDoRecebedor(): string {
    const gui = this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_GUI, "BR.GOV.BCB.PIX");
    const chave = this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_KEY, this.chavePix);

    if(this.descricao) return this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION, gui + chave + this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, this.descricao));

    return this._getIdETamanhoEvalor(ID_MERCHANT_ACCOUNT_INFORMATION, gui + chave);
  }

  private _getAdicionalInformacao() {
    const txid = this._getIdETamanhoEvalor(
      ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,
      this.codigoTransferencia
    );
    return this._getIdETamanhoEvalor(ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
  }


  public generateCode() {
    let payload =
      this._getIdETamanhoEvalor(ID_PAYLOAD_FORMAT_INDICATOR, "01") +
      this._montarInfomacoesDoRecebedor() +
      this._getIdETamanhoEvalor(ID_MERCHANT_CATEGORY_CODE, "0000") +
      this._getIdETamanhoEvalor(ID_TRANSACTION_CURRENCY, "986") +
      this._getIdETamanhoEvalor(ID_TRANSACTION_AMOUNT, this.valor) +
      this._getIdETamanhoEvalor(ID_COUNTRY_CODE, "BR") +
      this._getIdETamanhoEvalor(ID_MERCHANT_NAME, this.nomeRecebedor) +
      this._getIdETamanhoEvalor(ID_MERCHANT_CITY, this.cidadeRecebedor) +
      this._getAdicionalInformacao();

    return payload + this._getCRC16(payload);
  }

  private _getCRC16(payload: string): string {
    function ord(str: string): number {
      return str.charCodeAt(0);
    }
    function dechex(numero: any): string {
      if (numero < 0) {
        numero = 0xffffffff + numero + 1;
      }
      return parseInt(numero, 10).toString(16);
    }

    //ADICIONA DADOS GERAIS NO PAYLOAD
    payload = payload + ID_CRC16 + "04";

    //DADOS DEFINIDOS PELO BACEN
    let polinomio = 0x1021;
    let resultado = 0xffff;
    let length;

    //CHECKSUM
    if ((length = payload.length) > 0) {
      for (let offset = 0; offset < length; offset++) {
        resultado ^= ord(payload[offset]) << 8;
        for (let bitwise = 0; bitwise < 8; bitwise++) {
          if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
          resultado &= 0xffff;
        }
      }
    }
    //RETORNA CÓDIGO CRC16 DE 4 CARACTERES
    return ID_CRC16 + "04" + dechex(resultado).toUpperCase();
  }

}

export default Pix;