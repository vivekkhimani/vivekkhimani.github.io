---
title: Software Isn't Dead. The Work Moved.
date: 2026-09-27
summary: On model releases, build vs buy, and what software is for when agents do the work.
---

There is a lot of anxiety in software right now.

Every model release comes with a wave of posts about which companies it just killed. Every
announcement from a lab gets read as a threat to someone. And the bigger version of the
story, the one where software is dead altogether, shows up in my feed every few weeks.

I think the fear is fair. Some companies will get wiped out by a release. It has already
happened and it will happen again.

But a model release can't erase the value a company provides overnight. If a product was
solving a real problem for people last week, it's probably still solving it this week.
What a release changes is how easily someone else can solve that problem, which is a
different question.

---

You see this most clearly in sales right now. Build vs buy used to be a fairly easy
conversation. AI has changed that, and it would be silly to pretend otherwise.

If you walk into a renewal and the customer says their engineers built something
internally that's good enough, it's tempting to hear that as the market turning against
you. Sometimes it is. But the question I'd ask first is why they built it.

Was it purely about cost? Or did they try building it because your product wasn't solving
something they really needed?

Those are very different answers. The first is a pricing conversation. The second means
something was missing, and better tools just made it easier for them to act on it.

There's also a middle case that I think is completely valid. Say your product is the best
in its category, or it comes as a suite. A customer needs one small piece of it for a very
specific use case. They don't need the rest and don't want to pay for it. A few years ago
they probably would have paid anyway. Now a couple of engineers with good tools can build
that one piece in a few weeks. That's AI changing the economics, and there isn't much to
argue with there.

What I'd keep in mind is that nobody builds in-house lightly. The team knows they're
signing up to maintain it, fix it when it breaks, and keep it running after whoever built
it moves on.

And maintenance is only part of it. Even if a new model can do some of what your product
does, someone still has to build around it, move the data over, and get a team to trust
the new thing. People have workflows and habits built around your product. Moving off it
means asking all of them to unlearn something, usually while they're busy doing their
actual jobs. That change management is a real cost, and companies know it.

So if a customer goes through all of that anyway, something is really wrong. It could be
price, or it could be that the product stopped keeping up with what they needed. Either
way, the useful thing to do as a company is be honest with yourself about which one it is.

---

Underneath both the model-release fear and the build vs buy conversation, I think there's
a bigger shift that doesn't get talked about as much.

When I was at Semgrep, I kept coming back to a thought experiment. If humans had infinite
time, resources, and intelligence, what would the software development lifecycle look
like? The first answer I landed on was pretty boring. Software is built to help people do
their best work. That was true before AI and it's still true.

<p class="turn" markdown="1">
<span>What changed is the work itself.</span>
</p>

Most security software, including the product I worked on, was built around execution.
Detect an issue, triage it, fix it, report on it, repeat. That work didn't go away. But
it's continuous, repetitive, needs a lot of context, and splits easily across parallel
tracks, which is exactly the kind of work agents are good at.

What stays with people is the work that needs authority and accountability rather than
effort.

<p class="stanza" markdown="1">
<span>Deciding what matters and how much risk is acceptable.</span>
<span>Signing off on the calls that can't be undone.</span>
<span>Supervising the agents doing the execution, and improving how they work over time.</span>
</p>

You can delegate execution, but you can't delegate responsibility.

Sequoia's recent essay on the cognitive revolution lands in a similar place. It describes
what stays human the longest as "wanting things, choosing between them, being accountable
for the choice, and being trusted by other people." Then it puts it more simply than I
did: "The machine can draft the treaty. Someone still has to sign it."<sup><a
href="#ref-1" id="cite-1a">1</a></sup>

A lot of software was built for the old version of the job. The companies I'd worry about
are the ones still building for it.

Linear is a good example of the other side of this.

It might sound basic, but it's one of the few tools I've never replaced, and I'm not sure
I ever will. I've been using it since 2023 and have always liked it. In the last year,
though, the way I use it has changed completely.

I barely create tickets by hand anymore. A lot of what ends up in Linear starts in Slack,
from a customer conversation or something that came up in the code, and gets picked up by
cloud agents from there. My time goes into deciding what's worth doing and reviewing what
comes back.

That only works because Linear gave me the pieces to work that way. They seem to
understand that nobody wants to manually turn context into tickets anymore, when agents
are good at reading that context and doing a lot of the parallel work. So they built for
what the human is actually doing now. Kudos to them for that.

---

There's one more reason I don't buy the "software is dead" story, and it's the one I'm
most excited about.

Model capabilities are going up on a curve that looks like a hockey stick right now.
Adoption is not. Across industries, companies, and people, the way work actually gets done
is changing much more slowly than what the models can do.

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

I saw a slide recently that called the space between those two curves the diffusion gap,
and labeled it as the opportunity. That framing stuck with me.

Most of what it takes to close that gap isn't a better model. It's the stuff I've been
talking about in this post: change management, trust, workflows people are actually
willing to switch to, and software built around the work humans do now. That's software's
job, and it's a big one.

The same essay makes a point about how early we still are. The physical half of the
economy "has been mechanizing for 200 years. The cognitive half has barely started." It
also brings up Jevons: when steam engines got more efficient, Britain didn't burn less
coal, it burned far more.<sup><a href="#ref-1" id="cite-1b">1</a></sup> I think software
follows the same pattern. When building gets cheap, I'd expect more software, not less,
pointed at problems nobody could afford to think about before.

---

So yes, a model release can kill a company, and plenty of teams will have hard renewals
because building got cheaper. I'm not going to pretend that isn't happening.

But I don't think software is dead. Something built with real taste, that clearly adds
value and keeps up with how people's work is changing, is still very hard to replace. And
the distance between what models can do and what people actually do with them is only
getting wider.

Honestly, that's what makes this such an exciting time to be building. Most of the
capability is already here, and most of the world hasn't caught up to it yet. I feel
pretty lucky to be working on that gap right now.

<section class="refs" markdown="1">
<h2>Citations</h2>
<ol>
<li id="ref-1">Sequoia Capital, <a href="https://sequoiacap.com/article/the-cognitive-revolution">The Cognitive Revolution</a></li>
</ol>
</section>
