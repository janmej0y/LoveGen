const User = require('../models/User');
const Match = require('../models/Match');

// Haversine formula to calculate distance between two lat/lon points
function getDistanceInMiles(coords1, coords2) {
    const R = 3958.8; // Radius of the Earth in miles
    const lat1 = coords1[1];
    const lon1 = coords1[0];
    const lat2 = coords2[1];
    const lon2 = coords2[0];

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

exports.findPotentialMatches = async (userId) => {
    const currentUser = await User.findById(userId);
    if (!currentUser || !currentUser.profile.location.coordinates) {
        return [];
    }

    // 1. Find users who have already been interacted with (liked, disliked, or matched)
    const interactedUsers = await Match.find({ users: userId });
    const interactedUserIds = interactedUsers.flatMap(match => match.users);

    // 2. Build the query
    const { ageRange, distancePreference, sexualOrientation } = currentUser.profile.settings;

    // Determine the gender preferences based on orientation
    let genderPreference = [];
    if (currentUser.profile.gender === 'male') {
        if (sexualOrientation === 'straight') genderPreference = ['female'];
        if (sexualOrientation === 'gay') genderPreference = ['male'];
        if (['bisexual', 'pansexual'].includes(sexualOrientation)) genderPreference = ['male', 'female', 'non-binary'];
    } else if (currentUser.profile.gender === 'female') {
        if (sexualOrientation === 'straight') genderPreference = ['male'];
        if (sexualOrientation === 'lesbian') genderPreference = ['female'];
        if (['bisexual', 'pansexual'].includes(sexualOrientation)) genderPreference = ['male', 'female', 'non-binary'];
    } // Add more logic for non-binary if needed

    // Age range calculation
    const minDob = new Date();
    minDob.setFullYear(minDob.getFullYear() - ageRange.max);
    const maxDob = new Date();
    maxDob.setFullYear(maxDob.getFullYear() - ageRange.min);
    
    // 3. Find potential users who meet the criteria and have not been interacted with
    let potentialMatches = await User.find({
        _id: { $ne: userId, $nin: interactedUserIds },
        'profile.gender': { $in: genderPreference },
        'profile.dob': { $gte: minDob, $lte: maxDob },
        'profile.photos': { $exists: true, $not: { $size: 0 } } // Must have at least one photo
    }).select('username profile.photos profile.bio profile.interests profile.dob profile.location');

    // 4. Filter by distance client-side or with more complex geo-queries
    // A simple server-side filter for demonstration:
    const userCoords = currentUser.profile.location.coordinates;
    potentialMatches = potentialMatches.filter(user => {
        if (!user.profile.location || !user.profile.location.coordinates) return false;
        const distance = getDistanceInMiles(userCoords, user.profile.location.coordinates);
        return distance <= distancePreference;
    });

    // TODO: Add interest-based scoring (Jaccard similarity) and sort by score

    return potentialMatches.slice(0, 20); // Limit to 20 per request
};