async function handler(event, context) {
  console.log(
    ">>> Variáveis de Ambiente",
    JSON.stringify(process.env, null, 2)
  );

  console.log(">>> Evento", JSON.stringify(event, null, 2));

  return { message: "Hello World!" };
}

module.exports = { handler };
