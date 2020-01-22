const ipfsClient = require('ipfs-http-client');
const fs = require('fs');
const util = require("./util.js");
const ipfs = ipfsClient('http://localhost:5001');

/**
 * Displays the IPFS node ID information.
 * 
 * @returns {Promise}
 */
const ipfsID = () => {
    return ipfs.id();
}

/**
 * Adds file on BTFS
 * 
 * @param {string} name         The file name.
 * @param {string} filepath     The filepath is the local path that will be added to IPFS.
 * @returns {Promise}
 */
const addFile = (name, filepath) => {
    let filestream = fs.createReadStream(filepath);
    return ipfs.addFromStream({
        path: name,
        content: filestream
    });
}

/**
 * List directory contents for Unix filesystem objects.
 * 
 * @param {string}  btfsPath    The CID of the IPFS path to list object(s).
 * @returns {Array}
 */
const listDir = (btfsPath, filename) => {
    return util.expireOnTimeOut(() => {
        return ipfs.ls(btfsPath);
    });
}

/**
 * Fetch a file or an entire directory tree from IPFS that is addressed
 * by a valid IPFS Path. The files will be yielded as Readable Streams.
 * 
 * @param {string}  ipfsPath    IPFS path that will be downloaded.
 * @returns {Promise}
 */
const getFile = (ipfsPath) => {
    const stream = ipfs.getReadableStream(ipfsPath)
    return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
            reject(err);
        })
        stream.on('data', (file) => {
            if (typeof file.content !== undefined) {
                const writable = fs.createWriteStream(__dirname + '/download/' + file.path);
                file.content.pipe(writable);
            }
        })
        stream.on('end', () => {
            resolve(true)
        });
    });
}

module.exports.ipfsID = ipfsID;
module.exports.addFile = addFile;
module.exports.listDir = listDir;
module.exports.getFile = getFile;
