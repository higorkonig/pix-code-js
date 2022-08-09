declare class Pix {
    private chavePix;
    private descricao;
    private nomeRecebedor;
    private cidadeRecebedor;
    private codigoTransferencia;
    private valor;
    constructor(chavePix: string, nomeRecebedor: string, cidadeRecebedor: string, valor: number, descricao?: string, codigoTransferencia?: string);
    private _getIdETamanhoEvalor;
    private _montarInfomacoesDoRecebedor;
    private _getAdicionalInformacao;
    generateCode(): string;
    private _getCRC16;
}
export default Pix;
