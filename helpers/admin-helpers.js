var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')

var objectId=require('mongodb').ObjectID

module.exports={
    doSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
            adminData.Password = await bcrypt.hash(adminData.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
              db.get().collection(collection.ADMIN_COLLECTION).findOne({_id:objectId(data.insertedId)}).then((response)=>{
                resolve(response);
                //mongodb latest update il kurach change vanitund ath kond an ee code ivide add cheythath user data db il ninum eduthit resolve cheyunath an
              })
            })
        })
    },

    doLogin: (adminData) => {
        return new Promise(async(resolve, reject) => {
            
            //let loginStatus = false
            let response = {}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION)
            .findOne({ Email: adminData.Email })                                   
                if (admin) {
                    bcrypt.compare(adminData.Password, admin.Password)
                    .then((status) => {
                        if (status) {
                            console.log("Login Success");
                            response.admin = admin;
                            response.status = true;   
                            resolve(response);
                        } else {
                            console.log("Login Failed");
                            resolve({ status: false });
                        }
                    })
                } else {
                    console.log("User not found");
                    resolve({ status: false });
                }           
        })
        
    },

    getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTION)
            .find().toArray()
            resolve(user)
        })
    },

    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let order=await db.get().collection(collection.ORDER_COLLECTION)
            .find().toArray()

            resolve(order)
        })
    }
}