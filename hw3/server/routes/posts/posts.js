

const db = require('../../database/test')

const createPost = async (req, res) => {
    let boardId = req.params.boardId
    let email = req.body.email?req.body.email:null
    let { title, body } = req.body;

    if (!title ||!body) {
      res.status(400).send({ error: "Missing title or body" });
      return;
    }
    try {
      let resp =await db.collection('boards').doc(boardId).
      collection('posts').add({title,body,email})
      res.status(201).send({ message: "Post created", id: resp.id });
      return;
    } catch (error) {
      console.log("err", error);
      res.status(500).send({ error: "Something bad happend" });
    }
  }



const getPosts = async( req,res)=>{
    try{
        let boardId=  req.params.boardId
        let data = await db.collection('boards').doc(boardId)
        .collection('posts').get()
        let array = data.docs.map(el=>{
          return {...el.data(),id:el.id}
        })
        res.status(200).send({message:'ok',posts:array})
    }
    catch(e){
      console.log(e)
        res.status(500).send({ error: "Something bad happend" });
    }
}


const getPost = async(req,res)=>{
  try{
    let postId = req.params.postId
    let boardId = req.params.boardId
    let data = await db.collection('boards').doc(boardId).collection('posts').doc(postId).get().data()
    res.status(200).send({data})
  }catch(e){
    console.log(e)
    res.status(500).send({ error: "Something bad happend" });
  }
}

const deletePost = async(req,res)=>{
  try{
    let boardId = req.params.boardId
    let postId=  req.params.postId
    let rest = await db.collection('boards').doc(boardId)
    .collection('posts').doc(postId)  
    rest.get().then(doc=>{
      if(doc.exists){
        rest.delete().then(e=>{
          res.status(200).send({message:"Deleted",})
        })
      }
      else{
        res.status(404).send({error:"Not found",})
      }
    })
}
catch(e){
  res.status(500).send({ error: "Something bad happend" });
}
}

const editPost = async(req,res)=>{
  let {email,title,body} = req.body
  let boardId =req.params.boardId
  let postId = req.params.postId
  try{
    let rest = await db.collection('boards').doc(boardId)
    .collection('posts').doc(postId)
    let d = await rest.get()
    if(!d.exists)
    {
      res.status(404).send({ message:"Not found" });
      return 
    }
    let data = d.data()
    let updateData ={email,title,body}
    Object.keys(updateData).forEach(key=>{
      if(updateData[key]==undefined)
        delete updateData[key]
    })
    console.log(updateData)
    rest.update({...data,updateData}).then(e=>{
      res.status(200).send({message:'updated'})
    }).catch(e=>{
      res.status(500).send({ error: "Something bad happend" });
    })
  }catch(e){
    console.log(e)
    res.status(500).send({ error: "Something bad happend" });
  }
}

module.exports = {
    createPost,getPosts,getPost,deletePost,editPost
}