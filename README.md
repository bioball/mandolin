# Mandolin

This is a library of Monads in JavaScript. The intent of this library is to provide Monads, as well as a great way to interop between Monadic types and vanilla JS types.

In this library, the monadic `bind` is called `flatMap`, in order to not conflict with `Function.prototype.bind`. The monadic `return` is called `unit`, to not cause any confusion with the `return` keyword.

## What is a monad?

In brief, a Monad is a wrapper around a value that allows you to make safe, composable operations. It eliminates the need to throw errors, as well as the need for things like `null` values. A JavaScript `Array` is a monad-like data type, but doesn't fully satisfy the rules of being a monad, given that it doesn't have a `bind` (or `flatMap`) function.

A monad is a type that satisfies the following methods:
* A composition function, called `>>=`, `bind`, or `flatMap`, that has type `(A) => M<B>`, and returns type `M<B>`.
* A `return` (or `unit`), that has type `(A) => M<A>`.

Monads are common in functional programming languages.

Here are some great resources that discuss monads:

* [Brian Beckman: Don't Fear The Monad](https://www.youtube.com/watch?v=ZhuHCtR3xq8)
* [James Coglan: Promises are the monad of asynchronous programming](https://blog.jcoglan.com/2011/03/11/promises-are-the-monad-of-asynchronous-programming/)
* [Douglas Crockford: Monads and Gonads](https://www.youtube.com/watch?v=b0EF0VTs9Dc)

## Available monads

* [Option](#option)
* [Either](#either)

## Installation

This module can be installed either through NPM or Bower.

```bash
npm install mandolin
bower install mandolin
```

Then, if you are within Node.js, or using a CommonJS module loader, simply `require` it in.

```js
const m = require('mandolin');
const { Option, Some, None } = m;
```

You also may choose to include this as a script tag on a page:

```html
<script src="/lib/mandolin/dist/mandolin.js"></script>
```

### Option

An `Option` is a type comprising of `Some` and `None`. A value of type `Option` can either be a `Some`, in which it holds a value, or a `None`, in which it holds no value. This is used in lieu of `null` and `undefined`.

Example:

```js
const bobsEmail = new Some("bob@mcadoo.com");
// We have Bob's email
const sandrasEmail = new None();
// we do not have Sandra's email
```

The way to get a reference to the actual value is through either `map`, `flatMap` or `match`.

```js
bobsEmail.map((email) => doThingWithEmail(email));
```

This is similar to writing a null check:

```js
if (email !== null || email !== undefined) {
  doThingWithEmail(email)
}
```

### Either

A disjoint union of `Left` and `Right`, and is right-biased. `map` and `flatMap` are only called if it is a `Right`. This is similar to an `Option`, in that `Left : None :: Right : Some`. The difference is that a `Left` can also hold values.

## Reads

Mandolin uses `Reads` objects, which are not monads, but whose purpose are to serialize values into algebraic types (`Option`, `Either`).

A `Reads` is created with this signature:

```js
const r = new Reads(reader);
```

Where `reader` is a function that accepts a value, and returns an `Either`; a `Right` with a successful value, or a `Left` with an unsuccessful value. For example, a `reader` of even numbers would look like this:

```js
const reader = (v) => v % 2 ? new Left("number is not even") : new Right(v);
```

You can think of a `Reads` as a rule for serializing something. `Reads` can be freely chained together, to further define a rule.

```js
const greaterThan10 = new Reads((v) => v < 10 ? new Left("number is less than 10") : new Right(v));
const evenAndGreaterThan10 = r.chain(greaterThan10);

evenAndGreaterThan10.getValue(4) // Left("number is not event")
evenAndGreaterThan10.getValue(14) // Right(14)
```

Reads can be chained via `chain`, `map` and `flatMap`.


## Parser

Along with `Reads`, Mandolin has `Parser`s that accept arbitrary objects of key --> `Reads` pairs, and returns an either with a successful serialized object, or an error.

This provides a generic way to validate objects, and coerce values into algebraic data types.

You may create a definition with this signature:

```js
const definition = m.define({
  age: m.number,
  name: m.string
});
```

In this example, `m.number` and `m.string` are pre-baked `Reads` for primitives. The following are all available:

* `m.number`
* `m.string`
* `m.boolean`
* `m.array`
* `m.object`
* `m.undefined`
* `m.null`

The return value of `m.define` is a `Parser`, which is a special type of `Reads`. Thus, nested objects are simply notated as such:

```js
const definition = m.define({
  age: m.number,
  name: m.string,
  address: m.define({
    street1: m.string
  })
});
```

`Option` and `Either` both have a generic way to create `Reads`.

```js
const definition = m.define({
  meta: Option.reads,
  email: Option.as(m.string)
});
```

`Option.reads` will return either a `None()`, or a `Some(<Any>)`. `Option.as()` accepts a `Reads` argument, to perform further validation after casting away `null` or `undefined`.

## Types

This library makes no assumptions about type safety. The approach, rather, is to use Reads combinators to serialize monads that follow certain sets of rules. For example, in Scala, an `Option` of a `String` is notated as such:

```scala
Option[String]
```

The seemingly equivalent example in our library is this:

```js
Option.as(M.string)
```

The difference is, `Option.as(M.String)` is not a type, but a rule for reading in values. Essentially, this is the same thing as types, but I think makes more sense in a world that doesn't perform any compile-time type checking.

## Pattern Matching

JavaScript doesn't have pattern matching built into the language. However, each algebraic data type in this library comes with a `match` function that behaves like pattern matching.

```js
new Left("foo").match({
  Left (str) { ... },
  Right (str) { ... }
});
```

The return value of `match` is the return value of whichever function ends up being called.