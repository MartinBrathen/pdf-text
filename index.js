const pdfjs = require('pdfjs-dist/es5/build/pdf.js')

/**
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport|Buffer} src -
 * Can be the same as for {@link https://github.com/mozilla/pdf.js/blob/a10dc1cb6e24b83d1b713e3fd3dc9a44788541d1/src/display/api.js#L207 pdfjs.getDocument(srs)} but also supports Buffer.
 * @param {string} textJoinString - Optional string to be used by join method between texts on same page. Default is newline.
 * @param {string} textJoinString - Optional string to be used by join method between pages. Default is newline.
 * @returns {Promise<string>} Promise of text content of pdf as string.
 */
async function pdfToString(pdf, textJoinString = '\n', pageJoinString = '\n'){

    return pdfjs.getDocument(pdf).promise.then(function (doc) {
        var promises = [];
        for(var i = 1; i <= doc.numPages; i++) {
            promises.push(doc.getPage(i).then(page => {
                return page.getTextContent().then(text => {
                    return text.items.map(function (s) { return s.str; }).join(textJoinString);
                });
            }));
        }
        return Promise.all(promises).then(function (texts) {
            return texts.join(pageJoinString);
        });
    });
}

module.exports = pdfToString;