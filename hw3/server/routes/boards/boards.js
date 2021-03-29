

const db = require('../../database/test');

const createBoard = async (req, res) => {
    let { name, description } = req.body;
    console.log(name, description);
    if (!name) {
      console.log(name);
      res.status(400).send({ error: "Missing name or description" });
      return;
    }
    try {

      let resp = await db.collection("boards").add({
        name,
        description,
      });
      console.log(resp.id);
      res.status(201).send({ message: "Board created", id: resp.id });
      return;
    } catch (error) {
      console.log("err", error);
      res.status(500).send({ error: "Something bad happend" });
    }
  }


  const deleteBoard = async(req,res)=>{
    try{
      let id = req.params.id
      let rest = await db.collection('boards').doc(id)
      rest.get().then(doc=>{
        if(doc.exists){
          rest.delete().then(e=>{
            res.status(200).send({message:"Deleted",})
          })
        }else{
          res.status(404).send({error:"Not found",})
        }
      })
    }
    catch(e){
      console.log(e)
      res.status(500).send({ error: "Something bad happend" });
    } 

  }

  const getBoard = async(req,res)=>{
    try{
      let id = req.params.id
      let rest = await db.collection('boards').doc(id)
      let d = await rest.get()
      res.status(200).send({message:"Received Data",data:d.data()})
    }
    catch(e){
      res.status(500).send({ error: "Something bad happend" });
    }
  }

  const editBoard =async (req,res)=>{
    try{
      let id = req.params.id
      let { name, description } = req.body;
      if (!name||!description) {
        console.log(name);
        res.status(400).send({ error: "Missing name or description" });
        return;
      }
      let doc = await db.collection('boards').doc(id)
      data = {description,name}

      doc.update(data).then(e=>{
        res.status(200).send({message:"Update"})
      })

    }catch(e){
      console.log(e)
      res.status(500).send({ error: "Something bad happend" });
    }
  }

module.exports= {createBoard,
  getBoard,
  deleteBoard,
  editBoard
}