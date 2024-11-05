// types/talent.ts

export interface TalentBio {
    name: string;
    twitter: string;
    discord: string;
    focus: string;
    skillset: string;
    site?: string;
    imageName?: string;
  }
  
  export type TalentFocus = 'Artist' | 'Developer' | 'Writer' | 'Project Manager' | 
    'Filmmaker' | 'Biz Dev' | 'Musician + Dev';
  
  export const talentData: TalentBio[] = [
    {
      name: 'swiftpaw',
      twitter: 'thomas_djb',
      discord: 'swiftpaw#8880',
      focus: 'Artist',
      skillset: '3D animation / modeling, sound design',
      site: 'https://instagram.com/thomas_djb'
    },
    // Add all other talent data here
  ];