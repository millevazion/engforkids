export const SOURCES = {
  te_design: {
    id: "te_design",
    title: "Engineering Design Process",
    publisher: "TeachEngineering (University of Colorado Boulder)",
    url: "https://www.teachengineering.org/k12engineering/designprocess",
  },
  nasa_force: {
    id: "nasa_force",
    title: "Forces",
    publisher: "NASA Glenn Research Center",
    url: "https://www.grc.nasa.gov/WWW/k-12/FoilSim/Manual/fsim001x.htm",
  },
  nasa_newton: {
    id: "nasa_newton",
    title: "Newton's Laws of Motion",
    publisher: "NASA Glenn Research Center",
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/newtons-laws-of-motion/",
  },
  brit_mass_weight: {
    id: "brit_mass_weight",
    title: "Mass and Weight",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/science/What-Is-the-Difference-Between-Mass-and-Weight",
  },
  nasa_weight: {
    id: "nasa_weight",
    title: "Weight",
    publisher: "NASA Glenn Research Center",
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/what-is-weight/",
  },
  nasa_work: {
    id: "nasa_work",
    title: "Work",
    publisher: "NASA Glenn Research Center",
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/work/",
  },
  nasa_power: {
    id: "nasa_power",
    title: "Power",
    publisher: "NASA Glenn Research Center",
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/power/",
  },
  eia_energy: {
    id: "eia_energy",
    title: "Law of Conservation of Energy",
    publisher: "U.S. Energy Information Administration",
    url: "https://www.eia.gov/kids/what-is-energy/laws-of-energy.php",
  },
  te_simple_topics: {
    id: "te_simple_topics",
    title: "Simple Machines (Popular Topics)",
    publisher: "TeachEngineering (University of Colorado Boulder)",
    url: "https://www.teachengineering.org/populartopics/simplemachines",
  },
  brit_mech_adv: {
    id: "brit_mech_adv",
    title: "Mechanical Advantage",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/technology/mechanical-advantage",
  },
  te_pulleys: {
    id: "te_pulleys",
    title: "Powerful Pulleys",
    publisher: "TeachEngineering (University of Colorado Boulder)",
    url: "https://www.teachengineering.org/lessons/view/cub_simple_lesson05",
  },
  nasa_torque: {
    id: "nasa_torque",
    title: "Torque",
    publisher: "NASA Glenn Research Center",
    url: "https://www.grc.nasa.gov/WWW/K-12/airplane/torque.html",
  },
  brit_wheel_axle: {
    id: "brit_wheel_axle",
    title: "Wheel and Axle",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/technology/wheel-and-axle",
  },
  brit_gear: {
    id: "brit_gear",
    title: "Gear",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/technology/gear",
  },
  brit_friction: {
    id: "brit_friction",
    title: "Friction",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/science/friction",
  },
  brit_elasticity: {
    id: "brit_elasticity",
    title: "Elasticity",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/summary/elasticity-physics",
  },
  cam_stiffness: {
    id: "cam_stiffness",
    title: "Stiffness and Strength",
    publisher: "University of Cambridge Department of Engineering",
    url: "https://www-materials.eng.cam.ac.uk/mpsite/properties/non-IE/stiffness.html",
  },
};

