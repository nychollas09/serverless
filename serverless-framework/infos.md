- Instalar o Serverless Framework

```bash
npm i -g serverless
```

<br>

- Inicializar SLS para criar o projeto

```bash
sls
```

<br>

- Fazendo deploy para verificar o ambiente

```bash
sls deploy
```

<br>

- Invocando a lambda na AWS

```bash
sls invoke -f hello
```

<br>

- Invocando a lambda no Local

```bash
sls invoke local -f hello --l
```

<br>

- Configurar Dashboard

```bash
sls
```

<br>

- Acompanhar os logs

```bash
sls logs -f hello --tail
```
