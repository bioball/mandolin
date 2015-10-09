# Monadia

This is an attempt to make Monadic types practical in JavaScript. This is heavily inspired by Scala.

### Ideas

#### Faux-pattern matching

In Scala, you can create partial functions that match based on type, like so:

```scala
foo match {
  case Some(bar) => ???
  case None => ???
}
```

This is pretty useful for when working with algebraic types. Although we don't have such syntax in JavaScript, it's possible to do something like this:

```js
foo().match({
  some (bar) { ... },
  none () { ... }
})
```

The drawbacks are the lack of compile-time syntax and type checks. However, it does make using Options more practical. In the same vein, here's faux-pattern matching for an `Either`.

```js
foo().match({
  left (bar) { ... },
  right (baz) { ... }
})
```


#### Creating class objects

I think things like Option types are totally useless unless there's an easy way to interop with vanilla JS objects. There needs to be some repeatable way to serialize and deserialize out of our monadic types. For example:

```json
{
  "foo": "bar",
  "biz": null
}
```

Should serialize into:

```js
{
  "foo": Some("bar"),
  "biz": None
}
```

My suggestion is to have a method that creates constructors, given a type definition. For example, you should be able to do this:

```js
const Person = createClass({
  firstName: Some.as(String),
  lastName: Some.as(String)
}).withPrototype({
  fullName () { ... }
})
```

Then once you have instantiated a `Person`, you'd be able to either `new` it up, or parse a JS object as a `Person`.

```js
Person.parseFromJsObj({
  firstName: null,
  lastName: null
});
// => Person({
//  firstName: None,
//  lastName: None
// })
```

Naturally, they would deserialize back into JSON as well.


**Further thoughts:**

A serious problem coming up is primitive types in JavaScript don't necessary behave as instances of their constructor. For instance:

```js
"foo" instanceof String
// => false
```

My initial thought to implementing classes with type definitions was to just use a bunch of `instanceof` checks, so you can pass their constructors in. That clearly doesn't work, so the syntax of `createClass({ firstName: String })` isn't going to cut it.

My revised approach is to do something like this:

```js
const Person = createClass({
  "firstName": M.string,
  lastName: M.string
});
```

`M` is just a placeholder reference until I figure out a name for this project. `M.string` wouldn't be a reference to the `String` constructor, but a `Reads` object for the `String` type. This is another inspiration from Scala.

Here's a possible implementation for a `Reads`

```js
class Reads {
  constructor (reader) {
    this.reader = reader;
  }
  getValue (val) {
    return this.reader(val);
  }
}

M.string = new Reads(function(val){
  if (typeof val !== "string") {
    throw new Error("Attempted to read %o as a String value", val)
  }
  return val;
});
```

All of JavaScript's primitives would have a pre-baked Reads for them--`Number`, `Boolean`, `String`, etc. 

For class types, each of my monadic types could be defined via this syntax

```js
createClass({
  email: Option.as(M.string)
})
```

Implementation:

```js
Option.as = new Reads(function(read){
  return function(val){
    if (val === null || val === undefined) {
      return None();
    }
    return new Some(read.getValue(val));
  }
});
```

Each algebraic type will need to define its own `as` function, because the rules for deserialization are different.

**Further thoughts**: What should deserialization look like for an `Either`? Given there might be the same type for `Left` and `Right`?