//Name = bio-dev || key = 939955963413739
//Token = LyehM-GZ5Ngj4Yt6VT5rCyH21yA

const uploadImage = async (message) => {
    message.attachments
        .filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL))
        .map(({ proxyURL }) => proxyURL);
};

module.exports = uploadImage;