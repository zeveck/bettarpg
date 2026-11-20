// strings.js: every line of dialogue and story text. NPC lines are picked by
// world flags (dialogue.js): the first matching set, top to bottom, wins.
// The original game's lines are kept as each villager's first-meeting lines.

export const NAMES = [
  'Bubbles', 'Finley', 'Shimmer', 'Sparkle', 'Azure', 'Pearl', 'Splash', 'Ripple', 'Current', 'Flow',
  'Wave', 'Tide', 'Marina', 'Ruby', 'Sapphire', 'Emerald', 'Topaz', 'Amber', 'Crystal', 'Diamond',
  'Sunny', 'Misty', 'Stormy', 'Windy', 'Cloudy', 'Rainy', 'Dewy', 'Happy', 'Lucky', 'Brave', 'Swift',
  'Gentle', 'Proud', 'Noble', 'Zippy', 'Peppy', 'Snappy', 'Flippy', 'Swishy', 'Splashy', 'Bubbly',
  'Aqua', 'Cyan', 'Teal', 'Turquoise', 'Indigo', 'Violet', 'Magenta', 'Gil', 'Scale', 'Kelp', 'Algae',
  'Plankton', 'Nemo', 'Dory', 'Ariel', 'Flounder', 'Sebastian', 'Triton', 'Alpha', 'Beta', 'Gamma',
  'Delta', 'Sigma', 'Omega', 'Zeta',
];

export const COLOR_NAMES = { red: 'Red', blue: 'Blue', purple: 'Purple', green: 'Green', orange: 'Orange' };

// Goal lines: Finn's pointers, with the scale and cog overrides.
export function goalLine(s) {
  const f = s.flags;
  if (f.garDefeated || f.garFriend) return 'The paddies are safe. Make friends, brave the edge zones, or visit the old Gar.';
  if (f.gateOpen) return 'The gate is open. Whatever is down there... bring our fish home. The old tales say a party of five friends can soften any heart.';
  if (f.lantern) {
    const n = s.cogs.length;
    if (n >= 3) return 'Take the three cogs to the drain gate at the Murk\'s far end.';
    return `The Lock-Keeper's lantern will light the Murk. Find those three cogs. (${n}/3)`;
  }
  if (f.trailFound) return 'Up the spillway lies Highwater. Ask them about the shadow.';
  if (f.stumpDone) {
    if (s.scales.length >= 5) return 'Take the scales to the straw bundle at the Spillway\'s foot.';
    return `Captain Reef will open the reed gate east. Follow where that scale leads. (Scales ${s.scales.length}/5)`;
  }
  if (f.metFinn) return 'Swim to the Old Stump at the far end of the Shallows. Mossy was last seen there.';
  return 'Talk to Elder Finn.';
}

// Speakers: display name and portrait sprite key.
export const SPEAKERS = {
  finn: { name: 'Elder Finn', sprite: 'finn' },
  coral: { name: 'Shopkeeper Coral', sprite: 'coral' },
  reef: { name: 'Guard Captain Reef', sprite: 'reef' },
  bubble: { name: 'Bubble the Brave', sprite: 'bubble' },
  seaweed: { name: 'Innkeeper Seaweed', sprite: 'seaweed' },
  whorl: { name: 'Lock-Keeper Whorl', sprite: 'whorl' },
  pip: { name: 'Pip', sprite: 'pip' },
  kelpie: { name: 'Innkeeper Kelpie', sprite: 'kelpie' },
  folk1: { name: 'Dace', sprite: 'folk1' },
  folk2: { name: 'Old Loach', sprite: 'folk2' },
  folk3: { name: 'Minnow', sprite: 'folk3' },
  mossy: { name: 'Mossy', sprite: 'mossy' },
  cap1: { name: 'Pebble', sprite: 'cap1' },
  cap2: { name: 'Fern', sprite: 'cap2' },
  cap3: { name: 'Little Guppy', sprite: 'cap3' },
  gar: { name: 'The Gar', sprite: 'garsmall' },
  player: { name: '', sprite: 'player' },
  sign: { name: '', sprite: null },
};

