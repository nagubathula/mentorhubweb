-- Migration to add index_code and seed the full course catalog

ALTER TABLE courses ADD COLUMN IF NOT EXISTS index_code text;

-- Clear existing mock courses if any (optional, but keep it clean)
-- DELETE FROM courses WHERE mentor_id IS NULL; 

-- Seed Software Courses
INSERT INTO courses (title, index_code, description, content, status) VALUES
('UX Design', 'UXD-101', 'Introduction to UX, User Research, Wireframing, and Testing.', '[
  {"id": "UXD-101.1", "title": "Introduction to UX", "topics": ["What is UX", "UX vs UI", "Design Thinking"]},
  {"id": "UXD-101.2", "title": "User Research", "topics": ["Interviews", "Surveys", "Personas"]},
  {"id": "UXD-101.3", "title": "Wireframing", "topics": ["Low Fidelity", "High Fidelity", "Prototyping"]},
  {"id": "UXD-101.4", "title": "Testing", "topics": ["Usability Testing", "A/B Testing", "Heuristic Evaluation"]}
]'::jsonb, 'Active'),

('Python Programming', 'PY-201', 'Basics, Control Flow, Advanced concepts, and Libraries.', '[
  {"id": "PY-201.1", "title": "Basics", "topics": ["Syntax", "Variables", "Data Types"]},
  {"id": "PY-201.2", "title": "Control Flow", "topics": ["If Statements", "Loops", "Functions"]},
  {"id": "PY-201.3", "title": "Advanced", "topics": ["OOP", "File Handling", "Exception Handling"]},
  {"id": "PY-201.4", "title": "Libraries", "topics": ["NumPy", "Pandas", "API Call"]}
]'::jsonb, 'Active'),

('Web Development', 'WEB-301', 'Frontend, Frameworks, and Backend Development.', '[
  {"id": "WEB-301.1", "title": "Frontend", "topics": ["HTML", "CSS", "JavaScript"]},
  {"id": "WEB-301.2", "title": "Frameworks", "topics": ["React Basics", "Components", "State Management"]},
  {"id": "WEB-301.3", "title": "Backend", "topics": ["Node.js", "APIs", "Authentication"]}
]'::jsonb, 'Active'),

('Data Science', 'DS-401', 'Data Analysis and Machine Learning.', '[
  {"id": "DS-401.1", "title": "Data Analysis", "topics": ["Data Cleaning", "Data Visualization", "Statistics"]},
  {"id": "DS-401.2", "title": "Machine Learning", "topics": ["Regression", "Classification", "Clustering"]}
]'::jsonb, 'Active');

-- Seed ECE Courses
INSERT INTO courses (title, index_code, description, content, status) VALUES
('Basic Electronics', 'ECE-101', 'Fundamentals, Components, and Circuit Analysis.', '[
  {"id": "ECE-101.1", "title": "Fundamentals", "topics": ["Voltage & Current", "Ohm’s Law", "Kirchhoff’s Laws"]},
  {"id": "ECE-101.2", "title": "Components", "topics": ["Resistors", "Capacitors", "Inductors"]},
  {"id": "ECE-101.3", "title": "Circuit Analysis", "topics": ["Series Circuits", "Parallel Circuits", "Network Theorems"]}
]'::jsonb, 'Active'),

('Digital Electronics', 'ECE-201', 'Logic Basics, Combinational and Sequential Circuits.', '[
  {"id": "ECE-201.1", "title": "Logic Basics", "topics": ["Boolean Algebra", "Logic Gates", "Truth Tables"]},
  {"id": "ECE-201.2", "title": "Combinational Circuits", "topics": ["Adders", "Multiplexers", "Encoders"]},
  {"id": "ECE-201.3", "title": "Sequential Circuits", "topics": ["Flip-Flops", "Counters", "Registers"]}
]'::jsonb, 'Active'),

('Communication Systems', 'ECE-301', 'Analog and Digital Communication.', '[
  {"id": "ECE-301.1", "title": "Analog Communication", "topics": ["AM", "FM", "Noise"]},
  {"id": "ECE-301.2", "title": "Digital Communication", "topics": ["PCM", "Modulation", "Error Detection"]}
]'::jsonb, 'Active'),

('Microprocessors & Microcontrollers', 'ECE-401', 'Architecture, Instruction Set, and Arduino Interfacing.', '[
  {"id": "ECE-401.1", "title": "Basics", "topics": ["Architecture", "Instruction Set", "Assembly Language"]},
  {"id": "ECE-401.2", "title": "Microcontrollers", "topics": ["Arduino Uno", "Embedded C", "Interfacing"]}
]'::jsonb, 'Active'),

('Signals & Systems', 'ECE-501', 'Signals, Systems, and Transformations.', '[
  {"id": "ECE-501.1", "title": "Signals", "topics": ["Continuous Signals", "Discrete Signals", "Transformations"]},
  {"id": "ECE-501.2", "title": "Systems", "topics": ["LTI Systems", "Convolution", "Fourier Transform"]}
]'::jsonb, 'Active'),

('VLSI Design', 'ECE-601', 'CMOS Basics and Design Flow.', '[
  {"id": "ECE-601.1", "title": "Basics", "topics": ["CMOS", "Fabrication", "Design Flow"]},
  {"id": "ECE-601.2", "title": "Design", "topics": ["Logic Design", "Layout Design", "Testing"]}
]'::jsonb, 'Active');
