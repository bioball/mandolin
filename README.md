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

The drawbacks are the lack of compile-time syntax and type checks. However, it does make using Options more practical.

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