// Line sets: [condition, lines]. Conditions are names checked in dialogue.js.
// {name} is the player's name.
export const LINES = {
  finn: [
    ['garFriend', ['Sealed under the terraces for a hundred years... and now it comes to our parties. You did that, {name}.', 'Go on, enjoy the paddies. Every fish here owes you a dance.']],
    ['garDefeated', ['A hundred years shut under our paddies, alone. I still think about that old fish.', 'Maybe someday someone will visit it. Maybe someone with a party hat.']],
    ['peace', ['Peace in the Paddies! In all my years I never saw so many hats.', 'The young ones say you can befriend anything. I believe them.']],
    ['lowHp', ['You look hurt! Seaweed\'s inn is just there. Rest first, then be brave.']],
    ['gateOpen', ['The gate is open. Whatever is down there... bring our fish home.', 'The old tales say a party of five friends can soften any heart. Count your friends, {name}.']],
    ['lantern', ['The Lock-Keeper\'s lantern will light the Murk. Find those three cogs.', 'The Murk starts at the old culvert, southwest in the Shallows. Mind the deep water.']],
    ['trailFound', ['Up the spillway lies Highwater. Ask them about the shadow.', 'They see more of the terraces from up there than we ever will.']],
    ['stumpDone', ['A scale as big as Bubble\'s head... Nothing in our paddies grows that big.', 'Captain Reef will open the reed gate east. Follow where that scale leads.']],
    ['metFinn', ['Swim to the Old Stump at the far end of the Shallows. Mossy was last seen there.', 'Be careful out there, little betta. The paddies hold many dangers.']],
  ],
  finnOpening: [
    'Welcome, young one. I sense great potential in you.',
    'There have been strange happenings lately... fish have been disappearing from the outer paddies.',
    'The rumors speak of dark shadows that come when the rice stalks sway. Perhaps you could investigate?',
    'Mossy was last seen at the Old Stump. Swim to the Old Stump at the far end of the Shallows. Mossy was last seen there.',
    'I\'ll have the south gate opened for you. Swim safely, {name}.',
  ],
  coral: [
    ['garFriend', ['A Gar at a party! I\'ve started stocking extra-large snacks, just in case.']],
    ['garDefeated', ['Mossy\'s home and helping in the shop again. Thank you, {name}.']],
    ['peace', ['Business is booming! Everyone wants party snacks now.']],
    ['lowHp', ['You look hurt! A Kelp Snack would do you good. Want to see my wares?']],
    ['sub', ['How\'s the submarine handling? Ancient engineering, that. Need anything else?']],
    ['highwater', ['Highwater, you say? Then you\'re ready for this: the ancient Dunkleosteus submarine, {cost} Betta Bites. Its armor shrugs off even the biggest bite.']],
    ['armor3', ['Full metal! You clank when you swim. Very stylish. Want to see my wares?']],
    ['firstFriend', ['I heard you threw a party out there! Make sure your friends get snacks too.']],
    ['bubbleJoined', ['Bubble\'s going with you? Then buy two of everything. That fish eats.']],
    ['met', ['Business has been slow, but my shelves are full. Want to see my wares?']],
    ['first', ['Welcome to my shop! Though I\'m afraid business has been slow lately.', 'With all these disappearances, fewer fish dare to venture between the rice stalks.', 'I\'ve heard whispers of something lurking in the deeper paddies...', 'Would you like to see my wares?']],
  ],
  reef: [
    ['garFriend', ['I\'ve seen a lot of strange things on watch, but a Gar in a party hat? Carry on, hero.']],
    ['garDefeated', ['You did it. The paddies are safe, and the guard salutes you, {name}.']],
    ['peace', ['Peace in the Paddies. Not much left to guard against. I might take up dancing.']],
    ['lowHp', ['You look hurt! Rest at the inn before you go out again. That\'s an order.']],
    ['highwater', ['A snail with a lantern sent you into the Murk? Keep your armor on and your friends close.']],
    ['armor3', ['Full metal armor! Now that is a proper guard\'s kit.']],
    ['armor2', ['That armor suits you. Remember: Gravel Grenade breaks a crayfish shell. Bites just bounce off.']],
    ['stumpDone', ['A friend in a party hat... at the Old Stump? Well, you settled it. The reed gate is open. Go east.', 'Tip: catfish slip aside from a plain bite. Spells never miss.']],
    ['bubbleJoined', ['That angelfish at the Old Stump won\'t let anyone pass in peace. Settle it first.']],
    ['met', ['Not alone, little one. Come back with a friend.', 'Tip: watch the number over a fish. That\'s its level. Red glow means stay away.']],
    ['first', ['Halt! State your business, young betta.', 'I\'ve been keeping watch, but these mysterious abductions have me worried.', 'Three of our villagers vanished last week while foraging near the tall rice. No trace, no struggle... just gone.', 'If you\'re thinking of investigating, be very careful. Whatever\'s out there is dangerous.', 'And this reed gate stays shut. Not alone, little one. Come back with a friend.']],
  ],
  reefGateClosed: {
    alone: ['Not alone, little one. Come back with a friend.'],
    stump: ['That angelfish at the Old Stump won\'t let anyone pass in peace. Settle it first.'],
  },
  bubbleHome: [
    ['metFinn', ['Elder Finn sent you out? Go on ahead to the Old Stump! I\'ll... I\'ll catch up. Probably!']],
    ['first', ['Hey there! I\'m Bubble! I\'ve been wanting to explore the outer paddies forever!', 'My fins are strong and I know the waterways better than anyone my age!', 'I dream of swimming up to the big city on the next terrace! They say it\'s amazing up there!', 'When you decide to investigate these disappearances... well, I\'d love to come with you!']],
  ],
  bubble: [
    ['garFriend', ['Best. Party. EVER. Did you see the Gar\'s little hat?!']],
    ['garDefeated', ['We did it! Mossy\'s home! ...I still feel a bit sorry for the old Gar, though.']],
    ['gateOpen', ['Five friends for a party... How many do we have? Let\'s count! (Friends {friends}/5)']],
    ['lantern', ['Three cogs. Shiny brass ones. I\'ll look left, you look right!']],
    ['trailFound', ['Highwater! The big city on the next terrace! I KNEW it was real!']],
    ['scales5', ['That\'s all five! They all point uphill, to the Spillway\'s foot.']],
    ['stumpDone', ['Follow the scales! Big dark ones. You can\'t miss them. Well, you could, but don\'t!']],
    ['bubbleJoined', ['I told you I\'d come! Where to next?']],
  ],
  seaweed: [
    ['garFriend', ['Rest well, hero. And tell that big old Gar we have a spare kelp bed. A very big one.']],
    ['peace', ['So many happy fish! Rest up, dear, the party goes all night.']],
    ['lowHp', ['You look hurt! Come, rest in the soft kelp beds.']],
    ['met', ['Welcome back to the Swishy Solace Inn. Rest for {cost} Betta Bites?']],
    ['first', ['Welcome to the Swishy Solace Inn! You look tired, young betta.', 'A good rest in our soft kelp beds will restore your strength.', 'For just {cost} Betta Bites, you can sleep safely and wake up refreshed!', 'Your first rest is on the house, dear.']],
  ],
  kelpie: [
    ['garFriend', ['My sister says the Gar sleeps in her biggest bed now. I don\'t believe her. Rest?']],
    ['lowHp', ['You look hurt! Seaweed would never forgive me if I let you swim off like that. Rest?']],
    ['met', ['Rest at the Highwater inn? {cost} Betta Bites, best view on the terraces.']],
    ['first', ['Oh! You\'ve met my sister Seaweed, down in Paddy Village? I can tell. You have her inn\'s kelp in your fins.', 'Welcome to the Highwater inn. The first night is free for Seaweed\'s guests.']],
  ],
  pip: [
    ['garFriend', ['Party snacks! Get your party snacks! Even Gar-sized!']],
    ['lowHp', ['You look hurt! A Seed Cake fixes everything. Well, most things.']],
    ['met', ['Seed Cakes and Fizzy Water, the finest on the terraces! Take a look!']],
    ['first', ['Hi hi hi! I\'m Pip! Welcome to my stall!', 'Seed Cakes for your HP, Fizzy Water for your MP. Big ones, Highwater-sized!', 'Take a look!']],
  ],
  whorl: [
    ['gateOpen', ['The gate\'s open. If that old outflow pipe gets a door one day... well, I know who\'d build it.']],
    ['lantern', ['Three cogs, lost in the Murk. Fixed spots, mind you; the flood just dropped them. Bring them to the drain gate.']],
    ['first', ['Ah, a little betta from the lower paddies. You\'re asking about the shadow?', 'The spring flood jammed my drain gate (shook its three cogs right out into the Murk) and burst the old outflow pipe below it. Whatever\'s taking your fish uses that pipe. Too strong for little fins: you\'ll need the gate.', 'Here. The drain-gate key, and my glow-moss lantern. It\'ll light the Murk for you.', 'Find the gate\'s three cogs, and the gate will open. The Murk starts at the old culvert in the Shallows.']],
  ],
  whorlAfter: [
    ['garFriend', ['A door in the pipe that opens from the inside! Finest work I ever did. The old fish visits every week.']],
    ['garDefeated', ['The pipe\'s sealed tight now. Quiet down there. Too quiet, maybe.']],
  ],
  folk1: [
    ['gateOpen', ['You opened the drain gate? Brave fish. I\'ll keep watching the pipe for you.']],
    ['first', ['A long shadow comes down the old outflow pipe at night, when the rice stalks sway. Takes a fish and goes back the way it came.']],
  ],
  folk2: [
    ['garFriend', ['So the old story was true! And now it comes to parties. Times change.']],
    ['first', ['My gran said a fish older than the terraces was shut in under the paddies when they were built. Just a story... isn\'t it?']],
  ],
  folk3: [
    ['peace', ['Peace in the Paddies! Can I have a party hat too?']],
    ['first', ['You came all the way up the spillway? Lock-Keeper Whorl knows everything about the gates. He\'s in the lock house with the big wheel.']],
  ],
  mossy: [
    ['first', ['You came! You really came!', 'It doesn\'t eat us. It brings us here and just... watches us. It hums at night. I think it\'s lonely.']],
  ],
  captive: [
    ['first', ['Shh! It\'s right there. Please, get us home.']],
  ],
  garPost: {
    friend: ['PARTY... AGAIN?'],
    fins: ['...ALONE AGAIN.'],
  },
};

