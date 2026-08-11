import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are KindMentor's AI Learning Assistant. You act as an encouraging, expert, step-by-step academic tutor for students studying computer science, engineering, software development, mathematics, and general academic subjects.

Guidelines for your responses:
1. Explain concepts in clear, simple, and engaging language.
2. For programming and coding doubts, provide clean, well-commented code blocks alongside step-by-step explanations of how the code works.
3. Use real-world examples and analogies whenever helpful.
4. Encourage understanding rather than just giving direct answers.
5. If the student's question is vague, ambiguous, or lacks context, politely ask for clarification.
6. Use markdown formatting (bolding, bullet points, numbered lists, and fenced code blocks with language identifiers) to make answers easy to read.
7. Maintain a supportive, friendly, and patient tone.`

// Intelligent educational fallback generator when external API is unreachable or unconfigured
function generateFallbackResponse(userPrompt: string, courseContext?: string): string {
  const query = userPrompt.toLowerCase().trim()
  const contextStr = (courseContext || '').toLowerCase()

  if (query.includes('mosfet') || query.includes('transistor') || (contextStr.includes('vlsi') && (query.includes('fet') || query.includes('cmos')))) {
    return `### ⚡ MOSFET Explained Simply (VLSI & Semiconductor Context)

A **MOSFET** (Metal-Oxide-Semiconductor Field-Effect Transistor) is the fundamental building block of modern digital VLSI circuits and microprocessors. It acts as a voltage-controlled electronic switch.

---

#### 🔌 Key Terminals:
1. **Gate ($G$)**: The control terminal. Applying a voltage creates an electric field to open/close the channel.
2. **Drain ($D$)**: The terminal where current leaves the channel.
3. **Source ($S$)**: The terminal where charge carriers enter the channel.
4. **Body / Substrate ($B$)**: The silicon base supporting the transistor.

---

#### 💡 Simple Water Tap Analogy:
- **Gate** = The tap handle (turning it controls flow).
- **Source** = Water pipe coming in.
- **Drain** = Water exiting the tap.
- **Gate Voltage ($V_{GS}$)** = Turning the handle to let current (water) flow!

---

#### 📐 CMOS Logic in VLSI Design:
In VLSI, we combine **NMOS** (turns ON with HIGH voltage) and **PMOS** (turns ON with LOW voltage) to create **CMOS** logic gates, which consume almost zero static power!`
  }

  if (query.includes('python') && (query.includes('loop') || query.includes('for') || query.includes('while'))) {
    return `### 🐍 Python Loops Explained Simply

In Python, **loops** allow you to repeat a block of code multiple times automatically. There are two main types of loops:

---

