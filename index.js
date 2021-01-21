const pdfjs = require('pdfjs-dist/es5/build/pdf.js')

/**
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport|Buffer} src -
 * Can be the same as for {@link https://github.com/mozilla/pdf.js/blob/a10dc1cb6e24b83d1b713e3fd3dc9a44788541d1/src/display/api.js#L207 pdfjs.getDocument(srs)} but also supports Buffer.
 * @returns {Promise<Array<Array<string>>>} Promise of text content of pdf as 2D array of strings, where each second level arrays represents a page of the pdf.
 */
async function pdfToArray2D(pdf){

    return pdfjs.getDocument(pdf).promise.then(function (doc) {
        var promises = [];
        for(var i = 1; i <= doc.numPages; i++) {
            promises.push(doc.getPage(i).then(page => {
                return page.getTextContent().then(text => {
                    return text.items.map(function (s) { return s.str; });
                });
            }));
        }
        return Promise.all(promises).then(function (texts) {
            return texts;
        });
    });
}

/**
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport|Buffer} src -
 * Can be the same as for {@link https://github.com/mozilla/pdf.js/blob/a10dc1cb6e24b83d1b713e3fd3dc9a44788541d1/src/display/api.js#L207 pdfjs.getDocument(srs)} but also supports Buffer.
 * @returns {Promise<Array<string>>} Promise of text content of pdf flat array of strings.
 */
async function pdfToArray(pdf){

    return pdfToArray2D(pdf).then((res) => {
        return res.flat()
    });
}

/**
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport|Buffer} src -
 * Can be the same as for {@link https://github.com/mozilla/pdf.js/blob/a10dc1cb6e24b83d1b713e3fd3dc9a44788541d1/src/display/api.js#L207 pdfjs.getDocument(srs)} but also supports Buffer.
 * @param {string} textJoinString - Optional string to be used by join method between texts on same page. Default is newline.
 * @param {string} textJoinString - Optional string to be used by join method between pages. Default is newline.
 * @returns {Promise<string>} Promise of text content of pdf as string.
 */
async function pdfToString(pdf, textJoinString = '\n', pageJoinString = '\n'){

    return pdfToArray2D(pdf).then((res) => {
        return res.map((page).join(pageJoinString)).join(textJoinString);
    });
}

module.exports = {
    asString: pdfToString,
    asArray2D: pdfToArray2D,
    asArray: pdfToArray
}