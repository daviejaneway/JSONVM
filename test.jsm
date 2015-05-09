.import ~/stuff/jsonvm/libs/core

.alias say-hello
  .push "Hello, "
  .string-concat
  .puts
  .ret

say-hello "World!"
