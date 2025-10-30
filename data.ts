import { Module, GlossaryTerm, User, Role } from './types';

// In a real application, this user data would come from a database.
// For this demo, we're using localStorage to simulate a persistent user store.

interface StoredUser extends User {
  password: string;
}

const USERS_STORAGE_KEY = 'aasiraUsers';
const ORGANIZER_SECRET_KEY = '2025';

/**
 * Retrieves the list of users from localStorage.
 */
const getUsers = (): StoredUser[] => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Failed to parse users from localStorage", e);
    return [];
  }
};

/**
 * Saves the list of users to localStorage.
 */
const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Populates localStorage with initial users if it's empty.
 */
export const seedInitialUsers = () => {
  if (localStorage.getItem(USERS_STORAGE_KEY)) {
    return;
  }
  
  const initialUsers: StoredUser[] = [
    { id: 'user-student-demo', username: 'student', password: 'password123', role: 'student' },
    { id: 'user-organizer-demo', username: 'organizer', password: 'password123', role: 'organizer' },
  ];
  saveUsers(initialUsers);
};

/**
 * Handles user sign-up.
 * @throws Will throw an error if validation fails.
 */
export const signup = (username: string, password: string, role: Role, organizerKey?: string): User => {
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }
  if (role === 'organizer' && organizerKey !== ORGANIZER_SECRET_KEY) {
    throw new Error('Invalid organizer key.');
  }

  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username already exists.');
  }

  const newUser: StoredUser = {
    id: `user-${crypto.randomUUID()}`,
    username,
    password, // In a real app, this should be hashed.
    role,
  };

  saveUsers([...users, newUser]);

  // Return user object without the password
  const { password: _, ...userToReturn } = newUser;
  return userToReturn;
};

/**
 * Handles user login.
 * @throws Will throw an error if authentication fails.
 */
export const login = (username: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid username or password.');
  }

  // Return user object without the password
  const { password: _, ...userToReturn } = user;
  return userToReturn;
};

