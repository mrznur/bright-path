// Contact details used across the site (navbar, footer, home, courses, contact).
// Change a value here and it updates everywhere.

export const SITE = {
    name: { en: 'BrightPath Coaching Center', bn: 'ব্রাইটপাথ কোচিং সেন্টার' },

    phone: {
        en: '01712 345 678',
        bn: '০১৭১২ ৩৪৫ ৬৭৮',
    },
    // Used by every "Call" button. International format, no spaces.
    tel: 'tel:+8801712345678',

    email: 'contact@brightpathcoachingcenter.com',

    address: {
        en: 'House 12, Road 5, Dhanmondi, Dhaka 1205',
        bn: 'বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা ১২০৫',
    },

    hours: {
        en: 'Sat - Thu, 8:00 AM - 9:00 PM · Fri, 8:00 AM - 12:00 PM & 3:00 PM - 8:00 PM',
        bn: 'শনি - বৃহস্পতি, সকাল ৮:০০ - রাত ৯:০০ · শুক্র, সকাল ৮:০০ - দুপুর ১২:০০ এবং বিকেল ৩:০০ - রাত ৮:০০',
    },

    facebook: 'https://www.facebook.com/brightpathcoachingcenter',

    // Google Maps: the embed link is used inside an iframe, the other opens the map in a new tab.
    mapEmbedUrl: 'https://www.google.com/maps?q=Dhanmondi+Dhaka+1205&output=embed',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Dhanmondi+Dhaka+1205',
} as const;