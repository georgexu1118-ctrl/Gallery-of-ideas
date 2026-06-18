export interface Thesis {
  slug: string;
  title: string;
  ticker?: string;          // hidden until user adds them
  date: string;             // ISO month: "2026-05"
  dateFormatted: string;    // "May 2026"
  excerpt: string;
  content: string;          // HTML string
  category?: string;
  tags?: string[];
}

export const theses: Thesis[] = [
  {
    slug: "architecture-of-attention",
    title: "The Architecture of Attention",
    date: "2026-05",
    dateFormatted: "May 2026",
    excerpt:
      "The infrastructure layer beneath the next era of computing is not the model — it is everything the model needs to exist.",
    category: "Technology",
    tags: ["AI", "Infrastructure", "Semiconductors"],
    content: `
      <p>There is a category error being made in discussions of artificial intelligence. Most observers focus on the model — the neural network, the algorithm, the training run. They are watching the painting and missing the gallery.</p>

      <p>The infrastructure beneath these models — the chips, the networking fabric, the cooling systems, the power plants, the software orchestration layers — is where the durable value is accumulating. Not in any single model, which may be superseded within months, but in the physical and digital substrate that all future models will require.</p>

      <p>Consider the historical analogy. During the California Gold Rush, the enduring fortunes were not made by the miners who struck gold, but by those who supplied the shovels. Levi Strauss, selling denim. Wells Fargo, moving capital. The railroads, moving everything else. The infrastructure of a rush outlasts any individual claim.</p>

      <blockquote>We are in the infrastructure phase of the AI Gold Rush. The picks and shovels of this era are not metaphorical — they are physical objects measured in nanometers and watts.</blockquote>

      <p>The constraint on AI is not intelligence. Models are improving faster than almost any technology in recorded history. The constraint is the physical world. Compute. Power. Cooling. The ability to move vast amounts of data with minimal latency. These are hard problems. They take years and billions of dollars to address. They create moats that no amount of algorithmic innovation can quickly circumvent.</p>

      <p>The companies positioned at these chokepoints are building something rarer than any model: genuine defensibility. In a world where the frontier model turns over every six to twelve months, the infrastructure that enables the frontier does not. It compounds.</p>

      <p>This is not a thesis about AI as a concept. It is a thesis about who captures the value when intelligence becomes abundant. The answer, I believe, is those who own what intelligence runs on.</p>
    `,
  },
  {
    slug: "abundance-machines",
    title: "Abundance Machines",
    date: "2026-03",
    dateFormatted: "March 2026",
    excerpt:
      "We are witnessing the early stages of a deflationary revolution in knowledge work. The firms that own the distribution of this revolution will not be obvious at first.",
    category: "Technology",
    tags: ["AI", "Software", "Productivity"],
    content: `
      <p>Every generation or so, a technology appears that does not merely improve upon what came before — it redefines what is possible. The printing press. The steam engine. The transistor. The internet. Each created abundance where scarcity had existed. Each destroyed old industries while building new ones an order of magnitude larger.</p>

      <p>We are in the early months of one of these moments. The difference this time is that the resource being made abundant is cognition itself.</p>

      <p>The implications are difficult to reason about clearly because they compound in non-linear ways. When the cost of a task falls by 10x, demand increases modestly. When it falls by 100x, entirely new categories of activity become possible. When it falls by 1000x, civilization reorganizes around it.</p>

      <blockquote>The question is not whether AI will change the economics of knowledge work. It already has. The question is who will capture the resulting surplus.</blockquote>

      <p>The first-order answer — the model providers — is probably wrong, or at least incomplete. History suggests that in commodity markets, distribution beats production. The company that delivers coal to the most homes captures more value than the mine that produces the purest coal.</p>

      <p>The second-order answer — the application layer, the companies that embed intelligence into workflows that customers cannot easily abandon — is more durable. These firms benefit from both the declining cost of their inputs and the increasing switching costs of their outputs.</p>

      <p>I am looking for companies that are quietly becoming the pipes through which the abundance flows. They are rarely the most celebrated names in any given week. They rarely appear on the covers of magazines. But they are being built into the fabric of how work gets done, and that is worth paying attention to.</p>
    `,
  },
  {
    slug: "great-energy-reordering",
    title: "The Great Energy Reordering",
    date: "2026-01",
    dateFormatted: "January 2026",
    excerpt:
      "The world's power grid is being reconstructed from first principles. For the first time in a century, energy infrastructure is a growth industry.",
    category: "Energy",
    tags: ["Energy", "Infrastructure", "Climate"],
    content: `
      <p>For most of the twentieth century, energy infrastructure was a story of incremental improvement. The basic architecture of power generation — centralized plants, long-distance transmission, regulated utilities — was established by 1930 and has not fundamentally changed since. Improvements came at the margins. Efficiency crept upward. Costs fell slowly.</p>

      <p>This is no longer the case. Three forces are converging to produce the most significant restructuring of the global energy system since electrification itself.</p>

      <p>The first is the economics of solar and wind. Costs have fallen faster than almost any technology in history — faster than semiconductors, faster than mobile phones. At current trajectories, new renewable capacity is now cheaper than running existing fossil fuel plants in most of the world. This is not a policy outcome. It is a market outcome.</p>

      <blockquote>The transition is not a question of if. It is a question of who captures the value of the reconstruction, and who gets stranded on the wrong side of it.</blockquote>

      <p>The second is the electrification of everything. Transportation, heating, industrial processes — all are moving toward electricity as their primary energy source. This is not a marginal change to electricity demand. It is a doubling or tripling of total demand over the next two decades.</p>

      <p>The third, and least appreciated, is the AI-driven demand explosion. Data centers are among the most energy-intensive facilities ever built. The buildout currently underway is unprecedented in speed and scale. The power grid was not designed for it.</p>

      <p>Together, these forces create a rare investment environment: one where the need for infrastructure is urgent, obvious, and largely undisputed, but where the capital has not yet arrived at the scale required. I am looking at the companies building the new grid — not the generators, but the connective tissue between generation and consumption.</p>
    `,
  },
  {
    slug: "pharmacists-revolution",
    title: "The Pharmacist's Revolution",
    date: "2025-11",
    dateFormatted: "November 2025",
    excerpt:
      "Biology is being translated into software. The companies that master this translation will define the next era of medicine.",
    category: "Healthcare",
    tags: ["Biotech", "AI", "Drug Discovery"],
    content: `
      <p>The history of medicine can be divided into two eras: before germ theory and after. Before, illness was mysterious and treatment was largely superstitious. After, causation became visible, and for the first time, cures became systematically possible.</p>

      <p>We are at the beginning of a third era. The code beneath biology is becoming legible. Protein folding, once a computational problem estimated to require centuries of computation, was solved in months. Gene editing has moved from theoretical to clinical. Drug discovery, once a process of brute-force trial and error requiring billions of dollars and decades, is being systematized.</p>

      <p>The implications are not subtle. A drug discovery process that once took fifteen years and cost $2 billion on average is being compressed, first to years, then to months. The pipeline of candidates that can be tested simultaneously is growing from hundreds to millions.</p>

      <blockquote>This is not merely a technology story. It is a story about what becomes possible when biological complexity becomes computable.</blockquote>

      <p>The companies I find most interesting are not the ones making the loudest claims about their AI capabilities. They are the ones that have built proprietary data assets — the real constraint in biological AI — and are translating that data into clinical results. Results are the only currency that matters.</p>

      <p>The failure mode for this thesis is pace. Biology is slower than software. Clinical trials cannot be compressed beyond certain biological limits. The timeline between discovery and revenue is long. Patience is not optional — it is required. But for those willing to think in years rather than quarters, the opportunity is generational.</p>
    `,
  },
  {
    slug: "where-the-capital-flows",
    title: "Where the Capital Flows",
    date: "2025-09",
    dateFormatted: "September 2025",
    excerpt:
      "Private markets have become the primary venue for value creation. The public market is the exit, not the arena.",
    category: "Finance",
    tags: ["Private Markets", "Capital Markets", "Alternatives"],
    content: `
      <p>Something fundamental has changed in the architecture of capital formation, and it has not received the attention it deserves. The public equity market — long the defining institution of capitalism, the place where companies went to raise money, to grow, and to be valued by the crowd — is no longer where the action is.</p>

      <p>Consider the data. In 2000, a typical technology company went public at a valuation of a few hundred million dollars, with several years of public-market compounding available to ordinary investors. Today, companies routinely stay private until they are worth tens of billions. By the time they reach public markets, the majority of the value creation has already occurred — in rounds accessible only to institutional investors, sovereign wealth funds, and the very wealthy.</p>

      <blockquote>The public market has become the liquidity event, not the growth story. This is a structural shift, not a temporary one.</blockquote>

      <p>The causes are multiple and reinforcing. Sarbanes-Oxley made public reporting burdensome. Low interest rates for two decades made private capital cheap and abundant. The growth of the venture and private equity industries created an alternative infrastructure for capital allocation. And the companies themselves — having watched predecessors get destroyed by quarterly earnings pressure — learned to stay private longer.</p>

      <p>The implication for investors is uncomfortable. Access matters more than it used to. The relevant question is no longer just what to buy, but how to gain access to the vehicles that can participate in the earlier stages. The compounding that used to happen in public markets is happening earlier, in private markets, and at a scale and pace that was not previously possible.</p>

      <p>I am thinking carefully about which listed vehicles provide genuine exposure to this shift — not watered-down versions, but real access to the private market compounding cycle.</p>
    `,
  },
];

export function getThesis(slug: string): Thesis | undefined {
  return theses.find((t) => t.slug === slug);
}

export function getAllTheses(): Thesis[] {
  return [...theses].sort((a, b) => b.date.localeCompare(a.date));
}