export const courseModules: Module[] = [
  {
    id: 1,
    title: "Intro to Computers & Their Parts",
    content: `Welcome to the world of computers! A computer is an electronic device that processes data and performs tasks according to a set of instructions. Think of it as a super-fast calculator and filing cabinet combined. At its core, a computer has two main components: hardware and software. Hardware refers to the physical parts you can touch, like the monitor, keyboard, and mouse. Software is the set of instructions that tells the hardware what to do.

Let's break down the essential hardware components. The 'brain' of the computer is the Central Processing Unit (CPU). It performs all the calculations and executes commands. The faster the CPU, the more operations it can perform per second. Next is Random Access Memory (RAM), which is the computer's short-term memory. It holds the data and programs that are currently in use, allowing the CPU to access them quickly. When you open an application, it gets loaded into RAM. However, RAM is volatile, meaning it loses its data when the power is turned off.

For long-term storage, computers use a hard drive (HDD) or a solid-state drive (SSD). This is where your files, photos, applications, and the operating system are permanently stored. SSDs are much faster than traditional HDDs because they have no moving parts. Input devices allow you to interact with the computer. The most common are the keyboard for typing and the mouse (or trackpad) for pointing and clicking. Other examples include microphones, webcams, and scanners.

Output devices, on the other hand, show you the results of the computer's work. The monitor (or screen) displays visuals, speakers play audio, and printers create physical copies of documents. All these parts connect to the motherboard, a large circuit board that acts as the central hub, allowing all the components to communicate with each other. The power supply unit (PSU) provides electricity to all these parts.

Finally, software brings the hardware to life. The most important software is the Operating System (OS), such as Windows, macOS, or Linux. The OS manages all the hardware and software, provides a user interface, and allows you to run applications. Application software are programs designed for specific tasks, like web browsers (Google Chrome), word processors (Google Docs), and games. Understanding these basic parts will help you feel more comfortable and confident using any computer.`,
    youtubeLinks: [
        { title: "Computer Basics: Inside a Computer", url: "https://www.youtube.com/watch?v=Iy4iQvJo24U" },
        { title: "How a CPU Works", url: "https://www.youtube.com/watch?v=c3_U0sF60pA" }
    ],
    quiz: [
        { question: "What is considered the 'brain' of the computer?", options: ["RAM", "CPU", "Hard Drive", "Motherboard"], correctAnswer: "CPU" },
        { question: "Which component is used for short-term memory?", options: ["SSD", "CPU", "RAM", "Power Supply"], correctAnswer: "RAM" },
        { question: "What does an Operating System (OS) do?", options: ["Plays music", "Manages hardware and software", "Creates documents", "Connects to the internet"], correctAnswer: "Manages hardware and software" },
        { question: "Which of these is an input device?", options: ["Monitor", "Printer", "Speakers", "Keyboard"], correctAnswer: "Keyboard" },
        { question: "Where are files stored permanently?", options: ["RAM", "CPU", "Cache", "Hard Drive / SSD"], correctAnswer: "Hard Drive / SSD" },
        { question: "What does 'volatile' mean in the context of RAM?", options: ["It's very fast", "It's very expensive", "It loses data when power is off", "It can't be replaced"], correctAnswer: "It loses data when power is off" },
        { question: "Which part connects all the components together?", options: ["CPU", "RAM", "Motherboard", "Power Supply"], correctAnswer: "Motherboard" },
        { question: "An example of application software is:", options: ["Windows", "macOS", "A web browser", "A driver"], correctAnswer: "A web browser" },
        { question: "Which is a faster type of storage?", options: ["HDD", "SSD", "CD-ROM", "Floppy Disk"], correctAnswer: "SSD" },
        { question: "What is the main purpose of an output device?", options: ["To send instructions to the computer", "To store data permanently", "To show the results of the computer's work", "To provide power"], correctAnswer: "To show the results of the computer's work" }
    ],
  },
  {
    id: 2,
    title: "Google Docs",
    content: `Google Docs is a powerful, free word processor that runs in your web browser. It's part of Google's suite of online tools and is a fantastic alternative to traditional software like Microsoft Word. Because it's cloud-based, your documents are saved automatically to your Google Drive, and you can access them from any device with an internet connection. This eliminates the fear of losing your work if your computer crashes.

Getting started is simple. All you need is a Google account. Once you're in, you can create a new document from scratch or choose from a variety of templates for resumes, letters, and reports. The interface is clean and intuitive. At the top, you'll find a toolbar with all the essential formatting options. You can change fonts and sizes, make text bold, italic, or underlined, adjust alignment, and create bulleted or numbered lists. The 'Insert' menu allows you to add images, tables, drawings, charts, and links to your document, making it dynamic and visually appealing.

One of the standout features of Google Docs is collaboration. You can share your document with others by simply sending them a link. You have full control over their permissions: they can be viewers (can only read), commenters (can read and add comments), or editors (can make changes directly). When multiple people are in a document at the same time, you can see their cursors moving in real-time, making it feel like you're working together in the same room. The 'Comments' feature is great for feedback. You can highlight any part of the text and leave a comment or suggestion. The document owner can then resolve these comments once the feedback has been addressed.

Version history is another lifesaver. Google Docs automatically saves a complete history of all changes made to your document. You can go back in time to see who made what changes and when, and you can restore any previous version if you need to. This is incredibly useful for tracking progress and undoing mistakes without any fuss.

Beyond text, Google Docs has many other helpful features. The 'Tools' menu contains a spell checker, grammar checker, and a word counter. There's also a voice typing feature that lets you dictate your text, which can be much faster than typing. You can even use add-ons from the Google Workspace Marketplace to extend its functionality further, with tools for creating citations, diagrams, and more. Google Docs is more than just a place to type; it's a versatile tool for creating, collaborating, and sharing ideas effectively.`,
    youtubeLinks: [
        { title: "Google Docs Full Course", url: "https://www.youtube.com/watch?v=znSA2RqG_gY" },
        { title: "Top 10 Google Docs Tips", url: "https://www.youtube.com/watch?v=z8a_2L62s2g" }
    ],
    quiz: [
        { question: "What is the primary benefit of Google Docs being 'cloud-based'?", options: ["It works offline only", "Documents are saved automatically and accessible anywhere", "It's more expensive", "It has more fonts"], correctAnswer: "Documents are saved automatically and accessible anywhere" },
        { question: "What do you need to use Google Docs?", options: ["A Microsoft account", "A paid subscription", "A Google account", "Special software installation"], correctAnswer: "A Google account" },
        { question: "Which permission level allows a user to make direct changes to the document?", options: ["Viewer", "Commenter", "Editor", "Owner"], correctAnswer: "Editor" },
        { question: "What feature lets you see changes made over time?", options: ["Version History", "Toolbar", "Spell Check", "Add-ons"], correctAnswer: "Version History" },
        { question: "Where can you find options to change font size and alignment?", options: ["File Menu", "Insert Menu", "Toolbar", "Help Menu"], correctAnswer: "Toolbar" },
        { question: "Which of the following can you NOT insert into a Google Doc?", options: ["Images", "Tables", "Live video streams", "Links"], correctAnswer: "Live video streams" },
        { question: "The real-time collaboration feature allows you to:", options: ["See others' cursors as they type", "Lock the document completely", "Automatically print the document", "Send emails from the doc"], correctAnswer: "See others' cursors as they type" },
        { question: "What does the 'Voice Typing' feature do?", options: ["It reads the document aloud", "It checks for grammar errors", "It lets you dictate text with your voice", "It translates the text"], correctAnswer: "It lets you dictate text with your voice" },
        { question: "Add-ons from the Google Workspace Marketplace are used to:", options: ["Change the color scheme", "Extend the functionality of Google Docs", "Increase your storage space", "Chat with support"], correctAnswer: "Extend the functionality of Google Docs" },
        { question: "If your computer crashes while writing, what happens to your Google Doc?", options: ["It's deleted forever", "You lose all unsaved changes", "It's safe and saved in your Google Drive", "It becomes read-only"], correctAnswer: "It's safe and saved in your Google Drive" }
    ],
  },
   {
    id: 3,
    title: "Google Slides",
    content: `Google Slides is a versatile, cloud-based presentation tool that allows you to create and deliver compelling slideshows. Similar to Google Docs, it's a free part of Google's suite of web-based applications, making it a strong competitor to Microsoft PowerPoint. Its greatest advantage is its collaborative and accessible nature. Because presentations are saved to Google Drive, you can work on them from anywhere, on any device, and you never have to worry about saving your file or carrying around a USB drive.

Creating a presentation is straightforward. You start by choosing a theme, which provides a consistent design with pre-selected fonts and color schemes for your slides. The main workspace is divided into a central slide editor, a filmstrip view of all your slides on the left, and a speaker notes section at the bottom. The toolbar at the top contains all the tools you need to add and format content. You can insert text boxes, images, videos from YouTube, shapes, and tables. Each element can be resized, rotated, and positioned with ease.

Google Slides truly shines in its collaborative capabilities. You can share your presentation with teammates, allowing them to edit, view, or comment in real-time. This is perfect for group projects, as everyone can work on their respective slides simultaneously. You can see who is currently in the presentation and what they are working on. The comment feature allows for targeted feedback on specific elements, and the revision history tracks every change, so you can revert to a previous state if needed.

When it's time to present, Google Slides offers a robust presenter view. This mode displays your current slide to the audience, while on your screen, you can see a preview of the next slide, your speaker notes, and a timer. A particularly engaging feature is the live Q&A. You can share a link with your audience, allowing them to submit questions from their devices during your presentation. These questions appear in your presenter view, and you can choose which ones to display on the main screen for everyone to see and discuss.

Beyond the basics, Google Slides has powerful features to make your presentations more dynamic. You can add transitions between slides and animate individual objects to control how they appear. You can link to other slides within the presentation, external websites, or even other Google Drive files. For those who want to push creativity further, you can edit the 'Theme builder' (formerly Master Slide) to create a custom, reusable presentation layout that ensures consistency across all slides. Whether for a school project, a business pitch, or a personal story, Google Slides provides all the tools you need to design, collaborate on, and deliver a professional and impactful presentation.`,
    youtubeLinks: [
        { title: "The Beginner's Guide to Google Slides", url: "https://www.youtube.com/watch?v=uTr_I2a_f4" },
        { title: "10 Google Slides Tips & Tricks", url: "https://www.youtube.com/watch?v=Vl3a-3SS8Yc" }
    ],
    quiz: [
        { question: "Google Slides is a tool for creating what?", options: ["Spreadsheets", "Documents", "Presentations", "Databases"], correctAnswer: "Presentations" },
        { question: "What is the main advantage of Google Slides being cloud-based?", options: ["It has more animations", "It's accessible from any device and saves automatically", "It requires a powerful computer", "It only works offline"], correctAnswer: "It's accessible from any device and saves automatically" },
        { question: "What feature provides a consistent design for your presentation?", options: ["Theme", "Toolbar", "Speaker Notes", "Q&A"], correctAnswer: "Theme" },
        { question: "In Presenter View, what can the presenter see that the audience cannot?", options: ["The current slide", "Your speaker notes and the next slide", "Embedded videos", "The presentation title"], correctAnswer: "Your speaker notes and the next slide" },
        { question: "The live Q&A feature allows the audience to:", options: ["Edit your slides directly", "Submit questions from their own devices", "Clap virtually", "Change the presentation theme"], correctAnswer: "Submit questions from their own devices" },
        { question: "To ensure a consistent layout across all slides, you can edit the:", options: ["Toolbar", "Theme builder", "Speaker notes", "File menu"], correctAnswer: "Theme builder" },
        { question: "Which of these can you insert into a Google Slide?", options: ["Text boxes", "YouTube videos", "Shapes", "All of the above"], correctAnswer: "All of the above" },
        { question: "Real-time collaboration in Google Slides means:", options: ["Only one person can edit at a time", "Multiple people can edit the same presentation simultaneously", "You have to save after every change", "You must email the file to others"], correctAnswer: "Multiple people can edit the same presentation simultaneously" },
        { question: "What is the 'filmstrip' view?", options: ["A view of all your slides on the side", "A way to add movie clips", "A special animation effect", "The presenter view"], correctAnswer: "A view of all your slides on the side" },
        { question: "Transitions are effects that happen:", options: ["When an object appears on a slide", "When you move from one slide to the next", "When you type text", "When you end the presentation"], correctAnswer: "When you move from one slide to the next" }
    ],
  },
  {
    id: 4,
    title: "Google Sheets",
    content: `Google Sheets is a cloud-based spreadsheet application that is part of Google's free, web-based software office suite. It allows users to create, update, and analyze data in a structured format. Just like Docs and Slides, its primary strength lies in its collaborative features and accessibility from any device with an internet connection. It is an excellent tool for everything from simple to-do lists and budgeting to complex data analysis and project management.

The basic layout of Google Sheets is a grid of cells, organized into rows (numbered) and columns (lettered). Each cell can hold data, such as text, numbers, dates, or formulas. This grid structure is perfect for organizing information in a clear and logical way. You can format cells by changing their background color, font style, and number format (e.g., currency, percentage). You can also resize columns and rows, and freeze certain rows or columns so they remain visible as you scroll—a handy feature for keeping headers in view.

The true power of Google Sheets comes from its ability to perform calculations using formulas and functions. A formula always starts with an equals sign (=) and can perform mathematical operations, like =A1+B1, which adds the values in cells A1 and B1. Google Sheets also has hundreds of built-in functions for more complex tasks. For example, the SUM() function can add a whole range of cells, AVERAGE() can find the average, and COUNT() can count the number of cells with numbers. Mastering a few basic functions can save you an enormous amount of time and effort.

Data visualization is another key feature. You can turn your raw data into professional-looking charts and graphs with just a few clicks. Select the data you want to visualize, and Google Sheets will suggest chart types—like pie charts, bar graphs, and line charts—that best represent your information. These charts are dynamic, meaning they will automatically update if you change the underlying data. This makes it easy to spot trends, patterns, and insights that might be hidden in a table of numbers.

Collaboration in Sheets is seamless. Multiple users can work on the same spreadsheet at the same time. You can see their changes live, and there's a built-in chat feature for quick discussions. You can also protect certain cells or entire sheets to prevent accidental edits while still allowing collaborators to work on other parts of the spreadsheet. Like other Google apps, Sheets has a detailed revision history, so you can track changes and restore older versions. For more advanced users, Google Sheets can be extended with add-ons and even custom scripts using Google Apps Script to automate repetitive tasks and connect with other services.`,
    youtubeLinks: [
        { title: "Google Sheets for Beginners", url: "https://www.youtube.com/watch?v=d13g9E2y9g" },
        { title: "10 Functions in Google Sheets", url: "https://www.youtube.com/watch?v=Jb-g_fIqBvA" }
    ],
    quiz: [
        { question: "What is a 'cell' in Google Sheets?", options: ["An entire row", "An entire column", "A single box in the grid for holding data", "A type of chart"], correctAnswer: "A single box in the grid for holding data" },
        { question: "Every formula in Google Sheets must begin with what symbol?", options: ["@", "#", "$", "="], correctAnswer: "=" },
        { question: "What does the SUM() function do?", options: ["Finds the average of a range", "Counts the number of cells", "Adds up the values in a range of cells", "Sorts the data"], correctAnswer: "Adds up the values in a range of cells" },
        { question: "The feature that keeps headers visible as you scroll is called:", options: ["Locking", "Hiding", "Freezing", "Merging"], correctAnswer: "Freezing" },
        { question: "How can you turn data into a visual representation like a bar graph?", options: ["By using formulas", "By creating a chart", "By freezing panes", "By protecting the sheet"], correctAnswer: "By creating a chart" },
        { question: "What happens to a chart if you change the data it's based on?", options: ["It gets deleted", "It stays the same", "It updates automatically", "You have to recreate it"], correctAnswer: "It updates automatically" },
        { question: "Protecting a range of cells is useful for:", options: ["Making them look nicer", "Preventing accidental edits by collaborators", "Hiding them from view", "Adding them up automatically"], correctAnswer: "Preventing accidental edits by collaborators" },
        { question: "Rows in Google Sheets are identified by:", options: ["Letters", "Numbers", "Roman numerals", "Symbols"], correctAnswer: "Numbers" },
        { question: "Columns in Google Sheets are identified by:", options: ["Letters", "Numbers", "Colors", "Names"], correctAnswer: "Letters" },
        { question: "An example of a cell address is:", options: ["123", "A", "A1", "Row 1"], correctAnswer: "A1" }
    ],
  },
  {
    id: 5,
    title: "Google Keep",
    content: `Google Keep is a simple yet powerful note-taking and organization tool from Google. It's designed for capturing ideas, thoughts, and to-do lists quickly and easily. Unlike more complex note apps, Keep's strength is its simplicity and visual, card-based interface, which feels like a virtual bulletin board of sticky notes. It's accessible via the web and as a mobile app, and everything you create is instantly synced across all your devices through your Google account.

The main interface displays your notes as individual cards. You can create a new note by simply starting to type in the "Take a note..." box. Each note can be more than just plain text. You can create checklists for tasks, add images to a note (and Keep can even transcribe text from the image), and make quick voice memos which are automatically transcribed for you. This makes it incredibly versatile for capturing information in whatever form it comes to you.

Organization is a key feature of Google Keep. You can color-code your notes to visually categorize them at a glance—for example, blue for work tasks, yellow for personal reminders, and green for creative ideas. You can also add labels (similar to tags or folders) to group related notes together. For instance, you could have a "Projects" label for all your project-related notes or a "Shopping" label for all your grocery lists. The search function is robust, allowing you to find notes by color, label, content type (like notes with images or lists), or keywords within the text.

One of the most practical features is the ability to set reminders. A reminder can be time-based, alerting you at a specific date and time, or location-based. A location-based reminder is particularly clever; you can set a note to pop up when you arrive at a specific place, like reminding you to buy milk when you get to the grocery store. This turns your notes from passive containers of information into active assistants.

Collaboration is also built into Google Keep. You can share any note with another Google user, allowing them to view and edit it. This is perfect for shared shopping lists, collaborative brainstorming, or planning a trip with someone. Everyone with access can add, edit, and check off items in real-time. Finally, Google Keep is integrated with other Google services. You can easily copy your notes to a Google Doc for more formal writing or access your Keep notes directly from a sidebar in Gmail, Google Calendar, and Google Docs, allowing you to seamlessly pull your ideas into your workflow. Its simplicity is not a limitation but its greatest asset, making it the perfect tool for quick, everyday organization.`,
    youtubeLinks: [
        { title: "Google Keep Tutorial", url: "https://www.youtube.com/watch?v=L45k8qJ8_Y" },
        { title: "15 Google Keep Tips", url: "https://www.youtube.com/watch?v=8ah5L3Tr88Q" }
    ],
    quiz: [
        { question: "What is the main interface of Google Keep based on?", options: ["A calendar", "A word document", "A virtual bulletin board of cards/notes", "A spreadsheet"], correctAnswer: "A virtual bulletin board of cards/notes" },
        { question: "Besides text, what can you add to a Google Keep note?", options: ["Checklists", "Images", "Voice memos", "All of the above"], correctAnswer: "All of the above" },
        { question: "How can you visually categorize notes in Keep?", options: ["By changing the font", "By color-coding them", "By making them bold", "By resizing them"], correctAnswer: "By color-coding them" },
        { question: "What is a 'label' used for in Google Keep?", options: ["To set a reminder", "To change the note's color", "To group related notes together", "To print the note"], correctAnswer: "To group related notes together" },
        { question: "A location-based reminder will alert you when you:", options: ["Reach a specific place", "Are running late", "Open the app", "Finish a task"], correctAnswer: "Reach a specific place" },
        { question: "What happens when you share a note with someone in Google Keep?", options: ["They can only view it", "They can view and edit it", "It sends them a copy via email", "It posts the note publicly"], correctAnswer: "They can view and edit it" },
        { question: "What useful feature does Keep have for images you add?", options: ["It can animate them", "It can improve the image quality", "It can transcribe text from within the image", "It can turn them into drawings"], correctAnswer: "It can transcribe text from within the image" },
        { question: "Google Keep integrates with other Google services like:", options: ["Google Maps only", "YouTube only", "Gmail, Google Calendar, and Google Docs", "It is a standalone app with no integrations"], correctAnswer: "Gmail, Google Calendar, and Google Docs" },
        { question: "What happens to a voice memo you record in Keep?", options: ["It's saved as an audio file only", "It is automatically transcribed into text", "It can only be 10 seconds long", "It gets deleted after 24 hours"], correctAnswer: "It is automatically transcribed into text" },
        { question: "Google Keep is best suited for:", options: ["Writing novels", "Complex data analysis", "Quick notes, ideas, and to-do lists", "Creating video presentations"], correctAnswer: "Quick notes, ideas, and to-do lists" }
    ],
  },
  {
    id: 6,
    title: "Introduction to AI",
    content: `Artificial Intelligence, or AI, is a fascinating and rapidly growing field of computer science. In simple terms, AI refers to the simulation of human intelligence in machines that are programmed to think, learn, and problem-solve like humans. The goal of AI is to create systems that can perform tasks that would normally require human intelligence, such as understanding language, recognizing images, making decisions, and even creating art.

There are two main types of AI: Narrow AI and General AI. Narrow AI, also known as Weak AI, is what we see all around us today. These AI systems are designed and trained for one particular task. Examples include virtual assistants like Siri and Alexa, facial recognition software, recommendation engines on Netflix and Amazon, and self-driving cars. They can perform their specific tasks incredibly well, often better than humans, but they cannot operate outside of their limited context. For instance, an AI that is an expert at playing chess cannot give you a weather forecast.

General AI, or Strong AI, is the more futuristic concept of a machine with the ability to understand, learn, and apply its intelligence to solve any problem, much like a human being. This type of AI would have consciousness, self-awareness, and the ability to think abstractly. We are still a long way from achieving General AI, and it remains largely in the realm of science fiction for now.

So, how does AI 'learn'? A major subfield of AI is called Machine Learning (ML). Instead of being explicitly programmed with rules for a task, an ML system is 'trained' by being fed huge amounts of data. It learns to identify patterns and make predictions from that data. For example, to train an AI to recognize cats in photos, developers would show it millions of pictures, some with cats and some without, labeling which is which. The AI adjusts its internal parameters until it can accurately identify cats in new, unseen photos.

Another exciting area is Natural Language Processing (NLP), which gives machines the ability to understand, interpret, and generate human language. This is the technology behind chatbots, language translation services like Google Translate, and spam filters in your email. Deep Learning, a subset of machine learning, uses complex neural networks with many layers to process data, inspired by the structure of the human brain. This has led to major breakthroughs in image and speech recognition. AI is no longer just a concept from movies; it's a powerful tool that is transforming industries and changing how we interact with technology in our daily lives.`,
    youtubeLinks: [
        { title: "What is Artificial Intelligence?", url: "https://www.youtube.com/watch?v=ad79nYk2keg" },
        { title: "How AI and Machine Learning Work", url: "https://www.youtube.com/watch?v=R9OHn5ZF4Uo" }
    ],
    quiz: [
        { question: "What is the primary goal of Artificial Intelligence?", options: ["To replace all human jobs", "To simulate human intelligence in machines", "To create better video games", "To build physical robots"], correctAnswer: "To simulate human intelligence in machines" },
        { question: "The AI we use today, like virtual assistants, is known as:", options: ["General AI", "Strong AI", "Super AI", "Narrow AI"], correctAnswer: "Narrow AI" },
        { question: "What is a key characteristic of Narrow AI?", options: ["It has consciousness", "It is designed for one specific task", "It can solve any problem", "It is self-aware"], correctAnswer: "It is designed for one specific task" },
        { question: "The concept of a machine with human-like intelligence is called:", options: ["Machine Learning", "Narrow AI", "General AI", "Natural Language Processing"], correctAnswer: "General AI" },
        { question: "How does a Machine Learning system 'learn'?", options: ["By being programmed with explicit rules", "By reading books", "By being trained on large amounts of data", "By asking questions"], correctAnswer: "By being trained on large amounts of data" },
        { question: "What is Natural Language Processing (NLP)?", options: ["The process of learning a new language", "The ability of machines to understand and generate human language", "A type of computer hardware", "A method for data storage"], correctAnswer: "The ability of machines to understand and generate human language" },
        { question: "Which of the following is an application of AI?", options: ["Facial recognition", "Spam filters", "Recommendation engines", "All of the above"], correctAnswer: "All of the above" },
        { question: "Deep Learning uses a structure inspired by what?", options: ["The solar system", "A library", "The human brain", "A car engine"], correctAnswer: "The human brain" },
        { question: "An AI that plays chess cannot also give you a weather forecast. This is an example of the limitation of:", options: ["General AI", "Narrow AI", "Human intelligence", "Computer storage"], correctAnswer: "Narrow AI" },
        { question: "What is a subfield of AI that involves training models on data?", options: ["Computer Graphics", "Cybersecurity", "Machine Learning", "Network Administration"], correctAnswer: "Machine Learning" }
    ],
  }
];

