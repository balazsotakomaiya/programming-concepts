// The concept graph.
//
// Each node is a tuple: [id, name, tier, blurb, parents]
// where every parent is [parentId, whyThisEdgeExists] — the first parent is
// the "primary" one that defines the node's place on the tidy-tree spine, and
// any further parents are cross-links.

export type Parent = [id: string, why: string];
export type NodeTuple = [
  id: string,
  name: string,
  tier: number,
  blurb: string,
  parents: Parent[],
];

export interface Tier {
  n: number;
  name: string;
  note: string;
}

export const NODES: NodeTuple[] = [
// ── TIER 1 · FOUNDATIONS ───────────────────────────────────────────────
["state","State",1,"A value that persists across time. Everything a program 'knows' at a moment.",[]],
["control-flow","Control Flow",1,"The order statements run in: sequence, branch, loop, jump.",[]],
["procedure","Procedures & Functions",1,"A named, reusable, parameterised block of control flow.",[
  ["control-flow","A procedure is control flow you can name and jump into and out of on demand. Without branching and sequencing there is nothing worth naming."],
  ["state","Parameters and locals are state whose lifetime is bound to a single call — that binding is what makes a call reusable."]]],
["call-stack","Call Stack",1,"The runtime structure holding each call's locals and return address.",[
  ["procedure","Once a procedure can call another and expect to come back, the runtime needs somewhere to remember where 'back' was. That place is a stack because calls nest strictly."]]],
["recursion","Recursion",1,"A procedure defined in terms of itself, with a base case to terminate.",[
  ["procedure","Recursion is just a procedure calling itself; it needs nothing new except the willingness to trust the abstraction mid-definition."],
  ["call-stack","Each recursive call needs its own frame of locals. Recursion is only safe once you understand the stack it consumes."]]],
["scope","Scope & Lifetime",1,"Where a name is visible, and how long the thing it names lives.",[
  ["procedure","Procedures create the first boundary: names inside a call are not names outside it. Scope is the rule that makes that boundary precise."],
  ["state","Lifetime is a question about state — when is this value created, and when may it be destroyed?"]]],
["data-structures","Data Structures",1,"The shapes state takes when there is more than one value: arrays, maps, trees, graphs.",[
  ["state","A data structure is state with an internal arrangement chosen to make some operations cheap and others expensive."]]],
["algorithms","Algorithms",1,"A finite procedure that transforms input to output correctly.",[
  ["data-structures","An algorithm is only as good as the structure it walks. Sorting, searching and traversal are defined against a shape."],
  ["control-flow","Every algorithm is loops and branches — it is control flow with a proof of correctness attached."]]],
["complexity","Complexity & Big-O",1,"How cost grows with input size, ignoring constants.",[
  ["algorithms","You cannot compare two algorithms without a cost model. Big-O is the coarsest model that still predicts what breaks at scale."]]],
["memory-model","Memory Model",1,"Stack vs heap, references vs values, layout, locality.",[
  ["state","State has to physically live somewhere. The memory model is the answer to 'where', and it leaks into everything above it."],
  ["call-stack","The stack is one half of the model; anything outliving a call must go elsewhere — that gap is exactly why the heap exists."]]],
["mutability","Mutability",1,"Whether a value can be changed in place after creation.",[
  ["state","Mutability is the one axis of state that decides almost everything downstream: aliasing, threading, caching, reasoning."]]],
["types","Types",1,"A claim about which values a piece of state may hold, and what may be done to it.",[
  ["state","A type is a constraint on state, asserted before you run. It converts a class of runtime failures into a class of things you cannot write."]]],
["errors","Errors & Failure",1,"The paths where the operation does not do the thing it is named for.",[
  ["control-flow","Failure is control flow that abandons the happy path. Every error mechanism — codes, exceptions, results — is a different jump."]]],
["io","I/O and the Outside World",1,"Reading and writing things you do not control: disk, network, clock, user.",[
  ["state","I/O is state that lives outside your process, so you can neither trust it nor undo it."]]],
["naming","Naming",1,"Choosing words that tell the reader what a thing is and is not.",[
  ["procedure","The instant you can name a unit of behaviour, the name becomes the interface most readers will ever see. Naming is the cheapest and most-used documentation."]]],

// ── TIER 2 · ABSTRACTION & STRUCTURE ──────────────────────────────────
["abstraction","Abstraction",2,"Using something correctly without knowing how it works.",[
  ["procedure","The function is the first abstraction: a caller relies on what it does and ignores how. Everything else in this tree is that same trick, applied at larger scale."],
  ["naming","An abstraction you cannot name is one nobody can find or reuse. The name is the handle."]]],
["leaky-abstraction","Leaky Abstractions",2,"Every abstraction eventually forces you to understand what it hid.",[
  ["abstraction","The cost of hiding: when performance, failure or ordering bleeds through, the user must reason about both levels at once."],
  ["complexity","Leaks are usually cost leaks — the abstraction was fine until the cost model underneath it stopped matching your assumptions."]]],
["encapsulation","Encapsulation",2,"Hiding internal state and exposing only the operations allowed on it.",[
  ["abstraction","Encapsulation is abstraction pointed at state rather than behaviour: you may use the data, not touch it."],
  ["mutability","Hiding state only matters because mutable state is dangerous when shared. Immutable data needs no protection."]]],
["interfaces","Interfaces & Contracts",2,"The promised surface of a component, independent of its implementation.",[
  ["abstraction","An interface is an abstraction made explicit and checkable — the boundary, written down."],
  ["types","A contract needs a language to be stated in. Types are that language, whether checked by a compiler or a docstring."]]],
["modularity","Modularity",2,"Splitting a system into units that can be understood and changed alone.",[
  ["encapsulation","A module is an encapsulation boundary scaled up from one object to a whole area of the system."],
  ["interfaces","Units are only separable if what passes between them is a stated contract instead of shared internals."]]],
["composition","Composition",2,"Building bigger behaviour by wiring smaller parts together.",[
  ["procedure","Calling one function from another is composition. Everything else is the same move with more ceremony."],
  ["modularity","Modules are worthless if they cannot be recombined. Composition is what you buy with the cost of splitting."]]],
["objects","Objects",2,"State bundled with the operations permitted on it.",[
  ["encapsulation","An object is the smallest unit that owns state and guards it behind methods — encapsulation given a runtime identity."],
  ["types","A class is a type: it says what shape the state has and which messages are legal."]]],
["inheritance","Inheritance",2,"Defining a type as a specialisation of another, reusing its structure.",[
  ["objects","Inheritance only exists once behaviour and state are bundled — it is a way of extending that bundle."]]],
["polymorphism","Polymorphism",2,"One name, many implementations, chosen by the value at hand.",[
  ["interfaces","Polymorphism is only possible when the caller depends on a contract rather than a concrete thing. The interface is the seam."],
  ["types","Which implementation runs is a question about the type of the value — statically or at dispatch time."]]],
["generics","Generics (Parametric Polymorphism)",2,"Code written once, over any type, without knowing which.",[
  ["polymorphism","Where subtype polymorphism varies the behaviour, generics vary the type while keeping behaviour identical. Same seam, other axis."],
  ["types","Generics are functions in the language of types: they take a type and return a type."]]],
["immutability","Immutability",2,"Values that cannot change after construction; change means a new value.",[
  ["mutability","Immutability is the deliberate refusal of mutation. It trades allocation for the ability to reason without checking who else holds a reference."]]],
["pure-functions","Pure Functions",2,"Same input, same output, no observable effects.",[
  ["procedure","A pure function is the strictest possible contract for a procedure: everything it depends on is in the arguments."],
  ["immutability","Purity is unenforceable if callees can quietly mutate what you passed them. Immutable inputs are what make purity real."]]],
["hof","Higher-Order Functions",2,"Functions that take or return functions.",[
  ["procedure","Once a function is a value like any other, it can be passed and returned. That single move is what makes behaviour parameterisable."],
  ["abstraction","HOFs let you abstract over the *varying step* — map, filter, retry — rather than over data."]]],
["closures","Closures",2,"A function bundled with the environment it was defined in.",[
  ["hof","Returning a function is useless if it forgets the values it was built with. Closures make returned functions carry their context."],
  ["scope","A closure is a scope that outlives the call that created it, which is precisely why lifetime stops being simple."]]],
["adts","Algebraic Data Types",2,"Compound types built from products (and) and sums (or).",[
  ["types","Products and sums are the two ways to combine types. Records and enums are the whole vocabulary of data modelling."],
  ["data-structures","ADTs are the type-level description of the shapes data structures actually take, including 'exactly one of these cases'."]]],
["pattern-matching","Pattern Matching",2,"Branching on the structure of a value and destructuring it in one step.",[
  ["adts","A sum type is only useful if you can ask which case you have. Matching is that question, with exhaustiveness checked."],
  ["control-flow","Matching is a branch whose conditions the compiler can verify cover every possibility."]]],
["result-vs-exception","Exceptions vs Result Types",2,"Failure as an out-of-band jump, or as a value in the return type.",[
  ["errors","Both are answers to the same question: how does a callee tell a caller it failed?"],
  ["adts","A Result is a sum type — success or failure — which puts failure into the signature where the type checker can see it."]]],
["iterators","Iterators & Laziness",2,"Producing a sequence one element at a time, on demand.",[
  ["data-structures","An iterator abstracts traversal away from the structure, so one loop works over arrays, trees and streams alike."],
  ["closures","A lazy sequence is a suspended computation holding its own state — a closure you resume."]]],
["resource-mgmt","Resource Management",2,"Acquiring and releasing files, sockets, locks deterministically.",[
  ["scope","Tying release to scope exit (RAII, defer, with) is the only discipline that survives early returns and exceptions."],
  ["memory-model","Memory is the resource with automatic help; everything else is the same problem without a collector to save you."]]],
["gc","Garbage Collection",2,"Reclaiming memory no longer reachable from the program.",[
  ["memory-model","GC is an answer to heap ownership: nobody frees, the runtime proves unreachability instead."]]],
["threads","Threads & Processes",2,"More than one control flow alive at the same time.",[
  ["control-flow","Concurrency is the moment there is no single 'next statement'. Every hard thing below follows from that."],
  ["memory-model","Threads share memory; processes do not. That one distinction determines which bugs are possible."]]],
["static-dynamic","Static vs Dynamic Typing",2,"Checking types before running, or as you run.",[
  ["types","The same claim, verified at two different moments. The choice trades feedback speed against expressiveness and ceremony."]]],
["type-inference","Type Inference",2,"The compiler deducing types you did not write.",[
  ["types","Inference is what makes strong typing bearable: full checking, without the annotation tax."]]],
["testing","Testing",2,"Executing code against expectations to find the gap between intent and behaviour.",[
  ["interfaces","You can only test what you can call. The contract is the test's grip on the system; untestable usually means unencapsulated."],
  ["procedure","A test is a procedure that calls another procedure and asserts about the result — nothing more exotic."]]],

// ── TIER 3 · PRINCIPLES & PATTERNS ────────────────────────────────────
["coupling-cohesion","Coupling & Cohesion",3,"How much modules depend on each other; how much each belongs together.",[
  ["modularity","These are the two measurements that tell you whether your module boundary was drawn in the right place."],
  ["interfaces","Coupling is measured in what you know about the other side. A narrow contract is literally less coupling."]]],
["soc","Separation of Concerns",3,"One reason to care per unit.",[
  ["modularity","Concerns are the criterion for where to cut. Split by what changes together, not by technical layer alone."],
  ["coupling-cohesion","High cohesion *is* one concern per unit, stated in measurement terms."]]],
["dry","DRY",3,"One authoritative representation of each piece of knowledge.",[
  ["abstraction","Removing duplication means naming the shared thing — which is abstraction. DRY is the pressure that produces abstractions."]]],
["kiss","KISS",3,"Prefer the simplest thing that works.",[
  ["complexity","Complexity is the actual budget you spend. KISS is the rule that stops you spending it on nothing."],
  ["leaky-abstraction","Every abstraction you add can leak. Simplicity is partly a refusal to buy things whose leaks you will pay for later."]]],
["yagni","YAGNI",3,"Do not build for a future you have not been shown.",[
  ["kiss","YAGNI is KISS applied along the time axis: the simplest thing that works *today*."],
  ["dry","The counterweight to DRY. Two things that look alike but change for different reasons must not be merged yet."]]],
["demeter","Law of Demeter",3,"Talk only to your immediate collaborators.",[
  ["encapsulation","a.b().c().d() reaches through two objects' internals — it is an encapsulation breach written as punctuation."],
  ["coupling-cohesion","Each dot in the chain is another type you now depend on, and another type whose change can break you."]]],
["solid","SOLID",3,"Five principles for keeping object-oriented designs changeable.",[
  ["objects","All five are about how classes and their dependencies should be arranged."],
  ["coupling-cohesion","SOLID is, in one sentence, a recipe for high cohesion and low, *directed* coupling."]]],
["srp","Single Responsibility",3,"A module should have one reason to change.",[
  ["solid","The S. It is the cohesion half of SOLID, stated as a test you can apply to a class."],
  ["soc","SRP is separation of concerns scoped down to a single unit of code."]]],
["ocp","Open/Closed",3,"Open to extension, closed to modification.",[
  ["solid","The O. Extension without editing existing code is only possible if there is a seam."],
  ["polymorphism","That seam is polymorphism: add a new implementation instead of adding a new branch."]]],
["lsp","Liskov Substitution",3,"A subtype must be usable anywhere its supertype is.",[
  ["solid","The L. It is what makes 'is-a' safe rather than merely convenient."],
  ["inheritance","Inheritance without LSP produces subclasses that break their parent's promises — the classic Square/Rectangle failure."]]],
["isp","Interface Segregation",3,"Do not force clients to depend on methods they do not use.",[
  ["solid","The I. A fat interface couples every client to every capability."],
  ["interfaces","Splitting an interface splits the dependency graph; the contract is the unit of coupling."]]],
["dip","Dependency Inversion",3,"Depend on abstractions; let the details point inward.",[
  ["solid","The D, and the load-bearing one — it is what lets a policy stay ignorant of its plumbing."],
  ["polymorphism","Inversion needs a stable contract that both sides can be written against. That contract is a polymorphic seam."]]],
["ioc","Inversion of Control",3,"The framework calls you; you do not call it.",[
  ["dip","IoC is DIP applied to who owns the control flow, not merely who owns the type dependency."]]],
["di","Dependency Injection",3,"Supply a component's collaborators from outside instead of constructing them inside.",[
  ["ioc","DI is the ordinary mechanical realisation of IoC: someone else decides what you get."],
  ["testing","Injection is what makes a unit testable — you can only substitute a collaborator you did not construct yourself."]]],
["comp-over-inherit","Composition over Inheritance",3,"Prefer has-a to is-a.",[
  ["comp","placeholder"]]],
["patterns","Design Patterns",3,"Named, recurring solutions to recurring design problems.",[
  ["polymorphism","Nearly every classic pattern is polymorphism plus a naming convention. The seam is the pattern."],
  ["encapsulation","Patterns are mostly answers to: what should this object be allowed to know?"]]],
// Creational
["factory","Factory Method",3,"Defer which concrete class to instantiate to a subclass or function.",[
  ["patterns","Creational: it removes the 'new Concrete()' that would otherwise hard-code a dependency."],
  ["dip","Construction is the one place a caller *must* name a concrete type. A factory is where you quarantine that."]]],
["abstract-factory","Abstract Factory",3,"Create families of related objects without naming the family.",[
  ["factory","One factory per object, generalised to one factory per consistent set of objects."]]],
["builder","Builder",3,"Assemble a complex object step by step.",[
  ["patterns","Creational: it replaces a constructor with ten arguments and four illegal combinations."],
  ["immutability","Builders exist largely to construct immutable objects that must be fully valid the moment they are born."]]],
["singleton","Singleton",3,"Exactly one instance, globally reachable.",[
  ["patterns","Creational, and the one most often a mistake: it is global mutable state wearing a class."],
  ["threads","Its ugliest problems are concurrency problems — lazy init races and shared mutable state."]]],
["prototype","Prototype",3,"Create new objects by cloning an existing one.",[
  ["patterns","Creational: when construction is expensive or the configuration matters more than the class."]]],
["adapter","Adapter",3,"Translate one interface into another.",[
  ["patterns","Structural: it is the pattern for reusing something whose shape you do not control."],
  ["interfaces","An adapter exists only because two contracts disagree. It is the seam made physical."]]],
["decorator","Decorator",3,"Wrap an object to add behaviour while keeping its interface.",[
  ["patterns","Structural: extension without subclassing, stackable at runtime."],
  ["comp-over-inherit","It is the canonical demonstration that has-a beats is-a — behaviours compose rather than combinatorially explode."]]],
["facade","Facade",3,"One simple entry point over a complicated subsystem.",[
  ["patterns","Structural: a deliberate, narrow abstraction over a wide surface."],
  ["demeter","A facade exists precisely so callers need not chain through your internals."]]],
["proxy","Proxy",3,"A stand-in that controls access to a real object.",[
  ["patterns","Structural: same interface, but interposed — for laziness, caching, remoting or access control."],
  ["decorator","Structurally identical to a decorator; the difference is intent — a proxy controls access, a decorator adds behaviour."]]],
["composite-p","Composite",3,"Treat individual objects and trees of objects uniformly.",[
  ["patterns","Structural: it makes recursion in the data invisible to the caller."],
  ["recursion","The pattern is recursion expressed in types — a leaf and a branch answer the same messages."]]],
["bridge","Bridge",3,"Split an abstraction from its implementation so both can vary.",[
  ["patterns","Structural: it prevents the class explosion you get when two dimensions both need subclassing."],
  ["comp-over-inherit","The split is a has-a relationship replacing a two-dimensional inheritance matrix."]]],
["flyweight","Flyweight",3,"Share the immutable parts of many similar objects.",[
  ["patterns","Structural: a memory-driven pattern, not a modelling one."],
  ["immutability","Sharing is only safe because the shared part cannot be mutated by any holder."]]],
["strategy","Strategy",3,"Make the algorithm a parameter.",[
  ["patterns","Behavioural, and the purest expression of the family: swap the varying step, keep the shape."],
  ["hof","In a language with first-class functions, Strategy is a function argument. The pattern is what you build when you lack that."]]],
["observer","Observer",3,"Subjects notify registered listeners on change.",[
  ["patterns","Behavioural: it inverts the dependency — the subject knows nothing about who is listening."],
  ["ioc","Callbacks mean the subject calls you. It is IoC at the level of a single object relationship."]]],
["command","Command",3,"Turn an invocation into an object.",[
  ["patterns","Behavioural: once an action is data you can queue it, log it, undo it, retry it, ship it over a wire."]]],
["state-p","State Pattern",3,"Represent each state as an object that handles behaviour for that state.",[
  ["patterns","Behavioural: it replaces a sprawling switch on a status field with dispatch."],
  ["polymorphism","The switch becomes a vtable. Adding a state stops meaning editing every method."]]],
["template-method","Template Method",3,"Fix the skeleton of an algorithm, let subclasses fill in steps.",[
  ["patterns","Behavioural: the inheritance-based sibling of Strategy."],
  ["inheritance","It is one of the few honest uses of inheritance — the base class owns the sequence, the subclass owns a step."]]],
["visitor","Visitor",3,"Add operations to a type hierarchy without editing it.",[
  ["patterns","Behavioural: it trades easy new operations for hard new types — the expression problem, chosen deliberately."],
  ["pattern-matching","Visitor is what you write when the language has no pattern matching; matching is what you use when it does."]]],
["iterator-p","Iterator Pattern",3,"Expose sequential access without exposing the structure.",[
  ["patterns","Behavioural: the pattern that got absorbed into every modern standard library."],
  ["iterators","This is the pattern formalised as a language feature."]]],
["mediator","Mediator",3,"Route interactions between components through a hub.",[
  ["patterns","Behavioural: it converts an n-to-n mesh of references into n-to-1."],
  ["coupling-cohesion","It is a direct trade — fewer edges between peers, at the cost of one component that knows everyone."]]],
["chain","Chain of Responsibility",3,"Pass a request along a chain until something handles it.",[
  ["patterns","Behavioural: the sender needs no idea which handler will take it. Middleware stacks are this pattern."]]],
["memento","Memento",3,"Capture and restore an object's state without breaking encapsulation.",[
  ["patterns","Behavioural: undo, snapshots and checkpoints, without publishing the internals."],
  ["encapsulation","The whole difficulty is exporting state while keeping it opaque to everyone but its owner."]]],
["interpreter","Interpreter",3,"Represent a grammar as a structure and evaluate it.",[
  ["patterns","Behavioural: when the problem is best expressed as a little language."],
  ["composite-p","An abstract syntax tree is a Composite; interpretation is a recursive walk over it."]]],
["smells","Code Smells",3,"Surface symptoms that usually indicate a deeper design problem.",[
  ["coupling-cohesion","Most smells are coupling or cohesion failures made visible: feature envy, shotgun surgery, god class."]]],
["refactoring","Refactoring",3,"Changing structure without changing behaviour.",[
  ["smells","Smells are the trigger; refactorings are the catalogue of responses."],
  ["testing","'Without changing behaviour' is a claim you can only make if something checks it. Tests are what make refactoring safe rather than brave."]]],
["clean-code","Readability",3,"Optimising code for the reader, who is the scarce resource.",[
  ["naming","Names are most of readability. The rest is keeping the level of abstraction consistent within a function."]]],
["dbc","Design by Contract",3,"Preconditions, postconditions, invariants stated explicitly.",[
  ["interfaces","A contract that only says types is half a contract. DbC writes down the rest."],
  ["testing","Assertions are contracts checked at runtime; tests are contracts checked at build time."]]],
["tdd","Test-Driven Development",3,"Write the failing test first, then the code that passes it.",[
  ["testing","TDD uses tests as a design tool rather than a verification tool — the test is the first client of your interface."],
  ["refactoring","The third step is the point. Without a refactor phase, TDD just produces tested bad code."]]],
["pbt","Property-Based Testing",3,"Assert laws over generated inputs, not examples.",[
  ["testing","Examples test the cases you thought of. Properties test the ones you didn't."],
  ["pure-functions","Properties need determinism to be reproducible and shrinkable. Purity is what makes the technique practical."]]],
["idempotency","Idempotency",3,"Doing it twice has the same effect as doing it once.",[
  ["pure-functions","A pure function is trivially idempotent from the caller's side. Idempotency is the useful weakening: effects allowed, repetition safe."],
  ["errors","It exists because of retries. If you cannot tell whether a failed call ran, safety must come from the operation itself."]]],
["fcis","Functional Core, Imperative Shell",3,"Pure decision-making inside, effects at the edges.",[
  ["pure-functions","The core can be pure only if nothing in it touches the world. All I/O gets pushed to the boundary."],
  ["soc","It is separation of concerns along the single axis that matters most for testability: decisions vs effects."]]],

// ── TIER 4 · ARCHITECTURE, CONCURRENCY & SYSTEMS ──────────────────────
["layered","Layered Architecture",4,"Stack the system in tiers, each depending only downward.",[
  ["soc","The oldest structural answer: cut by concern, then forbid upward calls."],
  ["coupling-cohesion","The single downward rule is a deliberate constraint on the dependency graph — it makes the graph acyclic."]]],
["hexagonal","Hexagonal / Ports & Adapters",4,"Domain in the middle; everything external plugs in through ports.",[
  ["dip","This is DIP as a whole-system layout: the domain defines the ports and the database implements them, not the reverse."],
  ["adapter","Each driver — HTTP, SQL, queue — is literally an adapter onto a port the domain owns."]]],
["clean-arch","Clean Architecture",4,"Concentric layers with dependencies pointing only inward.",[
  ["hexagonal","Same inversion, drawn as rings and with the use-case layer named explicitly."],
  ["layered","It is layering with the dependency rule made absolute rather than conventional."]]],
["ddd","Domain-Driven Design",4,"Model the business domain in code, in the language the business uses.",[
  ["soc","DDD's contribution is a criterion for where to cut: by domain meaning, not by technical role."],
  ["objects","Its tactical half — entities, value objects, aggregates — is an argument about what objects should be."]]],
["bounded-context","Bounded Context",4,"An explicit boundary within which a model and its terms are consistent.",[
  ["ddd","The strategic core of DDD: 'Customer' does not mean the same thing in billing and support, and pretending otherwise is what produces the god model."],
  ["modularity","It is the module boundary chosen by meaning rather than by mechanism."]]],
["aggregate","Aggregates & Value Objects",4,"Consistency boundaries around entities, plus identity-free values.",[
  ["ddd","The aggregate is the unit inside which invariants must hold at all times — which makes it the unit of transaction and of lock."],
  ["immutability","A value object has no identity, so it can be immutable and freely shared — which is why it is the safest thing in the model."]]],
["repository","Repository",4,"A collection-like interface over persistence.",[
  ["ddd","It keeps storage out of the domain's vocabulary — the model asks for objects, not rows."],
  ["dip","The interface belongs to the domain; the SQL implementation depends on it. Straight inversion."]]],
["api-design","API Design",4,"Designing the contract others build against, and cannot easily unbuild.",[
  ["interfaces","A public API is an interface you can never quietly refactor. Every design mistake becomes permanent."],
  ["isp","Fat, chatty or over-general APIs couple every consumer to every capability you ever shipped."]]],
["eda","Event-Driven Architecture",4,"Components emit facts; other components react.",[
  ["observer","Observer at system scale: producers know nothing about consumers, which is the whole point and the whole difficulty."],
  ["coupling-cohesion","It buys extremely low coupling and pays with a control flow no single file describes."]]],
["pubsub","Publish/Subscribe",4,"A broker decouples producers from consumers entirely.",[
  ["eda","Pub/sub is the mechanism EDA is usually built on: a topic replaces a direct reference."],
  ["mediator","The broker is a mediator — it converts a mesh of point-to-point links into a hub."]]],
["queues","Message Queues",4,"Durable, ordered-ish, at-least-once delivery between services.",[
  ["pubsub","A queue adds durability and buffering, which is what turns decoupling into resilience."],
  ["idempotency","At-least-once delivery means consumers *will* see duplicates. Idempotency is not optional here, it is the price of entry."]]],
["event-sourcing","Event Sourcing",4,"Store the sequence of changes; derive state by replaying it.",[
  ["eda","If events are already the truth on the wire, they may as well be the truth at rest."],
  ["immutability","The log is append-only. State becomes a fold over immutable history, which gives you audit and time-travel for free."]]],
["cqrs","CQRS",4,"Separate the write model from the read models.",[
  ["srp","Reads and writes have different shapes, different loads and different consistency needs. One model serving both is one model with two reasons to change."],
  ["event-sourcing","Once writes are an event log, read models are just projections of it — which is why the two ideas travel together."]]],
["microservices","Microservices",4,"Independently deployable services owning their own data.",[
  ["bounded-context","A service boundary that does not follow a context boundary produces a distributed monolith — the worst of both."],
  ["distributed","The moment a call crosses a process, it can be slow, duplicated or lost. You have traded a compile error for a network partition."]]],
["modular-monolith","Modular Monolith",4,"Strict internal module boundaries, one deployable.",[
  ["modularity","It claims the real benefit of microservices is modularity, and that modularity does not require a network."],
  ["yagni","It is YAGNI applied to distribution: take the boundaries now, defer the operational cost until something actually forces it."]]],
["caching","Caching",4,"Keep a copy of an expensive answer closer to the asker.",[
  ["complexity","Caching is the standard trade: spend memory to buy time. It only helps where the cost model says the recompute or the round trip dominates."],
  ["memory-model","Every level of the machine already does this — registers, L1, page cache. Application caching is the same idea one layer up."]]],
["cache-invalidation","Cache Invalidation",4,"Knowing when the copy is wrong.",[
  ["caching","The hard half. A cache is a second source of truth, and two sources of truth must be reconciled."],
  ["mutability","If the underlying data never changed, no cache would ever need invalidating. This problem is mutation's bill arriving."]]],
["locks","Locks & Mutual Exclusion",4,"Serialising access to shared mutable state.",[
  ["threads","Two threads, one mutable location — locks are the first and bluntest answer."],
  ["mutability","Locks protect against mutation. Shared immutable data needs no lock at all, which is the single biggest argument for immutability."]]],
["races","Race Conditions & Deadlock",4,"Correctness that depends on timing; progress that depends on impossible ordering.",[
  ["locks","Too little locking gives races; too much, or in inconsistent order, gives deadlock. There is no setting that avoids both by default."]]],
["atomics","Atomics & Lock-Free Programming",4,"Correctness via CAS and memory ordering, without blocking.",[
  ["locks","Lock-free removes the blocking, not the difficulty — it moves the reasoning down to the hardware memory model."],
  ["memory-model","Reordering, visibility and fences are the *machine's* memory model surfacing. This is where the abstraction stops hiding it."]]],
["async","Async & the Event Loop",4,"One thread, many in-flight operations, resumed on completion.",[
  ["io","Async exists for one reason: I/O waits, and blocking a thread while it does is expensive. There is nothing async about CPU work."],
  ["control-flow","await is a suspension point — control flow that pauses and resumes rather than blocks."]]],
["futures","Futures & Promises",4,"A value that will exist later, composable now.",[
  ["async","A future is a handle on an unfinished operation, which is what lets you build a graph of work before any of it completes."],
  ["hof","then/map on a future is a higher-order function over time — the same combinator vocabulary, deferred."]]],
["backpressure","Backpressure",4,"Letting a slow consumer tell a fast producer to wait.",[
  ["async","Non-blocking producers will happily outrun consumers, converting a throughput problem into an out-of-memory crash."],
  ["queues","An unbounded queue is not a solution, it is a delay. Bounded buffers with a signal upstream are the actual mechanism."]]],
["actors","Actors",4,"Isolated units of state communicating only by message.",[
  ["encapsulation","An actor is an object that also owns its thread of control, so its state can never be touched from outside — encapsulation extended to time."],
  ["threads","It removes shared memory as an option. If nothing is shared, no lock is needed."]]],
["csp","CSP & Channels",4,"Independent processes coordinating by passing values over channels.",[
  ["threads","The alternative discipline to actors: don't communicate by sharing memory, share memory by communicating."],
  ["backpressure","A bounded channel *is* backpressure — the send blocks, and slowness propagates upstream for free."]]],
["parallelism","Parallelism vs Concurrency",4,"Doing many things at once, versus dealing with many things at once.",[
  ["threads","Concurrency is a structuring choice; parallelism is a hardware outcome. Conflating them is why people 'add threads' and get slower."],
  ["complexity","Amdahl's law is a cost model: the serial fraction caps your speedup no matter how many cores you buy."]]],
["stm","Software Transactional Memory",4,"Optimistic, composable atomic blocks over memory.",[
  ["locks","It answers the composition problem: two correct locked operations do not make a correct combined one, but two transactions do."],
  ["immutability","STM depends on being able to snapshot and retry, which needs values that don't change under you."]]],
["distributed","Distributed Systems",4,"Multiple machines, an unreliable network, no shared clock.",[
  ["threads","Concurrency with the shared memory removed and partial failure added. Every process can now die alone."],
  ["io","The network is I/O that can be slow, duplicated, reordered or silently lost — and you cannot tell which."]]],
["cap","CAP & the Trade-offs",4,"Under partition, choose consistency or availability.",[
  ["distributed","Partitions are not a design choice, they are a fact. CAP forces you to say in advance what you sacrifice when one happens."]]],
["consistency","Consistency Models",4,"Linearizable, sequential, causal, eventual.",[
  ["cap","'Consistency' is a spectrum, not a bit. The model you pick is the precise version of the CAP trade you're making."],
  ["immutability","Many weaker models become tractable by never overwriting — versioning instead of mutating."]]],
["consensus","Consensus (Paxos, Raft)",4,"Getting unreliable nodes to agree on one value.",[
  ["consistency","Strong consistency needs an agreed order of operations. Consensus is the algorithm that produces that order."],
  ["distributed","It exists because of partial failure: agreement is trivial if nobody crashes and no message is lost."]]],
["crdts","CRDTs",4,"Data types that converge without coordination.",[
  ["consistency","The other route: instead of agreeing on order, design operations so order does not matter."],
  ["immutability","Convergence relies on commutative, associative, idempotent merges — algebra doing the job a lock would otherwise do."]]],
["observability","Observability",4,"Being able to ask new questions about production without shipping code.",[
  ["distributed","Once the call graph spans machines, no stack trace describes a failure. Traces, metrics and structured logs replace the debugger."],
  ["testing","Tests check the behaviours you predicted. Observability is how you handle the ones you didn't."]]],
["performance","Performance & Profiling",4,"Measuring before optimising, then fixing what dominates.",[
  ["complexity","Big-O tells you what will eventually dominate; the profiler tells you what actually does at your n, with your constants."],
  ["memory-model","At real scale, cache locality and allocation usually beat algorithmic cleverness. This is the memory model refusing to stay hidden."]]],
["scalability","Scalability",4,"Serving more load by adding resources rather than rewriting.",[
  ["performance","Scalability is about the shape of the growth curve; performance is about the constant. They are different problems and demand different fixes."],
  ["distributed","Vertical scaling ends at the biggest machine you can buy. Everything after that is a distributed system, with all that implies."]]],
["security","Security & Trust Boundaries",4,"Assume the caller is hostile at every boundary you do not own.",[
  ["interfaces","A trust boundary is an interface where you must validate rather than assume. Which interfaces those are is a design decision."],
  ["encapsulation","Least privilege is encapsulation with an adversary: expose the minimum, and assume anything exposed will be poked."]]],

// ── TIER 5 · THEORY & FRONTIER ────────────────────────────────────────
["type-theory","Type Systems Theory",5,"The formal study of what type systems can prove.",[
  ["types","Once types are a proof system rather than a lint, questions like soundness, variance and expressiveness get precise answers."],
  ["type-inference","Hindley–Milner is where inference stops being a convenience and starts being a theorem."]]],
["lambda","Lambda Calculus",5,"Three rules — variable, abstraction, application — sufficient for all computation.",[
  ["pure-functions","It is the minimal pure-functional language, and the model every functional feature is ultimately explained in."],
  ["hof","Everything is a function taking a function. This is the origin of the idea, not an application of it."]]],
["functors","Functors & Applicatives",5,"Structures you can map over, and combine within.",[
  ["hof","map is the whole idea: apply a function inside a context without unwrapping it."],
  ["adts","The 'context' is a type constructor — Option, List, Result. Functors are laws about how those behave."]]],
["monads","Monads",5,"A way to sequence computations that carry a context.",[
  ["functors","A monad is a functor that can also flatten — which is exactly what lets you chain steps whose *next* step depends on the previous result."],
  ["pure-functions","Monads are how a pure language sequences effects: the effect becomes a value, and sequencing becomes composition."],
  ["result-vs-exception","Result chaining, Option chaining and async/await are all the same shape. Once you see it, you stop learning it three times."]]],
["category","Category Theory",5,"The mathematics of composition itself.",[
  ["monads","The vocabulary functional programming borrowed — functor, monad, natural transformation — has its actual definitions here."],
  ["composition","Its subject is precisely what this whole tree is about: what it means for things to compose lawfully."]]],
["effects","Effect Systems & Algebraic Effects",5,"Tracking, and handling, effects in the type system.",[
  ["monads","Monads sequence one effect elegantly and several awkwardly. Effect systems are the attempt to fix the composition problem."],
  ["type-theory","'This function may throw, may read config, may not do I/O' is a claim only a type system can enforce."]]],
["dependent-types","Dependent Types",5,"Types that depend on values.",[
  ["type-theory","The far end of expressiveness: a type can state 'a list of length n' or 'a sorted array', and the compiler checks it."],
  ["dbc","It is Design by Contract with the contract checked statically rather than asserted at runtime."]]],
["curry-howard","Curry–Howard Correspondence",5,"Programs are proofs; types are propositions.",[
  ["lambda","The correspondence is exact between typed lambda calculus and constructive logic — the same structure, two readings."],
  ["type-theory","It is why type theory is not merely engineering: type checking is proof checking."]]],
["formal-verification","Formal Verification",5,"Proving a program correct rather than testing it.",[
  ["dependent-types","If a type can express the specification, then a well-typed program is a proof that it meets it."],
  ["curry-howard","Verification is only *possible* because proofs and programs are the same objects."]]],
["ownership","Ownership & Borrowing",5,"Static tracking of who may mutate and who may read.",[
  ["memory-model","It makes the memory model a compile-time concern: no GC, no use-after-free, no data races — enforced, not hoped for."],
  ["mutability","The insight is that aliasing and mutation are only dangerous together. Forbid the combination, keep both separately."],
  ["type-theory","Lifetimes are types. The borrow checker is a proof system with a bad reputation."]]],
["persistent-ds","Persistent Data Structures",5,"Immutable structures with cheap versioned updates via sharing.",[
  ["immutability","They are the answer to the obvious objection: 'copying on every write is too expensive'. Structural sharing makes it O(log n)."],
  ["data-structures","Tries, finger trees, RRB vectors — the shapes you get when the requirement is 'never overwrite'."]]],
["compilers","Compilers & Interpreters",5,"Turning source into a tree, then into meaning or machine code.",[
  ["pattern-matching","An AST is a sum type and every phase is an exhaustive walk over it. Compilers are the reason those features exist."],
  ["interpreter","The pattern, taken seriously: parse, analyse, optimise, emit."]]],
["metaprogramming","Metaprogramming & Macros",5,"Programs that write programs.",[
  ["compilers","A macro is a compiler phase you were allowed to write, so it needs the compiler's own view of the program as data."],
  ["dry","It is the last resort against duplication the language's abstractions cannot remove — and its usual failure mode is abstraction nobody else can read."]]],
["dsl","Domain-Specific Languages",5,"A small language whose vocabulary is the problem's vocabulary.",[
  ["metaprogramming","An internal DSL is metaprogramming aimed at readability; an external one is a compiler you own."],
  ["ddd","The end state of ubiquitous language: the domain expert can read the rules, because the rules are written in their words."]]],
["determinism","Determinism & Reproducibility",5,"Same inputs, same run, every time — including builds and deploys.",[
  ["pure-functions","Reproducible builds, deterministic simulation and record/replay debugging are all purity applied above the function level."],
  ["idempotency","Both are disciplines for making a system safe to re-run — one at the operation level, one at the whole-system level."]]],
["expression-problem","The Expression Problem",5,"Adding new types vs new operations — you can usually have one cheaply.",[
  ["visitor","Visitor makes operations cheap and types expensive; a class hierarchy does the reverse. The tension is fundamental, not a language flaw."],
  ["adts","Sum types and open interfaces sit on opposite sides of it. Choosing which axis you expect to grow is a real architectural decision."]]],
];

// Composition-over-inheritance: fix parents properly (the tuple above carries a
// placeholder so the entry reads cleanly; the real edges are wired here).
NODES.find((n) => n[0] === "comp-over-inherit")![4] = [
  ["inheritance","Inheritance couples subclass to superclass at compile time and forever. It is the tightest coupling most languages offer."],
  ["composition","Delegating to a collaborator you hold gives the same reuse with a swappable, testable, runtime-chosen relationship."],
  ["lsp","Most inheritance hierarchies eventually violate substitutability. Composition never makes the promise, so it cannot break it."]];

export const TIERS: Tier[] = [
  {n:1,name:"Foundations",note:"The primitives everything else is defined in terms of."},
  {n:2,name:"Abstraction & Structure",note:"The moves that let a program grow past one file."},
  {n:3,name:"Principles & Patterns",note:"Named forces, named trade-offs, named solutions."},
  {n:4,name:"Architecture, Concurrency & Systems",note:"What happens when the program has parts, threads, or machines."},
  {n:5,name:"Theory & Frontier",note:"Where the ideas stop being folklore and start being proofs."},
];
