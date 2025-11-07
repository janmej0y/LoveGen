const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    googleId: String,
    facebookId: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile: {
        dob: { type: Date, required: true },
        gender: { type: String, enum: ['male', 'female', 'non-binary'], required: true },
        sexualOrientation: { type: String, enum: ['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'asexual'], required: true },
        bio: { type: String, maxlength: 500 },
        interests: [{ type: String }],
        photos: [{ type: String }],
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], index: '2dsphere' }
        },
        settings: {
            showAge: { type: Boolean, default: true },
            showLocation: { type: Boolean, default: true },
            distancePreference: { type: Number, default: 50 },
            ageRange: {
                min: { type: Number, default: 18 },
                max: { type: Number, default: 55 }
            }
        }
    },
    subscription: {
        tier: { type: String, enum: ['free', 'premium', 'super'], default: 'free' },
        stripeCustomerId: String,
        expires: Date
    },
    swipes: {
        dailyCount: { type: Number, default: 0 },
        lastSwipeDate: { type: Date }
    },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Ensure the model is named 'User'
module.exports = mongoose.model('User', UserSchema);
