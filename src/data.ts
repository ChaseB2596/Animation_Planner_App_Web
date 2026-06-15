import { Scene } from './types';

export const MOCK_SCENES: Scene[] = [
  {
    id: 'sc-01',
    title: 'Condensation Close-up',
    description: 'Extreme macro shot of water droplets forming on the cold aluminum surface.',
    thumbnail: '/images/1.jpg',
    sceneFile: 'SC01_Condensation_v04.blend',
    compFile: 'SC01_Comp_v02.aep',
    renderFolder: '/renders/SC01_v04/',
    version: 'v04',
    duration: 2.5,
    cost: 1200,
    color: '#3b82f6',
    progress: { stage3D: 100, lighting: 90, rendering: 80, compositing: 40 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref1/400/225', 'https://picsum.photos/seed/ref2/400/225'],
      modelLink: 'https://studio.flow/assets/can_highpoly'
    },
    audio: { title: 'Ambient Fridge Hum', file: 'audio_hum_01.wav', description: 'Low-frequency hum with metallic resonance and compressor cycling.' },
    renderPasses: [
      { name: 'Diffuse', progress: 100, color: '#3b82f6' },
      { name: 'Glossy', progress: 80, color: '#8b5cf6' },
      { name: 'Transmission', progress: 40, color: '#10b981' },
      { name: 'Volume', progress: 10, color: '#f59e0b' }
    ],
    assets: [
      { name: 'Can Highpoly', type: 'model', cost: 450, status: 'create', sourceUrl: 'https://sketchfab.com/3d-models/soda-can-0a1b2c' },
      { name: 'Aluminum Texture', type: 'texture', cost: 120, status: 'existing', sourceUrl: 'https://polyhaven.com/textures/aluminum' },
      { name: 'Condensation Sim', type: 'sim', cost: 630, status: 'create' }
    ],
    budgetCategories: ['small', 'standard'],
    schedule: {
      stage3D: { start: 0, duration: 2 },
      lighting: { start: 2, duration: 1 },
      rendering: { start: 3, duration: 1 },
      compositing: { start: 4, duration: 2 }
    },
    history: [
      { version: 'v04', date: '2024-03-20', update: 'Added micro-droplets', note: 'Droplets look more realistic with new shader.', categories: [] },
      { version: 'v03', date: '2024-03-18', update: 'Adjusted lighting', note: 'Rim light was too strong.', categories: [] }
    ]
  },
  {
    id: 'sc-02',
    title: 'Wide Table Shot',
    description: 'Establishing shot of the soda can sitting on a rustic wooden table in a sunlit kitchen.',
    thumbnail: '/images/2.jpg',
    sceneFile: 'SC02_WideShot_v08.blend',
    compFile: 'SC02_Comp_v05.aep',
    renderFolder: '/renders/SC02_v08/',
    version: 'v08',
    duration: 4.0,
    cost: 2500,
    color: '#10b981',
    progress: { stage3D: 100, lighting: 100, rendering: 100, compositing: 95 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref3/400/225'],
      modelLink: 'https://studio.flow/assets/table_wood'
    },
    audio: { title: 'Soft Jazz Background', file: 'bg_music_01.mp3', description: 'Smooth, sophisticated jazz trio providing an elegant kitchen atmosphere.' },
    renderPasses: [
      { name: 'Diffuse', progress: 100, color: '#3b82f6' },
      { name: 'Glossy', progress: 100, color: '#8b5cf6' },
      { name: 'Transmission', progress: 90, color: '#10b981' },
      { name: 'Shadow', progress: 100, color: '#ef4444' }
    ],
    assets: [
      { name: 'Kitchen Table', type: 'model', cost: 840, status: 'purchase', sourceUrl: 'https://quixel.com/megascans/home' },
      { name: 'Wood Texture', type: 'texture', cost: 150, status: 'existing', sourceUrl: 'https://polyhaven.com/textures/wood' },
      { name: 'HDRI Kitchen', type: 'other', cost: 200, status: 'existing' },
      { name: 'Ambient Props', type: 'model', cost: 1310, status: 'purchase' }
    ],
    budgetCategories: ['medium', 'standard'],
    schedule: {
      stage3D: { start: 1, duration: 3 },
      lighting: { start: 4, duration: 2 },
      rendering: { start: 6, duration: 1 },
      compositing: { start: 7, duration: 2 }
    },
    history: [
      { version: 'v08', date: '2024-03-21', update: 'Final render pass', note: 'Ready for client review.' }
    ]
  },
  {
    id: 'sc-03',
    title: 'Hand Reach',
    description: 'A hand enters the frame and reaches for the can, creating a sense of anticipation.',
    thumbnail: '/images/3.jpg',
    sceneFile: 'SC03_HandReach_v12.blend',
    compFile: 'SC03_Comp_v03.aep',
    renderFolder: '/renders/SC03_v12/',
    version: 'v12',
    duration: 1.5,
    cost: 3200,
    color: '#8b5cf6',
    progress: { stage3D: 100, lighting: 40, rendering: 10, compositing: 0 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref4/400/225', 'https://picsum.photos/seed/ref5/400/225'],
      modelLink: 'https://studio.flow/assets/hand_rig'
    },
    audio: { title: 'Cloth Rustle', file: 'sfx_rustle.wav', description: 'Natural textile movement as the sleeve brushes against the counter.' },
    renderPasses: [
      { name: 'Diffuse', progress: 20, color: '#3b82f6' },
      { name: 'Glossy', progress: 5, color: '#8b5cf6' },
      { name: 'AO', progress: 100, color: '#64748b' }
    ],
    assets: [
      { name: 'Hand Rig', type: 'model', cost: 1450, status: 'create', sourceUrl: 'https://actorcore.reallusion.com/hand-rig' },
      { name: 'Skin Texture', type: 'texture', cost: 320, status: 'existing' }
    ],
    budgetCategories: ['medium', 'complex'],
    schedule: {
      stage3D: { start: 3, duration: 4 },
      lighting: { start: 7, duration: 3 },
      rendering: { start: 10, duration: 2 },
      compositing: { start: 12, duration: 3 }
    },
    history: [
      { version: 'v12', date: '2024-03-22', update: 'Animation polish', note: 'Finger movement is smoother now.' }
    ]
  },
  {
    id: 'sc-04',
    title: 'The Pop & Fizz',
    description: 'Dynamic shot of the tab being pulled, followed by a burst of carbonation spray.',
    thumbnail: '/images/4.jpg',
    sceneFile: 'SC04_PopFizz_v06.blend',
    compFile: 'SC04_Comp_v01.aep',
    renderFolder: '/renders/SC04_v06/',
    version: 'v06',
    duration: 2.0,
    cost: 4500,
    color: '#f59e0b',
    progress: { stage3D: 80, lighting: 20, rendering: 0, compositing: 0 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref6/400/225'],
      modelLink: 'https://studio.flow/assets/fluid_sim_cache'
    },
    audio: { title: 'Can Opening SFX', file: 'sfx_pop_fizz.wav' },
    renderPasses: [
      { name: 'Diffuse', progress: 10, color: '#3b82f6' },
      { name: 'Glossy', progress: 0, color: '#8b5cf6' },
      { name: 'Fluid', progress: 80, color: '#06b6d4' }
    ],
    assets: [
      { name: 'Fluid Sim Cache', type: 'sim', cost: 2400, status: 'create' },
      { name: 'Can Tab', type: 'model', cost: 2100, status: 'purchase', sourceUrl: 'https://grabcad.com/library/beverage-can-tab' }
    ],
    budgetCategories: ['large', 'complex'],
    schedule: {
      stage3D: { start: 5, duration: 5 },
      lighting: { start: 10, duration: 4 },
      rendering: { start: 14, duration: 3 },
      compositing: { start: 17, duration: 4 }
    },
    history: [
      { version: 'v06', date: '2024-03-23', update: 'Fluid sim bake', note: 'Bake took 12 hours. Looks great.' }
    ]
  },
  {
    id: 'sc-05',
    title: 'Pouring into Glass',
    description: 'Slow-motion capture of the liquid cascading into a chilled glass with ice.',
    thumbnail: '/images/5.jpg',
    sceneFile: 'SC05_Pouring_v03.blend',
    compFile: 'SC05_Comp_v01.aep',
    renderFolder: '/renders/SC05_v03/',
    version: 'v03',
    duration: 3.5,
    cost: 3800,
    color: '#ef4444',
    progress: { stage3D: 60, lighting: 10, rendering: 0, compositing: 0 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref7/400/225'],
      modelLink: 'https://studio.flow/assets/glass_model'
    },
    audio: { title: 'Liquid Pouring', file: 'sfx_pour.wav' },
    renderPasses: [
      { name: 'Diffuse', progress: 5, color: '#3b82f6' },
      { name: 'Transmission', progress: 60, color: '#10b981' }
    ],
    assets: [
      { name: 'Glass Model', type: 'model', cost: 1200, status: 'purchase', sourceUrl: 'https://sketchfab.com/3d-models/drinking-glass-0a1b2c' },
      { name: 'Liquid Sim', type: 'sim', cost: 2600, status: 'create' }
    ],
    budgetCategories: ['large', 'complex'],
    schedule: {
      stage3D: { start: 8, duration: 4 },
      lighting: { start: 12, duration: 3 },
      rendering: { start: 15, duration: 2 },
      compositing: { start: 17, duration: 3 }
    },
    history: [
      { version: 'v03', date: '2024-03-24', update: 'Initial sim', note: 'Needs more viscosity.' }
    ]
  },
  {
    id: 'sc-06',
    title: 'Bubbles Rising',
    description: 'Close-up of carbonation bubbles racing to the surface of the glass.',
    thumbnail: '/images/6.jpg',
    sceneFile: 'SC06_Bubbles_v09.blend',
    compFile: 'SC06_Comp_v04.aep',
    renderFolder: '/renders/SC06_v09/',
    version: 'v09',
    duration: 2.0,
    cost: 1800,
    color: '#06b6d4',
    progress: { stage3D: 100, lighting: 80, rendering: 50, compositing: 20 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref8/400/225'],
      modelLink: 'https://studio.flow/assets/bubble_particle_system'
    },
    audio: { title: 'Carbonation Fizz', file: 'sfx_fizz_loop.wav' },
    renderPasses: [
      { name: 'Diffuse', progress: 40, color: '#3b82f6' },
      { name: 'Glossy', progress: 30, color: '#8b5cf6' },
      { name: 'Particles', progress: 100, color: '#ec4899' }
    ],
    assets: [
      { name: 'Bubble Particle System', type: 'sim', cost: 1800, status: 'create' },
      { name: 'Refraction Shader', type: 'texture', cost: 0, status: 'existing', sourceUrl: 'https://blendermarket.com/products/refraction-shader' }
    ],
    budgetCategories: ['medium', 'standard'],
    schedule: {
      stage3D: { start: 10, duration: 3 },
      lighting: { start: 13, duration: 2 },
      rendering: { start: 15, duration: 1 },
      compositing: { start: 16, duration: 2 }
    },
    history: [
      { version: 'v09', date: '2024-03-25', update: 'Particle count increase', note: 'Added 5000 more bubbles.' }
    ]
  },
  {
    id: 'sc-07',
    title: 'Glass Reflection',
    description: 'Artistic shot focusing on the reflections of the environment on the glass surface.',
    thumbnail: '/images/7.jpg',
    sceneFile: 'SC07_Reflection_v02.blend',
    compFile: 'SC07_Comp_v01.aep',
    renderFolder: '/renders/SC07_v02/',
    version: 'v02',
    duration: 3.0,
    cost: 1500,
    color: '#f97316',
    progress: { stage3D: 40, lighting: 0, rendering: 0, compositing: 0 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref9/400/225'],
      modelLink: 'https://studio.flow/assets/hdri_kitchen'
    },
    audio: { title: 'Distant Chatter', file: 'amb_chatter.wav' },
    renderPasses: [
      { name: 'Diffuse', progress: 0, color: '#3b82f6' },
      { name: 'Environment', progress: 40, color: '#f97316' }
    ],
    assets: [
      { name: 'Kitchen HDRI', type: 'other', cost: 1500, status: 'existing', sourceUrl: 'https://polyhaven.com/hdris' }
    ],
    budgetCategories: ['small', 'standard'],
    schedule: {
      stage3D: { start: 12, duration: 2 },
      lighting: { start: 14, duration: 1 },
      rendering: { start: 15, duration: 1 },
      compositing: { start: 16, duration: 2 }
    },
    history: [
      { version: 'v02', date: '2024-03-26', update: 'HDRI setup', note: 'Testing different lighting environments.' }
    ]
  },
  {
    id: 'sc-08',
    title: 'Logo Reveal',
    description: 'The camera pans around the can to reveal the vibrant brand logo in high detail.',
    thumbnail: '/images/8.jpg',
    sceneFile: 'SC08_LogoReveal_v15.blend',
    compFile: 'SC08_Comp_v10.aep',
    renderFolder: '/renders/SC08_v15/',
    version: 'v15',
    duration: 2.5,
    cost: 5000,
    color: '#ec4899',
    progress: { stage3D: 100, lighting: 100, rendering: 100, compositing: 100 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref10/400/225'],
      modelLink: 'https://studio.flow/assets/logo_vector'
    },
    audio: { title: 'Brand Jingle', file: 'jingle_final.wav' },
    renderPasses: [
      { name: 'Diffuse', progress: 100, color: '#3b82f6' },
      { name: 'Glossy', progress: 100, color: '#8b5cf6' },
      { name: 'Emission', progress: 100, color: '#ef4444' }
    ],
    assets: [
      { name: 'Logo Vector', type: 'other', cost: 1500, status: 'existing' },
      { name: 'Can Model', type: 'model', cost: 3500, status: 'existing' }
    ],
    budgetCategories: ['small', 'complex'],
    schedule: {
      stage3D: { start: 14, duration: 3 },
      lighting: { start: 17, duration: 2 },
      rendering: { start: 19, duration: 1 },
      compositing: { start: 20, duration: 2 }
    },
    history: [
      { version: 'v15', date: '2024-03-27', update: 'Final Polish', note: 'Logo animation is perfect.' }
    ]
  },
  {
    id: 'sc-09',
    title: 'Final Product Shot',
    description: 'Hero shot of the can and glass together, perfectly lit for the final commercial frame.',
    thumbnail: '/images/9.jpg',
    sceneFile: 'SC09_FinalShot_v05.blend',
    compFile: 'SC09_Comp_v02.aep',
    renderFolder: '/renders/SC09_v05/',
    version: 'v05',
    duration: 5.0,
    cost: 2200,
    color: '#64748b',
    progress: { stage3D: 90, lighting: 50, rendering: 10, compositing: 0 },
    status: {
      stage3D: { completed: false, hasNotes: false },
      lighting: { completed: false, hasNotes: false },
      rendering: { completed: false, hasNotes: false },
      compositing: { completed: false, hasNotes: false }
    },
    references: {
      images: ['https://picsum.photos/seed/ref11/400/225'],
      modelLink: 'https://studio.flow/assets/environment_final'
    },
    audio: { title: 'Outro Music', file: 'bg_music_outro.mp3' },
    renderPasses: [
      { name: 'Diffuse', progress: 20, color: '#3b82f6' },
      { name: 'Glossy', progress: 10, color: '#8b5cf6' },
      { name: 'Mist', progress: 90, color: '#64748b' }
    ],
    assets: [
      { name: 'Environment Final', type: 'model', cost: 1800, status: 'create' },
      { name: 'Mist Pass', type: 'other', cost: 400, status: 'create' }
    ],
    budgetCategories: ['large', 'standard'],
    schedule: {
      stage3D: { start: 16, duration: 4 },
      lighting: { start: 20, duration: 3 },
      rendering: { start: 23, duration: 2 },
      compositing: { start: 25, duration: 3 }
    },
    history: [
      { version: 'v05', date: '2024-03-28', update: 'Camera move adjustment', note: 'Slower pan at the end.' }
    ]
  }
];
