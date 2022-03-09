import html2canvas from "html2canvas";
import pdfMake from "pdfmake/build/pdfmake";

const RATE = 2.83464566929;

const PAGE_WIDTH = 297 * RATE;
const PAGE_HEIGHT = 419 * RATE;

const CONTENT_WIDTH = 297 * RATE;
const CONTENT_HEIGHT = 419 * RATE;
const PAGE_MARGINS= [0 * RATE, 0 * RATE];

/**
 * @param {HTMLElement} element
 */
export async function createPdfFromHtml(element) {
    const pdfProps = await createPdfProps(element);
    createPdf(pdfProps);
}

/**
 * @param {HTMLElement} element
 * @returns {Promise<PdfProps>}
 */
async function createPdfProps(element) {
    // html2canvas実行
    const options = {
        // HACK: ブラウザ依存でcanvasサイズが変わらないように、scaleは固定値。IEでのぼやけ対策で十分大きめの2にした
        scale: 2
    };
    const canvas = await html2canvas(element, options);

    const dataUrl = canvas.toDataURL();

    const pdfProps = {
        dataUrl,
        pageSize: {
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT
        },
        pageOrientation: "PORTRAIT",
        contentSize: {
            width: CONTENT_WIDTH,
            height: CONTENT_HEIGHT
        },
        pageMargins: PAGE_MARGINS
    };

    return pdfProps;
}

/**
 * @param {PdfProps} pdfProps
 */
function createPdf(pdfProps) {
    const { dataUrl, contentSize, pageMargins } = pdfProps;
    const pageSize = pdfProps.pageSize;
    const pageOrientation = pdfProps.pageOrientation;

    const documentDefinitions = {
        pageSize,
        pageOrientation,
        content: {
            image: dataUrl,
            ...contentSize
        },
        pageMargins
    };

    pdfMake.createPdf(documentDefinitions).download();
}
