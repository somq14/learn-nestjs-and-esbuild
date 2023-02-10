import { build } from 'esbuild';
import { esbuildDecorators } from '@anatine/esbuild-decorators';

// ビルド対象のファイルをここに指定する。
const entryPoints = ['src/api/main.ts'];

await build({
  logLevel: 'info',

  entryPoints,

  // バンドルを有効にする。
  // ハンドルとは、依存モジュールを連結して１つのファイルにこと。
  // バンドルして得られるファイルもバンドルと呼ぶことがある。
  bundle: true,

  // Node.js 向けにもろもろを設定する。
  // 例えば fs などの Node.js ライブラリがバンドル対象外となったり、
  // 外部ライブラリの解決方法が Node.js 向けになったりする。
  platform: 'node',

  // バンドル対象外のモジュールを指定する。
  // つまり、これらのモジュールはバンドルされずに import や require がコードに残る。
  external: [
    // これらのモジュールは NestJS の内部で必要に応じて require される仕組みになっている。
    // 実際には使用するつもりのないモジュールであるためここに指定する。
    // この指定がないと esbuild がモジュールを解決しようとしてエラーになる。
    'cache-manager',
    'class-transformer',
    'class-validator',
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
  ],

  // このディレクトリにバンドルを出力する。
  outdir: 'dist',

  // src と同様のディレクトリ構成を dist に生成する。
  outbase: 'src',

  // 出力ファイルの名前を指定する。
  entryNames: '[dir]/index',

  // 出力ファイルの拡張子を .mjs にする。
  // 拡張子を .mjs にすることで ESM であることを Node.js に明示できる。
  outExtension: { '.js': '.mjs' },

  // ソースマップ index.js.map を出力する。
  // このファイルがあるとスタックとレースで TypeScript のファイル名や行数が表示できる。
  sourcemap: true,

  // 実行環境を指定する。
  // この指定に基づいてトランスパイルが実施される。
  // トランスパイルとは、最新の JavaScript 構文を古い環境でも実行できるように同等のコードへ変換すること。
  target: 'node18',

  // 出力ファイルのモジュール形式を指定する。
  format: 'esm',

  banner: {
    // 出力ファイルのモジュール形式を ESM にしても、バンドルの一部に CommonJS の require が残ってしまう。
    // require が動作するようにバンドルの先頭にコードを挿入する。
    // cf. https://github.com/evanw/esbuild/issues/1921#issuecomment-1152887672
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },

  plugins: [
    // esbuild は TypeScript の emitDecoratorMetadata に対応していないため、NestJS などのデコレータがうまく動作しない。
    // このプラグインにより emitDecoratorMetadata の動作を再現する。
    esbuildDecorators(),
  ],

  // コードが小さくなるよう変換する。
  // 例えば、空白や改行を除去したり、変数名を短くしたりする。
  minify: true,

  // minify において関数名やクラス名は変更しない。
  // 関数名やクラス名はログなどに使用されるため変更したくない。
  keepNames: true,

  // コードを UTF-8 で出力する。
  // これを指定しないと ASCII 文字のみでコードが出力され、コードが間延びしてしまう。
  charset: 'utf8',

  // 依存ライブラリのライセンスコメントをバンドルに出力しない。
  legalComments: 'none',
});
