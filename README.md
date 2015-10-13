# Monadia

[![Build Status](https://travis-ci.org/bioball/monadia.svg)](https://travis-ci.org/bioball/monadia)

This is a library of Monads in JavaScript. The intent of this library is to provide Monads, as well as a great way to interop between Monadic types and vanilla JS types.

In this library, the monadic `bind` is called `flatMap`, in order to not conflict with `Function.prototype.bind`. The monadic `return` is called `unit`, to not cause any confusion with the `return` keyword.

## What is a monad?

In brief, a Monad is a wrapper around a value that allows you to make safe, composable operations. It eliminates the need to throw errors, as well as the need for things like `null` values. A JavaScript `Array` is a monad-like data type, but doesn't fully satisfy the rules of being a monad, given that it doesn't have a `bind` (or `flatMap`) function.

Monads are common in functional programming languages.

Here are some great resources that discuss monads:

* [Brian Beckman: Don't Fear The Monad](https://www.youtube.com/watch?v=ZhuHCtR3xq8)
* [James Coglan: Promises are the monad of asynchronous programming](https://blog.jcoglan.com/2011/03/11/promises-are-the-monad-of-asynchronous-programming/)
* [Douglas Crockford: Monads and Gonads](https://www.youtube.com/watch?v=b0EF0VTs9Dc)

## Available monads

* [Option](#option)
* [Either](#either)

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