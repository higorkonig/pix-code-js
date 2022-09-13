<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/higorkonig/pix-code-js">
    <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo-1.png" alt="Logo" width="215" height="76">
  </a>
</p>

# Manda o Pix

Gerador de código Pix para scaneamento com qr code;

**Qualquer preenchimento incorreto, os aplicativos dos bancos não conseguiram ler o qr code**

## Instalação:

Se este é um projeto totalmente novo, certifique-se de criar um `package.json` primeiro com
o comando [`npm init`](https://docs.npmjs.com/creating-a-package-json-file).

```console
$ yarn add manda-o-pix
ou
$ npm i manda-o-pix
```

### Parâmetros obrigatórios ex.
```JS
//Parâmetros obrigatórios

import { Pix } from "manda-o-pix";

const chavePix = '123e4567-e12b-12d1-a456-426655440000';
const nomeRecebedor = 'Higor Konig';
const cidadeRecebedor = 'Sao Paulo';

const codigo = new Pix(chavePix, nomeRecebedor, cidadeRecebedor);

codigo.generateCode();
```

```console
00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5911Higor Konig6009Sao Paulo62070503***6304BA66
```

## Informações dos parâmetros obrigatórios

| Nome            | Tamanho max |
| --------------- | ----------: |
| chavePix        |          36 |
| nomeRecebedor   |          13 |
| cidadeRecebedor |          08 |

<br>

### Parâmetros opcionais ex.

```JS
import { Pix } from "manda-o-pix";

const chavePix = '123e4567-e12b-12d1-a456-426655440000';
const nomeRecebedor = 'Higor Konig';
const cidadeRecebedor = 'Sao Paulo';

//Parâmetros opcionais
const valor = 75.80;
const descricao: 'produto 2'
const transacaoId: 'PAGAMENTO123ABC'

const codigo = new Pix(chavePix, nomeRecebedor, cidadeRecebedor, valor, descricao, transacaoId);

codigo.generateCode();
```

```console
00020126700014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-4266554400000208produto2520400005303986540575.805802BR5911Higor Konig6009Sao Paulo62190515PAGAMENTO123ABC6304A82A
```

## Informações dos parâmetros opcionais

| Nome        | Tamanho max |
| ----------- | ----------: |
| valor       |          06 |
| descricao   |          18 |
| transacaoId |          07 |

## Métodos

```JS
generateCode() // Método retorna o código gerado para o QrCode
await generateQRCode() // Método assincrono retorna um QrCode em base64
```

Referências útilizadas: <br>
[`documentação do pix`](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf); <br>
[`documentação pix bar`](https://www.npmjs.com/package/manda-o-pix);
