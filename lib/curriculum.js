// 12-week curriculum for "Learn AI together".
// All weeks use the same schema: learn[{concept,body}], project[{step,body}].
// Calibrated for advanced builders who already use Claude Code, MCP, and system prompts daily.

module.exports = {
  phases: [
    { id: 'foundations', label: 'Foundations', weekRange: [1, 4] },
    { id: 'building',    label: 'Building',    weekRange: [5, 8] },
    { id: 'shipping',    label: 'Shipping',    weekRange: [9, 12] },
  ],
  weeks: [
    // -----------------------------------------------------------------
    // WEEK 1 — How LLMs actually work
    // -----------------------------------------------------------------
    {
      number: 1,
      phaseId: 'foundations',
      title: 'How LLMs actually work',
      desc: 'The mental model you need before everything else',
      lessons: [
        {
          id: 'w1-l1',
          title: 'Tokens, context windows, prediction',
          sub: 'What the model actually sees and does',
          type: 'lesson',
          duration: '12 min',
          learn: [
            {
              concept: "Tokens aren't words",
              body: "LLMs read tokens, not words. 'Unbelievable' might be 3 tokens. 'GPT' is 1. Numbers and code break differently than English. This matters because context windows and pricing are measured in tokens — and you already feel this when Claude Code hits long sessions."
            },
            {
              concept: 'Next token prediction is the whole job',
              body: "An LLM predicts the most likely next token given everything before it. Reasoning, coding, writing — all emerge from doing this extremely well at massive scale. Even 'think hard' mode is just more tokens of internal prediction before the answer."
            },
            {
              concept: 'Context window = working memory',
              body: "Everything the model 'knows' in this conversation fits in a context window (Claude Opus: 200k tokens). It sees the system prompt + entire conversation + your new message. Nothing else. No persistent memory by default — that's why Claude Code's CLAUDE.md and memory features exist."
            },
            {
              concept: 'Temperature & sampling',
              body: 'Same prompt, different answers. temperature=0 = deterministic. temperature=0.7 = creative variation. For code, lower is better. For brainstorming, higher.'
            }
          ],
          quiz: {
            q: "You give Claude Code a 50k token codebase to review. Why might it 'forget' details from the start of the file by the end?",
            opts: [
              'The model is too small',
              "Context windows have a limit and attention spreads thinner across long inputs — earlier content gets less focus",
              'Training data was incomplete',
              'It needs more temperature'
            ],
            correct: 1,
            explanation: "Even with a 200k context window, models have 'attention dilution' over very long inputs. Early content can effectively get less weight than recent content. This is why splitting tasks and giving focused context works better than dumping everything in."
          },
          project: [
            {
              step: 'Experiment with tokenization',
              body: "Open Claude.ai and ask: 'tokenize this sentence: Eindhoven is great' — see how it breaks down."
            },
            {
              step: 'Compare temperature outputs',
              body: 'Try the same coding prompt at temperature 0 and temperature 1 in the API console (console.anthropic.com) — compare how different the outputs are.'
            },
            {
              step: 'Observe attention on a long file',
              body: 'In Claude Code, ask it to summarize a long file and notice what it emphasizes — usually recent content gets more weight.'
            },
            {
              step: 'Discuss context design implications',
              body: "Reflect together: how does knowing about tokens and attention change how you'd structure a CLAUDE.md or system prompt?"
            }
          ],
          ownProject: "Pick one feature you've shipped using Claude Code. Trace it back: what was your system prompt? What context did you give? Write a 5-bullet retrospective on what worked and what hit token limits."
        },
        {
          id: 'w1-l2',
          title: "System prompts & the model's worldview",
          sub: 'Why CLAUDE.md feels like magic — and how to weaponize that',
          type: 'lesson',
          duration: '10 min',
          learn: [
            {
              concept: 'System prompts set the rules',
              body: "A system prompt comes before the conversation and shapes everything: persona, rules, output format, tone, what's off-limits. When you use Claude Code, your CLAUDE.md is essentially a system prompt for your project."
            },
            {
              concept: 'Specificity beats verbosity',
              body: "Vague: 'Be helpful.' Useful: 'You are a senior Python engineer reviewing code for a fintech startup. Flag security issues first. Be terse. Suggest the smallest possible change.' The second one shapes behavior dramatically."
            },
            {
              concept: 'The XML / structure trick',
              body: "Claude responds well to structured prompts. Wrap context in <context> tags, examples in <example>, instructions in <task>. This isn't superstition — it genuinely helps the model parse intent."
            },
            {
              concept: 'Skills, MCPs and tool use',
              body: "What you already use with Claude Code — skills, MCP servers, tool calls — are all built on this foundation. A skill is essentially a focused system prompt + capabilities the model can invoke. You're already doing advanced prompt engineering without calling it that."
            }
          ],
          quiz: {
            q: 'You want Claude Code to always check tests before suggesting a change. Where does this rule belong?',
            opts: [
              'At the start of every prompt you send',
              'In CLAUDE.md (the project system prompt)',
              'It needs to be fine-tuned in',
              'In the user message every time'
            ],
            correct: 1,
            explanation: "CLAUDE.md is the system prompt for the project. Rules that should apply to every interaction belong there — you don't want to repeat them in every message, and the model treats system-prompt rules with more weight."
          },
          project: [
            {
              step: 'Open an existing CLAUDE.md',
              body: 'Pick one of your real projects that already has a CLAUDE.md and open it.'
            },
            {
              step: 'Audit for specificity',
              body: 'Read through it: does it contain concrete behavior rules, or is it mostly vague intent? Mark anything that could mean anything.'
            },
            {
              step: 'Add 3 specific rules',
              body: "Write in at least 3 actionable rules — e.g. 'Always check existing tests before suggesting a change', 'Prefer fewer dependencies', 'Ask before deleting files'."
            },
            {
              step: 'Compare before and after',
              body: 'Run the same task with and without those rules active and observe the behavior difference — specificity is the whole game.'
            }
          ],
          ownProject: 'Write a CLAUDE.md for a side project (real or imagined) that defines: persona, output format, 3 rules, and 1 thing it must never do. Share it with Björn and have him try to break it.'
        },
        {
          id: 'w1-q1',
          title: 'Week 1 quiz: foundations',
          sub: 'Test tokens, context, prompts together',
          type: 'quiz',
          duration: '8 min',
          learn: [
            {
              concept: 'What this covers',
              body: 'This wraps Week 1 foundations: tokens, context windows, system prompts, temperature, and how this connects to your Claude Code workflow. Do it together — discuss before answering for double the value.'
            }
          ],
          quiz: {
            q: "Which of these would NOT meaningfully change an LLM's output?",
            opts: [
              'Changing the system prompt',
              'Adding examples in the prompt (few-shot)',
              'Lowering the temperature to 0',
              'Reformatting whitespace in a code block from tabs to spaces'
            ],
            correct: 3,
            explanation: "Whitespace changes have minimal effect on tokenization for most models. System prompts, examples, and temperature all shape output significantly. This matters because PMs sometimes attribute behavior to the wrong cause — knowing what does and doesn't matter saves debugging time."
          },
          project: [
            {
              step: 'Reflect on what surprised you',
              body: 'Go around and share: what was the most surprising or counterintuitive thing from Week 1?'
            },
            {
              step: "Write your own 'what is an LLM' in 3 sentences",
              body: "Each person writes their own explanation for a non-technical friend — no jargon. The constraint is exactly 3 sentences."
            },
            {
              step: 'Compare framings',
              body: 'Read each other\'s explanations aloud. Where they differ, dig in — different framings reveal different mental models and gaps.'
            }
          ],
          ownProject: "Watch Karpathy's 'Intro to LLMs' (1 hour, free on YouTube) together. Pause every 10 mins to discuss."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 2 — Embeddings & Semantic Search
    // -----------------------------------------------------------------
    {
      number: 2,
      phaseId: 'foundations',
      title: 'Embeddings & Semantic Search',
      desc: 'Meaning as geometry — the substrate under every retrieval system',
      lessons: [
        {
          id: 'w2-l1',
          title: 'How embeddings actually work',
          sub: 'From tokens to vectors to similarity',
          type: 'lesson',
          duration: '22 min',
          learn: [
            {
              concept: 'Embeddings are learned geometry',
              body: "An embedding model compresses a chunk of text (or an image, or audio) into a fixed-length vector — typically 768 to 3072 dimensions. Similar meanings end up close in that space, dissimilar ones far apart. Crucially, 'similar' is defined by the model's training objective: a model trained on web text will cluster 'lithography' and 'photolithography' tightly; a model trained on legal corpora might not."
            },
            {
              concept: 'Cosine similarity vs dot product vs Euclidean',
              body: "Cosine similarity measures the angle between two vectors — it ignores magnitude, which is what you usually want for text. Dot product is faster and equivalent when vectors are normalised (most modern embeddings are). Euclidean distance is rarely the right choice for text but shows up in image and audio retrieval. Pick one and stay consistent — mixing metrics is a classic silent bug."
            },
            {
              concept: 'Why dimensions matter (and matryoshka embeddings)',
              body: "Higher dimensions capture more nuance but cost more in storage and search. OpenAI's text-embedding-3 and several open models now use Matryoshka Representation Learning — you can truncate the vector (3072 → 512) and lose surprisingly little quality. This lets you index at full dimension and query at a smaller one for cheap first-pass retrieval."
            },
            {
              concept: 'The off-the-shelf landscape',
              body: "In 2026 the practical defaults are: OpenAI text-embedding-3-large for general English, Cohere embed-v3 for multilingual, voyage-3 for code and technical text, and BAAI/bge-m3 or nomic-embed-text-v1.5 if you want open weights you can self-host. The MTEB leaderboard moves weekly — check it before committing, but don't optimise for the last 2 points of NDCG if your data is messy."
            }
          ],
          quiz: {
            q: "You're building search over ASML internal engineering docs in Dutch and English. You benchmark text-embedding-3-large and bge-m3 on a held-out set; they score within 1 point. What's the most important next consideration?",
            opts: [
              'Pick whichever scored higher — every point matters',
              'Cost per million tokens at your expected query volume',
              'Whether you can self-host (data residency, IP exposure to a third-party API)',
              'Vector dimension count'
            ],
            correct: 2,
            explanation: "At ASML or any IP-heavy industrial setting, sending engineering documents to an external API is often a non-starter regardless of benchmark scores. bge-m3 runs on a single A100 and gives you multilingual support natively. Cost and dimension matter, but data governance is the gating decision in industrial AI."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w2-q1',
          title: 'Embedding intuition quiz',
          sub: 'Five minutes to test your geometric thinking',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Two sentences have a cosine similarity of 0.92. A third has 0.91 with the first and 0.42 with the second. What can you conclude?",
            opts: [
              'All three sentences are about roughly the same topic',
              'Cosine similarity is not transitive — closeness to A and closeness to B tell you nothing about A-to-B directly',
              'The embedding model is broken — high similarity should transfer',
              'The third sentence must be in a different language'
            ],
            correct: 1,
            explanation: "Embedding space is high-dimensional and similarity is not transitive. Two points can each be close to a third without being close to each other — think of three points on a sphere. This is why retrieval over clusters needs explicit clustering, not just pairwise scores."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w2-p1',
          title: 'Build a semantic search over your own notes',
          sub: 'Index, query, evaluate — in under an hour',
          type: 'project',
          duration: '45 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Collect a real corpus',
              body: "Export 50-200 documents you actually care about — Notion exports, Obsidian vault, Slack DMs, PDFs of papers. Real data is messy and that's the point. Save them as plain text or markdown in one folder."
            },
            {
              step: 'Embed with two different models',
              body: "Run the corpus through OpenAI text-embedding-3-small AND a local model (nomic-embed-text via Ollama, or bge-small via sentence-transformers). Store both sets of vectors. This is the only way to feel the quality/cost/privacy tradeoff."
            },
            {
              step: 'Index in pgvector or Chroma',
              body: "pgvector is the boring correct choice if you already have Postgres — one extension and an index. Chroma is faster to set up for a throwaway. Use HNSW index, not flat, once you exceed ~10k vectors."
            },
            {
              step: 'Build a tiny query loop',
              body: "Write 10 queries you'd actually ask. For each, fetch top-5 from both indexes and eyeball which is better. Track wins/losses in a spreadsheet — this is your first eval set, and you'll reuse it next week for RAG."
            },
            {
              step: 'Add a simple reranker',
              body: "Pass the top-20 results to Cohere rerank-3 or a cross-encoder like bge-reranker-v2-m3. Compare top-5 after reranking. Reranking on a small set is the cheapest quality lever in the entire stack."
            }
          ],
          ownProject: "Pick a domain you both know deeply — Sania's PM artifacts, Björn's engineering notes, or shared travel/recipes — and find one query where both embedding models fail. Why? Is it a chunking problem, a vocabulary problem, or genuinely ambiguous? Write the failure up in 5 sentences."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 3 — RAG
    // -----------------------------------------------------------------
    {
      number: 3,
      phaseId: 'foundations',
      title: 'RAG: retrieval that actually works',
      desc: 'The pattern that powers most enterprise AI — and why most implementations are mediocre',
      lessons: [
        {
          id: 'w3-l1',
          title: 'RAG, properly',
          sub: 'Chunking, retrieval, augmentation, generation — and where each fails',
          type: 'lesson',
          duration: '25 min',
          learn: [
            {
              concept: 'The four stages and where they break',
              body: "RAG has four stages: chunk, embed+index, retrieve, generate. The naive view is 'retrieval is the hard part' — actually, chunking causes more failures in production. A 500-token chunk that splits a table in half or separates a definition from its example will silently destroy answer quality, and your retrieval metrics won't catch it."
            },
            {
              concept: "Chunking strategies that aren't terrible",
              body: "Fixed-size chunking (e.g. 512 tokens with 50-token overlap) is the default and it's usually wrong. Better: semantic chunking (split on heading boundaries, then merge until size limit), or 'late chunking' where you embed the full document context then split. For code or structured docs, parse the AST/structure first — never split a function or table."
            },
            {
              concept: 'Hybrid retrieval beats dense alone',
              body: "Dense (embedding) retrieval is great for paraphrase and concept matching. BM25 (sparse, keyword) crushes dense on rare terms, IDs, error codes, model numbers. Production RAG uses both, fuses with Reciprocal Rank Fusion (RRF), then reranks. If your users search for things like 'TWINSCAN NXT:2050i', dense alone will fail you."
            },
            {
              concept: 'Augmentation: more than stuffing',
              body: "How you arrange retrieved chunks in the prompt matters. Put the most relevant chunk last (recency bias in attention). Cite chunks with stable IDs so the model can ground its answer. Tell the model explicitly: 'If the answer is not in the context, say so' — and then evaluate that it actually does."
            }
          ],
          quiz: {
            q: "Your RAG system answers correctly when users ask 'what is the policy on remote work' but hallucinates when they ask 'can I work from Barcelona for 3 months'. Most likely cause?",
            opts: [
              'The LLM is too small',
              'The query is more specific than any chunk — retrieval returns generic policy text, model fills the gap by guessing',
              'You need a bigger context window',
              'Embeddings are the wrong dimension'
            ],
            correct: 1,
            explanation: "Specific compound queries often have no single matching chunk. The retriever finds adjacent generic content, the model fills the specific gap with plausible-sounding fiction. Fix with query decomposition (HyDE, multi-query) or by explicitly instructing the model to refuse when context is generic. This is the failure mode that kills RAG demos in production."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w3-q1',
          title: "RAG failure modes quiz",
          sub: "Diagnose, don't guess",
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Which of these is NOT a typical fix for 'retrieval finds the right chunk but the answer is still wrong'?",
            opts: [
              'Add a reranker between retrieval and generation',
              'Instruct the model to quote the source span verbatim before answering',
              'Increase the embedding model dimension',
              'Reduce chunk size so the relevant fact is less diluted'
            ],
            correct: 2,
            explanation: "If retrieval is finding the right chunk, the embedding model isn't your problem — generation is. Reranking, forced quoting, and tighter chunks all attack the generation step. Bumping embedding dimensions is what you'd do for retrieval recall problems, not generation problems."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w3-p1',
          title: 'Ship a RAG system you trust',
          sub: 'From corpus to evaluated pipeline in one session',
          type: 'project',
          duration: '60 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Reuse Week 2 corpus, build a baseline',
              body: "Take last week's notes corpus. Build the dumbest possible RAG: fixed 512-token chunks, top-3 retrieval, stuff into a Claude or GPT prompt with 'answer using only this context'. This is your baseline — measure it before improving."
            },
            {
              step: 'Build a 20-question eval set',
              body: "Write 20 questions with known correct answers from your corpus. Mix easy (single chunk), medium (synthesise from 2-3 chunks), and hard (requires reasoning over the whole corpus). Save as JSON with question, expected_answer, and source_doc."
            },
            {
              step: 'Add hybrid retrieval and reranking',
              body: "Add BM25 alongside your dense retriever — use rank_bm25 in Python or Postgres tsvector. Fuse with RRF (formula: score = sum(1/(60+rank)) across retrievers). Pass top-20 to a reranker, keep top-5. Re-run your eval and measure the delta."
            },
            {
              step: 'Add query rewriting',
              body: "Before retrieval, ask the LLM to rewrite the user query into 3 variants (a literal version, a hypothetical answer / HyDE, and a keyword version). Retrieve for each, union the results, then rerank. Measure again."
            },
            {
              step: 'Add a refusal / grounding check',
              body: "After generation, run a second cheap LLM call: 'Given this context and this answer, is every claim in the answer supported by the context? Respond with grounded/ungrounded.' Use this to flag answers in your UI. This is the entry point to next week's eval lesson."
            }
          ],
          ownProject: "Find one question in your eval set where the system is confidently wrong. Trace the failure: did retrieval miss the right chunk, did the reranker push it down, or did the LLM ignore it? Write a one-paragraph post-mortem in the style of a Philips/ASML incident report."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 4 — Evaluation & Testing
    // -----------------------------------------------------------------
    {
      number: 4,
      phaseId: 'foundations',
      title: 'Evals: the skill that separates builders from shippers',
      desc: 'You cannot improve what you cannot measure — and LLMs are hard to measure',
      lessons: [
        {
          id: 'w4-l1',
          title: 'How to evaluate non-deterministic systems',
          sub: 'Golden sets, LLM-as-judge, and the eval flywheel',
          type: 'lesson',
          duration: '22 min',
          learn: [
            {
              concept: 'The eval flywheel',
              body: "Every serious AI team converges on the same loop: collect real traffic, label a subset, run evals on every change, fix the worst failures, repeat. The eval set is the most valuable artifact you own — more valuable than your prompts, more valuable than your model choice. Start it on day one, even if it's 10 examples in a Google Sheet."
            },
            {
              concept: 'Reference-based vs reference-free metrics',
              body: "Reference-based (BLEU, ROUGE, exact match, semantic similarity to a gold answer) is rigorous but expensive to label and brittle for open-ended generation. Reference-free (LLM-as-judge, heuristics, structural checks) is cheaper and scales. Modern stacks use both: reference-based for regression on a small golden set, reference-free for breadth."
            },
            {
              concept: 'LLM-as-judge — done right',
              body: "Using an LLM to grade another LLM works, but only with care. Use a stronger model than the one being graded. Give it a rubric with concrete criteria, not 'is this good?'. Calibrate against human labels on at least 50 examples — judges have biases (positional, verbosity, self-preference). Tools like Braintrust, Langfuse, and Phoenix have made this much less DIY in 2026."
            },
            {
              concept: 'Beyond accuracy: latency, cost, safety',
              body: "An eval is incomplete if it only measures correctness. Track p50/p95 latency, $ per request, refusal rate, and safety violations. A new model that's 2% more accurate but 3x slower and 5x more expensive is a regression. PMs especially: insist on multi-dimensional evals or you'll ship the wrong wins."
            }
          ],
          quiz: {
            q: "You replace GPT-4o with Claude Sonnet 4.7 in your RAG app. Your LLM-as-judge eval (using GPT-4o as judge) shows a 3% drop in quality. What should you check first?",
            opts: [
              'The new model is genuinely worse — revert',
              'Self-preference bias: GPT-4o tends to rate GPT-4o outputs higher than competing models',
              'Your prompts need re-tuning for the new model — try that first',
              'Latency has changed and is affecting the judge'
            ],
            correct: 1,
            explanation: "LLM judges have well-documented self-preference bias — they rate outputs that look like their own training distribution higher. Best practice: use a third model as judge, or use multiple judges and average. Both (1) and (3) might also be true, but you can't trust the eval signal until you've controlled for judge bias."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w4-q1',
          title: 'Eval design quiz',
          sub: 'Spot the bad eval',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Which of these is the WORST eval design for a customer support chatbot?",
            opts: [
              "100 real user queries, graded by a senior support agent on a 1-5 rubric",
              "500 synthetic queries generated by GPT-4, graded by GPT-4-as-judge with a yes/no rubric",
              "20 'golden' queries with hand-written expected answers, exact-match scored",
              "Real user queries, with thumbs-up/down feedback aggregated by week"
            ],
            correct: 1,
            explanation: "Option B has compounding problems: synthetic queries don't reflect real user distribution, the judge has self-preference bias (same model generated and grades), and a yes/no rubric is too coarse. The others all have weaknesses too, but B's failures multiply. This is sadly the eval design that ships most often because it's the easiest to automate."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w4-p1',
          title: 'Build an eval harness for your RAG system',
          sub: "Turn Week 3's pipeline into something you can iterate on with confidence",
          type: 'project',
          duration: '50 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Expand the eval set to 50 examples',
              body: "Add 30 more cases to last week's 20. Deliberately include adversarial ones: questions whose answer isn't in the corpus (should refuse), questions with typos, multi-hop questions, and questions in a second language if your corpus is multilingual."
            },
            {
              step: 'Define a 3-axis rubric',
              body: "Score each answer on: correctness (0-2), groundedness (0-2, is every claim in the retrieved context?), and helpfulness (0-2, did it actually answer or hedge). Total 0-6. Avoid a single 'quality' score — it hides where you're losing."
            },
            {
              step: 'Wire up an LLM judge',
              body: "Use Claude Opus or GPT-4.5 as judge. Prompt it with the question, retrieved context, generated answer, and your rubric. Demand structured output (JSON with three scores + one-sentence reasoning per axis). Save every judgment to a SQLite or DuckDB table."
            },
            {
              step: 'Calibrate against yourselves',
              body: "Both of you independently grade 20 of the same examples. Compute inter-rater agreement (Cohen's kappa or just % agreement). Then compare your average to the LLM judge. If the judge is more than 1 point off on average, fix the rubric or switch judges."
            },
            {
              step: 'Run a regression sweep',
              body: "Change one thing — swap the embedding model, change chunk size, swap the generator. Run the full eval. Save results with a version tag. Plot a small bar chart of the three axes per version. This is the muscle that separates teams who ship from teams who guess."
            }
          ],
          ownProject: "Pick one of your real Claude Code or AI product workflows and write a 10-example eval for it. Be honest about which failures you'd actually catch. Then describe one change to your workflow you'd ship based on those results."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 5 — Building with LLM APIs
    // -----------------------------------------------------------------
    {
      number: 5,
      phaseId: 'building',
      title: 'Building with LLM APIs',
      desc: 'Tool use, structured output, streaming, caching — the API surface you need fluent',
      lessons: [
        {
          id: 'w5-l1',
          title: 'The modern LLM API surface',
          sub: "What's the same across providers, what's not, and what matters",
          type: 'lesson',
          duration: '22 min',
          learn: [
            {
              concept: 'Tool use is the only abstraction that matters',
              body: "Both Anthropic and OpenAI converged on the same pattern: you describe tools as JSON schemas, the model decides when to call them, returns structured arguments, you execute and feed results back. Everything else — agents, RAG, structured output — is a special case of tool use. Get fluent here and the rest is variation."
            },
            {
              concept: 'Structured output via constrained decoding',
              body: "In 2026 both OpenAI (response_format: json_schema) and Anthropic (via tool use or response prefill) guarantee valid JSON matching a schema. Use it. Don't parse strings with regex. Local models with vLLM, llama.cpp, and Outlines support the same via grammar-constrained generation. Schema-first design changes how you architect apps."
            },
            {
              concept: 'Streaming, server-sent events, and partial state',
              body: "Streaming isn't just for UX. With tool use, you can detect a tool call has started before its arguments are complete and prefetch resources. With structured output, you can render fields as they arrive. Master the SSE event types (content_block_start, delta, stop) — most teams use them naively and leave latency on the table."
            },
            {
              concept: 'Prompt caching pays for itself in a week',
              body: "Anthropic's prompt caching gives you 90% off cached input tokens for repeated context (system prompts, long docs, eval harnesses). OpenAI's automatic caching is similar but less explicit. If you have a 50k-token system prompt called 100x/day, this is the difference between viable and not. Always design for cacheable prefixes — put stable content first, variable content last."
            }
          ],
          quiz: {
            q: "You're building a feature that classifies incoming emails into 12 categories and extracts 5 fields each. Which approach is the right default in 2026?",
            opts: [
              "Prompt the model to return JSON and parse with try/except retry loops",
              "Use structured output (json_schema or tool use) with the schema as the contract; no retries needed for malformed JSON",
              "Fine-tune a smaller model on labeled examples",
              "Use regex on the model's text output"
            ],
            correct: 1,
            explanation: "Constrained decoding eliminates the malformed-JSON problem entirely — the model literally cannot output invalid JSON. This is now table stakes; teams still parsing free-text JSON in 2026 are paying a productivity tax. Fine-tuning may eventually be cheaper at high volume but it's not the right starting point."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w5-q1',
          title: 'API design quiz',
          sub: 'Caching, streaming, and the cost of mistakes',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Your system prompt is 40k tokens of company docs and rarely changes. The user message is ~200 tokens. You serve 10k requests/day. What's the single highest-leverage optimisation?",
            opts: [
              'Switch from GPT-4.5 to GPT-4o-mini',
              'Enable prompt caching so the 40k-token prefix costs ~10% of normal after the first hit',
              'Compress the system prompt to 20k tokens',
              'Add a CDN in front of your API'
            ],
            correct: 1,
            explanation: "Prompt caching is built for exactly this pattern: large stable prefix, small variable suffix. At 10k requests/day with 40k cached tokens each, you're looking at roughly 90% off the input cost — orders of magnitude bigger than any other optimisation. Compressing the prompt may hurt quality. Model swap is a separate question."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w5-p1',
          title: 'Build a tool-using assistant',
          sub: 'Three tools, structured output, streaming UI',
          type: 'project',
          duration: '60 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick a real task and define 3 tools',
              body: "Choose something you'd actually use: a meeting-prep assistant, a code reviewer, a weekly metrics summariser. Define exactly 3 tools as JSON schemas — e.g. get_calendar(date), search_docs(query), send_email(to, body). Three is the right number for a learning project; six is where things get fiddly."
            },
            {
              step: 'Implement the tool-use loop',
              body: "Write the loop: call model with tools → if tool_use, execute it → append result as tool_result → loop until model returns text-only. Cap iterations at 10 to prevent runaway. This 30-line loop is the heart of every agent framework — write it from scratch once before reaching for LangGraph."
            },
            {
              step: 'Force structured output for the final answer',
              body: "The final assistant message should be JSON with fields like summary, action_items[], confidence. Use response_format / tool_choice. Render it as a card in your UI, not a wall of text."
            },
            {
              step: 'Add streaming and a cancel button',
              body: "Stream tokens to the UI as they arrive. Add a cancel button that aborts the request mid-stream. This is the difference between feeling like a toy and feeling like a product."
            },
            {
              step: 'Enable prompt caching on the system prompt',
              body: "Put your tool definitions and any boilerplate in the cached prefix. Measure cost and latency before/after. Write down the numbers — you'll cite them when defending architecture choices later."
            }
          ],
          ownProject: "Add a fourth 'meta' tool: ask_user(question) that lets the model pause and request clarification mid-task. Try to break it: design an input where the model should use it but doesn't. What does that tell you about your system prompt?"
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 6 — Agents & Orchestration
    // -----------------------------------------------------------------
    {
      number: 6,
      phaseId: 'building',
      title: 'Agents & orchestration',
      desc: 'LangGraph, CrewAI, and the reality of multi-step systems',
      lessons: [
        {
          id: 'w6-l1',
          title: 'When you actually need an agent',
          sub: "And the architecture patterns that don't fall over",
          type: 'lesson',
          duration: '24 min',
          learn: [
            {
              concept: 'Agent = LLM in a loop with tools and state',
              body: "Strip the hype: an agent is an LLM that chooses tools to call until a goal is met, with state persisted between steps. Anthropic's 'Building Effective Agents' essay (Dec 2024) is still the clearest framing in 2026 — most 'agentic' systems should be deterministic workflows with one LLM call per node, not free-roaming agents. Use real agency only when the task is open-ended."
            },
            {
              concept: 'Workflow patterns: chain, route, parallelise, orchestrate',
              body: "Chain (output of step 1 → input of step 2) handles 80% of tasks. Route (classifier picks one of N specialised prompts) is the next 10%. Parallelise (run N calls, aggregate) is great for evals and large doc summarisation. Full orchestrator-worker (an LLM dispatches subtasks dynamically) is the last 5% — and where most production debugging hours go."
            },
            {
              concept: 'LangGraph vs the alternatives',
              body: "LangGraph won mindshare for explicit state graphs — you define nodes, edges, and a typed state object. CrewAI is friendlier for role-playing multi-agent setups but harder to debug. Anthropic's MCP + a hand-written loop is increasingly common for production work because the stack is smaller. Pick based on team size and observability needs, not stars."
            },
            {
              concept: 'The three failure modes',
              body: "Agents fail in three ways: (1) infinite loops — same tool, same args, no progress; (2) goal drift — model forgets the original objective after many turns; (3) tool misuse — model calls a destructive tool when it shouldn't. Mitigations: step limits, periodic re-statement of the goal in the prompt, and a 'plan first, approve, then execute' gate for any tool that writes."
            }
          ],
          quiz: {
            q: "You're building a system to triage Linear issues, comment with a suggested label, and route to the right person. The flow is predictable: classify → suggest → assign. Which architecture is right?",
            opts: [
              'A free-roaming agent with all three tools, let it figure out the order',
              'A deterministic chain of three LLM calls, each with one tool, with explicit state',
              'A single mega-prompt that does all three at once',
              "A multi-agent system with separate 'triager', 'commenter', and 'assigner' agents"
            ],
            correct: 1,
            explanation: "Predictable flows belong in deterministic workflows, not agents. A 3-node chain is easier to debug, eval, and roll back. Free-roaming agency is a tax you pay for flexibility you don't need here. This is the single most common over-engineering mistake in 2025-26 AI products."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w6-q1',
          title: 'Agent design quiz',
          sub: 'Architecture decisions under load',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Your agent has been running for 14 steps on a single user request, calling the same web_search tool with slight variations. What's the cleanest fix?",
            opts: [
              'Switch to a more capable model',
              'Detect tool-call repetition in your loop and force the agent to either summarise progress or stop',
              'Increase the step limit so it has more chances to succeed',
              'Remove the web_search tool entirely'
            ],
            correct: 1,
            explanation: "Repetition without progress is a classic agent failure. The fix isn't a bigger model — it's a control structure: detect repeated calls and force a state-change action (summarise, ask the user, or terminate). This belongs in your loop code, not in the prompt; prompt-level instructions to 'avoid repetition' are unreliable."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w6-p1',
          title: 'Build an orchestrated workflow',
          sub: 'A real multi-step system with state, retries, and observability',
          type: 'project',
          duration: '75 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick a workflow with 3-5 real steps',
              body: "Examples: PR reviewer (fetch diff → summarise → critique → post comment), market research (gather sources → extract claims → cross-reference → write brief), or trip planner (parse request → search flights → search hotels → assemble itinerary). Write the steps on paper before you code."
            },
            {
              step: 'Implement as a typed state graph',
              body: "Use LangGraph or hand-roll it: define a State TypedDict, write each step as a pure function (state) -> partial_state. Edges decide the next node based on state. Avoid letting an LLM choose the next node unless the task genuinely demands it."
            },
            {
              step: 'Add retries and timeouts per node',
              body: "Each node should have a max-retry policy (typically 2) with exponential backoff for API errors. Add a per-node timeout. A 60-second total timeout for the whole workflow is reasonable for interactive use; longer means run it async."
            },
            {
              step: 'Wire up tracing',
              body: "Use Langfuse, LangSmith, Phoenix, or Braintrust — all free tiers in 2026 are generous. Log every LLM call with prompt, completion, latency, tokens, and the state at that step. You will not debug an agent without this. Without traces you are guessing."
            },
            {
              step: 'Run it on 10 inputs and read every trace',
              body: "This is the actual learning moment. For each run: did every step add value? Was any step doing two things? Did the model ever ignore the state you gave it? Take notes — these patterns are what you'll spot in production work next year."
            }
          ],
          ownProject: "Add a 'human approval' edge: before any node that writes (sends a message, creates an issue, books a flight), require explicit user confirmation. Implement it as a real interrupt — the graph pauses, you serialise state, resume on confirmation. This pattern is unblockable in enterprise deployment."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 7 — Fine-tuning & Adaptation
    // -----------------------------------------------------------------
    {
      number: 7,
      phaseId: 'building',
      title: 'Fine-tuning, LoRA & adaptation',
      desc: "When prompting hits a wall — and when it doesn't",
      lessons: [
        {
          id: 'w7-l1',
          title: 'The fine-tuning decision tree',
          sub: 'Prompting, RAG, fine-tuning — in that order',
          type: 'lesson',
          duration: '22 min',
          learn: [
            {
              concept: 'Almost no one needs to fine-tune in 2026',
              body: "The frontier models are so good at instruction-following that fine-tuning rarely beats a well-engineered prompt + RAG for knowledge tasks. Fine-tuning earns its keep in three places: (1) latency/cost — a small fine-tuned model replaces a big prompted one; (2) style/format — getting consistent outputs that prompting alone can't lock down; (3) domain language — when in-context examples aren't enough."
            },
            {
              concept: 'LoRA and PEFT: the only way you should fine-tune',
              body: "Full fine-tuning rewrites all model weights and is overkill for almost everyone. LoRA (Low-Rank Adaptation) trains tiny adapter matrices (often <1% of params), giving you 90% of the quality at a fraction of the compute and storage. QLoRA quantises the base model to 4-bit during training — you can fine-tune a 70B model on a single H100. PEFT libraries (Hugging Face peft) make this a few lines of code."
            },
            {
              concept: 'Data is the whole game',
              body: "Fine-tuning quality is bottlenecked by data quality, not algorithm. You need 500-5000 high-quality examples for most tasks; more is rarely better if quality drops. Examples should reflect your real input distribution — synthetic data from GPT-4 is fine to bootstrap, but you must filter and have humans review at least a sample. Bad data trains bad behaviours, hard."
            },
            {
              concept: 'Evaluation is even more critical here',
              body: "When you fine-tune you can silently degrade everything outside your training distribution — catastrophic forgetting is real. Always keep a 'general capability' eval (e.g. a small MMLU slice) alongside your task eval. If general scores drop more than 5 points, you've overfitted; reduce learning rate or epochs."
            }
          ],
          quiz: {
            q: "You want your assistant to always respond in a specific company voice: brief, no emoji, never apologetic, always ending with a clear next action. Best approach in 2026?",
            opts: [
              'Fine-tune a 7B open model with LoRA on 1000 examples in that voice',
              'Engineer the system prompt with explicit rules and 3-5 few-shot examples',
              'Both: try prompting first, only fine-tune if you hit a consistency ceiling at scale',
              'Use RAG to retrieve example responses'
            ],
            correct: 2,
            explanation: "The right discipline is always: prompt first, measure, only fine-tune if there's a measurable ceiling. Style is the one place prompting actually does sometimes hit a wall — at very high volumes a 5% inconsistency rate becomes painful. But you don't know that until you try prompting first and measure. Jumping straight to fine-tuning skips the cheap win."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w7-q1',
          title: 'Adaptation strategy quiz',
          sub: 'Pick the right lever',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Which of these is the WORST candidate for fine-tuning?",
            opts: [
              'A small model that must classify customer emails into 20 categories, 1M/day, latency <100ms',
              "A model that needs to know about your company's 200 internal product codes",
              'A model that must always output JSON with a specific schema',
              'A model that needs a consistent, terse Scandinavian-engineer tone'
            ],
            correct: 1,
            explanation: "Knowledge of changing facts (product codes, policies, prices) belongs in RAG, not weights — fine-tuning bakes it in and you have to retrain every time it changes. Classification at scale (A), strict format (C), and stylistic consistency (D) are all legitimate fine-tuning candidates; product codes belong in a vector store."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w7-p1',
          title: 'Fine-tune a small model with LoRA',
          sub: 'End to end: data, training, eval, deploy',
          type: 'project',
          duration: '90 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick a narrow task with a clear win condition',
              body: "Suggestions: classify GitHub issues into bug/feature/question/docs; rewrite informal Slack messages in your team voice; extract structured data from invoices. Avoid open-ended generation tasks for a first fine-tune — too hard to evaluate."
            },
            {
              step: 'Build a dataset of 500-1000 examples',
              body: "Use Claude or GPT-4.5 to generate candidates, then manually review and edit at least 200. Format as JSONL with messages or prompt/completion fields per Hugging Face conventions. Hold out 20% for eval, never touch during training."
            },
            {
              step: 'Train a LoRA adapter on a 3B-8B model',
              body: "Use Hugging Face TRL + PEFT. Base model: Llama-3.2-3B-Instruct or Qwen2.5-7B-Instruct. Rank 16, alpha 32, 3 epochs, learning rate 2e-4 is a sane starting point. Run on a single A100 (Colab Pro, RunPod, or Modal) — should take 30-90 minutes."
            },
            {
              step: 'Evaluate against the base model',
              body: "Run your eval set on (a) base model with a strong prompt and (b) your fine-tuned model with the same prompt. Compare task accuracy AND a general-capability check. If your fine-tune is worse than 'base + good prompt', that's a real and important finding — write it up."
            },
            {
              step: 'Deploy and feel the latency win',
              body: "Serve with vLLM or via Together AI / Fireworks. Compare latency and $/1k requests against your prompted GPT-4.5 baseline. If you're 5-10x cheaper and 2-3x faster at acceptable quality, you've justified the entire exercise."
            }
          ],
          ownProject: "Try the same task with a 'merged' approach: keep the big model in the loop but use your fine-tuned small model as a first-pass filter (e.g. only escalate uncertain classifications). Measure the cost/quality curve. This cascading pattern is how cost-conscious teams actually ship."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 8 — Multimodal AI
    // -----------------------------------------------------------------
    {
      number: 8,
      phaseId: 'building',
      title: 'Multimodal: vision, audio, generation',
      desc: 'Beyond text — and what changes in your stack when pixels and waveforms enter',
      lessons: [
        {
          id: 'w8-l1',
          title: 'How vision-language models see',
          sub: 'And how to actually use them in production',
          type: 'lesson',
          duration: '22 min',
          learn: [
            {
              concept: 'Vision tokens are still tokens',
              body: "A VLM (GPT-4o, Claude with vision, Gemini, Qwen-VL) doesn't really 'see' an image — it patches it into tokens, projects them into the same embedding space as text tokens, and processes both together. A 1024x1024 image is typically 1000-2000 tokens. Resize images yourself; sending 4K screenshots is the most common silent cost leak."
            },
            {
              concept: "OCR is not what vision models are best at",
              body: "Counter-intuitively, dedicated OCR (Azure Read, Google Document AI, Surya) often beats VLMs on dense text. VLMs win at layout reasoning, mixed content (diagrams + text), and answering questions about images. Combine: OCR for text extraction, VLM for understanding. Don't make a VLM do OCR's job."
            },
            {
              concept: "Audio: Whisper is no longer the only game",
              body: "Whisper v3 is great for English ASR but lags in Dutch, code-switching, and real-time. In 2026 you have AssemblyAI Universal-2, Deepgram Nova-3, ElevenLabs Scribe, and open-source NVIDIA Parakeet. For TTS, ElevenLabs and Cartesia ship near-realtime; Kokoro is the open-source surprise. Pick based on language, latency, and whether you need diarisation."
            },
            {
              concept: "Image gen: Flux, SDXL, and what they're for",
              body: "Image generation in production rarely means 'make me an illustration'. It means: synthetic training data, marketing assets at scale, mockup generation, or virtual try-on. Flux.1 family (dev, schnell, pro) leads open-weight quality. Inpainting and ControlNet (or its modern equivalents) are how you get controllable, not-just-pretty results."
            }
          ],
          quiz: {
            q: "You're building a feature for a Philips medical product: doctors upload scan images and want concise findings. Which architecture is most defensible?",
            opts: [
              'Send raw image to GPT-4o, return the findings text directly',
              'Use a specialised medical imaging model for feature extraction, then a VLM to assemble findings, with mandatory human review and audit trail',
              'Fine-tune a general VLM on medical images',
              'Use OCR to extract text from the scan and pass to a text-only LLM'
            ],
            correct: 1,
            explanation: "In regulated medical contexts, a general-purpose VLM as primary interpretation is a regulatory and clinical non-starter. The pattern is: specialised model (often FDA-cleared) for the medical task, LLM for natural-language assembly and structuring, mandatory human-in-the-loop, full audit. This applies at Philips, ASML metrology, anywhere safety/compliance is in play."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w8-q1',
          title: 'Multimodal architecture quiz',
          sub: 'Pick the right tool for the modality',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "You're processing 10,000 scanned invoices/month, extracting line items into a database. Best stack in 2026?",
            opts: [
              'Send each scan to GPT-4o vision and ask for JSON',
              'Dedicated OCR (e.g. Azure Document Intelligence) for layout + text, then an LLM with structured output to normalise into your schema',
              'Fine-tune a VLM on your invoice format',
              "Manually transcribe — AI isn't reliable enough"
            ],
            correct: 1,
            explanation: "Document Intelligence (or AWS Textract, Google Document AI) is purpose-built for invoices, gives you bounding boxes and confidence scores per field, and is orders of magnitude cheaper than a VLM at scale. The LLM stage handles the fuzzy parts: vendor name normalisation, line-item categorisation. This 'specialised + LLM glue' pattern is the workhorse of document-AI shipping in 2026."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w8-p1',
          title: 'Build a multimodal feature',
          sub: 'Pick a modality, ship something that works',
          type: 'project',
          duration: '60 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick one of three concrete tracks',
              body: "Track A (vision): photo → structured analysis (e.g. fridge contents → recipe suggestions, whiteboard photo → markdown notes). Track B (audio): meeting recording → transcript + action items with speaker diarisation. Track C (image gen): generate marketing variants from a product photo + brand brief. Pick one — don't try all three."
            },
            {
              step: 'Set up the right specialised model',
              body: "Track A: a VLM (Claude vision, GPT-4o, Qwen-VL). Track B: AssemblyAI or Deepgram (use Whisper only if offline is mandatory). Track C: Flux.1-dev via Replicate or fal.ai with a ControlNet for layout. Resist the urge to use one giant model for everything."
            },
            {
              step: 'Process 5 real examples end to end',
              body: "Use your own data — Sania's product screenshots, Björn's whiteboard photos, real recorded calls (with consent). Synthetic data hides edge cases. Save inputs and outputs side by side for honest evaluation."
            },
            {
              step: 'Build a confidence/escalation path',
              body: "Multimodal models are more confidently wrong than text models. For each output, expose a confidence indicator (model's stated confidence + your own heuristics) and a one-click 'this is wrong' button that saves the bad example for your eval set."
            },
            {
              step: 'Measure cost per task honestly',
              body: "Compute $/task at your model and resolution choices. Multimodal can be 10-50x more expensive than text. If your unit economics don't work, downscale images, batch, or move to a specialised model. PMs especially: this is the conversation product/eng will have repeatedly."
            }
          ],
          ownProject: "Add a second modality to your project. If you built vision, add audio (e.g. the user can also describe the image). If you built audio, add a visual summary output. Notice where the modalities don't blend — the seams are where the next year of product work lives."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 9 — Shipping AI Products
    // -----------------------------------------------------------------
    {
      number: 9,
      phaseId: 'shipping',
      title: 'Shipping AI: latency, cost, observability',
      desc: 'The unglamorous skills that separate prototypes from products',
      lessons: [
        {
          id: 'w9-l1',
          title: 'The production checklist',
          sub: "What you can't skip when real users arrive",
          type: 'lesson',
          duration: '24 min',
          learn: [
            {
              concept: 'Latency is a product feature',
              body: "Users tolerate AI slowness up to a point. The frontier of acceptability in 2026: <500ms time-to-first-token for chat, <2s for completion of short responses, <10s for complex workflows with visible progress. Tactics: streaming, parallel tool calls, speculative decoding, smaller models for routing, prompt caching, and aggressive timeouts. If you don't measure p95 latency per endpoint, you're flying blind."
            },
            {
              concept: 'The cost model is per-token, the budget is per-user',
              body: "Pricing AI features requires translating $/1M tokens into $/user/month. A power user of a RAG product can easily generate $50/month in API costs at GPT-4.5 rates — fatal at a $20 subscription. Tactics: tiered models (cheap for routing, expensive for hard cases), prompt caching, output token limits, rate limits, and quotas surfaced honestly in the UI."
            },
            {
              concept: 'Observability: traces, evals, replays',
              body: "Production AI observability has three layers: traces (what happened on this request — prompts, tool calls, latency), aggregated evals (quality over time, broken down by user segment / model version), and replay (re-run a saved request against a new model or prompt). Langfuse, LangSmith, Braintrust, Helicone, and Arize Phoenix all cover this — pick one and use it from day one."
            },
            {
              concept: 'Safety and abuse: not optional',
              body: "Every public-facing LLM endpoint will be jailbroken, prompt-injected, and used to generate things you didn't intend. Minimum hygiene: input filtering for obvious abuse, output filtering for PII and unsafe content (Llama Guard, OpenAI Moderation), rate limiting per user, audit logging, and an incident playbook. The cost of a published 'AI says X' screenshot is enormous; the cost of basic guards is hours."
            }
          ],
          quiz: {
            q: "Your AI feature has p50 latency of 1.2s but p95 of 18s. Users complain it 'sometimes hangs'. What's the right first move?",
            opts: [
              'Switch to a faster model across the board',
              'Add per-request timeouts (e.g. 6s) with a graceful fallback, then investigate what causes the p95 tail',
              'Cache more aggressively',
              'Add a loading spinner'
            ],
            correct: 1,
            explanation: "The complaint isn't median latency — it's tail latency, which destroys perceived reliability. First, stop the bleeding with a hard timeout + fallback (cached response, simpler model, graceful error). Then trace the slow requests to find the root cause: long retrieval? tool-use loops? slow downstream API? You can't fix what you can't see — but you also shouldn't let users feel it while you investigate."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w9-q1',
          title: 'Production readiness quiz',
          sub: 'Catch what teams ship without',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "You're launching an AI chat feature next Monday. Which of these is the riskiest thing to ship WITHOUT?",
            opts: [
              'A fine-tuned model',
              'Per-user rate limits and abuse logging',
              'A multilingual interface',
              'An animated typing indicator'
            ],
            correct: 1,
            explanation: "Public LLM endpoints without rate limits get abused within hours — by scrapers, by users testing limits, by accidental loops. Without abuse logging you can't even tell. This is the most common 'how did this happen' postmortem in the industry. Fine-tuning, multilingual, and animations are all genuinely nice but won't burn down your runway on Tuesday morning."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w9-p1',
          title: 'Productionise one of your earlier projects',
          sub: 'Pick Week 5 or Week 6 — make it shippable',
          type: 'project',
          duration: '75 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Add tracing to every LLM call',
              body: "Wire Langfuse or LangSmith into your existing project. Every call should log: prompt, completion, tokens, latency, model, user ID (or session ID), and any tool calls. Run 50 requests and look at the traces. You will find at least one surprise."
            },
            {
              step: 'Add input and output guards',
              body: "Input: a quick check (Llama Guard 3, or a regex + small model) for obvious abuse. Output: PII detection (Presidio is free) and a check that the response stays on topic. Log all triggers — don't just block silently."
            },
            {
              step: 'Add cost and rate limits',
              body: "Per-user daily token budget, per-IP rate limit, per-endpoint max tokens out. Use Redis or a hosted service (Upstash Ratelimit). Surface the limit in the UI as friendly error messages, not 429s into a void."
            },
            {
              step: 'Implement model fallback',
              body: "If your primary model returns an error or exceeds a latency threshold, fall back to a cheaper/faster alternative (e.g. Claude Sonnet → Haiku, GPT-4.5 → 4o-mini). Log every fallback. This pattern saves launches when a provider has an outage — which happens 2-3x/year per major provider."
            },
            {
              step: 'Write a one-page runbook',
              body: "Document: how to deploy, how to roll back, who to wake up at 3am, the 5 most likely failure modes and their first-look-at queries. Save it in the repo. This is the artifact that separates 'we built a thing' from 'we own a thing'."
            }
          ],
          ownProject: "Run a deliberate load test: simulate 100 concurrent users hammering your system for 5 minutes. Watch latency, cost, errors. Write what broke first, what you'd fix first. This will be the most useful single hour of the whole course."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 10 — AI for Industrial & Enterprise
    // -----------------------------------------------------------------
    {
      number: 10,
      phaseId: 'shipping',
      title: 'AI in industrial & enterprise contexts',
      desc: "What ASML, Philips, and Brainport actually buy — and why it's different",
      lessons: [
        {
          id: 'w10-l1',
          title: 'The industrial AI playbook',
          sub: 'Safety, compliance, data residency, and the European stack',
          type: 'lesson',
          duration: '24 min',
          learn: [
            {
              concept: 'The four constraints that change everything',
              body: "Industrial AI lives under four constraints consumer AI ignores: (1) data residency — IP cannot leave EU borders or sometimes the building; (2) reliability — a 99% accurate model in a manufacturing line is 1 defect per 100, which is unacceptable; (3) explainability — auditors and regulators need to know why; (4) integration — the AI must speak to PLCs, MES, ERP systems built in the 1990s. Each constraint pushes you toward smaller, owned, specialised models."
            },
            {
              concept: 'The EU AI Act, practically',
              body: "By 2026 the EU AI Act is in full force. Most B2B AI features are 'limited risk' (transparency obligations: tell users they're talking to AI). 'High risk' applies to AI in safety components, employment decisions, biometric ID — full conformity assessment, risk management system, human oversight, post-market monitoring. If you build for Philips Healthcare or ASML metrology, assume high-risk and plan accordingly."
            },
            {
              concept: 'On-prem and the European model stack',
              body: "ASML and Philips increasingly deploy on-prem or in EU-sovereign cloud (OVHcloud, T-Systems). The practical model stack in 2026: Mistral Large/Medium (French, EU-hosted), Aleph Alpha (German, on-prem), Llama 3.3/4 (Meta open weights, self-hosted), Qwen (Alibaba open weights). Anthropic and OpenAI offer European endpoints with data-residency contracts but the gold standard for sensitive IP is open weights running on your own GPUs."
            },
            {
              concept: 'Predictive maintenance and process AI ≠ chatbots',
              body: "The biggest industrial AI use cases aren't generative — they're time-series anomaly detection (turbines, lithography stages, MRI machines), computer vision QA (wafer defects, weld inspection), and optimisation (yield, energy). Generative AI's role here is the glue: surfacing alerts in natural language, generating reports, helping engineers query telemetry. Don't pitch LLMs as the core — pitch them as the interface to existing ML."
            }
          ],
          quiz: {
            q: "You're pitching an AI feature to a Philips Healthcare PM. Which framing is most likely to land?",
            opts: [
              'An LLM that diagnoses patients from symptoms',
              'An LLM that helps service engineers query maintenance logs and generate repair recommendations, with mandatory human approval and full audit trail',
              'A fully autonomous agent that operates the MRI machine',
              'A chatbot that talks to patients about their condition'
            ],
            correct: 1,
            explanation: "Industrial AI wins are almost always 'AI as engineer assistant', not 'AI as replacement decision-maker'. The Philips win-shape: a real workflow, a real user (service engineer), bounded scope, human approval gate, full audit. The other options are either regulatory non-starters or product theatre. This framing is also how you sell to ASML, Vanderlande, and most Brainport employers."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w10-q1',
          title: 'Industrial AI quiz',
          sub: 'Compliance and architecture trade-offs',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Your team wants to add an LLM feature to an ASML tool used by lithography engineers. The data includes recipe parameters considered trade secrets. What's the only viable starting architecture?",
            opts: [
              "OpenAI API with a 'no training' contract clause",
              'Anthropic via AWS Bedrock in eu-central-1 with zero-retention agreement',
              'Self-hosted open-weight model (e.g. Llama 3.3 or Qwen) on internal GPUs, with no outbound calls',
              'Microsoft Copilot via the existing tenant'
            ],
            correct: 2,
            explanation: "For genuine trade-secret data at a company like ASML, even strict contractual guarantees with external APIs are often unacceptable to legal and IP teams. Self-hosted open-weight models on internal infrastructure with strict network controls are the default starting position. You can later argue for hybrid approaches, but the conversation starts on-prem. This is non-negotiable in the Brainport-adjacent industries."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w10-p1',
          title: 'Design an industrial AI proposal',
          sub: 'A real artifact you could send to a Philips or ASML hiring manager',
          type: 'project',
          duration: '60 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick a real Brainport company and a plausible problem',
              body: "Suggestions: ASML field service engineer documentation search, Philips imaging service log analysis, Vanderlande logistics anomaly explanation, NXP supply chain risk briefing, Signify lighting design assistant. Spend 20 minutes researching the company — annual report, recent press releases, job listings — to ground your proposal."
            },
            {
              step: 'Write a 1-page problem statement',
              body: "Who's the user? What's their current workflow and pain? What's the cost of the status quo (time, errors, revenue)? How would AI specifically help — and what would it NOT do? PMs especially: this is the artifact that gets you interviews."
            },
            {
              step: 'Design the architecture with constraints in mind',
              body: "Sketch the stack: model choice (and why — usually open-weight + on-prem), data flow, RAG sources, human approval gates, audit logging, integration points to existing systems. Annotate where the EU AI Act applies and what evidence you'd produce."
            },
            {
              step: 'Define 5 metrics for the first 90 days',
              body: "Mix of leading (adoption, usage frequency, time-on-task) and lagging (defect rate, MTTR, engineer satisfaction). One 'do-no-harm' metric (e.g. zero unauthorised data egress events). PMs: this is what executives read; engineers: this is what you instrument."
            },
            {
              step: 'Identify the 3 hardest objections and answer them',
              body: "Examples: 'our IT will never approve this', 'engineers won't trust it', 'we tried Watson and it failed'. Write a 3-sentence response to each that's honest, not salesy. The strongest candidates in interviews are the ones who've already thought through objections."
            }
          ],
          ownProject: "Pick one job listing at ASML, Philips, or another Brainport company that you'd actually apply for. Map your proposal to the specific responsibilities in the listing. Then take one paragraph from your proposal and put it in your portfolio or LinkedIn — concrete artifacts win over generic 'AI experience' on every resume."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 11 — AI Product Management
    // -----------------------------------------------------------------
    {
      number: 11,
      phaseId: 'shipping',
      title: 'AI product management',
      desc: 'Metrics, roadmaps, and the specific craft of PMing non-deterministic products',
      lessons: [
        {
          id: 'w11-l1',
          title: 'PMing AI is different',
          sub: 'And the patterns that work',
          type: 'lesson',
          duration: '22 min',
          learn: [
            {
              concept: "You don't define the feature — you define the eval",
              body: "In traditional product, the spec is the contract: 'when user clicks X, system does Y'. In AI product, behaviour is statistical. Your spec is the eval: 'on this golden set of inputs, 95% of outputs are graded ≥4/5 on the rubric, and 100% pass the safety filter'. The PM artifact that matters most is the eval set, not the PRD. This is the single biggest mindset shift."
            },
            {
              concept: 'Roadmaps under uncertainty',
              body: "AI feature timelines are uniquely hard because quality is emergent — you don't know if it'll work until you've prototyped. The pattern: every initiative starts with a 1-2 week 'feasibility spike' where you build the crappiest version and measure. Only then do you commit a release date. Roadmaps look like 'spike → decide → build', not 'design → build → ship'. Executives who don't accept this will not get good AI products."
            },
            {
              concept: "Metrics that don't lie",
              body: "Bad AI metrics: 'thumbs up rate' (skewed toward non-users), 'CSAT' (lags by months), 'usage' (vanity if not value). Good AI metrics: task completion rate, time saved per task vs baseline workflow, retention of users who use the AI feature vs those who don't, escalation/correction rate, cost per task. Always include a 'AI off' control if you can — A/B tests reveal whether AI is the cause or just correlated."
            },
            {
              concept: 'Stakeholder management: the trust ladder',
              body: "Stakeholders move through a trust ladder: skeptical → curious → cautiously using → advocating. Your job is to move them up one rung at a time with concrete evidence. Demos are not evidence — they're invitations. Evidence is: 'I shadowed 5 of your team for a week, here's what they did, here's what we'd save'. Lead with the user, follow with the model."
            }
          ],
          quiz: {
            q: "Engineering tells you the new model is 'much better' based on their internal benchmark. What's the right PM response?",
            opts: [
              'Trust them and announce the upgrade',
              "Ask to see the eval set and how it maps to real user tasks; run an A/B on a slice of real traffic before full rollout",
              'Ask for a different benchmark',
              'Wait for user complaints before reverting'
            ],
            correct: 1,
            explanation: "Internal benchmarks rarely capture real user distribution. The PM craft here: insist on (a) seeing the eval set, (b) checking it reflects real traffic, and (c) shadow rollouts (real users, measure outcomes, don't commit until evidence is in). This is the daily reality of AI PM and the muscle that separates senior from junior in interviews."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w11-q1',
          title: 'AI PM scenario quiz',
          sub: 'A real-world judgement call',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Your AI feature has 80% accuracy on a critical task. Sales wants to position it as 'AI-powered'. What's the right product call?",
            opts: [
              "Ship as 'AI-powered' — 80% is great compared to humans at 75%",
              "Ship as an 'AI assistant' with mandatory human review on every output, and metrics on review override rate",
              "Don't ship — 80% isn't good enough",
              'Ship but hide the AI part'
            ],
            correct: 1,
            explanation: "20% wrong rate is too high for autonomous action but very high-value as an assist that lets a human work 5x faster on the 80%. Positioning as 'assistant' with human review aligns expectations and gives you the override-rate metric — your real-world quality signal. Hiding AI is unethical and increasingly illegal under the EU AI Act transparency clauses."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w11-p1',
          title: 'Write a real AI PRD',
          sub: "For one of your earlier projects — the kind you'd send to a CEO",
          type: 'project',
          duration: '60 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick a project and a target audience',
              body: "Use your Week 9 productionised system or your Week 10 industrial proposal. The audience is real: a hiring manager, a fictional VP, or each other reading critically. Write at the level of detail you'd be willing to defend in an interview."
            },
            {
              step: 'Write the problem, user, and outcome sections',
              body: "1 paragraph each. Problem: what's broken today and at what cost. User: a specific persona (named, with a workflow). Outcome: what changes after the feature ships, measurable. No AI vocabulary in this section — it should make sense to a non-technical exec."
            },
            {
              step: 'Define success metrics with thresholds',
              body: "Pick 1 north-star metric, 2-3 input metrics, and 1 guardrail metric. Set v1 launch threshold (the minimum to ship), v1 success threshold (what 'works' looks like at 90 days), and a 'kill criterion' (when you'd shut it down). Numbers must be plausible — don't write '10x improvement' unless you can defend it."
            },
            {
              step: 'Write the eval plan',
              body: "What's your golden set, how do you grade, how often, by whom. This is the section that signals you've actually built AI products. Include: shadow mode plan (run AI in background, log decisions, don't act on them), A/B test plan, and rollback plan."
            },
            {
              step: 'Add risks and open questions',
              body: "5 risks ranked by severity and likelihood. 3 open questions you'd need to resolve before committing engineering. Senior PMs differentiate themselves here: junior PRDs hide risks; senior PRDs surface them with proposed mitigations."
            }
          ],
          ownProject: "Trade PRDs. Each of you reads the other's and writes the single hardest question you'd ask in a design review. Defend your answer in writing. This exercise is the closest you can get to interview prep for AI PM roles."
        }
      ]
    },

    // -----------------------------------------------------------------
    // WEEK 12 — Capstone
    // -----------------------------------------------------------------
    {
      number: 12,
      phaseId: 'shipping',
      title: 'Capstone: ship something real',
      desc: 'One project, fully built, evaluated, and deployed — your portfolio piece',
      lessons: [
        {
          id: 'w12-l1',
          title: 'The capstone framework',
          sub: 'Scope, ship, evaluate, narrate',
          type: 'lesson',
          duration: '20 min',
          learn: [
            {
              concept: 'Scope ruthlessly',
              body: "The single biggest capstone failure mode is overscope. Pick ONE user, ONE workflow, ONE measurable outcome. Resist adding features. A working 2-day project beats an aspirational 2-month project — for learning, for portfolio, for interviews. The best portfolio piece is one thing done well, with the trade-offs documented."
            },
            {
              concept: "Build like you're hiring yourself",
              body: "Imagine an interviewer pulls up your project next month. Can they run it locally in 5 minutes? Is there a README that explains the why, not just the how? Is there a 1-minute demo video? Are there visible evals? Are the architecture decisions defensible in writing? Build the artifact you'd want to show, not just code that runs."
            },
            {
              concept: 'Document the trade-offs',
              body: "Every interesting AI project has trade-offs: chose model X over Y because of cost, chose RAG over fine-tuning because of update cadence, accepted higher latency for better quality. Writing these down is what separates a portfolio piece from a tutorial repo. Junior candidates show code; senior candidates show reasoning."
            },
            {
              concept: 'Narrate it externally',
              body: "Write one public artifact: a blog post on Medium/Substack/your own site, a LinkedIn post with the demo video, or a talk at a local meetup (Eindhoven AI meetups, Brainport AI events). Hiring managers Google candidates; what they find shapes the first call. One thoughtful post outweighs a year of generic 'learning AI' on LinkedIn."
            }
          ],
          quiz: {
            q: "You have one week left and your capstone has 3 unfinished features. The eval set works, the main flow works, but the streaming UI, the multi-language support, and the admin dashboard are half-done. What do you do?",
            opts: [
              'Push through and finish all three',
              "Cut all three, polish what works, and document the rest as 'next steps' with reasoning",
              'Pick the most impressive one (admin dashboard) and finish that',
              'Hide the unfinished features and only show the main flow'
            ],
            correct: 1,
            explanation: "Cutting scope with public reasoning is a senior move. A polished v1 with a clear 'what I'd do next' beats a partially-broken v1.3 every time — both for learning and for portfolio. Documented cuts demonstrate judgement; hidden cuts get exposed in interviews. This is also the daily reality of shipping AI features at any real company."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w12-q1',
          title: 'Capstone readiness quiz',
          sub: 'Is it really ready to show?',
          type: 'quiz',
          duration: '8 min',
          learn: [],
          quiz: {
            q: "Which of these is the LEAST important for your capstone to be portfolio-ready?",
            opts: [
              'A README that explains the problem, decisions, and trade-offs',
              'A working demo (deployed link or 1-minute video)',
              'An eval set with results showing how you measured quality',
              'A custom domain name and polished landing page'
            ],
            correct: 3,
            explanation: "A custom domain and landing page is the lowest-leverage item — it signals 'finished' but says nothing about your skill. Hiring managers care most about: can you describe the problem (README), did you actually build it (demo), and did you measure quality (evals). Spend the polish budget on the README and evals — they're what gets read."
          },
          project: [],
          ownProject: ''
        },
        {
          id: 'w12-p1',
          title: 'Ship your capstone',
          sub: 'One real thing, in the world, with your name on it',
          type: 'project',
          duration: '120 min',
          learn: [],
          quiz: { q: '', opts: ['', '', '', ''], correct: 0, explanation: '' },
          project: [
            {
              step: 'Pick one idea, write a one-line pitch',
              body: "Examples that scope right: 'A semantic search over my Obsidian notes with citation' (Björn), 'A weekly PM digest that synthesises my Linear + Slack into a Friday brief' (Sania), 'A photo-to-recipe assistant trained on our actual fridge' (joint). The pitch fits in one sentence: who, what, why."
            },
            {
              step: 'Build the smallest working version',
              body: "Two days max. No streaming, no auth, no polish. Just: input goes in, useful output comes out. Use the patterns from weeks 5-8. Deploy somewhere accessible (Vercel, Modal, Railway, fly.io) so you can share a link. If you can't deploy it, you don't really have it."
            },
            {
              step: 'Build the eval and run it',
              body: "20-50 examples covering happy path, edge cases, adversarial inputs. Score with your week-4 rubric. Document results in the README with concrete numbers. This is the single biggest differentiator between your project and the average bootcamp output."
            },
            {
              step: 'Productionise the top 3 risks',
              body: "From your week-9 checklist: pick the 3 highest-risk gaps (likely: rate limiting, error handling, prompt injection) and fix those. Don't try to fix everything. Document what you chose to defer and why."
            },
            {
              step: 'Write the public artifact',
              body: "1500-2500 word post: the problem, the architecture, the trade-offs, the eval results, what you'd do next. Include screenshots and a demo video. Publish under your own name. Share with each other, with one mentor, with one Eindhoven AI community (Brainport AI, Eindhoven AI Meetup). This is the artifact that gets you the next interview."
            }
          ],
          ownProject: "Schedule a 30-minute 'demo day' for each other in the week after capstone. Pretend it's an interview. Each demos, the other plays interviewer asking hard questions: 'why this model?', 'what's the cost at 1000 users?', 'how do you know it's actually working?'. The questions you can't answer become next quarter's learning goals."
        }
      ]
    }
  ]
};
