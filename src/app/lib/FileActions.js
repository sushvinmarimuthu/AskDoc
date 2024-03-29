'use server';

import parseRTF from "rtf2text";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import {ObjectId} from "mongodb";
import {convertHtmlToRtf, getDocxData, strToUint8Array, validateFileName} from "@/app/lib/files";
import mammoth from "mammoth";
import {parse} from "node-html-parser";
import {PDFDocument} from "pdf-lib";
import Paper from "@/app/models/Paper";
import {NextResponse} from "next/server";
import {revalidatePath} from "next/cache";
import fs from "fs/promises";
import htmlToDocx from "html-to-docx"; //TODO: Deprecated, Replace with updated Packages.
import _ from "lodash";
import {put} from "@vercel/blob";

async function getRTF(fileText) {
    return await new Promise((resolve, reject) => {
        parseRTF.string(fileText, (err, text) => {
            if (err) {
                reject(err)
            } else {
                resolve(text);
            }
        });
    });
}

export async function uploadFile(formData) {
    await connectDB();

    let result;

    const userId = formData.get('userId');
    const file = formData.get('file');

    const user = await User.findById(new ObjectId(userId));
    const userData = {id: userId, name: user.name, email: user.email};
    const title = await validateFileName(file.name.replace(/\.[^/.]+$/, ""));
    let description;

    await file.arrayBuffer()
        .then(async (data) => {
            // Extract Data from the file.
            let fileData;
            if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const imageResult = [];
                const options = {
                    convertImage: mammoth.images.imgElement(function (image) {
                        return image.read("base64").then(function (imageBuffer) {
                            imageResult.push("data:" + image.contentType + ";base64," + imageBuffer)
                            return {
                                src: "data:" + image.contentType + ";base64," + imageBuffer,
                                id: `image-${new ObjectId()}`
                            };
                        });
                    })
                };

                fileData = await mammoth.convertToHtml({buffer: Buffer.from(data)}, options);
                await getDocxData(imageResult);

                // TODO: Remove this test array when get a API data.
                const imageData = ['Text from 1st image', 'Text from 2nd image'];
                const html = parse(fileData.value);
                html.getElementsByTagName('img').map((img, index) => {
                    const image = html.getElementById(img.attributes['id']);

                    // This code append the text after the image in the editor and preview.
                    image.insertAdjacentHTML('afterend', `<p>${imageData[index]}</p>`);

                    // This code replace the text with image in the editor and preview.
                    // image.replaceWith(`<p>${imageData[index]}</p>`)
                })

                fileData = html.toString();
                description = fileData.replace(/<[^>]+>/g, '').substring(0, 50) || 'Description';
            } else if (file.type === 'text/rtf') {
                const rtf = await getRTF(Buffer.from(data));
                fileData = rtf.toString();
                description = fileData.replace(/<[^>]+>/g, '').substring(0, 50) || 'Description';
            } else if (file.type === 'application/pdf') {
                const pdfDoc = await PDFDocument.load(data)
                const pdfBytes = await pdfDoc.save()
                fileData = await strToUint8Array(pdfBytes);
                description = 'PDF Document';
            } else {
                fileData = Buffer.from(data).toString();
                description = fileData.replace(/<[^>]+>/g, '').substring(0, 50) || 'Description';
            }

            result = await Paper.create({
                title: title,
                description: description,
                fileData: fileData,
                type: file.type,
                size: file.size,
                owner: userData,
                sharedUsers: [],
            })
            revalidatePath(`/${userId}/home`)
        })
        .catch(() => {
            return NextResponse.json({status: 409, error: "Post Paper Data failed."})
        });
}

export async function createFile(formData) {
    await connectDB();

    const title = await validateFileName(formData.get('name'));
    const userId = formData.get('userId');
    const user = await User.findById({_id: new ObjectId(userId)});
    const userData = {id: user._id, name: user.name, email: user.email};

    const fileResult = await Paper.create({
        title: title,
        description: 'Description',
        fileData: '',
        type: null,
        size: 0,
        owner: userData,
        sharedUsers: []
    })

    const fileId = await fileResult._id;
    return JSON.parse(JSON.stringify(fileId));
}

export async function renameFile(formData) {
    const userId = formData.get('userId');
    const fileId = formData.get('fileId');
    const name = formData.get('name');

    await Paper.findOneAndUpdate({_id: new ObjectId(fileId)}, {title: name})
    revalidatePath(`/${userId}/home`)
}

