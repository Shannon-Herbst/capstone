require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Listing = require('../models/listingModel')
const User = require('../models/userModel')

const HOST_USERNAME = 'host'
const HOST_PASSWORD = 'host123'

const listings = [
    {
        accommodationType: 'Entire apartment',
        title: 'New York',
        location: 'New York',
        description: 'Stay in the heart of New York City in this modern apartment, close to popular attractions and equipped with all the amenities you need for a comfortable stay. With its spacious layout and stylish decor, you\'ll feel right at home. Enjoy easy access to public transportation, making it a breeze to explore the city. Whether you\'re here for business or leisure, this apartment provides a perfect base for your adventures. Plus the vibrant neighbourhood offers a plethora of dining and entertainment options to enjoy during your stay.',
        maxGuests: 6,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Kitchen'],
        images: [
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-577058/original/e4d20ca2-fa58-4f03-9b1a-0833a5dc2f40.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-577058/original/004fe20d-a325-469c-bc95-d852cf45d5fd.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-577058/original/f2fd0218-5990-46f1-b941-f5ac8f93f2e5.jpeg?im_w=480',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-577058/original/5200d2ab-fa4d-4518-9789-752879ec150e.jpeg?im_w=480',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-577058/original/f95ef451-49f1-4ec4-802c-254e2470e5a5.jpeg?im_w=480'
        ],
        price: 320,
        rating: 4.5,
        reviewCount: 320
    },
    {
        accommodationType: 'Apartment',
        title: 'Paris',
        location: 'Paris, France',
        description: 'Charming flat near the Eiffel Tower with classic Parisian views.',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Kitchen', 'Washer', 'Heating'],
        images: [
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6596739/original/fec7851c-8e30-4754-9f18-f83582ec19a8.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6596739/original/382f6526-6a39-4860-a31b-196288ec540d.png?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6795152/original/4f3b1bca-7427-482c-892c-40e28c0b357b.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6616500/original/f024af85-cf43-455a-a7af-543839982ca8.jpeg?im_w=960',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-4275166/original/fa1e595f-9b72-4d47-9ecc-631229dfb090.jpeg?im_w=960'
        ],
        price: 280,
        rating: 4.8,
        reviewCount: 156
    },
    {
        accommodationType: 'House',
        title: 'Tokyo',
        location: 'Tokyo, Japan',
        description: 'Traditional-style home in a quiet neighborhood near Shibuya.',
        maxGuests: 5,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Kitchen', 'Washer', 'Free parking'],
        images: [
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-7080019/original/c8b6bbc4-4e91-4b85-b40a-13112c698ea3.png?im_w=720',
            'https://a0.muscache.com/im/pictures/BnbProperty/BnbProperty-1715245058471716431/original/04939275-01cc-40e5-8dc7-ff1fa93d312d.jpeg?im_w=1200',
            'https://a0.muscache.com/im/pictures/BnbProperty/BnbProperty-1715245058471716431/original/1bcab9e6-568a-46ce-bfee-c6883098d605.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/BnbProperty/BnbProperty-1715245058471716431/original/05a27609-86fd-465d-b5aa-747c2e4a212f.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6863618/original/08a687ad-fda1-4065-b4e0-eee440e90cf4.jpeg?im_w=720'
        ],
        price: 210,
        rating: 4.7,
        reviewCount: 98
    },
    {
        accommodationType: 'Villa',
        title: 'Cape Town',
        location: 'Cape Town, South Africa',
        description: 'Spacious villa with Table Mountain views and a private garden.',
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Free parking', 'BBQ grill'],
        images: [
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6690332/original/b69d015a-86e8-4aca-80ee-75b75f8dfe19.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6690332/original/8fba052e-9c48-4569-a16a-c192e5442dfa.jpeg?im_w=480',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6690332/original/95425185-0790-4b9b-8b41-e79dc8618258.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-1668069/original/0e857735-ae8c-482e-b5cf-7fc8f94de4b8.jpeg?im_w=480',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598098/original/eee2b644-11c8-492d-aba4-c8096b8023bd.jpeg?im_w=720'
        ],
        price: 450,
        rating: 4.9,
        reviewCount: 74
    },
    {
        accommodationType: 'Bungalow',
        title: 'Phuket',
        location: 'Phuket, Thailand',
        description: 'Beachside bungalow steps from the sand and local restaurants.',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Air conditioning', 'Beach access', 'Kitchen'],
        images: [
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598095/original/a695c881-2d25-48d7-8df7-d154c4c71795.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598095/original/1e1e1c87-0276-48c2-a158-73a5715c31ca.jpeg?im_w=480',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-7200175/original/fb0a1e1d-94a5-4b12-be41-e2e973010de4.jpeg?im_w=480',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-7200175/original/264ef819-6bd4-4e7c-a7dd-891395e711c6.jpeg?im_w=720',
            'https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598095/original/10163f9a-a4de-4da5-bcc2-94a61fc3a181.jpeg?im_w=480'
        ],
        price: 180,
        rating: 4.6,
        reviewCount: 203
    }
]

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        let hostUser = await User.findOne({ username: HOST_USERNAME })

        if (!hostUser) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(HOST_PASSWORD, salt)

            hostUser = await User.create({
                username: HOST_USERNAME,
                password: hashedPassword
            })
        }

        await Listing.deleteMany({})

        const listingsWithHost = listings.map((listing) => ({
            ...listing,
            host: hostUser._id
        }))

        await Listing.insertMany(listingsWithHost)
        console.log('Seeded 5 listings successfully')
        console.log(`Host login: username "${HOST_USERNAME}", password "${HOST_PASSWORD}"`)
        process.exit(0)
    })
    .catch((err) => {
        console.error('Seed failed:', err.message)
        process.exit(1)
    })
