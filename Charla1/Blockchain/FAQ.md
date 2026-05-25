# Preguntas frecuentes sobre el contrato Voting.sol

**Pregunta:** ¿Qué significa la primera línea del contrato?

**Respuesta:**
La primera línea:

    // SPDX-License-Identifier: MIT

es un comentario que indica la licencia bajo la cual se distribuye el código del contrato. "SPDX" es un estándar para identificar licencias de software de forma clara y automática. En este caso, "MIT" significa que el contrato está bajo la licencia MIT, una licencia permisiva que permite el uso, modificación y distribución del código con pocas restricciones. Esta línea es requerida por muchos compiladores y plataformas para cumplir con buenas prácticas de código abierto.

**Pregunta:** ¿Qué significa la segunda línea del contrato?

**Respuesta:**
La segunda línea:

    pragma solidity ^0.8.0;

indica la versión mínima del compilador Solidity requerida para compilar el contrato. "pragma" es una directiva de compilación, y "solidity ^0.8.0" significa que el contrato debe ser compilado con la versión 0.8.0 o superior, pero menor a 0.9.0. Esto ayuda a evitar errores de compatibilidad y asegura que se usen las características y correcciones de esa versión específica del lenguaje Solidity.

**Pregunta:** ¿Qué significa "string memory"?

**Respuesta:**
En Solidity, `string memory` indica que el parámetro o variable es de tipo cadena de texto (`string`) y que su almacenamiento será temporal, en la memoria del contrato durante la ejecución de la función. El modificador `memory` especifica que los datos no se guardan permanentemente en la blockchain, sino que existen solo mientras dura la llamada a la función. Esto es útil para manejar datos que no necesitan persistir, como parámetros de funciones o variables locales.

**Pregunta:** ¿Por qué es necesario usar `memory` solo para los string?

**Respuesta:**
En Solidity, los tipos de datos dinámicos como `string`, `bytes`, y arreglos requieren que se especifique el tipo de almacenamiento (`memory`, `storage` o `calldata`) cuando se usan como parámetros de funciones. Esto es porque su tamaño puede variar y el compilador necesita saber dónde almacenar temporalmente los datos. Los tipos de datos estáticos (como `uint`, `address`, `bool`) no requieren esta especificación porque su tamaño es fijo y siempre se almacenan en la pila. Por eso, al declarar un parámetro `string` en una función, es obligatorio indicar `memory` para definir que su almacenamiento será temporal durante la ejecución de la función.

**Pregunta:** ¿Cómo funciona `require`?

**Respuesta:**
En Solidity, `require` es una función que se utiliza para validar condiciones antes de ejecutar el resto del código de una función. Si la condición dentro de `require` es falsa, la ejecución se detiene, se revierte cualquier cambio realizado hasta ese momento y se muestra el mensaje de error especificado. Esto ayuda a proteger el contrato de acciones no permitidas, como accesos sin permisos o datos inválidos. Es fundamental para la seguridad y la lógica de los contratos inteligentes.

**Pregunta:** ¿Qué es una función interna y qué otros tipos existen?

**Respuesta:**
En Solidity, una función interna (internal) solo puede ser llamada desde dentro del mismo contrato o desde contratos que heredan de él. No puede ser llamada desde fuera del contrato, ni por usuarios ni por otros contratos externos. Además de `internal`, existen otros tipos de visibilidad para funciones:

- `public`: Puede ser llamada desde cualquier lugar, tanto dentro como fuera del contrato.
- `external`: Solo puede ser llamada desde fuera del contrato (por otros contratos o usuarios), no desde dentro del mismo contrato.
- `private`: Solo puede ser llamada desde dentro del contrato donde está definida, no por contratos heredados ni externos.

La visibilidad define quién puede acceder y ejecutar cada función, lo que es clave para la seguridad y el diseño de los contratos inteligentes.

**Pregunta:** ¿Qué significa que una función sea `view` y qué otros tipos existen?

**Respuesta:**
En Solidity, una función marcada como `view` indica que no modifica el estado del contrato, es decir, no cambia variables ni escribe en la blockchain. Solo puede leer datos. Esto permite que la función sea llamada sin costo de gas si se ejecuta localmente (no como transacción). Además de `view`, existen otros modificadores de función:

- `pure`: No lee ni modifica el estado del contrato, solo opera con los parámetros de entrada y variables locales.
- Sin modificador: Puede modificar el estado del contrato y escribir en la blockchain.

Estos modificadores ayudan a definir el comportamiento y el costo de las funciones, y son importantes para la seguridad y eficiencia de los contratos inteligentes.

**Pregunta:** ¿Qué es `keccak256`?

**Respuesta:**
`keccak256` es una función de Solidity que calcula el hash de un dato usando el algoritmo Keccak-256, el mismo que utiliza Ethereum para generar direcciones y proteger datos. El hash es un valor único que representa el contenido de los datos de entrada, y es útil para comparar cadenas de texto de manera segura y eficiente.

**Pregunta:** ¿Por qué se usa `bytes` en la comparación?

**Respuesta:**
En Solidity, para comparar cadenas de texto (`string`), primero se convierten a tipo `bytes` porque la función `keccak256` requiere datos en formato binario. Al convertir las cadenas a `bytes`, se asegura que la comparación sea exacta y eficiente, ya que el hash de los datos binarios será igual solo si el contenido de las cadenas es idéntico.
