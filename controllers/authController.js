const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Signup Controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = await User.create({ username, email, password });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateuser = async (req, res) => {
    try {
        const { id } = req.params;
        const childData = req.body;

        if (!childData) {
            return res.status(400).json({ message: 'Data is missing in body' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Map frontend keys to backend schema keys
        user.child = {
            childname: childData.childName ?? user.child?.childname,
            childage: childData.childAge ?? user.child?.childage,
            childgender: childData.childGender ?? user.child?.childgender,
            familyautism: childData.familyAutism === 'yes', // Convert "yes" to true
            prematurity: childData.prematureBirth === 'yes', // Convert "yes" to true
        };

        await user.save();
        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user details', error });
    }
};
const geteuser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user details', error });
    }
};


module.exports = { signup, login, updateuser,geteuser };
