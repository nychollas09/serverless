"use strict";

const { get } = require("axios");

class Handler {
  constructor({ rekognition, translator }) {
    this.rekognition = rekognition;
    this.translator = translator;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekognition
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems.map(({ Name }) => Name).join(" and ");

    return { names, workingItems };
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };

    return (
      await this.translator.translateText(params).promise()
    ).TranslatedText.split(" e ");
  }

  async formatTextResults(texts, workingItems) {
    const finalText = [];

    for (const indexText in texts) {
      const nameInPortugues = texts[indexText];
      const confidence = workingItems[indexText].Confidence;

      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortugues}`
      );
    }

    return finalText.join("\n");
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data, "base64");
  }

  async main(event) {
    try {
      console.log(">>> Downloading image....");
      const imgBuffer = await this.getImageBuffer(
        event.queryStringParameters.imageUrl
      );

      console.log(">>> Detectiong Labels....");
      const { names, workingItems } = await this.detectImageLabels(imgBuffer);

      console.log(">>> Translating to Portuguese...");
      const translatedTexts = await this.translateText(names);

      console.log(">>> Handling final object...");
      const finalText = await this.formatTextResults(
        translatedTexts,
        workingItems
      );

      console.log(">>> Finishing...");

      return {
        statusCode: 200,
        body: `A imagem tem\n ${finalText}`,
      };
    } catch (error) {
      console.log("Error****", error.stack);

      return {
        statusCode: 500,
        body: "Internal Server Error!",
      };
    }
  }
}

const awsSdk = require("aws-sdk");
const rekognition = new awsSdk.Rekognition();
const translator = new awsSdk.Translate();
const handler = new Handler({ rekognition, translator });

module.exports.main = handler.main.bind(handler);
