import 'babel-polyfill'; // use to build
const BASE_URL = process.env.VUE_APP_API_BASE_URL + '/xpl/backend/connector.php';

const request = (method = 'GET', body) => {
  if (!body) {
    body = method;
    method = "GET";
  }
  if (method === 'GET') {
    var query = [];
    for (var key in body) {
      query.push(`${key}=${body[key]}`);
    }
    query.push('v=' + new Date().getTime());
    query = query.join("&");

    return fetch(`${BASE_URL}?${query}`)
      .then(res => res.json())
      .catch(ex => console.log(ex));
  }
  return fetch(`${BASE_URL}`, {
      method,
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .catch(ex => console.log(ex));
};

const requestUpload = (method = 'POST', body) => {
  return fetch(`${BASE_URL}`, {
    method,
    body: body
  })
    .then(res => res.json())
    .catch(ex => console.log(ex));
};

const getDir = folder => request({
  method: 'list',
  folder
});
const uploadFile = (data) => requestUpload('POST', data);
const createFolder = folder => request('POST', {
  method: "createFolder",
  folderName: folder
});
const deleteFiles = paths => request('POST', {
  method: "deleteFile",
  paths
});
const deleteFolder = folder => request('POST', {
  method: "deleteFolder",
  folder
});
const renameFolder = (newName, folderName) => request('POST', {
  method: "renameFolder",
  newName,
  folderName
});
const moveFile = (paths, destination) => request('POST', {
  method: "moveFile",
  paths,
  destination
});

let _folder = '/';

export function setFolder(f) {
  _folder = f;
}

export function getFolder() {
  return _folder;
}

export default {
  getDir,
  createFolder,
  deleteFiles,
  deleteFolder,
  renameFolder,
  moveFile,
  uploadFile
};