// Friends (befriended fish in party hats) say one of these.
export const FRIEND_LINES = {
  guppy: ['Zoom zoom! Thanks for the party!', 'Guppies are small but we\'re FAST.'],
  angel: ['I still guard my spot. But now I guard it for you!', 'Tip: angelfish get fierce when they\'re hurt. Party early!'],
  cat: ['Psst. Spells never miss. Plain bites? We slip right past them.', 'I like the dark. And hats, apparently.'],
  nymph: ['One day I\'ll be a dragonfly! Then I\'ll party in the sky!', 'We strike first. Can\'t help it. Sorry!'],
  cich: ['I used to be fierce. Now I\'m fiercely festive!', 'The deep Murk fish chase. The near ones don\'t. Just so you know.'],
  cray: ['Clack clack! Gravel cracks shells, you know. Not that I\'m telling.', 'My claws are for waving now. Hi!'],
};

export const HINTS = {
  swimKeys: 'Swim with {up}{left}{down}{right}',
  swimTouch: 'Drag on the left side of the screen to swim',
  talk: '{talk}: Talk',
  redGlow: 'Fish glowing red are much stronger than you: swim around them.',
  battle: 'Choose what to do: Attack, a spell, Party!, an item, or Swim Away.',
  befriend: 'Party! tries to make a friend. It works better when the fish is worn down.',
};

