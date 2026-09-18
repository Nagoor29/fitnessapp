import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import Exercise from '../models/Exercise.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

export const initialExercises = [
  // --- CHEST ---
  {
    name: 'Barbell Bench Press',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Lie on a flat bench, grip barbell slightly wider than shoulder width. Lower bar to mid-chest under control, then press upward explosively while keeping shoulder blades retracted.',
    tips: ['Keep feet flat on floor', 'Do not bounce the bar off your chest', 'Maintain slight arch in lower back'],
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'strength',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    instructions: 'Set bench to 30-45 degrees. Press dumbbells upward over upper chest until arms are extended, lower slowly feeling a stretch in upper pecs.',
    tips: ['Keep elbows at 45 degree angle', 'Squeeze upper chest at the top'],
  },
  {
    name: 'Push-Up',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'core'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Place hands shoulder-width apart, keep body in a rigid plank. Lower chest until it hovers 1 inch off the floor, then push back up fully.',
    tips: ['Engage glutes and core', 'Do not let lower back sag'],
  },
  {
    name: 'Cable Chest Flye',
    category: 'strength',
    muscleGroups: ['chest'],
    equipment: 'cable',
    difficulty: 'intermediate',
    instructions: 'Stand between two cable pulleys at chest height. Bring handles together in front of chest in a hugging motion with slight bend in elbows.',
    tips: ['Focus on pectoral contraction', 'Control the eccentric opening stretch'],
  },

  // --- BACK ---
  {
    name: 'Conventional Barbell Deadlift',
    category: 'strength',
    muscleGroups: ['back', 'hamstrings', 'glutes', 'core'],
    equipment: 'barbell',
    difficulty: 'advanced',
    instructions: 'Stand with feet hip-width, barbell over mid-foot. Hinge hips back, grip bar outside shins, pull chest tall, drive through floor with legs to stand upright.',
    tips: ['Maintain neutral spine throughout', 'Do not hyperextend at the top', 'Keep bar close to body'],
  },
  {
    name: 'Pull-Up',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: 'Grip pull-up bar with overhand grip wider than shoulders. Pull chest up toward the bar by driving elbows down and back, lower with control.',
    tips: ['Avoid swinging / kipping', 'Engage lats before pulling'],
  },
  {
    name: 'Bent-Over Barbell Row',
    category: 'strength',
    muscleGroups: ['back', 'biceps', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Hinge forward at 45 degrees with flat back. Pull barbell to lower abdomen/belly button, retracting shoulder blades at top.',
    tips: ['Keep neck neutral', 'Avoid standing up during reps'],
  },
  {
    name: 'Lat Pulldown',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: 'Sit at pulldown station with thighs secured. Pull bar down smoothly to upper chest, squeezing lats and lower traps.',
    tips: ['Do not lean back excessively', 'Control bar return upward'],
  },
  {
    name: 'Single-Arm Dumbbell Row',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: 'Place one knee and hand on flat bench. With free hand, pull dumbbell toward hip keeping elbow tight to torso.',
    tips: ['Pull toward hip rather than armpit', 'Keep torso parallel to bench'],
  },

  // --- LEGS ---
  {
    name: 'Barbell Back Squat',
    category: 'strength',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Rest bar on upper traps. Stand shoulder-width, break at hips and knees simultaneously, descend until thighs are at least parallel to floor, drive up.',
    tips: ['Knees track in line with toes', 'Keep chest proud and core braced'],
  },
  {
    name: 'Romanian Deadlift (RDL)',
    category: 'strength',
    muscleGroups: ['hamstrings', 'glutes', 'back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Hold bar at hips with slight knee bend. Push hips back as far as possible while lowering bar down shins until deep hamstring stretch is felt.',
    tips: ['Movement comes from hip hinge, not knee bending', 'Keep bar touching legs'],
  },
  {
    name: 'Bulgarian Split Squat',
    category: 'strength',
    muscleGroups: ['quads', 'glutes'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    instructions: 'Place rear foot on bench behind you. Lower front knee until thigh is parallel to ground, push through front heel to return to top.',
    tips: ['Keep torso upright for quad focus, lean slightly forward for glute focus'],
  },
  {
    name: 'Leg Press',
    category: 'strength',
    muscleGroups: ['quads', 'glutes'],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: 'Sit with back flat against pad. Place feet shoulder-width on platform, release safety, lower weight until knees are at 90 degrees, press up.',
    tips: ['Do not lock knees at the top', 'Keep lower back glued to pad'],
  },
  {
    name: 'Standing Calf Raise',
    category: 'strength',
    muscleGroups: ['calves'],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: 'Stand on balls of feet on elevated block. Lower heels for a deep stretch, press up onto toes as high as possible and pause.',
    tips: ['Hold peak contraction for 1 full second', 'Perform slow eccentric descent'],
  },

  // --- SHOULDERS ---
  {
    name: 'Overhead Barbell Shoulder Press (OHP)',
    category: 'strength',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Stand tall with bar racked at clavicle. Press bar vertically overhead until elbows lock out, bracing core and glutes.',
    tips: ['Do not hyperextend lumbar spine', 'Move head slightly back as bar passes face'],
  },
  {
    name: 'Dumbbell Lateral Raise',
    category: 'strength',
    muscleGroups: ['shoulders'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: 'Hold dumbbells at sides with slight elbow bend. Raise arms out to the sides until parallel with floor, lower with control.',
    tips: ['Lead with elbows', 'Avoid swinging torso or using momentum'],
  },
  {
    name: 'Face Pull',
    category: 'strength',
    muscleGroups: ['shoulders', 'back'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: 'Set cable with rope attachment at eye level. Pull rope toward forehead while rotating wrists back and flaring elbows outward.',
    tips: ['Great for rear delts and rotator cuff posture', 'Squeeze upper back at end of pull'],
  },

  // --- ARMS ---
  {
    name: 'Barbell Biceps Curl',
    category: 'strength',
    muscleGroups: ['biceps'],
    equipment: 'barbell',
    difficulty: 'beginner',
    instructions: 'Stand holding barbell with underhand grip. Curl bar upward toward shoulders while pinning elbows to ribs, squeeze at top.',
    tips: ['Avoid rocking torso back and forth', 'Lower bar all the way down for full stretch'],
  },
  {
    name: 'Triceps Rope Pushdown',
    category: 'strength',
    muscleGroups: ['triceps'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: 'Attach rope to high pulley. Keep elbows locked by ribs, push rope down and spread ends apart at bottom for peak triceps contraction.',
    tips: ['Only forearms should move', 'Pause at full lockout'],
  },
  {
    name: 'Incline Dumbbell Hammer Curl',
    category: 'strength',
    muscleGroups: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: 'Sit on incline bench holding dumbbells with neutral grip (palms facing each other). Curl dumbbells upward without twisting wrists.',
    tips: ['Targets brachialis for thicker upper arms'],
  },
  {
    name: 'Skull Crusher (Lying Triceps Extension)',
    category: 'strength',
    muscleGroups: ['triceps'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Lie flat holding EZ curl bar above chest. Bend elbows to lower bar toward forehead/crown of head, extend elbows to return.',
    tips: ['Keep upper arms stationary and angled slightly back'],
  },

  // --- CORE ---
  {
    name: 'Hanging Leg Raise',
    category: 'strength',
    muscleGroups: ['core'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: 'Hang from pull-up bar with overhand grip. Flex abs and raise legs until parallel to floor (or knees to chest), lower under control.',
    tips: ['Avoid swinging', 'Focus on tilting pelvis upward'],
  },
  {
    name: 'Plank Hold',
    category: 'strength',
    muscleGroups: ['core', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Rest on forearms and toes in a straight line. Squeeze glutes, brace abs tightly, hold position without hips sagging or piking.',
    tips: ['Breathe steadily throughout the hold'],
  },
  {
    name: 'Ab Roller Wheel Rollout',
    category: 'strength',
    muscleGroups: ['core', 'shoulders'],
    equipment: 'other',
    difficulty: 'advanced',
    instructions: 'Kneel on floor holding wheel handles. Roll wheel forward extending body as far as possible without dropping lower back, pull back using abs.',
    tips: ['Start with short range of motion before progressing to full rollout'],
  },

  // --- CARDIO & HIIT ---
  {
    name: 'Treadmill Interval Run',
    category: 'cardio',
    muscleGroups: ['legs', 'calves', 'cardio'],
    equipment: 'cardio_machine',
    difficulty: 'intermediate',
    instructions: 'Alternate between 60 seconds of high-speed sprinting and 90 seconds of recovery jog/walk for 20-30 minutes.',
    tips: ['Land lightly on mid-foot', 'Maintain upright running posture'],
  },
  {
    name: 'Rowing Machine Intervals (Ergometer)',
    category: 'cardio',
    muscleGroups: ['back', 'legs', 'core', 'cardio'],
    equipment: 'cardio_machine',
    difficulty: 'intermediate',
    instructions: 'Drive with legs, lean slightly back at hips, pull handle to lower ribs. Recover by reversing sequence smoothly.',
    tips: ['Sequence: Legs -> Core -> Arms on drive; Arms -> Core -> Legs on return'],
  },
  {
    name: 'Assault / Stationary Bike Sprint',
    category: 'hiit',
    muscleGroups: ['quads', 'cardio'],
    equipment: 'cardio_machine',
    difficulty: 'intermediate',
    instructions: 'Perform high-intensity all-out sprints for 20 seconds followed by 40 seconds of easy pedaling.',
    tips: ['Keep cadence explosive on sprint phases'],
  },
  {
    name: 'Kettlebell Swing',
    category: 'hiit',
    muscleGroups: ['hamstrings', 'glutes', 'back', 'cardio'],
    equipment: 'kettlebell',
    difficulty: 'intermediate',
    instructions: 'Hinge at hips to swing kettlebell between legs, drive hips forward explosively to propel bell to chest level.',
    tips: ['This is a hip hinge, not a squat', 'Power comes from hips, arms are just ropes'],
  },
  {
    name: 'Burpees',
    category: 'hiit',
    muscleGroups: ['chest', 'quads', 'core', 'cardio'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: 'Drop from standing into a squat, kick feet back into plank, perform push-up, jump feet back in and leap vertically with hands up.',
    tips: ['Pace breathing to sustain high tempo across rounds'],
  },
  {
    name: 'Jump Rope High Knees',
    category: 'cardio',
    muscleGroups: ['calves', 'cardio', 'core'],
    equipment: 'other',
    difficulty: 'beginner',
    instructions: 'Skip jump rope continuously while alternating high-knee lifts with each turn.',
    tips: ['Stay light on balls of feet'],
  },

  // --- MOBILITY & RECOVERY ---
  {
    name: 'World’s Greatest Stretch',
    category: 'mobility',
    muscleGroups: ['hamstrings', 'glutes', 'chest', 'back'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Lunge forward with left foot, place both hands on inside of foot. Rotate left arm up toward ceiling looking at hand, hold, switch sides.',
    tips: ['Breathe deeply into thoracic rotation'],
  },
  {
    name: 'Cat-Cow Spinal Flow',
    category: 'mobility',
    muscleGroups: ['back', 'core'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'On hands and knees, inhale and arch back lifting chest and tailbone (Cow). Exhale and round spine upward toward ceiling (Cat).',
    tips: ['Move fluidly with breath rhythm'],
  },
  {
    name: 'Pigeon Pose Hip Opener',
    category: 'mobility',
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'From plank, bring one knee behind wrist with shin angled across mat. Lower hips toward floor and fold forward gently.',
    tips: ['Hold for 45-60 seconds per side', 'Do not force knee into pain'],
  },
  {
    name: 'Foam Rolling Thoracic Spine',
    category: 'mobility',
    muscleGroups: ['back'],
    equipment: 'other',
    difficulty: 'beginner',
    instructions: 'Lie with foam roller across upper back, support head with hands. Roll gently between mid-back and base of neck.',
    tips: ['Pause and extend gently over spots with tightness'],
  },
];

export const seedExercises = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness_assistant';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB Atlas...');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const ex of initialExercises) {
      const result = await Exercise.findOneAndUpdate(
        { name: ex.name },
        { $set: ex },
        { upsert: true, new: true }
      );
      if (result) {
        insertedCount++;
      }
    }

    console.log(`[Seed] Successfully seeded/updated ${insertedCount} exercises in library.`);
    await mongoose.disconnect();
    console.log('[Seed] Database connection closed.');
    return insertedCount;
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

// If run directly via node
if (process.argv[1]?.includes('seedExercises.js')) {
  seedExercises();
}
