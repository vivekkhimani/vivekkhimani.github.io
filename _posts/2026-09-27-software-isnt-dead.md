---

title: Software Isn't Dead.
date: 2026-09-27
summary: On model releases, build vs buy, and what software is for when agents do the work.
---

There is a lot of anxiety in software right now.

Every model release comes with a wave of posts about which companies it just killed. Every announcement from a lab gets read as a threat to someone. And every few weeks, the bigger version of the story shows up in my feed: software is dead.

I think the fear is fair. Some companies will get wiped out by a release. It has already happened, and it will happen again.

But a model release can't erase the value a company provides overnight. If a product solved a real problem last week, it's probably still solving it this week. What changes is how easily someone else can solve that problem. That's a different question.

---

You see this most clearly in sales right now. Build vs buy used to be a fairly easy conversation. AI has changed that.

If you walk into a renewal and the customer says their engineers built something internally that's good enough, it's tempting to hear that as the market turning against you. Sometimes it is. But I'd ask why they built it.

Was it purely about cost? Or did they build it because your product wasn't solving something they needed? Those are very different problems. The first is a pricing conversation. The second means something was missing, and better tools just made it easier for them to act on it.

There's also a middle case. Maybe your product is the best in its category, or comes as a suite, but a customer only needs one small piece of it. A few years ago they probably would have paid for the whole thing anyway. Now a couple of engineers with good tools can build that piece in a few weeks. That's AI changing the economics, and there's not much to argue with there.

But nobody builds in-house lightly. They know they're signing up to maintain it, fix it when it breaks, and keep it running after whoever built it moves on. They still have to move the data, rebuild workflows, and get people to trust the new thing. So if a customer goes through all of that anyway, something is probably wrong. Maybe you're too expensive. Maybe the product stopped keeping up. Either way, the useful thing to do is be honest about which one it is.

---

Underneath the model-release fear and the build vs buy conversation, I think there's a bigger shift that doesn't get talked about as much. 

When I was at Semgrep, I kept coming back to a thought experiment. If humans had infinite time, resources, and intelligence, what would the software development lifecycle look like? The answer was pretty boring: software is built to help people do their best work. That was true before AI, and it's still true.

<p class="turn" markdown="1">
<span>What changed is the work itself.</span>
</p>

Most security software was built around execution. Detect an issue, triage it, fix it, report on it, repeat. That work didn't go away. It's just continuous, repetitive, context-heavy, and easy to split across parallel tracks. That's exactly the kind of work agents are good at.

What stays with people is the work that requires authority and accountability. Your customer or your boss is still going to call you, not your agent.

Sequoia's recent essay on the cognitive revolution lands in a similar place. It describes what stays human the longest as "wanting things, choosing between them, being accountable for the choice, and being trusted by other people." It puts it more simply: "The machine can draft the treaty. Someone still has to sign it."<sup><a
href="#ref-1" id="cite-1a">1</a></sup>

A lot of software was built for the old version of the job. The companies I'd worry about are the ones still building for it.

Linear is a good example of the other side of this. It sounds basic, but Linear is one of the few tools I've never replaced. I've been using it since 2023, and I'm not sure I ever will. In the last year, though, the way I use it has changed completely.

I barely create tickets by hand anymore. A lot of what ends up in Linear starts in Slack, from a customer conversation or something that came up in the code, and gets picked up by cloud agents from there. My time goes into deciding what's worth doing and reviewing what comes back.

That only works because Linear gave me the pieces to work that way. They seem to understand that nobody wants to manually turn context into tickets anymore. Agents are good at reading that context and doing the parallel work.

So they built for what the human is actually doing now. Kudos to them for that.

---

There's another reason I don't buy the "software is dead" story. Model capabilities are going up on a curve that looks like a hockey stick right now. Adoption is not. The way people actually work is changing much more slowly than what the models can do.

<figure class="chart">
<svg viewBox="0 0 600 340" role="img" aria-label="Model capabilities rising steeply while adoption rises slowly, with the gap between them shaded" style="max-width:100%;height:auto;color:inherit">
<path d="M50,295 C250,290 380,200 430,30 L570,30 L570,190 C480,270 300,295 50,298 Z" class="gap"/>
<line x1="50" y1="300" x2="570" y2="300" stroke="currentColor" stroke-opacity="0.35"/>
<line x1="50" y1="300" x2="50" y2="25" stroke="currentColor" stroke-opacity="0.35"/>
<path d="M50,295 C250,290 380,200 430,30" fill="none" class="cap" stroke-width="3"/>
<path d="M50,298 C300,295 480,270 570,190" fill="none" stroke="currentColor" stroke-width="3"/>
<text x="410" y="45" fill="currentColor" font-size="14" text-anchor="end">Model capabilities</text>
<text x="570" y="268" fill="currentColor" font-size="14" text-anchor="end">Adoption</text>
<text x="455" y="140" fill="currentColor" font-size="14" font-style="italic" opacity="0.8">the gap</text>
<text x="545" y="322" fill="currentColor" font-size="13" opacity="0.6">time</text>
</svg>
<figcaption>A rough sketch of the idea, not to scale.</figcaption>
</figure>

I saw a slide recently that called the space between those two curves the diffusion gap, and labeled it as the opportunity. That framing stuck with me. Most of what it takes to close that gap isn't a better model. It's trust, new workflows, change management, and software built around how people actually work.

The same essay makes a point about how early we still are. The physical half of the economy "has been mechanizing for 200 years. The cognitive half has barely started." It also brings up Jevons: when steam engines got more efficient, Britain didn't burn less coal, it burned far more.<sup><a href="#ref-1" id="cite-1b">1</a></sup> I think software follows the same pattern. When building gets cheap, I'd expect more software, not less, pointed at problems nobody could afford to think about before.

---

So yes, a model release can kill a company, and plenty of teams will have hard renewals because building got cheaper. I'm not going to pretend that isn't happening.

But I don't think software is dead. Good software is still hard to replace, especially when it's deeply embedded in how people work. And the distance between what models can do and what people actually do with them is only getting wider.

Honestly, that's what makes this such an exciting time to be building. Most of the capability is already here, and most of the world hasn't caught up to it yet. I feel pretty lucky to be working on that gap right now.

<section class="refs" markdown="1">
<h2>Citations</h2>
<ol>
<li id="ref-1">Sequoia Capital, <a href="https://sequoiacap.com/article/the-cognitive-revolution">The Cognitive Revolution</a></li>
</ol>
</section>

