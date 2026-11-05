import type { Teacher } from '@/types';

export const teachers: Teacher[] = [
  {
    id: 't1',
    name: 'Nusrat Jahan',
    subject: 'Mathematics',
    qualifications: ['MSc Mathematics, University of Dhaka', '8 years teaching experience'],
    bio: "Let's make it make sense.",
    photo: '/avatars/female.svg',
  },
  {
    id: 't2',
    name: 'Arif Rahman',
    subject: 'Physics',
    qualifications: ['BSc Physics, BUET', '6 years teaching experience'],
    bio: 'Concepts first, then the numbers.',
    photo: '/avatars/male.svg',
  },
  {
    id: 't3',
    name: 'Sadia Islam',
    subject: 'Chemistry',
    qualifications: ['BSc Chemistry, Jahangirnagar University', '5 years teaching experience'],
    bio: 'Understanding beats memorising every time.',
    photo: '/avatars/female.svg',
  },
  {
    id: 't4',
    name: 'Kamal Hossain',
    subject: 'Bangla & English',
    qualifications: ['MA Bangla Literature, Dhaka University', '7 years teaching experience'],
    bio: 'Language is the foundation of everything.',
    photo: '/avatars/male.svg',
  },
  {
    id: 't5',
    name: 'Farida Akter',
    subject: 'Biology',
    qualifications: ['BSc Biology, Eden University College', '5 years teaching experience'],
    bio: 'Curious students make the best scientists.',
    photo: '/avatars/female.svg',
  },
];