export const glossaryTerms: GlossaryTerm[] = [
  { term: "AI (Artificial Intelligence)", definition: "The simulation of human intelligence in machines, enabling them to learn, reason, and perform tasks." },
  { term: "CPU (Central Processing Unit)", definition: "The primary component of a computer that performs most of the processing; often called the 'brain' of the computer." },
  { term: "RAM (Random Access Memory)", definition: "A computer's short-term, volatile memory where data is stored for quick access by the CPU." },
  { term: "SSD (Solid-State Drive)", definition: "A modern storage device that uses flash memory to store data persistently, much faster than a traditional hard drive." },
  { term: "Operating System (OS)", definition: "Software that manages all computer hardware and software resources, and provides common services for computer programs." },
  { term: "Cloud-Based", definition: "Refers to applications and services that are run on the internet ('the cloud') instead of being stored locally on a device." },
  { term: "Collaboration (in software)", definition: "The feature that allows multiple users to work on the same file at the same time from different locations." },
  { term: "Version History", definition: "A feature that automatically tracks and saves past changes to a document, allowing users to review or restore previous versions." },
  { term: "Formula (in spreadsheets)", definition: "An expression that calculates the value of a cell, usually starting with an equals sign (=)." },
  { term: "Function (in spreadsheets)", definition: "A predefined formula that performs a specific calculation, such as SUM() or AVERAGE()." },
  { term: "Cell (in spreadsheets)", definition: "A single box within a spreadsheet grid where data can be entered, identified by its column letter and row number (e.g., A1)." },
  { term: "Theme (in presentations)", definition: "A predefined set of colors, fonts, and layouts that provides a consistent design to a presentation." },
  { term: "Transition (in presentations)", definition: "A visual effect that occurs when moving from one slide to the next." },
  { term: "Label (in Google Keep)", definition: "A tag used to categorize and organize notes, similar to a folder." },
  { term: "Machine Learning (ML)", definition: "A subset of AI where systems learn and improve from experience (data) without being explicitly programmed." },
  { term: "Natural Language Processing (NLP)", definition: "A field of AI that enables computers to understand, interpret, and generate human language." },
  { term: "Hardware", definition: "The physical components of a computer system, such as the monitor, keyboard, and internal parts." },
  { term: "Software", definition: "The set of instructions, data, or programs used to operate computers and execute specific tasks." },
];