var azure = require('azure-storage');
const container = 'taskcontainer'

const multiparty = require('multiparty')
const uploadFileRoute = (req,res)=>{
    try{
        let id = req.params.id
        console.log(id)
        
        var blobService = azure.createBlobService();
        var form = new multiparty.Form();
        form.on('part', function(part) {
            if (part.filename) {
                var size = part.byteCount - part.byteOffset;
                var name = part.filename;
                blobService.createBlockBlobFromStream(container, id, part, size, function(error) {
                    if (error) {
                        res.send({ message: error });
                    }
                    console.log('Created')
                });
            } else {
            }
        });
        form.parse(req);
    }
    catch(e){
    }
}


const getFileRoute = (req,res)=>{
    var blobService = azure.createBlobService();
    let id = req.params.id
    blobService.doesBlobExist(container,id,(error,result,response)=>{
        if(result.exists){
            
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

            var token = blobService.generateSharedAccessSignature(container, id, sharedAccessPolicy);
            var url = blobService.getUrl(container, id, token);
            res.send(url)
            }else{
                res.status(404).send('No resource found')
            }
        })
    
}


module.exports= {
    uploadFileRoute,getFileRoute
}