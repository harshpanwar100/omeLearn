const mongoose = require("mongoose");
var UserDB = require("../model/model");

exports.create = (req, res) => {
  const user = new UserDB({
    active: "yes",
    status: "0",
  });

  user
    .save(user)
    .then((data) => {
      res.send(data._id);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occoured while creating a create operation",
      });
    });
};

exports.leavingUserUpdate = (req,res) => {
    const userid = req.params.id;
    console.log("Leaving userid is : ",userid);

    UserDB.updateOne({_id:userid},{$set:{active:"no", status:"0"}})
        .then((data)=>{
            if(!data){
                res.status(404).send({
                    message: `cannot update user with the ${userid} or not found`
                })
            }else{
                res.send("1 doc updated")
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating user information"
            });
        });
};

exports.newUserUpdate = (req,res) => {
    const userid = req.params.id;
    console.log("Revisiting userid is : ",userid);

    UserDB.updateOne({_id:userid},{$set:{active:"yes", status:"0"}})
        .then((data)=>{
            if(!data){
                res.status(404).send({
                    message: `cannot update user with the ${userid} or not found`
                })
            }else{
                res.send("1 doc updated")
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating user information"
            });
        });
};

exports.updateOnEngagement = (req,res) => {
    const userid = req.params.id;
    console.log("Revisiting userid is : ",userid);

    UserDB.updateOne({_id:userid},{$set:{active:"yes", status:"1"}})
        .then((data)=>{
            if(!data){
                res.status(404).send({
                    message: `cannot update user with the ${userid} or not found`
                })
            }else{
                res.send("1 doc updated")
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating user information"
            });
        });
};

exports.getRemoteUsers = (req,res) => {
    const omeID = req.body.omeID;

    UserDB.aggregate([
        {
            $match: {
                _id: {$ne: new mongoose.Types.ObjectId(omeID)},
                active:"yes",
                status:"0"
            }
        },
        {$sample:{size:1}},
    ])
    .limit(1)
    .then((data) => {
        res.send(data);
    })
    .catch((err)=>{
        res.status(500).send({
            message: err.message || "Error occured while retriving user information"
        })

    })
};
