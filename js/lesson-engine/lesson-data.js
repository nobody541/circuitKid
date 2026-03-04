/**
 * All 10 lessons defined declaratively
 */

export const LESSONS = {
  1: {
    id: 1,
    title: 'What is Electricity?',
    subtitle: 'Meet the Battery!',
    color: '#FFD700',
    icon: '🔋',
    mascotIntro: "Hi there! I'm Sparky the Robot! Ready for an awesome science adventure? Let's go!",

    learnMode: {
      slides: [
        {
          title: 'Electricity is Everywhere!',
          mascotSays: "Electricity is Everywhere! Without electricity, we wouldn't have video games, cartoons, night lights, or even phones! Can you imagine that?",
          visual: 'electricity-everywhere'
        },
        {
          title: 'What is Electricity?',
          mascotSays: "Electricity is tiny particles called electrons moving through a wire. Think of electrons like a long line of ants marching through a tunnel. One ant pushes the next, and they keep going around and around in a loop - that's how electricity flows!",
          visual: 'electron-flow'
        },
        {
          title: 'Electricity Needs a Road!',
          mascotSays: "A wire is like a super-fast water slide for electrons! Electricity moves best through some materials. Metal wires are great paths for electricity, like a smooth road that lets it travel easily. The plastic outside? That's just a safe jacket!",
          visual: 'wire-road'
        },
        {
          title: 'Meet the Battery!',
          mascotSays: "The battery is the boss! It gives electrons a big push called voltage to start marching. It has two sides: the plus side and the minus side. The plus side pushes electrons out, and they come back in through the minus side.",
          visual: 'battery'
        },
        {
          title: 'Plus and Minus - The Two Sides!',
          mascotSays: "Here's a cool trick to remember: Plus Pushes! The plus side pushes electricity out toward the minus side. The battery has chemicals inside that make this push happen. Easy, right? Always connect + to + and - to - for things like LEDs!",
          visual: 'battery-plus-minus'
        },
        {
          title: 'What is a Circuit?',
          mascotSays: "Circuit comes from the word \"circle\"! Electricity needs a complete circle or loop to flow. If there's a gap, like a broken train track. the electrons get stuck and nothing works!",
          visual: 'simple-circuit'
        },
        {
          title: "Let's Try It!",
          mascotSays: "You're already learning like a real engineer! I'm so proud of you! Let's keep going!",
          visual: 'ready-to-build'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: "Let's see how much you remember! Pick the right answer for each question.",
      questions: [
        {
          question: 'What is electricity?',
          choices: [
            'A kind of magic that comes from the wall',
            'Tiny particles called electrons moving through a wire',
            'Hot air that makes lights turn on',
            'A type of battery'
          ],
          correct: 1
        },
        {
          question: 'What do electrons need to travel through?',
          choices: ['Air', 'Water', 'A wire (made of metal)', 'Paper'],
          correct: 2
        },
        {
          question: 'What does a battery do?',
          choices: [
            'It stores water',
            'It pushes electrons around a complete loop',
            'It makes sounds',
            'It is a type of light'
          ],
          correct: 1
        },
        {
          question: 'Which side of the battery PUSHES electrons out?',
          choices: [
            'The Minus side',
            'The top side',
            'The Plus (+) side',
            'Both sides push the same way'
          ],
          correct: 2
        },
        {
          question: 'What is a circuit?',
          choices: [
            'A type of battery',
            'A complete loop that electricity travels around',
            'A special kind of wire',
            'A tool for fixing things'
          ],
          correct: 1
        },
        {
          question: 'What happens if there is a gap (break) in a circuit?',
          choices: [
            'Electricity jumps over the gap',
            'The light gets brighter',
            'Electricity stops flowing - nothing works!',
            'The battery gets bigger'
          ],
          correct: 2
        }
      ]
    },

    practiceSim: {
      objective: 'Connect the battery to the LED with wires to make it light up!',
      availableComponents: ['battery', 'led-red'],
      preplacedComponents: [
        { type: 'battery', x: 200, y: 160 },
        { type: 'led-red', x: 560, y: 160 }
      ],
      hints: [
        'See those orange circles? Those are terminals — tap one to start a wire!',
        'Now tap another terminal to connect the wire.',
        'Connect the battery + (red) to the LED + (red).',
        'Then connect the battery − to the LED −. Complete the loop!',
        "If the LED doesn't light up, check that + goes to + and − goes to −."
      ],
      successCondition: 'anyLedLit'
    },

    miniProject: {
      title: 'My First Circuit \u2014 Light Up an LED!',
      description: 'Build a REAL circuit with your own hands! Use a coin battery and an LED to make a tiny light. Ask a parent or grown-up to help you get the parts. Safety note: Use coin batteries only for this project, and do not leave wires connected for a long time because batteries can get warm.',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue'],
      minLEDs: 1,
      successCondition: 'anyLedLit'
    },

    badge: 'battery-boss'
  },

  2: {
    id: 2,
    title: 'LEDs & Light',
    subtitle: 'Colors of Electricity!',
    color: '#FF6B6B',
    icon: '💡',
    mascotIntro: "Today we'll learn about LEDs which are the tiny lights that can glow in many colors! Remember: Electricity is fun, but always ask a grown-up for real building. Let's glow!",

    learnMode: {
      slides: [
        {
          title: 'What is an LED?',
          mascotSays: 'LED stands for Light Emitting Diode. LEDs are small lights used everywhere, in your phone, TV, traffic lights, and toys! They turn electricity into light!',
          visual: 'led-anatomy'
        },
        {
          title: 'LED Direction Matters!',
          mascotSays: "LED has 2 leg, Often The longer leg is the positive leg which goes toward the battery's plus. The shorter leg is negative leg (-). If electricity tries to go the wrong way, the LED stays off. That's why direction matters!",
          visual: 'led-polarity'
        },
        {
          title: 'Colors of Light',
          mascotSays: 'LEDs can be red, green, blue, and more. White LEDs are actually blue LEDs with a special yellow coating that mixes to make white light! Mind blown?',
          visual: 'led-colors'
        },
        {
          title: 'LEDs Save Energy',
          mascotSays: 'LEDs use very little electricity and last super long which is way better than old bulbs!',
          visual: 'led-colors'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Answer these questions about LEDs!',
      questions: [
        {
          question: 'What does LED stand for?',
          choices: ['Light Emitting Diode', 'Large Electric Device', 'Low Energy Display', 'Little Electronic Dot'],
          correct: 0
        },
        {
          question: 'Which leg of an LED is positive (+)?',
          choices: ['The short leg', 'The long leg', 'Both legs', 'Neither leg'],
          correct: 1
        },
        {
          question: 'What happens if you put an LED in backwards?',
          choices: ['It explodes', "It doesn't light up", 'It changes color', 'It gets very hot'],
          correct: 1
        },
        {
          question: 'LEDs use a lot of electricity. True or false?',
          choices: ['True', 'False - LEDs use very little electricity'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Light up 2 different colored LEDs at the same time!',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue'],
      preplacedComponents: [
        { type: 'battery', x: 200, y: 250 },
        { type: 'led-red', x: 560, y: 120 },
        { type: 'led-green', x: 560, y: 360 }
      ],
      hints: [
        'Tap an orange terminal to start drawing a wire.',
        'Connect battery + to each LED +.',
        'Connect battery − to each LED −.',
        'Both LEDs need their own wires to the battery!'
      ],
      successCondition: 'twoLedsLit'
    },

    miniProject: {
      title: 'Traffic Light!',
      description: 'Build a traffic light with Red, Yellow (or Green), and Blue LEDs! Light up at least 2. Ask a grown-up to help.',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue'],
      minLEDs: 2,
      successCondition: 'twoLedsLit'
    },

    badge: 'led-master'
  },

  3: {
    id: 3,
    title: 'Switches & Control',
    subtitle: 'On and Off!',
    color: '#4CAF50',
    icon: '🔘',
    mascotIntro: "Let's learn about switches. They give you control over your circuit! Switches let you turn circuits on and off. Just like a light switch in your room.",

    learnMode: {
      slides: [
        {
          title: 'What is a Switch?',
          mascotSays: "You use switches every day. Like light switches, TV remotes, game controllers! A switch is like a door in a circuit. When the door is closed, electricity can flow. When the door is open, electricity must stop.",
          visual: 'switch-intro'
        },
        {
          title: 'Switch ON vs OFF',
          mascotSays: 'Switch ON usually means the circuit is closed which makes the electricity loop complete. Switch OFF usually means the loop is broken which means no flow.',
          visual: 'switch-types'
        },
        {
          title: 'Types of Switches',
          mascotSays: "Once you turn on, some switches stay on until you flip them back. But some other switch like a doorbell uses a push button which only works while you press it!",
          visual: 'switch-types'
        },
        {
          title: 'Switches in Circuits',
          mascotSays: "Switches don't \"make\" electricity. They only open or close the loop. Open means gap means no flow. Closed means complete circle means lights on!",
          visual: 'switch-circuit'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Test your switch knowledge!',
      questions: [
        {
          question: 'What does a switch do in a circuit?',
          choices: ['Makes it brighter', 'Opens or closes the circuit', 'Changes the color', 'Makes noise'],
          correct: 1
        },
        {
          question: 'A push button stays on after you press it. True or false?',
          choices: ['True', 'False - it only works while pressed'],
          correct: 1
        },
        {
          question: 'What happens when a switch is OFF?',
          choices: ['Electricity flows faster', 'The circuit is broken and electricity stops', 'Nothing changes', 'The battery charges'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Build a circuit with a switch that turns an LED on and off!',
      availableComponents: ['battery', 'led-red', 'led-green', 'switch'],
      preplacedComponents: [
        { type: 'battery', x: 140, y: 160 },
        { type: 'switch', x: 400, y: 160 },
        { type: 'led-red', x: 660, y: 160 }
      ],
      hints: [
        'Connect battery + to switch left terminal.',
        'Connect switch right terminal to LED +.',
        'Connect LED − back to battery −.',
        'Now tap the switch to toggle ON/OFF!'
      ],
      successCondition: 'switchControlled'
    },

    miniProject: {
      title: 'Flashlight!',
      description: 'Build a flashlight! Use a switch to turn an LED on and off. Grown-up help required.',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue', 'switch'],
      minLEDs: 1,
      successCondition: 'switchControlled'
    },

    badge: 'switch-hero'
  },

  4: {
    id: 4,
    title: 'Series vs Parallel',
    subtitle: 'Two Paths of Power!',
    color: '#9C27B0',
    icon: '🔀',
    mascotIntro: "Today we learn two ways to connect things: series and parallel! These are like two different road designs for electricity!. Let's split some paths!",

    learnMode: {
      slides: [
        {
          title: 'Series Circuits',
          mascotSays: "In a series circuit, everything is on one path, like a train on one track. Electricity must follow the exact same path, one after another, pass through the first light, then the next.",
          visual: 'series-flow'
        },
        {
          title: 'What Happens in Series?',
          mascotSays: 'In series, If one light in series is removed or broken, the path is broken. So all the lights go out. One gap stops the whole loop!',
          visual: 'series-flow'
        },
        {
          title: 'Parallel Circuits',
          mascotSays: 'In a parallel circuit, there are multiple paths. Think of it like a highway with multiple lanes! Electrons can choose different paths. If one lane closes, others keep going!',
          visual: 'parallel-flow'
        },
        {
          title: 'Brightness Difference!',
          mascotSays: "In series, adding more LEDs makes them all dimmer because they share the push. In parallel, each gets full push, so they stay bright!",
          visual: 'brightness-compare'
        },
        {
          title: 'Fun tip!',
          mascotSays: "Your house uses a parallel circuit so all the devices receive full voltage, and when one light or device goes out, it doesn't turn off the others",
          visual: 'parallel-flow'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Series or Parallel? You decide!',
      questions: [
        {
          question: 'In which circuit type do ALL lights go out if one breaks?',
          choices: ['Parallel', 'Series', 'Both', 'Neither'],
          correct: 1
        },
        {
          question: 'Which circuit keeps LEDs brightest?',
          choices: ['Series - one path is stronger', 'Parallel - each LED gets full power'],
          correct: 1
        },
        {
          question: 'Your house uses which type of circuit?',
          choices: ['Series', 'Parallel', 'Neither'],
          correct: 1
        },
        {
          question: 'Adding more LEDs in series makes them...',
          choices: ['Brighter', 'Dimmer', 'The same brightness', 'Change color'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Build a parallel circuit with 2 LEDs! Both should be bright!',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue', 'switch'],
      preplacedComponents: [
        { type: 'battery', x: 160, y: 250 },
        { type: 'led-red', x: 560, y: 120 },
        { type: 'led-green', x: 560, y: 380 }
      ],
      hints: [
        'Connect battery + to BOTH LED + terminals.',
        'Connect battery − to BOTH LED − terminals.',
        'Each LED gets its own path — that is parallel!',
        'Both LEDs should glow bright!'
      ],
      successCondition: 'twoLedsLit'
    },

    miniProject: {
      title: 'Room Lights!',
      description: 'Build a room with 3 LED lights in parallel with a main switch! All stay bright. Grown-up supervision!',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue', 'led-yellow', 'switch'],
      minLEDs: 2,
      successCondition: 'twoLedsLit'
    },

    badge: 'parallel-pro'
  },

  5: {
    id: 5,
    title: 'Complete Circuits',
    subtitle: 'Build Amazing Things!',
    color: '#4A90D9',
    icon: '⚡',
    mascotIntro: "You've learned so much! Now let's put it ALL together: batteries, LEDs, switches, and circuit design.",

    learnMode: {
      slides: [
        {
          title: 'Circuit Design Questions',
          mascotSays: "When building a circuit, remember three things: 1. Where does the power come from? 2. Does the wire make a full circle? 3. What is using the power (like a light or a toy)?",
          visual: 'circuit-design'
        },
        {
          title: 'Troubleshooting Like an Engineer',
          mascotSays: "If your circuit doesn't work, check: (1) Is there a gap? (2) Are wires connected to terminals? (3) Is the LED facing the right direction?",
          visual: 'circuit-design'
        },
        {
          title: 'Real World Circuits',
          mascotSays: "You now understand the basics of how ALL electronics work, from toys to houses! Great job!",
          visual: 'real-world'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: "Final Quiz - Test everything you've learned!",
      questions: [
        {
          question: 'What does a battery provide to a circuit?',
          choices: ['Light', 'Electricity/Voltage', 'Heat', 'Sound'],
          correct: 1
        },
        {
          question: 'What must be true for electricity to flow?',
          choices: ['The circuit must be open', 'The circuit must be a complete loop', 'You need two batteries', 'The wires must be long'],
          correct: 1
        },
        {
          question: 'An LED works in both directions. True or False?',
          choices: ['True', 'False - LEDs only work one way'],
          correct: 1
        },
        {
          question: 'What happens when you open a switch?',
          choices: ['More electricity flows', 'The circuit breaks and electricity stops', 'The LED gets brighter', 'Nothing happens'],
          correct: 1
        },
        {
          question: 'Which is better for home lighting - series or parallel?',
          choices: ['Series', 'Parallel - each light works independently'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Build a circuit with a battery, switch, and at least 2 LEDs!',
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue', 'led-yellow', 'switch'],
      preplacedComponents: [
        { type: 'battery', x: 120, y: 250 },
        { type: 'switch', x: 360, y: 250 },
        { type: 'led-red', x: 620, y: 120 },
        { type: 'led-green', x: 620, y: 380 }
      ],
      hints: [
        'Connect battery + to the switch.',
        'Connect switch to both LEDs + terminals.',
        'Connect both LEDs − back to battery −.',
        'Tap the switch to control both LEDs!'
      ],
      successCondition: 'twoLedsLit'
    },

    miniProject: {
      title: 'Dream Circuit!',
      description: "Design your ultimate circuit! Use a battery, at least 2 LEDs, and switch control. Challenge: make one LED turn on with a switch, and a second LED turn on with a push button. Safety note: Always ask a grown-up before building real circuits, and never connect wires directly across a battery for a long time.",
      availableComponents: ['battery', 'led-red', 'led-green', 'led-blue', 'led-yellow', 'switch'],
      minLEDs: 2,
      successCondition: 'twoLedsLit'
    },

    badge: 'circuit-champion'
  },

  6: {
    id: 6,
    title: 'Conductors & Insulators',
    subtitle: 'What Lets Electricity Through?',
    color: '#FF9800',
    icon: '🔌',
    mascotIntro: "Wow, you've built so many circuits! Today we learn why some things let electricity through and others block it, like superheroes vs. walls! Let's explore!",

    learnMode: {
      slides: [
        {
          title: 'Conductors Let Electricity Flow!',
          mascotSays: "Conductors are materials that let electrons zoom through easily, like metal wires, copper pennies, or aluminum foil. That's why wires are made of metal!",
          visual: 'electron-flow'
        },
        {
          title: 'Insulators Block the Flow!',
          mascotSays: "Insulators stop electrons, like plastic, rubber, wood, glass, or cloth. That's why wires have plastic covers to keep electricity safe inside!",
          visual: 'wire-road'
        },
        {
          title: 'Why It Matters',
          mascotSays: 'In your circuits, use metal for the path (conductors) and plastic or rubber for handles or covers (insulators).',
          visual: 'simple-circuit'
        },
        {
          title: 'Fun Test Idea',
          mascotSays: "You can make a circuit tester: If the LED lights up when you touch an object between two wires, it's a conductor! No light? Insulator!",
          visual: 'ready-to-build'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Conductors or Insulators? Let\'s find out!',
      questions: [
        {
          question: 'What is a conductor?',
          choices: ['Something that blocks electricity', 'A material that lets electricity flow easily', 'A type of battery', 'A switch'],
          correct: 1
        },
        {
          question: 'Which is usually an insulator?',
          choices: ['Copper wire', 'Plastic coating on a wire', 'Aluminum foil', 'A metal coin'],
          correct: 1
        },
        {
          question: 'Why do wires have plastic around them?',
          choices: ['To make them colorful', 'To insulate and keep electricity safe', 'To make them heavier', 'To stop them from bending'],
          correct: 1
        },
        {
          question: 'If you put a wooden stick in a circuit instead of wire, what happens?',
          choices: ['The LED gets brighter', 'Nothing lights up - wood is an insulator', 'The battery explodes', 'It changes color'],
          correct: 1
        },
        {
          question: 'Which would light up an LED in your tester?',
          choices: ['Rubber band', 'Paper clip (metal)', 'Plastic spoon', 'Cloth'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Connect the battery to the LED — if it lights up, the path conducts!',
      availableComponents: ['battery', 'led-red'],
      preplacedComponents: [
        { type: 'battery', x: 200, y: 160 },
        { type: 'led-red', x: 560, y: 160 }
      ],
      hints: [
        'Connect battery + to LED +.',
        'Connect battery − to LED −.',
        'If the LED lights, electricity flows — it is a conductor!'
      ],
      successCondition: 'anyLedLit'
    },

    miniProject: {
      title: 'Conductor Hunt!',
      description: 'Make a simple tester circuit with battery, LED, and wires. Hunt around your house (with grown-up help) for 10 items\u2014test which conduct electricity! Draw or list your conductors and insulators.',
      availableComponents: ['battery', 'led-red', 'led-green'],
      minLEDs: 1,
      successCondition: 'anyLedLit'
    },

    badge: 'conductor-detective'
  },

  7: {
    id: 7,
    title: 'Resistance & Dimming',
    subtitle: 'Slow Down the Electrons!',
    color: '#795548',
    icon: '🔅',
    mascotIntro: "Ever wonder why some lights are bright and others dim? Today: Resistance! It slows electrons down\u2014like traffic on a narrow road. Safety first\u2014grown-up for real parts!",

    learnMode: {
      slides: [
        {
          title: 'What is Resistance?',
          mascotSays: 'Resistance is how much a material fights the flow of electrons. High resistance = slow electrons = dimmer lights!',
          visual: 'wire-road'
        },
        {
          title: 'Resistors in Circuits',
          mascotSays: "Resistors are tiny parts that add controlled resistance. They're like speed bumps for electricity\u2014use them to protect LEDs or make lights dimmer.",
          visual: 'simple-circuit'
        },
        {
          title: 'Series vs Parallel Again',
          mascotSays: 'More resistors in series = more resistance = dimmer! In parallel, each path has less total resistance.',
          visual: 'series-circuit'
        },
        {
          title: 'Real Life',
          mascotSays: "Dimmer switches on lamps use resistance to control brightness. Your body has resistance too\u2014that's why you don't get shocked too badly from low batteries!",
          visual: 'real-world'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Test your resistance knowledge!',
      questions: [
        {
          question: 'What does a resistor do?',
          choices: ['Makes electricity faster', 'Slows down the flow of electrons', 'Makes lights change color', 'Stores electricity'],
          correct: 1
        },
        {
          question: 'Adding a resistor in series makes the LED...',
          choices: ['Brighter', 'Dimmer', 'Blink', 'Explode'],
          correct: 1
        },
        {
          question: 'Why do we use resistors with LEDs?',
          choices: ['To make them brighter', 'To protect them from too much electricity', 'To change their color', 'To make noise'],
          correct: 1
        },
        {
          question: 'A thin wire has more resistance than a thick one. True or false?',
          choices: ['True', 'False'],
          correct: 0
        }
      ]
    },

    practiceSim: {
      objective: 'Connect the battery to the LED and see it glow!',
      availableComponents: ['battery', 'led-red', 'led-green', 'switch'],
      preplacedComponents: [
        { type: 'battery', x: 200, y: 160 },
        { type: 'led-red', x: 560, y: 160 }
      ],
      hints: [
        'Connect battery + to LED +.',
        'Connect battery − to LED −.',
        'The LED lights! More resistance means dimmer light.'
      ],
      successCondition: 'anyLedLit'
    },

    miniProject: {
      title: 'Dimmer Challenge!',
      description: 'Build a circuit with an LED and add materials (like long thin wire or pencil graphite) to increase resistance and dim the light. Grown-up help to test safely!',
      availableComponents: ['battery', 'led-red', 'led-green', 'switch'],
      minLEDs: 1,
      successCondition: 'anyLedLit'
    },

    badge: 'resistance-ranger'
  },

  8: {
    id: 8,
    title: 'Motors & Movement',
    subtitle: 'Make Things Spin!',
    color: '#E91E63',
    icon: '⚙️',
    mascotIntro: "Lights are cool, but what about making things MOVE? Today: Electric motors! They turn electricity into spinning power. Grown-up supervision for real motors!",

    learnMode: {
      slides: [
        {
          title: 'What is a Motor?',
          mascotSays: 'A motor uses electricity to make a shaft spin\u2014like in fans, toy cars, or drills!',
          visual: 'real-world'
        },
        {
          title: 'How Motors Work',
          mascotSays: "Inside: Electromagnets push and pull to spin! Connect it right (polarity matters sometimes), and whoosh\u2014it goes!",
          visual: 'electron-flow'
        },
        {
          title: 'Direction & Speed',
          mascotSays: "Swap the wires? Motor spins opposite way! More voltage = faster spin (but don't overdo it!).",
          visual: 'battery-plus-minus'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Motors and movement quiz!',
      questions: [
        {
          question: 'What does a motor turn electricity into?',
          choices: ['Light', 'Movement (spinning)', 'Sound', 'Heat'],
          correct: 1
        },
        {
          question: 'What happens if you reverse the wires on a motor?',
          choices: ['It gets hotter', 'It spins the other direction', 'It stops', 'It explodes'],
          correct: 1
        },
        {
          question: 'Motors are found in...',
          choices: ['Flashlights', 'Toy cars and fans', 'Light bulbs', 'Switches'],
          correct: 1
        },
        {
          question: 'More battery power usually makes a motor...',
          choices: ['Slower', 'Faster'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Connect the switch to control the LED — like a motor switch!',
      availableComponents: ['battery', 'led-red', 'led-green', 'switch'],
      preplacedComponents: [
        { type: 'battery', x: 140, y: 160 },
        { type: 'switch', x: 400, y: 160 },
        { type: 'led-red', x: 660, y: 160 }
      ],
      hints: [
        'Connect battery + to the switch.',
        'Connect the switch to LED +.',
        'Connect LED − back to battery −.',
        'Tap the switch to turn it ON!'
      ],
      successCondition: 'anyLedLit'
    },

    miniProject: {
      title: 'Motor Fan!',
      description: 'Build a circuit with a small motor and attach a paper fan blade (grown-up help). Add a switch to control it. Make it blow air!',
      availableComponents: ['battery', 'led-red', 'switch'],
      minLEDs: 1,
      successCondition: 'anyLedLit'
    },

    badge: 'motor-master'
  },

  9: {
    id: 9,
    title: 'Static Electricity',
    subtitle: 'Zap and Attract!',
    color: '#00BCD4',
    icon: '🎈',
    mascotIntro: "Zap! Static electricity is the fun, sneaky kind\u2014no wires needed! Today: Rub, attract, and shock (safely). Grown-up for experiments!",

    learnMode: {
      slides: [
        {
          title: 'What is Static Electricity?',
          mascotSays: "Static is extra electrons building up on things\u2014when they jump, you get a spark or attraction!",
          visual: 'electricity-everywhere'
        },
        {
          title: 'Rubbing Makes Charge',
          mascotSays: 'Rub a balloon on your hair\u2014electrons move to the balloon! It becomes negative and attracts positive things (like hair or paper bits).',
          visual: 'electron-flow'
        },
        {
          title: 'Attraction & Repulsion',
          mascotSays: 'Opposite charges attract (stick together). Same charges repel (push away)!',
          visual: 'battery-plus-minus'
        },
        {
          title: 'Real Life Zaps',
          mascotSays: 'That shock when you touch a doorknob? Static discharge! Lightning is giant static!',
          visual: 'electricity-everywhere'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Static electricity quiz!',
      questions: [
        {
          question: 'Static electricity needs...',
          choices: ['Wires and batteries', 'Rubbing to move electrons', 'A switch', 'A motor'],
          correct: 1
        },
        {
          question: 'What happens when you rub a balloon on hair?',
          choices: ['Balloon gets positive charge', 'Balloon steals electrons and attracts paper', 'It makes light', 'It spins'],
          correct: 1
        },
        {
          question: 'Like charges...',
          choices: ['Attract', 'Repel', 'Do nothing', 'Make sound'],
          correct: 1
        },
        {
          question: 'Lightning is a form of...',
          choices: ['Current electricity', 'Static electricity'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Connect the battery to the LED to explore how electricity flows!',
      availableComponents: ['battery', 'led-red', 'led-green'],
      preplacedComponents: [
        { type: 'battery', x: 200, y: 160 },
        { type: 'led-red', x: 560, y: 160 }
      ],
      hints: [
        'Tap an orange terminal to start a wire.',
        'Connect battery + to LED +.',
        'Connect battery − to LED −.',
        'The LED lights up — electricity is flowing!'
      ],
      successCondition: 'anyLedLit'
    },

    miniProject: {
      title: 'Static Tricks!',
      description: 'Rub balloon on hair\u2014stick to wall, pick up paper bits, or make hair stand up! (Safe, no real shocks needed.) Grown-up help.',
      availableComponents: ['battery', 'led-red'],
      minLEDs: 1,
      successCondition: 'anyLedLit'
    },

    badge: 'static-spark'
  },

  10: {
    id: 10,
    title: 'Electromagnets',
    subtitle: 'Magnet Power!',
    color: '#3F51B5',
    icon: '🧲',
    mascotIntro: "Last big lesson: Turn electricity into magnetism! Make your own electromagnet. You're a super engineer now! Grown-up must help with coils/wires.",

    learnMode: {
      slides: [
        {
          title: 'Electricity Makes Magnetism',
          mascotSays: 'When electricity flows through a wire coil, it creates a magnetic field\u2014like a temporary magnet!',
          visual: 'electron-flow'
        },
        {
          title: 'Building an Electromagnet',
          mascotSays: 'Wrap wire around a nail, connect to battery\u2014nail picks up paper clips! More coils or bigger battery = stronger magnet.',
          visual: 'simple-circuit'
        },
        {
          title: 'On/Off Magnet',
          mascotSays: "Switch the current off? Magnetism disappears! That's why electromagnets are useful (cranes, doorbells).",
          visual: 'ready-to-build'
        },
        {
          title: 'Real World Wonders',
          mascotSays: 'Junkyard cranes, MRI machines, electric motors\u2014all use electromagnets!',
          visual: 'real-world'
        }
      ]
    },

    gameMode: {
      type: 'quiz',
      instruction: 'Electromagnet final quiz!',
      questions: [
        {
          question: 'An electromagnet needs...',
          choices: ['Permanent magnet only', 'Electric current through a coil', 'Batteries only', 'No wires'],
          correct: 1
        },
        {
          question: 'What happens when you turn off the current?',
          choices: ['Magnet gets stronger', 'Magnetism stops', 'It spins', 'It lights up'],
          correct: 1
        },
        {
          question: 'More wire coils make the electromagnet...',
          choices: ['Weaker', 'Stronger', 'Hotter only', 'No change'],
          correct: 1
        },
        {
          question: 'Electromagnets are used in...',
          choices: ['Permanent fridge magnets', 'Cranes to lift cars', 'Light bulbs', 'Batteries'],
          correct: 1
        }
      ]
    },

    practiceSim: {
      objective: 'Connect the switch to control the LED — like an electromagnet switch!',
      availableComponents: ['battery', 'led-red', 'led-green', 'switch'],
      preplacedComponents: [
        { type: 'battery', x: 140, y: 160 },
        { type: 'switch', x: 400, y: 160 },
        { type: 'led-red', x: 660, y: 160 }
      ],
      hints: [
        'Connect battery + to the switch.',
        'Connect switch to LED +.',
        'Connect LED − back to battery −.',
        'Toggle the switch to control your electromagnet circuit!'
      ],
      successCondition: 'switchControlled'
    },

    miniProject: {
      title: 'Super Electromagnet Crane!',
      description: "Wrap insulated wire around a nail (many turns), connect to battery with switch. Pick up small metal objects! Grown-up help\u2014don't leave on too long (gets warm). Celebrate\u2014you're an electricity pro!",
      availableComponents: ['battery', 'led-red', 'switch'],
      minLEDs: 1,
      successCondition: 'anyLedLit'
    },

    badge: 'electromagnet-engineer'
  }
};