#### 1. \`for\` Loop
A \`for\` loop is used to iterate over a sequence (like a list, range, or string).

\`\`\`python
# Example: Printing numbers from 1 to 5
for i in range(1, 6):
    print(f"Iteration number: {i}")

# Example: Iterating through a list of fruits
fruits = ["Apple", "Banana", "Mango"]
for fruit in fruits:
    print(f"I like {fruit}")
\`\`\`

---

#### 2. \`while\` Loop
A \`while\` loop keeps running as long as a condition evaluates to **True**.

\`\`\`python
count = 1
while count <= 3:
    print(f"Count is {count}")
    count += 1  # Increment to prevent an infinite loop!
\`\`\`

---

💡 **Key Tip:** Remember to always update your loop variable in a \`while\` loop to prevent infinite loops!`
  }

  if (query.includes('machine learning') || query.includes('ml')) {
    return `### 🤖 What is Machine Learning?

**Machine Learning (ML)** is a branch of Artificial Intelligence (AI) where computer systems learn from data to make predictions or decisions without being explicitly programmed for every scenario.

---

#### 🔍 3 Main Types of Machine Learning:

1. **Supervised Learning**: The model learns from labeled data (inputs and correct outputs).
   * *Example:* Email spam detection (Labeled as "Spam" or "Not Spam").
2. **Unsupervised Learning**: The model finds hidden patterns in unlabeled data.
   * *Example:* Customer segmentation based on shopping behavior.
3. **Reinforcement Learning**: The agent learns through trial-and-error using rewards and penalties.
   * *Example:* AI playing chess or training autonomous vehicles.

---

💡 **Analogy:** Think of ML like learning to ride a bicycle. Rather than reading a manual of instructions, your brain learns through practice, feedback, and balance adjustments over time!`
  }

  if (query.includes('dbms') || query.includes('normalisation') || query.includes('normalization') || query.includes('database')) {
    return `### 🗄️ DBMS Normalization Explained

**Normalization** in Database Management Systems (DBMS) is the process of organizing table columns and relations to **reduce data redundancy** and improve data integrity.

---

#### 📊 Normal Forms (NF):

* **1NF (First Normal Form)**:
  - Each table column must contain atomic (indivisible) values.
  - No repeating groups or arrays in columns.

* **2NF (Second Normal Form)**:
  - Must be in **1NF**.
  - All non-key attributes must depend on the *entire* primary key (eliminates partial dependency).

* **3NF (Third Normal Form)**:
  - Must be in **2NF**.
  - Eliminates **transitive dependencies** (non-key columns depending on other non-key columns).

---

💡 **Golden Rule:** "Every non-key attribute must provide a fact about *the key, the whole key, and nothing but the key*."`
  }

  if (query.includes('ohm') || query.includes('voltage') || query.includes('current') || query.includes('resistance')) {
    return `### ⚡ Ohm's Law Explained Simply

**Ohm's Law** describes the mathematical relationship between **Voltage ($V$)**, **Current ($I$)**, and **Resistance ($R$)** in an electrical circuit.

---

#### 📐 The Formula:
$$V = I \\times R$$

* **$V$ (Voltage)**: The electrical push or pressure driving charges through the circuit (measured in **Volts, V**).
* **$I$ (Current)**: The rate of flow of electrical charges (measured in **Amperes, A**).
* **$R$ (Resistance)**: The opposition to the flow of charge (measured in **Ohms, \\Omega**).

---

#### 💡 Real-World Water Pipe Analogy:
* **Voltage ($V$)** is like **water pressure** pushing water through a pipe.
* **Current ($I$)** is like the **volume of water** flowing through the pipe per second.
* **Resistance ($R$)** is like the **narrowness of the pipe** restricting water flow.

---

#### ✏️ Quick Example:
If a circuit has a voltage of **12V** and a resistance of **4 \\Omega**, the current is:
$$I = \\frac{V}{R} = \\frac{12}{4} = 3\\text{ Amperes}$$`
  }

  if (query.includes('code') || query.includes('coding') || query.includes('debug') || query.includes('programming')) {
    return `### 💻 How Can I Help You With Your Code?

I am ready to help you write, debug, and optimize code! 

---

#### 🚀 To get the best help, please share:
1. **The Programming Language** (e.g., Python, JavaScript, C++, Java, SQL).
2. **Your Problem Statement** or what you want the program to accomplish.
3. **The Code snippet** you are working on (if any).
4. **Any error message** or unexpected output you are encountering.

Feel free to paste your code or type your question below!`
  }

  return `### 📘 AI Learning Assistant

That's a great question about **"${userPrompt}"**!

---

#### 💡 Core Explanation:
Conceptually, understanding **${userPrompt}** involves breaking down the topic into foundational building blocks:

1. **Fundamental Principle**: Focus first on the core definition and why this concept exists.
2. **Practical Application**: Consider how this concept is applied in real-world engineering, software development, or problem solving.
3. **Step-by-Step Breakdown**:
   - Step 1: Identify key inputs and requirements.
   - Step 2: Apply the logical transformation or methodology.
   - Step 3: Analyze the outcome and verify correctness.

---

Would you like me to provide a code example, a practical diagram description, or dive deeper into a specific part of this topic? Ask me any follow-up question!`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, history, courseContext } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: "Please enter a valid question or doubt." },
        { status: 400 }
      )
    }

    const trimmedPrompt = message.trim()
    const activeSystemPrompt = courseContext 
      ? `${SYSTEM_PROMPT}\n\n[IMPORTANT COURSE CONTEXT]: The student is asking this question within the context of their enrolled course: "${courseContext}". Ensure all definitions, explanations, formulas, analogies, and code/design examples are tailored specifically to this course subject.`
      : SYSTEM_PROMPT;

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.GROQ_API_KEY

    // Try Google Gemini API if Gemini API key is available
    if (apiKey && (process.env.GEMINI_API_KEY || process.env.AI_API_KEY)) {
      try {
        const key = process.env.GEMINI_API_KEY || process.env.AI_API_KEY
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`

        // Build contents array incorporating history
        const contents: any[] = []

        if (Array.isArray(history) && history.length > 0) {
          history.forEach((item: any) => {
            if (item.sender === 'user' && item.text) {
              contents.push({ role: 'user', parts: [{ text: item.text }] })
            } else if (item.sender === 'ai' && item.text) {
              contents.push({ role: 'model', parts: [{ text: item.text }] })
            }
          })
        }

        const userPromptWithContext = courseContext 
          ? `[Course Context: ${courseContext}] User Question: ${trimmedPrompt}`
          : trimmedPrompt;

        contents.push({ role: 'user', parts: [{ text: userPromptWithContext }] })

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: activeSystemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        })

        if (res.ok) {
          const data = await res.json()
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (candidateText) {
            return NextResponse.json({ response: candidateText })
          }
        } else {
          console.warn("Gemini API call returned status:", res.status)
        }
      } catch (geminiError) {
        console.warn("Gemini API request error:", geminiError)
      }
    }

    // Try OpenAI API if OpenAI key is available
    if (apiKey && process.env.OPENAI_API_KEY) {
      try {
        const openAiEndpoint = 'https://api.openai.com/v1/chat/completions'
        const messages: any[] = [{ role: 'system', content: activeSystemPrompt }]

        if (Array.isArray(history) && history.length > 0) {
          history.forEach((item: any) => {
            if (item.sender === 'user' && item.text) {
              messages.push({ role: 'user', content: item.text })
            } else if (item.sender === 'ai' && item.text) {
              messages.push({ role: 'assistant', content: item.text })
            }
          })
        }

        const userPromptWithContext = courseContext 
          ? `[Course Context: ${courseContext}] User Question: ${trimmedPrompt}`
          : trimmedPrompt;

        messages.push({ role: 'user', content: userPromptWithContext })

        const res = await fetch(openAiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 1000,
          })
        })

        if (res.ok) {
          const data = await res.json()
          const aiResponseText = data.choices?.[0]?.message?.content
          if (aiResponseText) {
            return NextResponse.json({ response: aiResponseText })
          }
        }
      } catch (openAiError) {
        console.warn("OpenAI API request error:", openAiError)
      }
    }

    // Use intelligent fallback generator
    const fallbackAnswer = generateFallbackResponse(trimmedPrompt, courseContext)
    return NextResponse.json({ response: fallbackAnswer })

  } catch (error: any) {
    console.error("AI Assistant Route error:", error)
    return NextResponse.json(
      { error: "Sorry, I couldn't process that question. Please try again." },
      { status: 500 }
    )
  }
}
