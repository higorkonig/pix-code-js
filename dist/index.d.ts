export declare class Pix {
    private chavePix;
    private descricao;
    private nomeRecebedor;
    private cidadeRecebedor;
    private codigoTransferencia;
    private valor;
    constructor(chavePix: string, nomeRecebedor: string, cidadeRecebedor: string, valor?: number, descricao?: string, codigoTransferencia?: string);
    private _getIdTamanhoEvalor;
    private _montarInfomacoesDoRecebedor;
    private _getAdicionalInformacao;
    generateCode(): string;
    generateQRCode(): Promise<string>;
    private _getCRC16;
}