export const LESSONS = [
  {
    id: "design-process",
    level: 1,
    title: "Engineer Like a Pro",
    kicker: "Design Process",
    summary:
      "Engineers use a step-by-step process to solve problems and improve designs.",
    concepts: [
      {
        title: "Engineering design is a process",
        text:
          "The engineering design process is a series of steps engineers use to solve problems.",
        sources: ["te_design"],
      },
      {
        title: "A common set of steps",
        text:
          "A common version is: Ask, Research, Imagine, Plan, Create, Test, Improve.",
        sources: ["te_design"],
      },
      {
        title: "It is iterative",
        text:
          "After testing, engineers improve the design and try again.",
        sources: ["te_design"],
      },
    ],
    tryIt: [
      "Pick a problem: keep a paper cup from tipping over.",
      "Ask: What makes it tip? Research: where is the center of mass?",
      "Imagine: draw 3 base shapes. Plan: choose one and list materials.",
      "Create: build it. Test: push lightly. Improve: change one thing and retest.",
    ],
    quiz: [
      {
        question: "Which step is about brainstorming many ideas?",
        choices: ["Ask", "Imagine", "Test", "Improve"],
        answerIndex: 1,
        explanation: "The Imagine step focuses on brainstorming possible solutions.",
        sources: ["te_design"],
      },
      {
        question: "Why do engineers test a design?",
        choices: [
          "To decorate it",
          "To see how well it works and what to fix",
          "To avoid planning",
          "To skip building",
        ],
        answerIndex: 1,
        explanation:
          "Testing shows how the design performs so it can be improved.",
        sources: ["te_design"],
      },
    ],
  },
  {
    id: "forces-motion",
    level: 1,
    title: "Forces Make Things Move",
    kicker: "Forces & Newton",
    summary:
      "Forces are pushes or pulls, and Newton's laws explain how motion changes.",
    concepts: [
      {
        title: "Force is a push or pull",
        text: "A force is a push or a pull on an object.",
        sources: ["nasa_force"],
      },
      {
        title: "First law",
        text:
          "Objects keep doing what they are doing unless a force acts on them.",
        sources: ["nasa_newton"],
      },
      {
        title: "Second law",
        text:
          "Acceleration depends on the size of the force and the mass of the object.",
        sources: ["nasa_newton"],
      },
      {
        title: "Third law",
        text:
          "For every action force, there is an equal and opposite reaction force.",
        sources: ["nasa_newton"],
      },
    ],
    tryIt: [
      "Roll a toy car on a smooth floor and on a rug.",
      "Ask: which surface lets it keep moving longer?",
      "Explain your result using Newton's first law.",
    ],
    quiz: [
      {
        question: "A force can be described as a:",
        choices: ["Push or pull", "Color", "Sound", "Shape"],
        answerIndex: 0,
        explanation: "A force is a push or a pull.",
        sources: ["nasa_force"],
      },
      {
        question:
          "If you push a heavy box and a light box with the same force, which one accelerates more?",
        choices: ["The heavy box", "The light box", "Both the same"],
        answerIndex: 1,
        explanation:
          "With the same force, the object with less mass accelerates more.",
        sources: ["nasa_newton"],
      },
    ],
  },
  {
    id: "mass-weight",
    level: 1,
    title: "Mass vs. Weight",
    kicker: "Gravity Matters",
    summary:
      "Mass is how much matter you have; weight is the force of gravity on that mass.",
    concepts: [
      {
        title: "Mass stays the same",
        text:
          "Mass is the amount of matter in an object and does not change with location.",
        sources: ["brit_mass_weight"],
      },
      {
        title: "Weight is a force",
        text: "Weight is the force of gravity pulling on an object.",
        sources: ["brit_mass_weight", "nasa_weight"],
      },
      {
        title: "Gravity changes weight",
        text:
          "Weight changes if gravity changes, but mass stays the same.",
        sources: ["brit_mass_weight"],
      },
    ],
    tryIt: [
      "Imagine you are on the Moon. Would your mass or weight change?",
      "Explain your answer using the difference between mass and weight.",
    ],
    quiz: [
      {
        question: "Which statement is correct?",
        choices: [
          "Mass changes when you move to the Moon",
          "Weight changes when gravity changes",
          "Mass and weight are the same",
        ],
        answerIndex: 1,
        explanation:
          "Weight depends on gravity, but mass does not change with location.",
        sources: ["brit_mass_weight"],
      },
      {
        question: "Weight is best described as:",
        choices: ["A force", "A color", "A temperature", "A speed"],
        answerIndex: 0,
        explanation: "Weight is the gravitational force on an object.",
        sources: ["nasa_weight"],
      },
    ],
  },
  {
    id: "work-energy-power",
    level: 2,
    title: "Work, Energy, Power",
    kicker: "Getting Things Done",
    summary:
      "Work happens when a force moves something, and power tells how fast work is done.",
    concepts: [
      {
        title: "Work",
        text:
          "Work is done when a force moves an object through a distance; work equals force times distance.",
        sources: ["nasa_work"],
      },
      {
        title: "Power",
        text:
          "Power is the rate at which work is done; it depends on how quickly the work happens.",
        sources: ["nasa_power"],
      },
      {
        title: "Energy changes form",
        text:
          "Energy cannot be created or destroyed, but it can change from one form to another.",
        sources: ["eia_energy"],
      },
    ],
    tryIt: [
      "Climb stairs slowly, then quickly. You did the same work, but which took more power?",
      "Explain your answer using the definition of power.",
    ],
    quiz: [
      {
        question: "Which best describes work?",
        choices: [
          "Force times distance",
          "Distance times time",
          "Mass times speed",
        ],
        answerIndex: 0,
        explanation: "Work equals force times distance moved.",
        sources: ["nasa_work"],
      },
      {
        question: "Power is about:",
        choices: [
          "How quickly work is done",
          "How heavy something is",
          "What color it is",
        ],
        answerIndex: 0,
        explanation: "Power is the rate of doing work.",
        sources: ["nasa_power"],
      },
    ],
  },
  {
    id: "simple-machines",
    level: 2,
    title: "Simple Machines",
    kicker: "Make Work Easier",
    summary:
      "Simple machines change the size or direction of a force so tasks feel easier.",
    concepts: [
      {
        title: "Six classic simple machines",
        text:
          "The six common simple machines are the lever, wheel and axle, pulley, inclined plane, wedge, and screw.",
        sources: ["te_simple_topics"],
      },
      {
        title: "Make work easier",
        text:
          "Simple machines are basic devices with few or no moving parts that make work easier by changing the magnitude or direction of a force.",
        sources: ["te_simple_topics"],
      },
      {
        title: "Mechanical advantage",
        text:
          "Mechanical advantage compares output force to input force, and friction can reduce the actual advantage.",
        sources: ["brit_mech_adv"],
      },
    ],
    tryIt: [
      "Find each simple machine at home (scissors, ramp, doorknob, etc.).",
      "Explain how each one changes force or direction.",
    ],
    quiz: [
      {
        question: "Which list contains only simple machines?",
        choices: [
          "Lever, pulley, wheel and axle",
          "Battery, motor, wire",
          "Laptop, phone, TV",
        ],
        answerIndex: 0,
        explanation: "Lever, pulley, and wheel and axle are simple machines.",
        sources: ["te_simple_topics"],
      },
      {
        question:
          "Mechanical advantage compares which two forces?",
        choices: [
          "Output force and input force",
          "Friction and gravity",
          "Mass and weight",
        ],
        answerIndex: 0,
        explanation:
          "Mechanical advantage is the ratio of output force to input force.",
        sources: ["brit_mech_adv"],
      },
    ],
  },
  {
    id: "levers-torque",
    level: 2,
    title: "Levers & Torque",
    kicker: "Power at a Distance",
    summary:
      "Levers use a fulcrum to lift loads, and torque measures turning force.",
    concepts: [
      {
        title: "Levers and fulcrums",
        text:
          "A lever is a long beam resting on a fulcrum; moving the fulcrum close to the load can reduce the effort needed to lift it.",
        sources: ["te_simple_topics"],
      },
      {
        title: "Torque definition",
        text:
          "Torque is the product of a force and the perpendicular distance from the pivot point.",
        sources: ["nasa_torque"],
      },
    ],
    tryIt: [
      "Use a ruler as a lever to lift a book with a pencil as the fulcrum.",
      "Move the pencil closer to the book. What happens to the effort you need?",
    ],
    quiz: [
      {
        question: "The pivot point of a lever is called the:",
        choices: ["Fulcrum", "Axis", "Motor", "Pulley"],
        answerIndex: 0,
        explanation: "A lever pivots around a fulcrum.",
        sources: ["te_simple_topics"],
      },
      {
        question: "Torque depends on:",
        choices: [
          "Force and distance from the pivot",
          "Color and shape",
          "Mass and temperature",
        ],
        answerIndex: 0,
        explanation:
          "Torque is force times the perpendicular distance to the pivot.",
        sources: ["nasa_torque"],
      },
    ],
  },
  {
    id: "pulleys",
    level: 2,
    title: "Pulleys",
    kicker: "Lift with Rope",
    summary:
      "Pulleys change force direction and can multiply your lifting force.",
    concepts: [
      {
        title: "Pulley basics",
        text:
          "A pulley is a grooved wheel with a rope or cable used to lift or move loads.",
        sources: ["te_simple_topics"],
      },
      {
        title: "More pulleys, less force",
        text:
          "Using more pulleys can reduce the input force needed to lift a load.",
        sources: ["te_pulleys"],
      },
      {
        title: "Counting rope segments",
        text:
          "The mechanical advantage of a pulley system equals the number of rope segments supporting the load.",
        sources: ["te_pulleys"],
      },
    ],
    tryIt: [
      "Make a simple pulley with a spool and string.",
      "Try lifting a small weight with one pulley and then two pulleys.",
    ],
    quiz: [
      {
        question: "A pulley mainly uses a:",
        choices: ["Rope and grooved wheel", "Battery", "Magnet"],
        answerIndex: 0,
        explanation: "A pulley is a grooved wheel with a rope or cable.",
        sources: ["te_simple_topics"],
      },
      {
        question:
          "If a pulley system has 3 rope segments supporting the load, the mechanical advantage is:",
        choices: ["3", "1", "6"],
        answerIndex: 0,
        explanation:
          "Mechanical advantage equals the number of rope segments supporting the load.",
        sources: ["te_pulleys"],
      },
    ],
  },
  {
    id: "wheels-gears",
    level: 3,
    title: "Wheels, Axles, Gears",
    kicker: "Spin to Win",
    summary:
      "Wheels and gears help move force and motion around in machines.",
    concepts: [
      {
        title: "Wheel and axle",
        text:
          "A wheel and axle can multiply force; the mechanical advantage depends on the ratio of wheel radius to axle radius.",
        sources: ["brit_wheel_axle"],
      },
      {
        title: "Gears transmit motion",
        text:
          "Gears are toothed wheels that transmit and modify rotary motion and torque.",
        sources: ["brit_gear"],
      },
      {
        title: "Gear ratios",
        text:
          "For circular gears, speed and torque ratios stay constant because the teeth lie on circles.",
        sources: ["brit_gear"],
      },
    ],
    tryIt: [
      "Use two different sized gears (or cardboard circles with teeth) and link them.",
      "Which one turns faster? What happens to the turning force?",
    ],
    quiz: [
      {
        question: "A wheel and axle is a type of:",
        choices: ["Simple machine", "Battery", "Sensor"],
        answerIndex: 0,
        explanation: "A wheel and axle is one of the simple machines.",
        sources: ["brit_wheel_axle", "te_simple_topics"],
      },
      {
        question: "Gears mainly help by:",
        choices: [
          "Transmitting and changing rotary motion",
          "Making sound",
          "Changing color",
        ],
        answerIndex: 0,
        explanation:
          "Gears transmit and modify rotary motion and torque.",
        sources: ["brit_gear"],
      },
    ],
  },
  {
    id: "inclines-wedges-screws",
    level: 3,
    title: "Inclines, Wedges, Screws",
    kicker: "Slice and Lift",
    summary:
      "Inclined planes, wedges, and screws trade distance for force.",
    concepts: [
      {
        title: "Inclined plane",
        text:
          "An inclined plane is a flat, sloped surface used to raise heavy objects; steeper angles require more effort.",
        sources: ["te_simple_topics"],
      },
      {
        title: "Wedge",
        text:
          "A wedge is a tool that tapers to a thin edge and forces materials apart.",
        sources: ["te_simple_topics"],
      },
      {
        title: "Screw",
        text:
          "A screw is an inclined plane wrapped around a cylinder.",
        sources: ["te_simple_topics"],
      },
    ],
    tryIt: [
      "Build a small ramp and roll a toy up it. Compare to lifting straight up.",
      "Find a wedge (doorstop) and a screw (jar lid).",
    ],
    quiz: [
      {
        question: "An inclined plane helps by:",
        choices: [
          "Reducing the force needed to lift",
          "Adding gravity",
          "Stopping motion",
        ],
        answerIndex: 0,
        explanation:
          "Inclined planes reduce the effort needed to raise a load by using a sloped surface.",
        sources: ["te_simple_topics"],
      },
      {
        question: "A screw is best described as:",
        choices: [
          "An inclined plane wrapped around a cylinder",
          "A type of pulley",
          "A kind of motor",
        ],
        answerIndex: 0,
        explanation:
          "A screw is an inclined plane wrapped around a cylinder.",
        sources: ["te_simple_topics"],
      },
    ],
  },
  {
    id: "friction-materials",
    level: 3,
    title: "Friction & Materials",
    kicker: "What Stuff Does",
    summary:
      "Friction resists motion, and material properties tell how things bend or break.",
    concepts: [
      {
        title: "Friction resists motion",
        text:
          "Friction is the resistance that occurs when two surfaces slide or try to slide against each other.",
        sources: ["brit_friction"],
      },
      {
        title: "Static vs kinetic",
        text:
          "Static friction acts before motion starts, and kinetic friction acts during sliding.",
        sources: ["brit_friction"],
      },
      {
        title: "Elasticity",
        text:
          "Elasticity is the ability of a material to return to its original shape after forces are removed.",
        sources: ["brit_elasticity"],
      },
      {
        title: "Stiffness and strength",
        text:
          "Stiffness (related to Young's modulus) measures resistance to elastic deformation; strength is about how much load causes permanent deformation or breakage.",
        sources: ["cam_stiffness"],
      },
    ],
    tryIt: [
      "Slide a book on a table and on a towel. Which has more friction?",
      "Bend a plastic ruler and a metal spoon gently. Which is stiffer?",
    ],
    quiz: [
      {
        question: "Friction is:",
        choices: [
          "Resistance to sliding",
          "A type of light",
          "A kind of sound",
        ],
        answerIndex: 0,
        explanation: "Friction is resistance when surfaces slide or try to slide.",
        sources: ["brit_friction"],
      },
      {
        question: "Elasticity means a material:",
        choices: [
          "Returns to its original shape after the force is removed",
          "Always breaks",
          "Only changes color",
        ],
        answerIndex: 0,
        explanation:
          "Elastic materials return to their original shape when forces are removed.",
        sources: ["brit_elasticity"],
      },
    ],
  },
];

export const LEVELS = [
  {
    level: 1,
    title: "Level 1: Foundations",
    goal: "Understand forces and how engineers solve problems.",
  },
  {
    level: 2,
    title: "Level 2: Simple Machines",
    goal: "Use machines to trade force for distance.",
  },
  {
    level: 3,
    title: "Level 3: Motion Makers",
    goal: "Explore rotation, friction, and materials.",
  },
];

export const AI_PROMPTS = {
  idea:
    "Create 3 short build challenges for a 10-year-old about: {topic}. Use common household items. Keep each challenge to 2 sentences and avoid new scientific facts beyond the topic.",
  quiz:
    "Write 3 multiple-choice practice questions (with answers) about: {topic}. Avoid adding new scientific facts beyond the topic.",
  image:
    "Create a clean, kid-friendly diagram that illustrates: {topic}. Use simple shapes, labels, and a light background. No text longer than 3 words per label.",
};