export const HOW_TO_PLAY = [
  { title: 'Swim and explore', body: ['{swim} to swim. Fish show their level above them; fish glowing red are much stronger than you.', '{talk} talks to villagers and picks things up. {home} takes you home to the village.'] },
  { title: 'Battles', body: ['Touch a fish to battle. Attack, cast Bubble Blast (never misses), or use items.', 'Bubble fights beside you and sometimes takes a hit for you.', 'Losing is never the end: you wake at your last rest point.'] },
  { title: 'Make friends', body: ['Party! (Happy Balloon Time) tries to befriend a fish. It works best when the fish is worn down, and better with more friends.', 'A new friend gives the same EXP and Betta Bites, gives back your 5 MP and cheers you up.'] },
];

export const STORY = {
  stumpScale: 'That\'s no betta scale. It\'s as big as my head!',
  bubbleArrives: 'I told you I\'d come!',
  stumpFoundScale: 'A huge, dark, ancient-looking scale lies by the Old Stump.',
  stumpLesson: 'Fighting isn\'t the only way. Try this!',
  thirdScale: 'They all point uphill. Whatever dropped these was huge... and old.',
  scaleN: (n) => `A strange scale! (${n}/5)`,
  allScales: 'That\'s all five! They all point uphill, to the Spillway\'s foot.',
  bundleHeavy: (n) => `Too heavy for us... Those scales lead somewhere. (${n}/5)`,
  bundleShove: 'Five scales, all pointing up the spillway... Come on, together! One, two... SHOVE!',
  bundleGone: 'The straw bundle tumbles off the steps. The spillway is open!',
  culvertDark: 'Too dark to swim in there.',
  cogN: (n) => `A brass cog! (${n}/3)`,
  gateNeeds: (n) => `The gate needs 3 cogs (${n}/3).`,
  gateOpens: 'The three cogs click into place. With a groan, the old drain gate swings open.',
  shadowSeen: 'Did you SEE that?!',
  springRest: 'The Gate Spring bubbles around you. HP and MP restored. You\'ll wake here if you fall.',
  peaceTitle: 'PEACE IN THE PADDIES!',
  peaceBody: 'You\'ve made the rice paddies safe for you and all your new friends!',
  finsEnd: 'A hundred years shut under our paddies, alone. No wonder it wanted company. Maybe someday someone will visit it.',
  friendEnd: 'Sealed under the terraces for a hundred years... Well, old fish, you\'ve got a village now.',
  friendEndWhorl: 'And I\'ve fitted the old pipe with a door it can open from the inside. It can come and visit whenever it likes.',
  mossyHome: 'We\'re home! We\'re really home!',
  rescued: 'Rescued by the villagers',
};

export const LEVEL_UP_LINES = {
  3: 'You\'ve gained a protective helmet!',
  4: 'You learned Gravel Grenade!',
  5: 'Your armor has been upgraded to advanced protection!',
  7: 'You\'ve achieved full metal armor! Maximum protection! Your balloons got bigger!',
};
