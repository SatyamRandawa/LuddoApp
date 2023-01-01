const multer = require('multer');
const path = require('path');

const image_upload = (path,img_name)=>{

  const storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path)
    },
    filename:function(req,file,cb){
      const uniqueSuffix = Date.now();
      cb(null,uniqueSuffix+'-'+file.originalname)
    }
  })
  const upload = multer({storage:storage});
  const imgUploaded=upload.fields([{name:img_name,maxCount:1}]);
  return imgUploaded;
}

module.exports={image_upload}