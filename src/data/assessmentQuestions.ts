export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillQuiz {
  skillName: string;
  timeLimitSeconds: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export const SKILL_QUIZZES: Record<string, SkillQuiz> = {
  'Python': {
    skillName: 'Python',
    timeLimitSeconds: 120,
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'What is the output of the following list comprehension in Python 3?',
        codeSnippet: `nums = [1, 2, 3, 4]
res = [x * 2 for x in nums if x % 2 == 0]
print(res)`,
        options: ['[2, 4, 6, 8]', '[4, 8]', '[2, 6]', '[4, 6]'],
        correctIndex: 1,
        explanation: 'The condition `x % 2 == 0` filters for even numbers (2, 4), and then each is multiplied by 2, yielding [4, 8].',
      },
      {
        id: 2,
        question: 'Which built-in function or mechanism is used to implement generator iterators in Python?',
        options: ['return statement', 'yield keyword', 'async keyword', 'lambda function'],
        correctIndex: 1,
        explanation: 'The `yield` keyword pauses function execution and emits a value, turning the function into a generator iterator.',
      },
      {
        id: 3,
        question: 'What is the time complexity of looking up a key in a standard Python dictionary (dict) on average?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correctIndex: 2,
        explanation: 'Python dictionaries are implemented as hash tables, yielding average O(1) constant time lookups.',
      },
      {
        id: 4,
        question: 'How do decorators work in Python?',
        options: [
          'They compile Python to C++ bytecode.',
          'They are callables that accept a function and return a modified or wrapped function.',
          'They are only used for class inheritance.',
          'They prevent garbage collection on specified variables.',
        ],
        correctIndex: 1,
        explanation: 'A decorator takes a target callable as input, wraps its execution or modifies behavior, and returns the enhanced callable.',
      },
    ],
  },
  'React': {
    skillName: 'React',
    timeLimitSeconds: 120,
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'When does useEffect with an empty dependency array `[]` execute in React 18/19?',
        options: [
          'Before the initial DOM mount only.',
          'After the component mounts on the client.',
          'On every single state mutation.',
          'Only when parent props change.',
        ],
        correctIndex: 1,
        explanation: 'An empty dependency array causes the effect to execute once after the initial component commit to the DOM.',
      },
      {
        id: 2,
        question: 'Why should keys in list rendering be stable and unique rather than array indices when items can reorder?',
        options: [
          'Indices cause CSS styling collisions.',
          'Indices break React reconciliation algorithm when items are added, deleted, or shifted.',
          'React does not allow numeric keys.',
          'Indices consume more memory in the Virtual DOM.',
        ],
        correctIndex: 1,
        explanation: 'Using array indices as keys when list order can change causes subtle UI state bugs and suboptimal DOM re-renders.',
      },
      {
        id: 3,
        question: 'What is the primary benefit of the React `useMemo` hook?',
        options: [
          'It replaces the Redux store completely.',
          'It caches the calculated result of expensive operations between re-renders unless dependencies change.',
          'It forces synchronous DOM manipulation.',
          'It creates an immutable copy of the window object.',
        ],
        correctIndex: 1,
        explanation: '`useMemo` memoizes pure computational calculations to avoid repeating them on unrelated renders.',
      },
      {
        id: 4,
        question: 'What rule must be followed when invoking React Hooks?',
        options: [
          'Call them inside loops or nested conditionals for efficiency.',
          'Call them only at the top level of React function components or custom hooks.',
          'Call them strictly inside class lifecycle methods.',
          'Always invoke them within setTimeout callbacks.',
        ],
        correctIndex: 1,
        explanation: 'Hooks must always be invoked at the top level to guarantee that React preserves hook state order across renders.',
      },
    ],
  },
  'JavaScript': {
    skillName: 'JavaScript',
    timeLimitSeconds: 120,
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'What is the difference between `==` and `===` in JavaScript?',
        options: [
          'No difference; they are aliases.',
          '`==` performs type coercion before comparison; `===` checks both value and type strictly.',
          '`===` is deprecated in modern ESNext.',
          '`==` checks memory references while `===` checks primitive value.',
        ],
        correctIndex: 1,
        explanation: 'Strict equality (`===`) checks that both operands have the identical type and value without implicit coercion.',
      },
      {
        id: 2,
        question: 'What does the JavaScript Event Loop do when a Microtask (e.g. Promise.then) and a Macrotask (e.g. setTimeout) are both queued?',
        options: [
          'Macrotasks always execute before microtasks.',
          'All microtasks in the microtask queue are drained before the next macrotask is executed.',
          'They run concurrently on separate CPU cores.',
          'The browser pauses until garbage collection finishes.',
        ],
        correctIndex: 1,
        explanation: 'Microtasks (Promises, queueMicrotask) have priority and run immediately after the current call stack clears before the next macrotask (setTimeout).',
      },
      {
        id: 3,
        question: 'What is a Closure in JavaScript?',
        options: [
          'A method to close browser tabs programmatically.',
          'A function bundled together with references to its surrounding lexical environment.',
          'A syntax error caused by unmatched braces.',
          'An encrypted payload sent over HTTPS.',
        ],
        correctIndex: 1,
        explanation: 'Closures give an inner function access to an outer function’s scope even after the outer function has returned.',
      },
      {
        id: 4,
        question: 'What does `Promise.all()` do if one of the promises rejects?',
        options: [
          'It ignores the rejected promise and returns the rest.',
          'It immediately rejects with the error of that first rejected promise (fail-fast).',
          'It retries the failed promise 3 times.',
          'It converts the error into null.',
        ],
        correctIndex: 1,
        explanation: '`Promise.all` fails fast: if any promise rejects, the entire returned promise rejects immediately.',
      },
    ],
  },
  'SQL': {
    skillName: 'SQL',
    timeLimitSeconds: 120,
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'Which SQL clause is used to filter records aggregated by a GROUP BY statement?',
        options: ['WHERE', 'HAVING', 'FILTER BY', 'ORDER BY'],
        correctIndex: 1,
        explanation: '`HAVING` filters aggregated grouped rows, whereas `WHERE` filters individual rows prior to grouping.',
      },
      {
        id: 2,
        question: 'What does an INNER JOIN return?',
        options: [
          'All records from the left table and matched from the right table.',
          'All records when there is a match in either left or right table.',
          'Only rows where there is a matching value in both joined tables.',
          'The Cartesian product of both tables.',
        ],
        correctIndex: 2,
        explanation: 'INNER JOIN selects records that have matching values in both datasets.',
      },
      {
        id: 3,
        question: 'What database mechanism is primarily used to speed up SELECT query search performance?',
        options: ['FOREIGN KEY constraints', 'Database Indexes (e.g. B-Tree)', 'Triggers', 'Views'],
        correctIndex: 1,
        explanation: 'Indexes create efficient lookup trees (like B-trees) that prevent full table scans.',
      },
      {
        id: 4,
        question: 'What does the ACID property "Isolation" guarantee in transactional databases?',
        options: [
          'Data is backed up on isolated physical disks.',
          'Concurrent transactions execute without interfering with one another.',
          'Transactions run strictly in isolation from network firewalls.',
          'Only one user can log into the database at any moment.',
        ],
        correctIndex: 1,
        explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state as if executed serially.',
      },
    ],
  },
  'Node.js': {
    skillName: 'Node.js',
    timeLimitSeconds: 120,
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'How does Node.js handle high volumes of concurrent I/O operations despite being single-threaded?',
        options: [
          'It spawns a new OS thread for every HTTP request.',
          'Via a non-blocking asynchronous event loop backed by libuv and thread pool for heavy OS operations.',
          'By compiling JavaScript directly to assembly on each request.',
          'It delegates all execution to the client web browser.',
        ],
        correctIndex: 1,
        explanation: 'Node.js uses an event-driven, non-blocking I/O model supported by the libuv library.',
      },
      {
        id: 2,
        question: 'What is the purpose of middleware in Express.js?',
        options: [
          'To connect directly to hardware graphics cards.',
          'Functions that have access to the request object (req), response object (res), and the next middleware function.',
          'To encrypt the source code files.',
          'To prevent client cookies from expiring.',
        ],
        correctIndex: 1,
        explanation: 'Middleware functions execute during the lifecycle of a request, performing tasks like auth, logging, or data transformation before handing off with next().',
      },
      {
        id: 3,
        question: 'Why should you avoid synchronous operations like `fs.readFileSync` in production request handlers?',
        options: [
          'They are not supported in ES6.',
          'They block the single Node.js main thread, freezing all concurrent incoming user requests.',
          'They always corrupt file contents.',
          'They require root privileges.',
        ],
        correctIndex: 1,
        explanation: 'Blocking calls stop the event loop from servicing any other network requests or timers until completion.',
      },
      {
        id: 4,
        question: 'Which core module is commonly used in Node.js for cryptographic hashing and token signing?',
        options: ['http', 'crypto', 'path', 'events'],
        correctIndex: 1,
        explanation: 'The `crypto` module provides cryptographic functions, including OpenSSL hash, HMAC, cipher, and decipher methods.',
      },
    ],
  },
};
