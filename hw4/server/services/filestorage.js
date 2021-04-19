
var azure = require('azure-storage');
var blobService = azure.createBlobService( );
const container = 'taskcontainer'
const fs = require('fs')

const createContainer =(container)=>{
    return blobService.createContainerIfNotExists('taskcontainer', {
        publicAccessLevel: 'blob'
      }, function(error, result, response) {
        if (!error) {
            // return result
        }
        console.log(error,result)
      });
}

const uploadFile = (id,stream,size)=>{
    blobService.createBlockBlobFromStream(container, id, stream, size, function(error) {
        if (error) {
            res.send({ Grrr: error });
        }
    });
}

const getFile = (id)=>{
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);
    
    var sharedAccessPolicy = {
    AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate
    }
    };
    var token = blobService.generateSharedAccessSignature('taskcontainer', id, sharedAccessPolicy);
    var url = blobService.getUrl('taskcontainer', id, token);
    return url
}

module.exports={
    createContainer,uploadFile,getFile
}