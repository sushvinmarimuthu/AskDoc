'use server';

import File from "@/app/models/File";

export const validateFileName = async (newName) => {
    const existingName = await File.findOne({title: newName});
    if (existingName) {
        let suffix = 1;
        while (true) {
            const suffixedName = `${newName}-${suffix}`;
            const existingSuffixedName = await File.findOne({title: suffixedName});
            if (!existingSuffixedName) {
                return suffixedName;
            }
            suffix++;
        }
    } else {
        return newName;
    }
};

export async function checkFileAccess(file, userId) {
    let access;
    if (file.type === 'application/pdf') {
        access = false;
    } else {
        if (file.owner.id === userId) {
            access = true;
        } else {
            const index = file.sharedUsers.findIndex(data => data._id === userId);
            if (index !== -1) {
                access = file.sharedUsers.at(index).access !== 'read';
            }
        }
    }
    return access;
}

async function uint8ArrayToDataURI(uint8Array, mimeType) {
    const base64Encoded = btoa(String.fromCharCode.apply(null, uint8Array));
    return `data:${mimeType};base64,${base64Encoded}`;
}

export async function strToUint8Array(uint8Arr) {
    const mimeType = 'application/pdf';
    return await uint8ArrayToDataURI(uint8Arr, mimeType);
}

export async function getDocxData(imageResult) {
    const formData = new FormData();
    formData.append("imageResult", imageResult);
    return await new Promise((resolve, reject) => {
        fetch('https://ilocr.iiit.ac.in/ocr/infer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                imageContent: imageResult,
                modality: "printed",
                language: "en",
                version: "v4_robust"
            }),
        })
            .then(response => response.json().then(json => {
                resolve(json);
            }))
            .catch(e => {
                reject(e);
            });
    });
}

export async function convertHtmlToRtf(html) {
    if (!(typeof html === "string" && html)) {
        return null;
    }

    let tmpRichText, hasHyperlinks;
    let richText = html;

    // Singleton tags
    richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard \\brdrb \\brdrs \\brdrw10 \\brsp20 \\par}\n{\\pard\\par}\n");
    richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard\\par}\n");

    // Empty tags
    richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/ig, "{\\pard\\par}\n");
    richText = richText.replace(/<(?:[^>]+)\/>/g, "");

    // Hyperlinks
    richText = richText.replace(
        /<a(?:\s+[^>]*)?(?:\s+href=(["'])(?:javascript:void\(0?\);?|#|return false;?|void\(0?\);?|)\1)(?:\s+[^>]*)?>/ig,
        "{{{\n");
    tmpRichText = richText;
    richText = richText.replace(
        /<a(?:\s+[^>]*)?(?:\s+href=(["'])(.+)\1)(?:\s+[^>]*)?>/ig,
        "{\\field{\\*\\fldinst{HYPERLINK\n \"$2\"\n}}{\\fldrslt{\\ul\\cf1\n");
    hasHyperlinks = richText !== tmpRichText;
    richText = richText.replace(/<a(?:\s+[^>]*)?>/ig, "{{{\n");
    richText = richText.replace(/<\/a(?:\s+[^>]*)?>/ig, "\n}}}");

    // Start tags
    richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/ig, "{\\b\n");
    richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/ig, "{\\i\n");
    richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/ig, "{\\ul\n");
    richText = richText.replace(/<(?:strike|del)(?:\s+[^>]*)?>/ig, "{\\strike\n");
    richText = richText.replace(/<sup(?:\s+[^>]*)?>/ig, "{\\super\n");
    richText = richText.replace(/<sub(?:\s+[^>]*)?>/ig, "{\\sub\n");
    richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "{\\pard\n");

    // End tags
    richText = richText.replace(/<\/(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "\n\\par}\n");
    richText = richText.replace(/<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/ig, "\n}");

    // Strip any other remaining HTML tags [but leave their contents]
    richText = richText.replace(/<(?:[^>]+)>/g, "");

    // Prefix and suffix the rich text with the necessary syntax
    richText =
        "{\\rtf1\\ansi\n" + (hasHyperlinks ? "{\\colortbl\n;\n\\red0\\green0\\blue255;\n}\n" : "") + richText +
        "\n}";

    return richText;
}