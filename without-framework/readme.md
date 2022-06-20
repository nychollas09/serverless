- Criar arquivo com as políticas de segurança com a descrição dos serviços que a Lambda pode utilizar

```json
{
  "Version": "2012-10-17",
  "Statement": [
    // Descrição dos Acessos que a Lambda vai ter
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com" // Permisão ao servico principal da Lambda
      },
      "Action": "sts:AssumeRole" // A Lambda é uma conta filha e vai acessar como uma conta pai
    }
  ]
}
```

<br>

- Criar role de segurança na AWS (No IAM)

```bash
aws iam create-role \
  --role-name lambda-exemplo \
  --assume-role-policy-document file://policies.json \
  | tee logs/role.log
```

- Criar arquivo com o código fonte da lambda, zipa-lo e fazer o upload dele

```bash
zip function.zip index.js

aws lambda create-function \
  --function-name hello-cli \
  --zip-file fileb://function.zip \ # "fileb" por conta que é um blob de um arquivo compactado
  --handler index.handler \ # Caminho de execução da Lambda "index.js > handler()"
  --runtime nodejs16.x \
  --role arn:aws:iam::083537024163:role/lambda-exemplo \
  | tee logs/lambda-create.log
```

<br>

- Invocar a Lambda

```bash
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log
```

<br>

- Atualizar Lambda

```bash
rm -rf function.zip && zip function.zip index.js

aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name hello-cli \
  --publish \
  | tee logs/lambda-update.log
```

<br>

- Invocar a Lambda novamente

```bash
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-updated-exec.log
```

<br>

- Remover Lambda e role (Para não ficar perdido)

```bash
aws lambda delete-function \
  --function-name hello-cli

aws iam delete-role \
  --role-name lambda-exemplo
```
