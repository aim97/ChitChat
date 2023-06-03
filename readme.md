# Socket IO practice

Something to showcase socket IO usage in action.

## Basic server workflow

- You start by creating an instance of Socket IO server, it can be connected to an http server you created like done here, or working on its own.
- Socket io is event driven so the flow is mainly driven by the `on(eventName, handler)` function, that simply handle and event with a given name, by a given function.
- And the most important event is the `connection` event that's where you
  - identify the client
  - Add them into a room
  - set the events of interest of that client to keep it updated with messages on those events that are meant for them.
- There is surely authentication in socket IO, its data is sent from the client and is accessible from `handshake` field of the socket. for security it's passed on the `auth` field inside it.
- We may add a middleware on a socket server using the `use` function, similar to express. except it takes `socket`, and `next` as inputs, but works intuitively enough as you'd expect, if not pay a visit for the docs.

## Basic client workflow

- Similarly, you would create a socket io client that connects to the server providing the credentials in the options if required.
- Then the client would provide handler for the events its interested to listen on.
- The client can also send messages using the `emit` function (actually similarly can the server).
