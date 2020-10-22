const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../modules/User'); 


//@route Get api/users
//@desc Get all users
//@access Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(user.role === "admin"){
        let users = await User.find();
        console.log("access granted");
        res.json(users);
        } else{
            res.send("access Denied");
        }
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
});  

//@route Put api/users/:id
//@desc Update User details
//@access Private
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(user.role === "admin"){
            const {name, email, password, role} = req.body;  //giving you access to make changes

    //Build contact object
    const userUpdate = {};
    if(name) userUpdate.name = name;
    if(email) userUpdate.email = email;
    if(role) userUpdate.role = role;  //Updating the object with the new values
    if(password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);  //making sure the passwords are secure when hashed
    userUpdate.password = password;   //hashing a password once hashed automatically
    }
    let findUser = User.findById(req.params.id)
    if(!findUser){
        return res.status(404).json({ msg: "User not found"})
    }
    findUser = await User.findByIdAndUpdate(req.params.id, {$set: userUpdate}, { new: true}) 
    res.json(findUser);    
} else{
        res.send("access Denied");
    }
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
});  

module.exports = router;