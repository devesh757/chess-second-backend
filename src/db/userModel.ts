import mongoose,{Document,Schema} from "mongoose"

export interface IUser extends Document{
    firstname:string,
    lastname:string,
    email:string,
    password:string
}

const userModel = new Schema<IUser>({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true,Unique:true},
    password:{type:String,required:true}
})

const User = mongoose.model<IUser>("User",userModel);

export default User;