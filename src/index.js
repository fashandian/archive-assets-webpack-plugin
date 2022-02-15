// TODO: 后续考虑用 archiver
const JSZip = require('jszip');
const { RawSource } = require('webpack').sources;
const path = require('path');
const fs = require('fs');

const PLUGIN_NAME = 'ArchiveAssetsWebpackPlugin';

class ArchiveAssetsWebpackPlugin {

    constructor({ source, destination }) {
        this.output = path.resolve(process.cwd(), destination);
        this.sourcePath = path.resolve(process.cwd(), source);
        this.filename = path.basename(this.output);
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            const jszip = new JSZip();

            compilation.hooks.processAssets.tapAsync(
                { name: PLUGIN_NAME, stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE },
                (compilationAssets, callback) => {
                    Object.keys(compilationAssets).forEach(name => {
                        const sourceCode = compilationAssets[name].source();
                        jszip.file(name, sourceCode);
                    });
                    jszip.generateAsync({ type: 'nodebuffer' }).then(result => {
                        compilation.emitAsset(this.filename, new RawSource(result));
                        callback();
                    });
                });

        });

        compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async () => {
            const destPath = path.basename(this.output);
            fs.rename(path.resolve(this.sourcePath, this.filename), destPath, (err) => {
                if (err) throw err;
                console.log('the file is archive complete!');
            });
        });
    }
}

module.exports = ArchiveAssetsWebpackPlugin;