export async function deleteFile(fileId, userId) {
    await Paper.findOneAndDelete({_id: new ObjectId(fileId)});
    revalidatePath(`/${userId}/home`)
}

export async function saveFileData(formData) {
    await connectDB();
    const fileData = formData.get('fileData');
    const fileId = formData.get('fileId');

    await Paper.findOneAndUpdate({_id: new ObjectId(fileId)},
        {
            fileData: fileData,
            size: fileData.length,
            description: fileData.replace(/<[^>]+>/g, '').substring(0, 50) || 'Description'
        })
}

export async function getUserFiles(userId) {
    await connectDB();
    const ownedByMe = await Paper.find({"owner.id": {"$eq": userId}}).sort({updatedAt: -1})
    const sharedWithMe = await Paper.find({"sharedUsers._id": {"$eq": userId}}).sort({updatedAt: -1});

    return JSON.parse(JSON.stringify([ownedByMe, sharedWithMe]))
}

export async function getFile(fileId) {
    await connectDB();
    const paper = await Paper.findOne({_id: new ObjectId(fileId)});
    return JSON.parse(JSON.stringify(paper));
}

export async function textTranslation(formData) {
    let result;
    const text = formData.get('text');
    const source_lang = formData.get('source_lang');
    const target_lang = formData.get('target_lang');

    await fetch('https://ssmt.iiit.ac.in/onemt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({text: text, source_language: source_lang, target_language: target_lang}),
    }).then(response => response.json().then(json => {
        result = json.data;
    }));

    return result;
}

export async function textQA(formData) {
    let result;
    const text = formData.get('text');
    const previewFileId = formData.get('previewFileId');

    return result;
}

export async function downloadFile(fileId, fileType) {
    await connectDB();

    const file = await Paper.findOne({_id: new ObjectId(fileId)});
    let blob, downFile, buffRes;
    const filePath = `doc_${file.updatedAt.getTime()}_${file.title.replace(' ', '_')}.${fileType === '.docx' ? 'docx' : 'rtf'}`;
    if (fileType === '.docx') {
        buffRes = await htmlToDocx(file.fileData, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } else if (fileType === '.rtf') {
        buffRes = await convertHtmlToRtf(file.fileData);
    }
    await fs.writeFile(filePath, buffRes);
    downFile = await fs.readFile(filePath);
    blob = await put(`papers/${filePath}`, downFile, {
        access: 'public',
    })
    await fs.unlink(filePath);
    return blob.url;
}

export async function removeFileAccess(fileId, userId) {
    await connectDB();

    const file = await Paper.findOne({_id: new ObjectId(fileId)});
    const index = file.sharedUsers.findIndex(su => su._id === userId)
    if (index === -1) {
        throw new Error("User not found.")
    } else {
        file.sharedUsers.splice(index, 1);
    }
    file.markModified('sharedUsers')
    file.save()
}

export async function updateFilePermission(formData) {
    await connectDB();
    const emailsResult = JSON.parse(formData.get('emailsResult'));
    const fileId = formData.get('fileId');
    const isReadWrite = formData.get('isReadWrite');

    if (isReadWrite === 'read' || isReadWrite === 'write') {
        const file = await Paper.findOne({_id: new ObjectId(fileId)});
        emailsResult.map(_id => {
            const index = file.sharedUsers.findIndex(su => su._id === _id)
            if (index === -1) {
                file.sharedUsers.push({_id: _id, access: isReadWrite})
            } else {
                if (isReadWrite === 'read') {
                    if (_.isEqual(file.sharedUsers.at(index), {_id: _id, access: 'write'})) {
                        file.sharedUsers[index].access = 'read';
                    }
                } else {
                    if (_.isEqual(file.sharedUsers.at(index), {_id: _id, access: 'read'})) {
                        file.sharedUsers[index].access = 'write';
                    }
                }
            }
            file.markModified('sharedUsers')
            file.save()
        })
    }
    revalidatePath('/')
}


export async function getSharedUsers(fileId) {
    await connectDB();
    const file = await Paper.findOne({_id: new ObjectId(fileId)});
    let result = [];
    let sharedUserIds = [];
    file?.sharedUsers?.map(data => {
        sharedUserIds.push(new ObjectId(data['_id']));
    })
    if (sharedUserIds) {
        result = await User.find({
            _id: {
                $in: sharedUserIds
            }
        })
    }

    return JSON.parse(JSON.stringify(result));
}


export async function buildIndex(userFiles) {
    console.log(userFiles)
}