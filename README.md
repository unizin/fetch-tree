# fetch-tree

The goal is to allow you to define data requirements with your components. Those
data requirements can then be composed so that a top level component can load
all of the required data for it and its children.

This project was inspired by [redux-loader][redux-loader].

## Open Source

This library is written for and maintained by Unizin. We offer it without
guarantees because it may be useful to your projects. All proposed contributions
to this repository are reviewed by Unizin.

## Goals

* manage all data for each component
* selecting data is as easy as loading data
* requirement trees can be composed
* debuggable
* Loading screen shows when the data hasn't arrived
* revisiting a component will show cached data, but will also fetch fresh data in the background

[redux-loader]: https://github.com/Versent/redux-loader/https://github.com/Versent/redux-loader/
